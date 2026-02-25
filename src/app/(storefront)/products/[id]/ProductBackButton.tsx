'use client';

import { useRouter } from 'next/navigation';

export default function ProductBackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.push('/products')} className="p-1 -ml-1" aria-label="상품 목록으로">
      <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </button>
  );
}
