import Link from 'next/link';
import { getActiveCategories } from '@/lib/demo/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '미션 선택',
  description: '어떤 마음을 전하고 싶으세요? 상황에 맞는 꽃을 추천해드려요. 부산 당일 배송.',
};

export default async function MissionsPage() {
  const categories = await getActiveCategories();

  return (
    <div className="px-4 pt-6 page-transition">
      <h1 className="text-xl font-bold text-text-primary mb-2">
        어떤 마음을 전하고 싶으세요?
      </h1>
      <p className="text-sm text-text-tertiary mb-6">
        상황에 딱 맞는 꽃을 추천해드릴게요
      </p>

      <div className="flex flex-col gap-3">
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?mission=${cat.slug}`}
            className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:border-primary/30 transition-all"
          >
            <span className="text-3xl">{cat.emoji}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary">{cat.name}</h3>
              <p className="text-sm text-text-tertiary mt-0.5">{cat.description}</p>
            </div>
            <svg className="w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Florist choice */}
      <div className="mt-6 p-4 rounded-xl bg-bg-secondary border-2 border-dashed border-border">
        <div className="text-center">
          <span className="text-2xl">🎨</span>
          <h3 className="font-semibold text-text-primary mt-2">플로리스트에게 맡기기</h3>
          <p className="text-sm text-text-tertiary mt-1">
            뭘 골라야 할지 모르겠다면, 예산만 알려주세요
          </p>
          <Link
            href="/products?mission=trust_florist"
            className="inline-block mt-3 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            플로리스트 추천받기
          </Link>
        </div>
      </div>
    </div>
  );
}
