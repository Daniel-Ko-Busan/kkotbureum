import { NextRequest, NextResponse } from 'next/server';
import { DEMO_MODE, demoOrders, demoStatusHistory } from '@/lib/demo/data';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['confirmed', 'preparing', 'delivering', 'delivered', 'cancelled']),
  note: z.string().optional(),
  cancel_reason: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, note, cancel_reason } = updateStatusSchema.parse(body);

    // Demo mode: update in-memory and return
    if (DEMO_MODE) {
      const order = demoOrders.find(o => o.id === id);
      if (!order) {
        return NextResponse.json({ error: '주문을 찾을 수 없어요' }, { status: 404 });
      }

      // 상태 전환 검증
      const validTransitions: Record<string, string[]> = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['preparing', 'cancelled'],
        preparing: ['delivering'],
        delivering: ['delivered'],
        delivered: [],
        cancelled: [],
      };
      if (!validTransitions[order.status]?.includes(status)) {
        return NextResponse.json(
          { error: `'${order.status}' 상태에서 '${status}'로 변경할 수 없어요` },
          { status: 400 }
        );
      }

      order.status = status as typeof order.status;
      order.updated_at = new Date().toISOString();
      if (status === 'cancelled') {
        order.cancelled_at = new Date().toISOString();
        order.cancel_reason = cancel_reason || '';
        if (order.payment_status === 'paid') {
          order.payment_status = 'refunded';
        }
      }
      // 상태 이력 추가
      demoStatusHistory.push({
        id: `h-${Date.now()}`,
        order_id: id,
        status: status as typeof order.status,
        note: note || `상태 변경: ${status}`,
        created_at: new Date().toISOString(),
      });

      // Demo: SMS 로그 (콘솔에만 출력)
      const { getMessageForStatus } = await import('@/lib/notifications');
      const smsInfo = getMessageForStatus(status, {
        orderNumber: order.order_number,
        recipientName: order.recipient_name,
        productName: order.product_name,
      });
      if (smsInfo) {
        console.log(`[DEMO SMS → ${order.sender_phone}]\n${smsInfo.content}`);
      }

      return NextResponse.json(order);
    }

    const { createServiceClient } = await import('@/lib/supabase/server');
    const { sendSMS, getMessageForStatus } = await import('@/lib/notifications');
    const supabase = await createServiceClient();

    // Get current order
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없어요' }, { status: 404 });
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['delivering'],
      delivering: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return NextResponse.json(
        { error: `'${order.status}' 상태에서 '${status}'로 변경할 수 없어요` },
        { status: 400 }
      );
    }

    // Cancel payment via PortOne if cancelling a paid order
    if (status === 'cancelled' && order.payment_status === 'paid' && order.payment_id) {
      const { cancelPayment } = await import('@/lib/portone');
      const cancelResult = await cancelPayment(order.payment_id, cancel_reason || '관리자 취소');
      if (!cancelResult.success) {
        return NextResponse.json(
          { error: '환불 처리에 실패했어요. PortOne 관리자에서 직접 환불해주세요.' },
          { status: 500 }
        );
      }
    }

    // Update order
    const updateData: Record<string, unknown> = { status };
    if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
      updateData.cancel_reason = cancel_reason || '';
      if (order.payment_status === 'paid') {
        updateData.payment_status = 'refunded';
      }
    }

    const { data: updated, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: '상태 변경에 실패했어요' }, { status: 500 });
    }

    // Add status history
    await supabase.from('order_status_history').insert({
      order_id: id,
      status,
      note: note || `상태 변경: ${status}`,
    });

    // Send SMS notification for all status changes
    let smsWarning: string | undefined;
    const smsInfo = getMessageForStatus(status, {
      orderNumber: order.order_number,
      recipientName: order.recipient_name,
      productName: order.product_name,
    });

    if (smsInfo) {
      try {
        const smsResult = await sendSMS({ to: order.sender_phone, content: smsInfo.content });
        const smsStatus = smsResult?.success ? 'sent' : 'failed';

        await supabase.from('notifications').insert({
          order_id: id,
          recipient_phone: order.sender_phone,
          type: 'sms',
          template: smsInfo.template,
          content: smsInfo.content,
          status: smsStatus,
          sent_at: new Date().toISOString(),
        });

        if (!smsResult?.success) {
          smsWarning = '상태는 변경되었지만, SMS 발송에 실패했어요. 고객에게 직접 연락해주세요.';
        }
      } catch {
        smsWarning = '상태는 변경되었지만, SMS 발송에 실패했어요. 고객에게 직접 연락해주세요.';
        await supabase.from('notifications').insert({
          order_id: id,
          recipient_phone: order.sender_phone,
          type: 'sms',
          template: smsInfo.template,
          content: smsInfo.content,
          status: 'failed',
          sent_at: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ ...updated, smsWarning });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '잘못된 요청이에요' }, { status: 400 });
    }
    console.error('Status update error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했어요' }, { status: 500 });
  }
}
