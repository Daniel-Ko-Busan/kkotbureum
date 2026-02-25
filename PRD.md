# 꽃부름 (Kkotbureum) — Phase 1 MVP

## Context

부산 로컬 꽃배달 서비스 MVP. 모두싸인 초기 멤버로 PMF → ARR 120억 달성을 경험한 창업자가, 가족/동료 네트워크(퍼포먼스 마케터 아내, 꽃사업 경험 디자이너, 풀스택 개발자 형, 부산 꽃집 3곳)를 활용하여 "부산 최초의 디지털 네이티브 꽃 브랜드"를 만드는 것이 목표.

> "꽃 + 부름" = 꽃을 부르다(주문하다). 심부름 오마주 — 부르면 오는 당일 배달.

전국 위탁 판매 시장은 3,000개+ 업체가 경쟁 중이고 키워드 CPC가 건당 2,000~10,000원으로 비현실적. 반면 부산 로컬 꽃배달의 디지털 마케팅/UX는 거의 비어있어 (인스타 1등이 5,390 팔로워), 여기서 포지셔닝.

## 현재 상태

> **Phase 1 MVP 배포 완료** (Sprint 1~3 + 인프라 셋업).
> - 프로덕션: https://kkotbureum.vercel.app/
> - GitHub: https://github.com/Daniel-Ko-Busan/kkotbureum (master)
> - Supabase 연동 완료 (카테고리 6, 상품 12, 주문 샘플 18건, 관리자 1명)
> - 미연결: PortOne 실결제, Anthropic API, Aligo SMS

---

## 비즈니스 모델: 3-Track 전략

### Track 1: D2C — 목적 기반 꽃 주문 플랫폼 (메인) ✅ MVP 완성
- 모바일 퍼스트 웹사이트 (토스식 UX)
- 감정/목적 기반 큐레이션 + AI 카드 메시지 추천
- 부산 당일 배송 (3시간 내)
- "미션" 콘셉트는 상품 카테고리의 위트 요소로 활용

### Track 2: 구독 — 정기 꽃 배달 (반복 매출) ⬜ 후순위
- 주 1~2회 가정/사무실 꽃 배달 (건당 15,000~25,000원)
- 진입점: "화병 + 첫 꽃 세트" → 매주 꽃 구독
- 에코델타시티 신도시 입주민 = 이상적 초기 타겟
- **진입 조건**: D2C 유료 주문 30건 달성 후 검토

### Track 3: B2B — 법인 꽃 서비스 (안정 매출) ⬜ 후순위
- 부산 호텔, 레스토랑, 사무실, 웨딩홀 정기 계약
- 모두싸인 B2B 영업 경험 직접 적용
- **진입 조건**: D2C로 운영 프로세스 검증 후

### 미래 확장 비전: 로컬 꽃집 플랫폼 (Phase 3+)
- 부산 다른 꽃집들에 플랫폼 개방
- 구독/B2B 주문을 파트너 꽃집에 분배 → 비수기 현금흐름 안정화

## 팀 구성

| 역할 | 담당 | 핵심 역량 |
|------|------|----------|
| CEO/운영 | 본인 | 모두싸인 PMF→ARR120억 (운영/마케팅/영업/CS/데이터 8년) |
| 퍼포먼스 마케팅 | 아내 | 퍼포먼스 마케팅 전문 (모두싸인 경력) |
| 디자인 | 모두싸인 동료 | 디자이너 + 온라인 꽃사업 경험 |
| 개발 | 형 | 풀스택 개발자 (ERP 전문) |
| 꽃 공급 1 | 여동생 | 에코델타시티 유일 꽃집 (부산 강서구) |
| 꽃 공급 2 | 여동생 지인 | 부산 사직 꽃집 2곳 (일반 + 무인) |

## 공급 커버리지

```
부산 강서구 (서부)              부산 사직 (중동부)
에코델타시티 [여동생]           사직 꽃집 1 [여동생 지인] (일반)
                               사직 꽃집 2 [여동생 지인] (무인)

→ 부산 서부 + 중동부 커버. 해운대/서면은 추후 파트너 확장.
```

## 기술 스택

| 영역 | 선택 | 월 비용 (MVP) |
|------|------|--------------|
| 프론트엔드/호스팅 | Next.js 16 (App Router, Turbopack) + Vercel Pro | $20 |
| DB + 인증 + 스토리지 | Supabase (Free → Pro) | $0~25 |
| 결제 | PortOne v0.1.3 + 토스페이먼츠 | 거래 수수료 ~3.4% |
| AI 카드 메시지 | Vercel AI SDK + Claude Sonnet API | $3~10 |
| SMS 알림 | Aligo (LMS 자동 전환) | $3~10 |
| 스타일링 | Tailwind CSS v4 + Pretendard | — |
| **합계** | | **월 $26~65 (약 3.5~9만 원)** |

---

## Phase 1 구현 상태

### 프로젝트 구조 (현재)

```
kkotbureum/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # 루트 레이아웃 (SEO 메타, Pretendard)
│   │   ├── page.tsx                    # 홈 (카운트다운, 미션, 추천상품, JSON-LD)
│   │   ├── globals.css                 # Tailwind v4 디자인 토큰 (@theme inline)
│   │   ├── CountdownTimer.tsx          # 당일배송 카운트다운 (접근성 포함)
│   │   ├── robots.ts                   # SEO: robots.txt
│   │   ├── sitemap.ts                  # SEO: sitemap.xml (동적 생성)
│   │   │
│   │   ├── (storefront)/              # 고객 페이지
│   │   │   ├── layout.tsx             # Header + BottomNav + 조건부 패딩
│   │   │   ├── missions/page.tsx      # 미션 카테고리 목록 (6가지 + 플로리스트 맡기기)
│   │   │   ├── products/
│   │   │   │   ├── page.tsx           # 상품 목록 (미션 필터)
│   │   │   │   └── [id]/             # 상품 상세 (OG 메타, 이미지 스켈레톤)
│   │   │   │       ├── page.tsx
│   │   │   │       ├── ProductDetailClient.tsx
│   │   │   │       └── ProductBackButton.tsx
│   │   │   ├── order/
│   │   │   │   ├── layout.tsx         # 주문 전용 레이아웃 + StepIndicator
│   │   │   │   ├── page.tsx           # Step 1: 받는 분 (다음 주소 API)
│   │   │   │   ├── message/page.tsx   # Step 2: 카드 메시지 (AI 추천)
│   │   │   │   ├── payment/page.tsx   # Step 3: 결제 (약관 동의)
│   │   │   │   ├── complete/          # 주문 완료 (주문번호 복사)
│   │   │   │   └── lookup/page.tsx    # 주문 조회 (상태 진행바, 취소)
│   │   │   ├── privacy/page.tsx       # 개인정보처리방침
│   │   │   └── terms/page.tsx         # 이용약관
│   │   │
│   │   ├── admin/                     # 관리자
│   │   │   ├── layout.tsx             # AdminSidebar + AdminMobileNav
│   │   │   ├── page.tsx               # 대시보드 (주문/매출/접수대기/처리중)
│   │   │   ├── login/page.tsx         # Supabase Auth 로그인
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx           # 주문 목록 (상태 필터)
│   │   │   │   ├── OrderSearch.tsx    # 검색 (이름/전화/주문번호)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx       # 주문 상세
│   │   │   │       └── OrderStatusActions.tsx  # 상태 변경 (확인 다이얼로그)
│   │   │   └── products/
│   │   │       ├── page.tsx           # 상품 목록
│   │   │       └── new/page.tsx       # 상품 추가/수정 (다중 이미지)
│   │   │
│   │   └── api/
│   │       ├── chat/route.ts               # AI 카드 메시지 (비스트리밍, 3가지 톤)
│   │       ├── orders/route.ts             # POST: 주문 생성 (Zod + 가격 검증)
│   │       ├── orders/lookup/route.ts      # GET: 주문 조회 (번호+전화)
│   │       ├── orders/[id]/status/route.ts # PATCH: 상태 변경 + SMS 5종
│   │       ├── orders/[id]/cancel/route.ts # POST: 고객 취소 (전화 검증)
│   │       ├── payments/prepare/route.ts   # POST: PortOne 사전 등록
│   │       ├── payments/webhook/route.ts   # POST: 결제 검증 + 주문 확정
│   │       └── notifications/route.ts      # POST: SMS 발송
│   │
│   ├── components/
│   │   ├── ui/          # Button, Input, Card, Badge, StepIndicator, Toast
│   │   ├── layout/      # Header, BottomNav, AdminSidebar, AdminMobileNav
│   │   ├── product/     # ProductCard, ProductGrid, ProductImage (스켈레톤)
│   │   └── order/       # RecipientForm, MessageComposer, OrderSummary
│   │
│   ├── hooks/useOrder.ts          # 주문 상태 (useReducer + sessionStorage)
│   ├── lib/
│   │   ├── constants.ts           # 상수, formatPrice, formatDeliveryDate, formatPhone
│   │   ├── demo/data.ts           # 데모 데이터 (globalThis, 카테고리6/상품8/주문18)
│   │   ├── demo/queries.ts        # 데모/프로덕션 추상화 레이어
│   │   ├── supabase/client.ts     # 브라우저 클라이언트
│   │   ├── supabase/server.ts     # 서버 클라이언트 (Service Role)
│   │   ├── portone.ts             # 결제 헬퍼 (검증, 취소)
│   │   └── notifications.ts       # SMS (Aligo) + 메시지 템플릿 5종
│   ├── types/index.ts
│   └── middleware.ts              # /admin 인증 보호 (데모 모드 스킵)
│
├── vercel.json                    # icn1 리전, 보안 헤더
├── next.config.ts                 # 이미지 패턴, 프로덕션 최적화
├── .env.example                   # 환경변수 문서화
├── supabase/migrations/001_initial_schema.sql
└── package.json
```

### DB 스키마 (실제 구현)

```sql
-- ENUMS
CREATE TYPE order_status AS ENUM ('pending','confirmed','preparing','delivering','delivered','cancelled');
CREATE TYPE payment_status AS ENUM ('pending','paid','failed','refunded');

-- 미션 카테고리
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 상품
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,           -- 상품 카드에 표시
  price INT NOT NULL,
  sale_price INT,
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  flower_types TEXT[],
  size TEXT CHECK (size IN ('S','M','L','XL')),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 주문 (1주문 = 1상품, 상품 정보 직접 스냅샷)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,    -- BU-YYYYMMDD-NNNN (트리거 자동생성)
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  recipient_address_detail TEXT,
  recipient_zipcode TEXT,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_price INT NOT NULL,
  quantity INT DEFAULT 1,
  status order_status DEFAULT 'pending',
  card_message TEXT,
  delivery_date DATE NOT NULL,
  delivery_time_slot TEXT DEFAULT 'anytime',
  special_instructions TEXT,
  subtotal INT NOT NULL,
  delivery_fee INT DEFAULT 0,
  total_amount INT NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_id TEXT,
  paid_at TIMESTAMPTZ,
  partner_shop TEXT,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 주문 상태 이력
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 알림 로그
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  recipient_phone TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sms','kakao')),
  template TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 관리자
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_products_category ON products(category_id) WHERE is_active = true;
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);

-- 트리거: 주문번호 자동생성
CREATE OR REPLACE FUNCTION generate_order_number() RETURNS TRIGGER AS $$
DECLARE today_count INT; today_str TEXT;
BEGIN
  today_str := to_char(now(), 'YYYYMMDD');
  SELECT COUNT(*) + 1 INTO today_count FROM orders
    WHERE order_number LIKE 'BU-' || today_str || '-%';
  NEW.order_number := 'BU-' || today_str || '-' || lpad(today_count::TEXT, 4, '0');
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
  FOR EACH ROW WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- 트리거: updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_active_categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "read_active_products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "create_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "read_orders_by_phone" ON orders FOR SELECT USING (true);  -- API 레벨에서 전화번호 검증
CREATE POLICY "admin_categories" ON categories FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE auth_id = auth.uid()));
CREATE POLICY "admin_products" ON products FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE auth_id = auth.uid()));
CREATE POLICY "admin_orders" ON orders FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE auth_id = auth.uid()));
CREATE POLICY "admin_status_history" ON order_status_history FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE auth_id = auth.uid()));
CREATE POLICY "admin_notifications" ON notifications FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE auth_id = auth.uid()));
CREATE POLICY "admin_self" ON admin_users FOR SELECT
  USING (auth_id = auth.uid());

-- 시드: 미션 카테고리
INSERT INTO categories (slug, name, description, emoji, display_order) VALUES
  ('emergency', '오늘 큰일남', '생일, 기념일 깜빡했을 때', '🚨', 1),
  ('gratitude', '고마운 사람', '감사한 마음을 꽃으로', '🙏', 2),
  ('just_because', '괜히 보내봄', '이유 없이, 그냥', '🌸', 3),
  ('celebration', '축하해줘야 함', '승진, 개업, 합격', '🎉', 4),
  ('apology', '잘못했어요', '미안한 마음을 꽃으로', '😢', 5),
  ('love', '사랑합니다', '사랑하는 사람에게', '💕', 6);
```

**원래 기획 대비 단순화한 것:**
- `order_items` 테이블 제거 → 1주문=1상품, orders에 직접 스냅샷
- `subscriptions` 테이블 제거 → Track 2 후순위
- `chat_sessions` 테이블 제거 → 채팅 저장 불필요
- `sender_auth_id` 제거 → 게스트 주문만 (로그인 없음)
- `address_collected` 제거 → Address-Later 미구현, 주소 필수 입력
- `is_subscribable`, `stock_status` 제거 → 현재 불필요

### 핵심 기능 상세

#### 1. 주문 플로우 (3단계 토스식) ✅ 완성

```
[상품 선택] → Step 1: 받는 분 → Step 2: 메시지 → Step 3: 결제 → [완료]
```

- Step 1: 보내는 분 이름/전화, 받는 분 이름/전화/주소(필수), 배송일/시간
- Step 2: 카드 메시지 + "AI가 대신 써줄게요" → 3가지 추천 (정중/친근/유머)
- Step 3: 주문 요약 + 약관 동의 + PortOne 결제
- 상태 관리: `useOrder` 훅 (sessionStorage + useReducer)
- Step 간 데이터 검증: Step2에서 Step1 미입력 시 리다이렉트
- 주문 완료: 주문번호 복사, 한국어 날짜 표시

#### 2. 결제 (PortOne + 토스페이먼츠) ✅ 완성

```
1. POST /api/orders           → 주문 생성 (상품 가격 서버 검증)
2. POST /api/payments/prepare  → PortOne 금액 사전 등록
3. PortOne.requestPayment()    → 클라이언트 결제창
4. POST /api/payments/webhook  → 서버 결제 검증 + 주문 확정 + SMS
```
- 지원: 카드, 토스페이, 카카오페이, 네이버페이
- 결제 실패 시 유형별 복구 안내 + 재시도

#### 3. AI 카드 메시지 ✅ 완성

```typescript
// POST /api/chat — 비스트리밍, 3가지 톤 반환
const result = await generateText({
  model: anthropic('claude-sonnet-4-20250514'),
  prompt: `상황: ${situation}\n\n꽃 카드 메시지 3가지 (정중/친근/유머), 각 200자 이내`,
});
```
- 주문 Step 2에서 바텀시트로 호출
- 데모 모드: 상황별 7가지 분기로 프리셋 메시지 반환

#### 4. 취소/환불 ✅ 완성

- 고객 취소: POST /api/orders/[id]/cancel (sender_phone 검증)
- 관리자 취소: PATCH /api/orders/[id]/status (status='cancelled')
- 'pending' 또는 'confirmed' 상태에서만 가능 ('preparing' 이후 불가)
- 결제 완료 주문 취소 시 PortOne cancelPayment API 자동 호출

#### 5. SMS 알림 ✅ 완성

| 이벤트 | 수신자 | 템플릿 | 상태 |
|--------|--------|--------|------|
| 주문 확인 (confirmed) | 주문자 | 주문번호 + 상품명 + 받는 분 | ✅ |
| 준비 시작 (preparing) | 주문자 | 주문번호 + 받는 분 | ✅ |
| 배송 출발 (delivering) | 주문자 | 주문번호 + 받는 분 | ✅ |
| 배송 완료 (delivered) | 주문자 | 주문번호 + 받는 분 | ✅ |
| 주문 취소 (cancelled) | 주문자 | 주문번호 + 환불 안내 | ✅ |

- Aligo API, 90바이트 초과 시 자동 LMS 전환
- 데모 모드: 콘솔 로그 출력 + 성공 반환

#### 6. 관리자 대시보드 ✅ 완성

- 대시보드: 오늘 주문/매출/접수대기/처리중 카운트
- 주문 목록: 상태별 탭 필터 + 검색 (이름/전화/주문번호)
- 주문 상세: 전체 정보 + 상태 이력 + 상태 변경 (확인 다이얼로그)
- 상품 CRUD: 추가/수정/비활성화 + 다중 이미지 업로드
- 인증: Supabase Auth + admin_users 테이블 + middleware 보호

#### 7. SEO ✅ 완성

- robots.txt: /admin, /api, /order 크롤링 차단
- sitemap.xml: 동적 생성 (홈, 상품 목록, 미션, 개별 상품)
- OG/Twitter 메타태그 (전체 페이지)
- JSON-LD 구조화 데이터 (FloristShop 스키마)
- 상품 상세: 개별 OG 이미지 + 가격 포함 타이틀

### 디자인 시스템 (토스식)

```
Colors:   Primary #3182F6 | Text #191F28, #4E5968, #8B95A1 | BG #FFF, #F2F4F6
          Success #00C471 | Error #F04452 | Warning #FF9F00
Font:     Pretendard Variable (CDN)
Layout:   모바일 퍼스트, max-width 512px (max-w-lg)
Radius:   카드 12px | 버튼 8px
Shadow:   0 2px 8px rgba(0,0,0,0.08)
```

### 패키지 (현재)

```json
{
  "dependencies": {
    "next": "16.1.6", "react": "19.2.3", "react-dom": "19.2.3",
    "@supabase/supabase-js": "^2", "@supabase/ssr": "^0.5",
    "@portone/browser-sdk": "^0.1.3",
    "ai": "^4", "@ai-sdk/anthropic": "^1",
    "date-fns": "^4", "zod": "^3"
  },
  "devDependencies": {
    "typescript": "^5", "tailwindcss": "^4", "supabase": "^2"
  }
}
```

---

## 개발 스프린트 (실행 완료)

### Sprint 1 (완료) — 기반 + 상품 전시 + 주문 플로우

1. ✅ Next.js 프로젝트 초기화 (TypeScript, Tailwind v4, App Router, Pretendard)
2. ✅ 데모 모드 구현 (Supabase 없이 전체 UI 테스트 가능)
3. ✅ 토스식 UI 컴포넌트 (Button, Input, Card, Badge, StepIndicator, Toast)
4. ✅ 홈페이지 (당일배송 카운트다운 + 미션 카테고리 카드 + 추천 상품)
5. ✅ 미션 카테고리 목록 + 상품 목록/상세 페이지
6. ✅ 모바일 레이아웃 (헤더 + 하단 네비 4탭)
7. ✅ 주문 3단계 UI + useOrder 훅 (sessionStorage + useReducer)
8. ✅ AI 카드 메시지 추천 (주문 Step 2, 3가지 톤)
9. ✅ 데모 상품 8개 등록

### Sprint 2 (완료) — 결제 + 관리자 + UX

10. ✅ PortOne 결제 4단계 (주문생성→사전등록→결제→검증)
11. ✅ 관리자 대시보드 (오늘 현황)
12. ✅ 관리자 주문 목록/상세 + 상태 변경 + 검색
13. ✅ 관리자 상품 CRUD + 다중 이미지 업로드
14. ✅ 고객 주문 조회 페이지 (/order/lookup)
15. ✅ 고객 취소 API + 관리자 환불 (PortOne cancelPayment)
16. ✅ 개인정보처리방침 + 이용약관 + 약관 동의 체크박스
17. ✅ UX 개선 15건 (날짜 포맷, 상태 확인, 검색, 접근성 등)
18. ✅ 데모 모드 강화 (globalThis 상태 유지, 주문 18건)

### Sprint 3 (완료) — 알림 + SEO + 배포 준비

19. ✅ SMS 알림 5종 (Aligo, 모든 상태 전환 시 발송)
20. ✅ SEO (robots.txt, sitemap.xml, JSON-LD, OG/Twitter 메타)
21. ✅ Vercel 배포 설정 (vercel.json, 보안 헤더, icn1 리전)
22. ✅ 프로덕션 최적화 (소스맵 off, poweredBy off)
23. ✅ 환경변수 문서화 (.env.example)
24. ✅ A-to-Z 플로우 테스트 (전체 26개 라우트 검증)

---

## 배포 및 사전 준비 상태

- [x] Supabase 프로젝트 생성 + 마이그레이션 실행 + RLS 적용
- [x] Vercel 배포 + 환경변수 설정 (SUPABASE URL/ANON_KEY/SERVICE_ROLE_KEY)
- [x] GitHub 레포 생성 + Vercel 자동 배포 파이프라인 구축
- [x] 관리자 계정 생성 (Supabase Auth + admin_users)
- [x] 상품 데이터 12개 등록 (6카테고리 × 2개, 미션별 맞춤)
- [x] 주문 샘플 18건 등록 (상태별 3건 + 상태 이력)
- [ ] 사업자등록 (홈택스)
- [ ] 통신판매업 신고 (정부24, 3~7일)
- [ ] PortOne 가입 + 토스페이먼츠 PG 연동 (현재 데모값)
- [ ] Anthropic API 키 발급 (현재 데모 메시지 사용)
- [ ] Aligo 가입 + 발신번호 등록 (현재 콘솔 로그)
- [ ] 도메인 구매 + 연결 (선택, 현재 kkotbureum.vercel.app)
- [ ] 실제 상품 사진 촬영 + 이미지 업로드 (현재 이미지 없음, 이모지 폴백)
- [ ] 모바일 실기기 테스트 (iPhone Safari, Android Chrome)
- [ ] NEXT_PUBLIC_SITE_URL을 Vercel URL로 업데이트

---

## Phase 2 후보 기능 (우선순위 정렬)

유료 주문 데이터를 기반으로 우선순위를 재결정. 아래는 현재 후보 목록.

### 운영 데이터 기반 결정할 것
| 기능 | 트리거 조건 | 예상 효과 |
|------|-----------|----------|
| 구독 서비스 (Track 2) | 재구매 고객 5명+ 또는 구독 문의 | 비수기 MRR 확보 |
| B2B 법인 (Track 3) | 1건 이상 B2B 문의 유입 | 안정 매출 |
| 받는 분 반응 공유 | 배송 완료 20건+ | 바이럴 + 재구매 |
| Address-Later | 고객 문의 "주소를 모르겠어요" 3건+ | 전환율 개선 |

### 개발 후보 (고객 피드백 기반)
| 기능 | 설명 | 복잡도 |
|------|------|--------|
| 실제 배송 사진 전송 | 관리자가 완성 사진 업로드 → 주문자에게 SMS | 낮음 |
| AI 챗봇 | /chat 페이지 + useChat + tool use | 중간 |
| 미션 추적 (Realtime) | /track/[orderId] + Supabase Realtime | 중간 |
| 카카오 알림톡 | SMS → 알림톡 전환 (비용 절감) | 낮음 |

---

## 보안 체크리스트

- [x] 모든 Supabase 테이블 RLS 활성화
- [x] SUPABASE_SERVICE_ROLE_KEY 서버만 사용
- [x] 결제 금액 서버 측 검증 (4단계)
- [x] 관리자 라우트 미들웨어 보호 (/admin/login 스킵, service role key로 admin_users 확인)
- [x] 보안 헤더 (X-Frame-Options, X-Content-Type-Options 등)
- [x] poweredByHeader 비활성화
- [x] Supabase RLS 실제 환경 동작 확인 (프로덕션 배포 검증 완료)
- [ ] AI 엔드포인트 rate limiting (배포 후 적용)

## 검증 방법

1. ✅ 데모 모드 전체 플로우 (빌드 + A-to-Z 테스트 완료)
2. ✅ Vercel 프로덕션 배포 + Supabase 연동 동작 확인
3. ✅ 관리자 로그인 + 대시보드 + 주문/상품 관리 동작 확인
4. 모바일 실기기 브라우징 (iPhone Safari, Android Chrome) ← 다음 단계
5. 전체 주문 플로우 (PortOne 테스트 모드 결제) ← PG 연동 후
6. 관리자 주문 상태 변경 → SMS 수신 확인 ← Aligo 연동 후
7. 실제 상품 사진으로 모바일 UX 확인 ← 사진 촬영 후
