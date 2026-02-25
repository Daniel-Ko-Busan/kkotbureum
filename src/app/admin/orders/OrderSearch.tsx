'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OrderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const status = searchParams.get('status');
    if (status) params.set('status', status);
    if (query.trim()) params.set('q', query.trim());
    router.push(`/admin/orders${params.toString() ? `?${params}` : ''}`);
  };

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams();
    const status = searchParams.get('status');
    if (status) params.set('status', status);
    router.push(`/admin/orders${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="주문번호, 이름, 전화번호, 상품명 검색"
            className="w-full px-4 py-2.5 pr-9 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          검색
        </button>
      </div>
    </form>
  );
}
