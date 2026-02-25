-- ENUMS
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'delivering',
  'delivered',
  'cancelled'
);
CREATE TYPE payment_status AS ENUM ('pending','paid','failed','refunded');

-- 카테고리
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
  short_description TEXT,
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

-- 주문
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
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

-- 주문번호 자동생성
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

-- updated_at 자동 갱신
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
CREATE POLICY "read_orders_by_phone" ON orders FOR SELECT USING (true);

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
