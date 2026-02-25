export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type ProductSize = 'S' | 'M' | 'L' | 'XL';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  emoji: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  flower_types: string[] | null;
  size: ProductSize | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Order {
  id: string;
  order_number: string;
  sender_name: string;
  sender_phone: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_address_detail: string | null;
  recipient_zipcode: string | null;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  status: OrderStatus;
  card_message: string | null;
  delivery_date: string;
  delivery_time_slot: string;
  special_instructions: string | null;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_id: string | null;
  paid_at: string | null;
  partner_shop: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  order_id: string | null;
  recipient_phone: string;
  type: 'sms' | 'kakao';
  template: string;
  content: string;
  status: 'pending' | 'sent' | 'failed';
  sent_at: string | null;
  created_at: string;
}

export interface OrderFormData {
  // Step 1: Recipient
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientAddressDetail: string;
  recipientZipcode: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  // Step 2: Message
  cardMessage: string;
  // Step 3: Payment
  specialInstructions: string;
  // Product info (set from product selection)
  productId: string;
  productName: string;
  productPrice: number;
}

export interface AIMessageRequest {
  situation: string;
  recipientRelation: string;
  tone?: 'formal' | 'casual' | 'humorous';
}

export interface AIMessageResponse {
  messages: {
    tone: string;
    content: string;
  }[];
}
