import { NextRequest, NextResponse } from 'next/server';
import { DEMO_MODE, demoOrders } from '@/lib/demo/data';
import { z } from 'zod';

const cancelSchema = z.object({
  sender_phone: z.string().min(10),
  cancel_reason: z.string().optional().default('고객 요청 취소'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { sender_phone, cancel_reason } = cancelSchema.parse(body);

    // Demo mode
    if (DEMO_MODE) {
      const order = demoOrders.find(o => o.id === id);
      if (!order) {
        return NextResponse.json({ error: '주문을 찾을 수 없어요' }, { status: 404 });
      }
      if (order.sender_phone.replace(/-/g, '') !== sender_phone.replace(/-/g, '')) {
        return NextResponse.json({ error: '주문 정보가 일치하지 않아요' }, { status: 403 });
      }
      if (!['pending', 'confirmed'].includes(order.status)) {
        return NextResponse.json(
          { error: '준비가 시작된 주문은 취소할 수 없어요. 고객센터로 문의해주세요.' },
          { status: 400 }
        );
      }
      order.status = 'cancelled';
      order.cancelled_at = new Date().toISOString();
      order.cancel_reason = cancel_reason;
      order.payment_status = 'refunded';
      return NextResponse.json({ success: true, order });
    }

    const { createServiceClient } = await import('@/lib/supabase/server');
    const { cancelPayment } = await import('@/lib/portone');
    const supabase = await createServiceClient();

    // Get order
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없어요' }, { status: 404 });
    }

    // Verify sender identity
    if (order.sender_phone !== sender_phone.replace(/-/g, '')) {
      return NextResponse.json({ error: '주문 정보가 일치하지 않아요' }, { status: 403 });
    }

    // Check cancellable status (pending or confirmed only)
    if (!['pending', 'confirmed'].includes(order.status)) {
      return NextResponse.json(
        { error: '준비가 시작된 주문은 취소할 수 없어요. 고객센터로 문의해주세요.' },
        { status: 400 }
      );
    }

    // Cancel payment via PortOne if paid
    if (order.payment_status === 'paid' && order.payment_id) {
      const cancelResult = await cancelPayment(order.payment_id, cancel_reason);
      if (!cancelResult.success) {
        return NextResponse.json(
          { error: '환불 처리에 실패했어요. 고객센터로 문의해주세요.' },
          { status: 500 }
        );
      }
    }

    // Update order
    const { data: updated, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        payment_status: order.payment_status === 'paid' ? 'refunded' : order.payment_status,
        cancelled_at: new Date().toISOString(),
        cancel_reason,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: '취소 처리에 실패했어요' }, { status: 500 });
    }

    // Add status history
    await supabase.from('order_status_history').insert({
      order_id: id,
      status: 'cancelled',
      note: `고객 취소: ${cancel_reason}`,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '입력 정보를 확인해주세요' }, { status: 400 });
    }
    console.error('Cancel error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했어요' }, { status: 500 });
  }
}
