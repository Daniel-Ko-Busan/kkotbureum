import { getProducts, getCategoryBySlug } from '@/lib/demo/queries';
import ProductGrid from '@/components/product/ProductGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '전체 꽃',
  description: '부산 당일 배송 꽃다발, 꽃바구니. 보이는 가격이 최종 가격, 배송비 포함.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ mission?: string }>;
}) {
  const { mission } = await searchParams;
  const products = await getProducts(mission);

  let categoryName = '전체 꽃';
  let categoryEmoji = '🌸';
  if (mission && mission !== 'trust_florist') {
    const cat = await getCategoryBySlug(mission);
    if (cat) {
      categoryName = cat.name;
      categoryEmoji = cat.emoji || '🌸';
    }
  } else if (mission === 'trust_florist') {
    categoryName = '플로리스트 추천';
    categoryEmoji = '🎨';
  }

  return (
    <div className="px-4 pt-6 page-transition">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{categoryEmoji}</span>
          <h1 className="text-xl font-bold text-text-primary">{categoryName}</h1>
        </div>
        <p className="text-sm text-text-tertiary">
          보이는 가격이 최종 가격이에요 (배송비 포함)
        </p>
      </div>

      <ProductGrid
        products={products || []}
        emptyMessage="아직 준비 중이에요. 곧 예쁜 꽃을 보여드릴게요!"
      />
    </div>
  );
}
