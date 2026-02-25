import { NextRequest, NextResponse } from 'next/server';
import { DEMO_MODE } from '@/lib/demo/data';

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount } = await request.json();

    if (!orderId || !amount) {
      return NextResponse.json({ error: '필수 정보가 없어요' }, { status: 400 });
    }

    // Demo mode: skip pre-registration
    if (DEMO_MODE) {
      return NextResponse.json({ success: true, paymentId: `payment-${orderId}` });
    }

    // Pre-register payment amount with PortOne for server-side verification
    const response = await fetch('https://api.portone.io/payments/pre-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
      },
      body: JSON.stringify({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
        paymentId: `payment-${orderId}`,
        totalAmount: amount,
        currency: 'KRW',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Payment prepare error:', error);
      return NextResponse.json({ error: '결제 준비에 실패했어요' }, { status: 500 });
    }

    return NextResponse.json({ success: true, paymentId: `payment-${orderId}` });
  } catch (error) {
    console.error('Payment prepare error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했어요' }, { status: 500 });
  }
}
