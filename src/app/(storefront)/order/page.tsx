'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/useOrder';
import { StepIndicator } from '@/components/ui';
import RecipientForm from '@/components/order/RecipientForm';
import Link from 'next/link';

export default function OrderStep1Page() {
  const router = useRouter();
  const { orderData, updateField } = useOrder();

  useEffect(() => {
    if (!orderData.productId) {
      router.replace('/products');
    }
  }, [orderData.productId, router]);

  if (!orderData.productId) return null;

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="flex items-center px-4 h-14">
          <Link href={`/products/${orderData.productId}`} className="p-1 -ml-1">
            <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center font-semibold text-text-primary">주문하기</h1>
          <div className="w-6" />
        </div>
        <StepIndicator currentStep={1} totalSteps={3} labels={['받는 분', '메시지', '결제']} />
      </div>

      {/* Form */}
      <div className="px-4 pt-6">
        <h2 className="text-lg font-bold text-text-primary mb-1">받는 분 정보</h2>
        <p className="text-sm text-text-tertiary mb-6">꽃을 받으실 분의 정보를 입력해주세요</p>

        <RecipientForm
          data={orderData}
          onUpdate={updateField}
          onNext={() => router.push('/order/message')}
        />
      </div>
    </div>
  );
}
