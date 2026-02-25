'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/constants';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow">
        <div className="aspect-square bg-bg-secondary relative overflow-hidden">
          {product.images?.[0] ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-bg-secondary animate-pulse" />
              )}
              <img
                src={product.images[0]}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🌸
            </div>
          )}
          {product.is_featured && (
            <span className="absolute top-2 left-2 bg-flower text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              인기
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-text-primary text-sm line-clamp-1">
            {product.name}
          </h3>
          {product.short_description && (
            <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">
              {product.short_description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-1.5">
            {hasDiscount && (
              <span className="text-xs text-text-tertiary line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="font-bold text-text-primary">
              {formatPrice(displayPrice)}
            </span>
          </div>
          <p className="text-[10px] text-text-tertiary mt-1">
            배송비 포함
          </p>
        </div>
      </div>
    </Link>
  );
}
