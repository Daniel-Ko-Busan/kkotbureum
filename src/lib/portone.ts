import type { Order } from '@/types';

export const PORTONE_STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID!;
export const PORTONE_CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!;

export interface PaymentRequest {
  orderName: string;
  totalAmount: number;
  orderId: string;
  customerName: string;
  customerPhone: string;
}

export function buildPaymentRequest(order: Order): PaymentRequest {
  return {
    orderName: order.product_name,
    totalAmount: order.total_amount,
    orderId: order.id,
    customerName: order.sender_name,
    customerPhone: order.sender_phone,
  };
}

// Server-side payment verification
export async function verifyPayment(paymentId: string, expectedAmount: number): Promise<{
  success: boolean;
  error?: string;
}> {
  const response = await fetch(
    `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: {
        Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
      },
    }
  );

  if (!response.ok) {
    return { success: false, error: 'Failed to verify payment' };
  }

  const payment = await response.json();

  if (payment.status !== 'PAID') {
    return { success: false, error: `Payment status: ${payment.status}` };
  }

  if (payment.amount.total !== expectedAmount) {
    return { success: false, error: 'Amount mismatch' };
  }

  return { success: true };
}

export async function cancelPayment(paymentId: string, reason: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const response = await fetch(
    `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/cancel`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
      },
      body: JSON.stringify({ reason }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  return { success: true };
}
