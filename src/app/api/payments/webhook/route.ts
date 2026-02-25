import { NextRequest, NextResponse } from 'next/server';
import { DEMO_MODE } from '@/lib/demo/data';

export async function POST(request: NextRequest) {
  try {
    const { paymentId, orderId } = await request.json();

    if (!paymentId || !orderId) {
      return NextResponse.json({ error: '필수 정보가 없어요' }, { status: 400 });
    }

    // Demo mode: skip payment verification
    if (DEMO_MODE) {
      return NextResponse.json({
        success: true,
        order: { id: orderId, status: 'confirmed', payment_status: 'paid', payment_id: paymentId },
      });
    }

    const { createServiceClient } = await import('@/lib/supabase/server');
    const { verifyPayment } = await import('@/lib/portone');
    const { sendSMS, getOrderConfirmationMessage } = await import('@/lib/notifications');
    const supabase = await createServiceClient();

    // Get order
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없어요' }, { status: 404 });
    }

    // Verify payment amount
    const verification = await verifyPayment(paymentId, order.total_amount);

    if (!verification.success) {
      // Mark payment as failed
      await supabase
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', orderId);

      return NextResponse.json({ error: verification.error || '결제 검증에 실패했어요' }, { status: 400 });
    }

    // Update order: payment success
    const { data: updated, error } = await supabase
      .from('orders')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        payment_id: paymentId,
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Order update error:', error);
      return NextResponse.json({ error: '주문 업데이트에 실패했어요' }, { status: 500 });
    }

    // Add status history
    await supabase.from('order_status_history').insert({
      order_id: orderId,
      status: 'confirmed',
      note: `결제 완료: ${paymentId}`,
    });

    // Send confirmation SMS
    const smsContent = getOrderConfirmationMessage({
      orderNumber: updated.order_number,
      recipientName: order.recipient_name,
      productName: order.product_name,
    });

    const smsResult = await sendSMS({
      to: order.sender_phone,
      content: smsContent,
    });

    // Log notification
    await supabase.from('notifications').insert({
      order_id: orderId,
      recipient_phone: order.sender_phone,
      type: 'sms',
      template: 'order_confirmed',
      content: smsContent,
      status: smsResult.success ? 'sent' : 'failed',
      sent_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했어요' }, { status: 500 });
  }
}
