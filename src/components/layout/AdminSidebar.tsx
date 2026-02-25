'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/orders', label: '주문 관리', icon: '📋' },
  { href: '/admin/products', label: '상품 관리', icon: '🌸' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-border min-h-screen p-4 hidden md:block">
      <div className="mb-8">
        <Link href="/admin" className="text-lg font-bold text-primary">
          꽃부름
        </Link>
        <p className="text-xs text-text-tertiary mt-1">관리자</p>
      </div>
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-primary'
                  : 'text-text-secondary hover:bg-bg-secondary'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 pt-4 border-t border-border">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          사이트 보기
        </Link>
      </div>
    </aside>
  );
}
