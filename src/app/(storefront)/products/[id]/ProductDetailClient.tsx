'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/constants';
import type { Product } from '@/types';

interface ProductDetailClientProps {
  product: Product;
  displayPrice: number;
}

export default function ProductDetailClient({ product, displayPrice }: ProductDetailClientProps) {
  const router = useRouter();

  const handleOrder = () => {
    // 기존 입력 데이터(보내는 분, 받는 분 등)를 보존하고 상품 정보만 갱신
    const saved = sessionStorage.getItem('orderData');
    const existing = saved ? JSON.parse(saved) : {};
    sessionStorage.setItem('orderData', JSON.stringify({
      senderName: existing.senderName || '',
      senderPhone: existing.senderPhone || '',
      recipientName: existing.recipientName || '',
      recipientPhone: existing.recipientPhone || '',
      recipientAddress: existing.recipientAddress || '',
      recipientAddressDetail: existing.recipientAddressDetail || '',
      recipientZipcode: existing.recipientZipcode || '',
      deliveryDate: existing.deliveryDate || '',
      deliveryTimeSlot: existing.deliveryTimeSlot || 'anytime',
      cardMessage: existing.cardMessage || '',
      specialInstructions: existing.specialInstructions || '',
      productId: product.id,
      productName: product.name,
      productPrice: displayPrice,
    }));
    router.push('/order');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-text-tertiary">총 결제 금액</p>
          <p className="text-lg font-bold text-text-primary">{formatPrice(displayPrice)}</p>
        </div>
        <Button onClick={handleOrder} size="lg" className="flex-1">
          주문하기
        </Button>
      </div>
    </div>
  );
}
