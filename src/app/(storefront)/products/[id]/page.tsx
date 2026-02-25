import { getProductById } from '@/lib/demo/queries';
import { formatPrice, SITE_URL } from '@/lib/constants';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import ProductBackButton from './ProductBackButton';
import ProductImage from '@/components/product/ProductImage';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: '상품 상세' };
  }

  const displayPrice = product.sale_price || product.price;
  const title = `${product.name} ${formatPrice(displayPrice)}`;
  const description = product.short_description || product.description || '꽃부름 부산 꽃배달';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${id}`,
      images: product.images?.[0] ? [{ url: product.images[0], alt: product.name }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const displayPrice = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  return (
    <div className="page-transition">
      {/* Back Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <ProductBackButton />
          <span className="font-semibold text-text-primary">상품 상세</span>
        </div>
      </div>

      {/* Product Image */}
      {product.images?.[0] ? (
        <ProductImage src={product.images[0]} alt={product.name} />
      ) : (
        <div className="aspect-square bg-bg-secondary flex items-center justify-center text-6xl">🌸</div>
      )}

      {/* Product Info */}
      <div className="px-4 pt-4 pb-28">
        {product.category && (
          <span className="inline-flex items-center gap-1 text-xs text-text-tertiary mb-1">
            {product.category.emoji} {product.category.name}
          </span>
        )}
        <h1 className="text-xl font-bold text-text-primary">{product.name}</h1>

        <div className="flex items-center gap-2 mt-2">
          {hasDiscount && (
            <span className="text-sm text-text-tertiary line-through">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="text-2xl font-bold text-text-primary">
            {formatPrice(displayPrice)}
          </span>
        </div>
        <p className="text-xs text-text-tertiary mt-1">배송비 포함, 추가 비용 없어요</p>

        {product.description && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-text-primary mb-2">상품 설명</h2>
            <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {product.flower_types && product.flower_types.length > 0 && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-text-primary mb-2">사용된 꽃</h2>
            <div className="flex flex-wrap gap-1.5">
              {product.flower_types.map((flower: string) => (
                <span key={flower} className="px-2.5 py-1 bg-bg-secondary rounded-full text-xs text-text-secondary">
                  {flower}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.size && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-text-primary mb-2">사이즈</h2>
            <span className="px-2.5 py-1 bg-bg-secondary rounded-full text-xs text-text-secondary">
              {product.size}
            </span>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <ProductDetailClient product={product} displayPrice={displayPrice} />
    </div>
  );
}
