import { getAllProducts } from '@/lib/demo/queries';
import { formatPrice } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '상품 관리' };

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-primary">상품 관리</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors"
        >
          + 상품 추가
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {products?.map((product) => (
          <Link key={product.id} href={`/admin/products/new?edit=${product.id}`}>
            <Card hover>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-bg-secondary overflow-hidden shrink-0">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🌸</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary truncate">{product.name}</p>
                    {!product.is_active && (
                      <span className="px-1.5 py-0.5 bg-red-50 text-error text-[10px] font-medium rounded">비활성</span>
                    )}
                    {product.is_featured && (
                      <span className="px-1.5 py-0.5 bg-blue-50 text-primary text-[10px] font-medium rounded">인기</span>
                    )}
                  </div>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {product.category?.emoji} {product.category?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text-primary">{formatPrice(product.sale_price || product.price)}</p>
                  {product.sale_price && (
                    <p className="text-[10px] text-text-tertiary line-through">{formatPrice(product.price)}</p>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {(!products || products.length === 0) && (
          <div className="text-center py-12">
            <p className="text-text-tertiary text-sm">등록된 상품이 없어요</p>
            <Link href="/admin/products/new" className="text-primary text-sm font-medium mt-2 inline-block">
              첫 상품 등록하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
