'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/useOrder';
import { StepIndicator } from '@/components/ui';
import MessageComposer from '@/components/order/MessageComposer';
import Link from 'next/link';

export default function OrderStep2Page() {
  const router = useRouter();
  const { orderData, updateField } = useOrder();

  useEffect(() => {
    if (!orderData.productId) {
      router.replace('/products');
    } else if (!orderData.recipientName || !orderData.recipientPhone || !orderData.recipientAddress || !orderData.deliveryDate) {
      // Step 1 데이터가 없으면 Step 1로 되돌림
      router.replace('/order');
    }
  }, [orderData, router]);

  if (!orderData.productId || !orderData.recipientName) return null;

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
        <StepIndicator currentStep={2} totalSteps={3} labels={['받는 분', '메시지', '결제']} />
      </div>

      {/* Content */}
      <div className="px-4 pt-6">
        <MessageComposer
          value={orderData.cardMessage}
          onChange={(val) => updateField('cardMessage', val)}
          onNext={() => router.push('/order/payment')}
          onBack={() => router.back()}
        />
      </div>
    </div>
  );
}
