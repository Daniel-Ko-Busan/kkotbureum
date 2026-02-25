'use client';

import type { OrderFormData } from '@/types';
import { formatPrice, formatPhone, formatDeliveryDate, DELIVERY_TIME_SLOTS } from '@/lib/constants';

interface OrderSummaryProps {
  data: OrderFormData;
}

export default function OrderSummary({ data }: OrderSummaryProps) {
  return (
    <div className="bg-bg-secondary rounded-xl p-4 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-medium text-text-tertiary mb-2">상품</h4>
        <p className="text-sm font-semibold text-text-primary">{data.productName}</p>
      </div>

      <div className="h-px bg-border" />

      <div>
        <h4 className="text-xs font-medium text-text-tertiary mb-2">받는 분</h4>
        <p className="text-sm text-text-primary">{data.recipientName}</p>
        <p className="text-sm text-text-secondary">{formatPhone(data.recipientPhone)}</p>
        <p className="text-sm text-text-secondary mt-1">
          {data.recipientAddress}
          {data.recipientAddressDetail && ` ${data.recipientAddressDetail}`}
        </p>
      </div>

      <div className="h-px bg-border" />

      <div>
        <h4 className="text-xs font-medium text-text-tertiary mb-2">배송</h4>
        <p className="text-sm text-text-primary">
          {formatDeliveryDate(data.deliveryDate)}
          {data.deliveryTimeSlot && (
            <span className="text-text-secondary">
              {' · '}
              {DELIVERY_TIME_SLOTS.find(s => s.value === data.deliveryTimeSlot)?.label || data.deliveryTimeSlot}
            </span>
          )}
        </p>
      </div>

      {data.cardMessage && (
        <>
          <div className="h-px bg-border" />
          <div>
            <h4 className="text-xs font-medium text-text-tertiary mb-2">카드 메시지</h4>
            <p className="text-sm text-text-primary whitespace-pre-wrap">{data.cardMessage}</p>
          </div>
        </>
      )}

      <div className="h-px bg-border" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">총 결제 금액</span>
        <span className="text-lg font-bold text-primary">{formatPrice(data.productPrice)}</span>
      </div>
      <p className="text-[10px] text-text-tertiary -mt-2">배송비 포함, 보이는 가격이 최종 가격이에요</p>
    </div>
  );
}
