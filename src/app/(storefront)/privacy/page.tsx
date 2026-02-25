import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-12 page-transition">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-text-tertiary hover:text-text-primary transition-colors mb-6"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        홈으로 돌아가기
      </Link>

      <h1 className="text-xl font-bold text-text-primary mb-1">
        개인정보처리방침
      </h1>
      <p className="text-sm text-text-tertiary mb-8">
        꽃부름은 고객님의 개인정보를 소중히 보호합니다.
      </p>

      {/* 1. 수집하는 개인정보 */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-text-primary mb-2">
          1. 수집하는 개인정보 항목
        </h2>
        <div className="rounded-xl bg-bg-secondary p-4">
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              보내는 분 이름, 전화번호
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              받는 분 이름, 전화번호, 주소
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              카드 메시지
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              결제 정보
            </li>
          </ul>
        </div>
      </section>

      {/* 2. 수집 및 이용 목적 */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-text-primary mb-2">
          2. 개인정보의 수집 및 이용 목적
        </h2>
        <div className="rounded-xl bg-bg-secondary p-4">
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              꽃배달 서비스 주문 처리
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              배송
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              고객 문의 대응
            </li>
          </ul>
        </div>
      </section>

      {/* 3. 보유 및 이용 기간 */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-text-primary mb-2">
          3. 개인정보의 보유 및 이용 기간
        </h2>
        <div className="rounded-xl bg-bg-secondary p-4 space-y-2 text-sm text-text-secondary">
          <p>
            주문 완료 후 <strong className="text-text-primary">5년</strong> 보관
            (전자상거래 등에서의 소비자보호에 관한 법률)
          </p>
          <p>
            고객의 동의 철회 요청 시{' '}
            <strong className="text-text-primary">즉시 삭제</strong>합니다.
          </p>
        </div>
      </section>

      {/* 4. 제3자 제공 */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-text-primary mb-2">
          4. 개인정보의 제3자 제공
        </h2>
        <div className="rounded-xl bg-bg-secondary p-4">
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              <span>
                <strong className="text-text-primary">토스페이먼츠</strong> -
                결제 처리
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              <span>
                <strong className="text-text-primary">Aligo</strong> - SMS 발송
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. 정보주체의 권리 */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-text-primary mb-2">
          5. 정보주체의 권리
        </h2>
        <div className="rounded-xl bg-bg-secondary p-4 text-sm text-text-secondary">
          <p className="mb-2">
            고객님은 언제든지 다음의 권리를 행사하실 수 있습니다.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              개인정보 열람 요청
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              개인정보 정정 요청
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              개인정보 삭제 요청
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-tertiary mt-0.5">&#8226;</span>
              개인정보 수집 및 이용 동의 철회 요청
            </li>
          </ul>
        </div>
      </section>

      {/* 6. 연락처 */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-text-primary mb-2">
          6. 개인정보 보호 문의
        </h2>
        <div className="rounded-xl bg-bg-secondary p-4 text-sm text-text-secondary">
          <p>
            개인정보 관련 문의사항은 아래 이메일로 연락해주세요.
          </p>
          <p className="mt-2">
            <strong className="text-text-primary">이메일:</strong>{' '}
            <a
              href="mailto:info@kkotbureum.com"
              className="text-primary hover:underline"
            >
              info@kkotbureum.com
            </a>
          </p>
        </div>
      </section>

      <p className="text-xs text-text-tertiary text-center mt-8">
        본 방침은 2025년 1월 1일부터 시행됩니다.
      </p>
    </div>
  );
}
