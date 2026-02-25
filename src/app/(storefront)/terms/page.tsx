import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관',
};

export default function TermsPage() {
  return (
    <div className="page-transition">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="flex items-center px-4 h-14">
          <Link href="/" className="p-1 -ml-1">
            <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center font-semibold text-text-primary">이용약관</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="px-4 pt-6 pb-12">
        <p className="text-sm text-text-tertiary mb-8">
          본 약관은 꽃부름(이하 &quot;회사&quot;)이 제공하는 부산 지역 꽃 배달 서비스(이하
          &quot;서비스&quot;)의 이용에 관한 기본 사항을 규정합니다.
        </p>

        <div className="flex flex-col gap-8">
          {/* 제1조 */}
          <section>
            <h2 className="text-base font-bold text-text-primary mb-2">제1조 (목적)</h2>
            <div className="bg-bg-secondary rounded-xl p-4">
              <p className="text-sm text-text-secondary leading-relaxed">
                본 약관은 회사가 운영하는 온라인 플랫폼을 통해 제공하는 꽃 배달 서비스의
                이용 조건 및 절차, 회사와 이용자 간의 권리·의무 및 책임 사항, 기타 필요한
                사항을 규정하는 것을 목적으로 합니다.
              </p>
            </div>
          </section>

          {/* 제2조 */}
          <section>
            <h2 className="text-base font-bold text-text-primary mb-2">제2조 (서비스 내용)</h2>
            <div className="bg-bg-secondary rounded-xl p-4">
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                회사는 다음과 같은 서비스를 제공합니다.
              </p>
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">1.</span>
                  <span>꽃 상품 주문 및 결제</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">2.</span>
                  <span>부산 지역 꽃 배달</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">3.</span>
                  <span>AI 카드 메시지 작성 도우미</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 제3조 */}
          <section>
            <h2 className="text-base font-bold text-text-primary mb-2">제3조 (주문 및 결제)</h2>
            <div className="bg-bg-secondary rounded-xl p-4">
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">1.</span>
                  <span>
                    서비스는 게스트 주문 방식으로 운영되며, 별도의 회원가입 없이 이용할 수
                    있습니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">2.</span>
                  <span>
                    결제는 신용카드, 체크카드, 간편결제 등 회사가 지정한 결제 수단을 통해
                    이루어집니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">3.</span>
                  <span>
                    주문은 결제가 완료된 시점에 확정되며, 주문 확인 내역은 주문 조회
                    페이지에서 확인할 수 있습니다.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 제4조 */}
          <section>
            <h2 className="text-base font-bold text-text-primary mb-2">제4조 (배송)</h2>
            <div className="bg-bg-secondary rounded-xl p-4">
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">1.</span>
                  <span>배송 지역은 부산광역시로 한정됩니다.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">2.</span>
                  <span>
                    당일 배송을 원하시는 경우, 오후 4시까지 주문을 완료해야 합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">3.</span>
                  <span>
                    상품 가격에는 배송비가 포함되어 있으며, 별도의 배송비는 부과되지
                    않습니다.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 제5조 */}
          <section>
            <h2 className="text-base font-bold text-text-primary mb-2">제5조 (취소 및 환불)</h2>
            <div className="bg-bg-secondary rounded-xl p-4">
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">1.</span>
                  <span>
                    꽃 준비가 시작되기 전까지 전액 취소가 가능합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">2.</span>
                  <span>
                    꽃 준비가 시작된 이후에는 상품의 특성상 취소가 불가합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">3.</span>
                  <span>
                    배송된 상품에 품질 문제가 있는 경우, 수령 당일 사진을 첨부하여
                    문의해주시면 확인 후 재배송 또는 환불 처리해 드립니다.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 제6조 */}
          <section>
            <h2 className="text-base font-bold text-text-primary mb-2">제6조 (면책)</h2>
            <div className="bg-bg-secondary rounded-xl p-4">
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">1.</span>
                  <span>
                    천재지변, 전쟁, 폭동 등 불가항력적인 사유로 서비스 제공이 불가능한
                    경우, 회사는 이에 대한 책임을 지지 않습니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">2.</span>
                  <span>
                    수령인 부재 시, 배달원은 안전한 장소에 상품을 배치하며 이후 발생하는
                    문제에 대해 회사는 책임을 지지 않습니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">3.</span>
                  <span>
                    꽃은 자연 상품의 특성상 계절 및 수급 상황에 따라 일부 꽃이 유사한
                    품종으로 대체될 수 있으며, 이 경우 전체적인 분위기와 가격대는
                    동일하게 유지됩니다.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 제7조 */}
          <section>
            <h2 className="text-base font-bold text-text-primary mb-2">제7조 (분쟁 해결)</h2>
            <div className="bg-bg-secondary rounded-xl p-4">
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">1.</span>
                  <span>
                    본 약관에 관한 분쟁은 대한민국 법률을 적용합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary flex-shrink-0">2.</span>
                  <span>
                    서비스 이용과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는
                    부산지방법원을 제1심 관할 법원으로 합니다.
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-text-tertiary text-center">
            본 약관은 2026년 2월 25일부터 시행됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
