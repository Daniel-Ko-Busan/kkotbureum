import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/demo/queries';
import { formatPrice, MISSION_CATEGORIES, SAME_DAY_CUTOFF_HOUR, SITE_NAME, SITE_URL } from '@/lib/constants';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import CountdownTimer from './CountdownTimer';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FloristShop',
    name: SITE_NAME,
    description: '부산 당일 꽃배달 꽃부름. 꽃 하나 부르는 거, 이렇게 쉬워요.',
    url: SITE_URL,
    areaServed: {
      '@type': 'City',
      name: '부산',
    },
    priceRange: '₩35,000 ~ ₩150,000',
    openingHours: 'Mo-Su 00:00-23:59',
    paymentAccepted: '카드, 토스페이, 카카오페이, 네이버페이',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="max-w-lg mx-auto pb-20 min-h-screen">
        {/* Hero + Countdown */}
        <section className="px-4 pt-6 pb-4">
          <p className="text-xs font-medium text-primary tracking-wide mb-1">부산 당일 꽃배달</p>
          <h1 className="text-2xl font-bold text-text-primary leading-tight">
            꽃 하나 부르는 거<br />
            이렇게 쉬워요.
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            보이는 가격이 최종 가격이에요
          </p>
          <CountdownTimer cutoffHour={SAME_DAY_CUTOFF_HOUR} />
        </section>

        {/* Mission Categories */}
        <section className="px-4 pb-6">
          <h2 className="text-lg font-bold text-text-primary mb-3">
            어떤 마음을 전하고 싶으세요?
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {MISSION_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?mission=${cat.slug}`}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-bg-secondary hover:bg-border transition-colors"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-text-primary text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="px-4 pb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-text-primary">인기 꽃</h2>
              <Link href="/products" className="text-sm text-primary font-medium">
                전체보기
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.map((product) => {
                const displayPrice = product.sale_price || product.price;
                return (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow">
                      <div className="aspect-square bg-bg-secondary relative overflow-hidden">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">🌸</div>
                        )}
                        {product.is_featured && (
                          <span className="absolute top-2 left-2 bg-flower text-white text-xs font-semibold px-2 py-0.5 rounded-full">인기</span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-text-primary text-sm line-clamp-1">{product.name}</h3>
                        {product.short_description && (
                          <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">{product.short_description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-1.5">
                          {product.sale_price && product.sale_price < product.price && (
                            <span className="text-xs text-text-tertiary line-through">{formatPrice(product.price)}</span>
                          )}
                          <span className="font-bold text-text-primary">{formatPrice(displayPrice)}</span>
                        </div>
                        <p className="text-[10px] text-text-tertiary mt-1">배송비 포함</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Order Lookup CTA */}
        <section className="px-4 pb-6">
          <Link
            href="/order/lookup"
            className="flex items-center justify-between w-full p-4 rounded-xl bg-bg-secondary border border-border hover:bg-border transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">📦</span>
              <div>
                <p className="text-sm font-semibold text-text-primary">주문 조회</p>
                <p className="text-xs text-text-tertiary">주문번호로 배송 상태를 확인하세요</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </section>

        {/* Value Props */}
        <section className="px-4 pb-8">
          <div className="bg-bg-secondary rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="text-lg">🎯</span>
              <div>
                <p className="text-sm font-semibold text-text-primary">사진 = 실물</p>
                <p className="text-xs text-text-tertiary">우리 플로리스트가 직접 만들어요</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🚀</span>
              <div>
                <p className="text-sm font-semibold text-text-primary">부산 당일 배송</p>
                <p className="text-xs text-text-tertiary">오후 4시 전 주문, 오늘 도착</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">💰</span>
              <div>
                <p className="text-sm font-semibold text-text-primary">추가 비용 없음</p>
                <p className="text-xs text-text-tertiary">보이는 가격이 최종 가격이에요</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
