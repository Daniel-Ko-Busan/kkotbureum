import { NextRequest, NextResponse } from 'next/server';
import { DEMO_MODE, demoOrders } from '@/lib/demo/data';
import { sendSMS } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const { orderId, template, content } = await request.json();

    // Demo mode
    if (DEMO_MODE) {
      const order = demoOrders.find(o => o.id === orderId);
      if (!order) {
        return NextResponse.json({ error: '주문을 찾을 수 없어요' }, { status: 404 });
      }
      console.log(`[DEMO Notification] To: ${order.sender_phone}, Template: ${template}\n${content}`);
      return NextResponse.json({ success: true });
    }

    const { createServiceClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceClient();

    const { data: order } = await supabase
      .from('orders')
      .select('sender_phone, recipient_phone')
      .eq('id', orderId)
      .single();

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없어요' }, { status: 404 });
    }

    const phone = order.sender_phone;
    const result = await sendSMS({ to: phone, content });

    // Log notification
    await supabase.from('notifications').insert({
      order_id: orderId,
      recipient_phone: phone,
      type: 'sms',
      template,
      content,
      status: result.success ? 'sent' : 'failed',
      sent_at: result.success ? new Date().toISOString() : null,
    });

    return NextResponse.json({ success: result.success });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: '알림 발송에 실패했어요' }, { status: 500 });
  }
}
