import { NextRequest, NextResponse } from 'next/server';
import { DEMO_MODE, demoOrders } from '@/lib/demo/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const phone = searchParams.get('phone');

    if (!orderNumber || !phone) {
      return NextResponse.json({ error: '주문번호와 전화번호를 입력해주세요' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/-/g, '');

    if (DEMO_MODE) {
      const order = demoOrders.find(
        o => o.order_number === orderNumber && o.sender_phone.replace(/-/g, '') === cleanPhone
      );
      if (!order) {
        return NextResponse.json({ error: '주문을 찾을 수 없어요. 주문번호와 전화번호를 확인해주세요.' }, { status: 404 });
      }
      return NextResponse.json({ order });
    }

    const { createServiceClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceClient();

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .eq('sender_phone', cleanPhone)
      .single();

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없어요. 주문번호와 전화번호를 확인해주세요.' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order lookup error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했어요' }, { status: 500 });
  }
}
