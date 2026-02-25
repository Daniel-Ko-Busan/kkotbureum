'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  // Don't show on: order flow (own nav), product detail (own back nav + CTA)
  if (pathname.startsWith('/order')) return null;
  if (/^\/products\/[^/]+$/.test(pathname)) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-lg font-bold text-primary">꽃부름</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/missions"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/missions'
                ? 'text-primary bg-blue-50'
                : 'text-text-secondary hover:bg-bg-secondary'
            }`}
          >
            미션
          </Link>
          <Link
            href="/products"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith('/products')
                ? 'text-primary bg-blue-50'
                : 'text-text-secondary hover:bg-bg-secondary'
            }`}
          >
            전체 꽃
          </Link>
        </nav>
      </div>
    </header>
  );
}
