'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrder } from '@/hooks/useOrder';
import { StepIndicator, Button } from '@/components/ui';
import OrderSummary from '@/components/order/OrderSummary';
import { TextArea } from '@/components/ui/Input';

export default function OrderStep3Page() {
  const router = useRouter();
  const { orderData, updateField, reset } = useOrder();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState<'order' | 'payment' | 'verify' | ''>('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!orderData.productId) {
      router.replace('/products');
    }
  }, [orderData.productId, router]);

  if (!orderData.productId) return null;

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    setErrorType('');

    try {
      // 1. Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: orderData.senderName,
          sender_phone: orderData.senderPhone.replace(/-/g, ''),
          recipient_name: orderData.recipientName,
          recipient_phone: orderData.recipientPhone.replace(/-/g, ''),
          recipient_address: orderData.recipientAddress,
          recipient_address_detail: orderData.recipientAddressDetail,
          recipient_zipcode: orderData.recipientZipcode,
          product_id: orderData.productId,
          product_name: orderData.productName,
          product_price: orderData.productPrice,
          quantity: 1,
          card_message: orderData.cardMessage,
          delivery_date: orderData.deliveryDate,
          delivery_time_slot: orderData.deliveryTimeSlot,
          special_instructions: orderData.specialInstructions,
          subtotal: orderData.productPrice,
          delivery_fee: 0,
          total_amount: orderData.productPrice,
        }),
      });

      if (!orderRes.ok) {
        setErrorType('order');
        throw new Error('주문 생성에 실패했어요');
      }

      const order = await orderRes.json();

      // 2. Pre-register payment amount (서버 측 금액 검증 준비)
      const prepareRes = await fetch('/api/payments/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          amount: orderData.productPrice,
        }),
      });

      if (!prepareRes.ok) {
        setErrorType('order');
        throw new Error('결제 준비에 실패했어요');
      }

      // 3. Request payment via PortOne
      const { default: PortOne } = await import('@portone/browser-sdk/v2');

      const paymentResponse = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
        paymentId: `payment-${order.id}`,
        orderName: orderData.productName,
        totalAmount: orderData.productPrice,
        currency: 'CURRENCY_KRW',
        payMethod: 'CARD',
        customer: {
          fullName: orderData.senderName,
          phoneNumber: orderData.senderPhone.replace(/-/g, ''),
        },
      });

      if (paymentResponse?.code) {
        if (paymentResponse.code === 'USER_CANCEL') {
          setLoading(false);
          return; // 사용자가 직접 취소한 경우 에러 표시 불필요
        }
        setErrorType('payment');
        throw new Error(paymentResponse.message || '결제에 실패했어요');
      }

      // 4. Verify payment on server
      const verifyRes = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: paymentResponse?.paymentId,
          orderId: order.id,
        }),
      });

      if (!verifyRes.ok) {
        setErrorType('verify');
        throw new Error('결제 확인에 실패했어요');
      }

      // 5. Success — redirect (완료 페이지 이동 후 클리어)
      const completeUrl = `/order/complete?orderId=${order.id}`;
      router.push(completeUrl);
      // 네비게이션 시작 후 클리어 (뒤로가기 시 빈 페이지 방지)
      setTimeout(() => reset(), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했어요');
    } finally {
      setLoading(false);
    }
  };

  const getErrorHint = () => {
    switch (errorType) {
      case 'order':
        return '네트워크 연결을 확인하고 다시 시도해주세요.';
      case 'payment':
        return '다른 결제 수단을 사용하거나 카드사에 문의해주세요.';
      case 'verify':
        return '결제는 완료되었을 수 있어요. 잠시 후 다시 시도하거나, 문제가 지속되면 고객센터로 연락해주세요.';
      default:
        return '잠시 후 다시 시도해주세요.';
    }
  };

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="flex items-center px-4 h-14">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="flex-1 text-center font-semibold text-text-primary">주문하기</h1>
          <div className="w-6" />
        </div>
        <StepIndicator currentStep={3} totalSteps={3} labels={['받는 분', '메시지', '결제']} />
      </div>

      {/* Content */}
      <div className="px-4 pt-6 flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-1">주문 확인</h2>
          <p className="text-sm text-text-tertiary">주문 내용을 확인해주세요</p>
        </div>

        <OrderSummary data={orderData} />

        {/* Special Instructions */}
        <TextArea
          label="요청사항 (선택)"
          placeholder="배달 시 요청사항이 있으면 적어주세요"
          rows={2}
          value={orderData.specialInstructions}
          onChange={(e) => updateField('specialInstructions', e.target.value)}
          maxLength={200}
          hint={`${orderData.specialInstructions.length}/200`}
        />

        {/* 약관 동의 */}
        <div className="p-4 rounded-xl bg-bg-secondary border border-border">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 rounded border-border mt-0.5 flex-shrink-0"
            />
            <span className="text-sm text-text-secondary leading-relaxed">
              주문 내용을 확인했으며,{' '}
              <Link href="/terms" target="_blank" className="text-primary underline underline-offset-2">이용약관</Link>
              {' '}및{' '}
              <Link href="/privacy" target="_blank" className="text-primary underline underline-offset-2">개인정보처리방침</Link>
              에 동의합니다.
            </span>
          </label>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-error/20">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-error">{error}</p>
                <p className="text-xs text-text-secondary mt-1">{getErrorHint()}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePayment}
              className="mt-3 w-full py-2 rounded-lg border border-error/30 text-sm font-medium text-error hover:bg-red-100 transition-colors"
            >
              다시 시도하기
            </button>
          </div>
        )}

        <div className="flex gap-3 pb-8">
          <Button onClick={() => router.back()} variant="secondary" size="lg" className="flex-1">
            이전
          </Button>
          <Button onClick={handlePayment} loading={loading} disabled={loading || !agreed} size="lg" className="flex-[2]">
            {loading ? '결제 처리 중...' : `${orderData.productPrice.toLocaleString()}원 결제하기`}
          </Button>
        </div>
      </div>
    </div>
  );
}
