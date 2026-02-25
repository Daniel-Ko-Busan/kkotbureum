import Link from 'next/link';
import { getOrderById } from '@/lib/demo/queries';
import { formatPrice, formatDeliveryDate } from '@/lib/constants';
import type { Metadata } from 'next';
import OrderCompleteClient from './OrderCompleteClient';

export const metadata: Metadata = {
  title: '주문 완료',
};

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-text-tertiary">주문 정보를 찾을 수 없어요</p>
        <Link href="/" className="mt-4 text-primary font-medium text-sm">홈으로 돌아가기</Link>
      </div>
    );
  }

  const order = await getOrderById(orderId);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-text-tertiary">주문 정보를 찾을 수 없어요</p>
        <Link href="/" className="mt-4 text-primary font-medium text-sm">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-12 pb-8 page-transition">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-text-primary">주문 완료.</h1>
        <p className="text-sm text-text-secondary mt-2">
          플로리스트가 꽃을 준비하고 있어요.
        </p>
      </div>

      {/* Order Info */}
      <div className="bg-bg-secondary rounded-xl p-4 mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-tertiary">주문번호</span>
            <OrderCompleteClient orderNumber={order.order_number} productId={order.product_id || ''} />
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-tertiary">상품</span>
            <span className="text-sm text-text-primary">{order.product_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-tertiary">받는 분</span>
            <span className="text-sm text-text-primary">{order.recipient_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-tertiary">배송일</span>
            <span className="text-sm text-text-primary">{formatDeliveryDate(order.delivery_date)}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between">
            <span className="text-sm text-text-tertiary">결제 금액</span>
            <span className="text-sm font-bold text-primary">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="w-full py-3 rounded-lg bg-primary text-white text-center font-semibold hover:bg-primary-hover transition-colors"
        >
          홈으로 돌아가기
        </Link>
        <Link
          href="/order/lookup"
          className="w-full py-3 rounded-lg border border-primary text-primary text-center font-medium hover:bg-blue-50 transition-colors"
        >
          주문 조회하기
        </Link>
        <Link
          href="/products"
          className="w-full py-3 rounded-lg border border-border text-text-secondary text-center font-medium hover:bg-bg-secondary transition-colors"
        >
          다른 꽃도 둘러보기
        </Link>
      </div>

      {/* Info */}
      <div className="mt-6 p-3 rounded-lg bg-blue-50 border border-primary/10">
        <p className="text-xs text-text-secondary text-center">
          주문 상태는 SMS로 알려드릴게요.<br />
          문의사항이 있으시면 카카오톡으로 연락해주세요.
        </p>
      </div>
    </div>
  );
}
