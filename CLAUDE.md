# 꽃부름 (Kkotbureum)

부산 로컬 D2C 꽃배달 서비스 MVP. 모바일 퍼스트, 토스식 UX.
상세 PRD: `PRD.md` 참조 (비즈니스 모델, 고객 심리, DB 스키마 등)

> 브랜드 이력: 미션꽃파서블 → 부타닉 가든 → **꽃부름** (현재)
> "꽃 + 부름" = 꽃을 부르다(주문하다). 심부름 오마주 — 부르면 오는 당일 배달.

## 현재 상태: Phase 1 MVP 완성 (Sprint 1~3 전체 완료)

데모 모드로 전체 기능 동작 확인 완료. Supabase/API 키 연결 후 실제 배포 가능.
- 빌드: `next build` 성공, 26개 라우트 전체 정상
- A-to-Z 플로우 테스트 완료

## 기술 스택
- **프레임워크**: Next.js 16 (App Router, Turbopack)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4 (`@theme inline` 커스텀 토큰, `tailwind.config.js` 없음)
- **DB**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **결제**: PortOne v0.1.3 (토스페이먼츠)
- **AI**: Vercel AI SDK + Claude Sonnet (카드 메시지 생성)
- **SMS**: Aligo API (데모 모드: 콘솔 로그)
- **폰트**: Pretendard Variable (CDN)
- **배포**: Vercel (icn1 리전), `vercel.json` 설정 완료

## 프로젝트 구조
```
src/
├── app/
│   ├── layout.tsx, page.tsx, globals.css   # 루트 레이아웃, 홈, 스타일
│   ├── CountdownTimer.tsx                  # 당일배송 카운트다운
│   ├── robots.ts, sitemap.ts              # SEO
│   ├── (storefront)/                      # 고객용 페이지 (route group)
│   │   ├── layout.tsx                     # Header + BottomNav + 조건부 패딩
│   │   ├── missions/                      # 미션 카테고리 목록
│   │   ├── products/                      # 상품 목록 + [id] 상세
│   │   ├── order/                         # 주문 플로우 (Step 1→2→3→complete→lookup)
│   │   ├── privacy/, terms/               # 법적 페이지
│   ├── admin/                             # 관리자 (대시보드, 주문관리, 상품CRUD)
│   │   ├── orders/                        # 주문 목록 + [id] 상세 + OrderSearch + OrderStatusActions
│   │   ├── products/                      # 상품 목록 + new (추가/수정)
│   │   └── login/                         # Supabase Auth 로그인
│   └── api/                               # API routes
│       ├── chat/                          # AI 카드 메시지 (데모: 상황별 7가지)
│       ├── orders/                        # 주문 CRUD + [id]/status + [id]/cancel + lookup
│       ├── payments/                      # prepare + webhook
│       └── notifications/                 # SMS 발송
├── components/
│   ├── ui/                    # Button, Input, Card, Badge, StepIndicator, Toast
│   ├── layout/                # Header, BottomNav, AdminSidebar, AdminMobileNav
│   ├── product/               # ProductCard, ProductGrid, ProductImage
│   └── order/                 # RecipientForm, MessageComposer, OrderSummary
├── hooks/useOrder.ts          # 주문 상태 관리 (useReducer + sessionStorage)
├── lib/
│   ├── constants.ts           # 사이트 상수, formatPrice, formatDeliveryDate, formatPhone
│   ├── demo/data.ts           # 데모 데이터 (globalThis 패턴 — 카테고리 6, 상품 8, 주문 18건)
│   ├── demo/queries.ts        # 데모/프로덕션 데이터 추상화 레이어
│   ├── supabase/              # client.ts, server.ts
│   ├── portone.ts             # 결제 헬퍼
│   └── notifications.ts       # SMS (Aligo) + 상태별 메시지 템플릿 5종
├── types/index.ts
└── middleware.ts              # /admin 보호 (데모 모드 스킵)

vercel.json                    # icn1 리전, 보안 헤더
.env.example                   # 전체 환경변수 문서화
supabase/migrations/           # 001_initial_schema.sql
```

## 데모 모드
Supabase/API 키 없이 전체 UI 테스트 가능.
- `DEMO_MODE` 플래그: `NEXT_PUBLIC_SUPABASE_URL`이 없거나 `https://demo.supabase.co`일 때 활성화
- `globalThis` 패턴으로 Next.js dev 모듈 재평가 시에도 데모 데이터(주문 상태 등) 유지
- 데모 데이터: 카테고리 6개, 상품 8개, 주문 18건 (상태별 3건), 상태 이력
- SMS: 데모 모드에서 콘솔 로그 출력 + 성공 반환

## 주문 플로우
```
상품 상세 → [주문하기] → Step 1 (받는 분) → Step 2 (카드 메시지/AI) → Step 3 (결제) → 완료
```
- 게스트 주문 전용 (로그인 없음)
- `useOrder` 훅 (sessionStorage + useReducer)
- 결제: PortOne SDK → 서버 검증 4단계 (주문생성→사전등록→결제→검증)
- 주문번호 접두사: **BU-** (예: BU-20260225-0001)

## 주문 상태 생명주기
```
pending → confirmed → preparing → delivering → delivered
                ↓          ↓
            cancelled   (취소 불가)
```
- 모든 상태 전환 시 SMS 알림 (5종 템플릿: confirmed, preparing, delivering, delivered, cancelled)
- 취소: pending/confirmed에서만 가능, 결제 완료 건은 PortOne 환불 API 자동 호출

## 디자인 시스템 (꽃부름 v3)
- **Primary**: Toss Blue #3182F6 (신뢰, 속도 — CTA, 로고, 링크, 활성 상태)
- **Accent**: Flower Pink #F06595 (꽃의 따뜻함 — 인기 배지, 강조)
- **Success**: #2B8A3E, **Error**: #E03131, **Warning**: #FF9F00, **Info**: #3182F6
- Text: #191F28/#4E5968/#8B95A1, BG: #FFFFFF/#F2F4F6 (쿨 톤), Border: #E5E8EB
- 모바일 퍼스트: max-w-lg (512px), Radius: 카드 12px, 버튼 8px
- Tailwind 클래스: `text-primary`, `text-flower`, `bg-flower`
- 주문 상태: confirmed=blue, preparing=yellow, delivering=purple, delivered=green

## 카피라이팅 톤
- **컨셉**: "가볍고 친근한 심부름" — 부담 없이, 친구에게 부탁하듯
- 히어로: "꽃 하나 부르는 거 / 이렇게 쉬워요."
- 주문완료: "주문 완료." + "플로리스트가 꽃을 준비하고 있어요."
- SMS 발신자명: [꽃부름]

## 빌드 & 실행
```bash
npm run dev       # 개발 서버 (Turbopack)
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버
```

## 주의사항
- OneDrive 폴더에 위치 → `.next` 폴더 EPERM 에러 시 `rm -rf .next` 후 재빌드
- Tailwind v4: `globals.css`의 `@theme inline`에서 토큰 정의
- Next.js 16: `params`/`searchParams`는 Promise 타입 → `await params` 필요
- 다음 주소 API 스크립트: `layout.tsx`의 `<body>` 하단에 async 로드
- middleware.ts deprecated 경고 (proxy 전환 예정, 기능 영향 없음)
