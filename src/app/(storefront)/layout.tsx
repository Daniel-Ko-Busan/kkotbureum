'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that show BottomNav need bottom padding
  const isProductDetail = /^\/products\/[^/]+$/.test(pathname);
  const isOrderFlow = pathname.startsWith('/order');
  const needsBottomPadding = !isProductDetail && !isOrderFlow;

  return (
    <>
      <Header />
      <main className={`max-w-lg mx-auto min-h-screen ${needsBottomPadding ? 'pb-20' : ''}`}>
        {children}
      </main>
      <BottomNav />
    </>
  );
}
