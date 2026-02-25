import { NextRequest, NextResponse } from 'next/server';
import { DEMO_MODE } from '@/lib/demo/data';
import { z } from 'zod';

const createOrderSchema = z.object({
  sender_name: z.string().min(1),
  sender_phone: z.string().min(10),
  recipient_name: z.string().min(1),
  recipient_phone: z.string().min(10),
  recipient_address: z.string().min(1),
  recipient_address_detail: z.string().optional().default(''),
  recipient_zipcode: z.string().optional().default(''),
  product_id: z.string(),
  product_name: z.string().min(1),
  product_price: z.number().positive(),
  quantity: z.number().int().positive().default(1),
  card_message: z.string().optional().default(''),
  delivery_date: z.string().min(1),
  delivery_time_slot: z.string().default('anytime'),
  special_instructions: z.string().optional().default(''),
  subtotal: z.number().positive(),
  delivery_fee: z.number().default(0),
  total_amount: z.number().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.parse(body);

    // Demo mode: return a mock order
    if (DEMO_MODE) {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const demoOrder = {
        id: `demo-${Date.now()}`,
        order_number: `BU-${today}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        ...parsed,
        status: 'pending',
        payment_status: 'pending',
        payment_id: null,
        paid_at: null,
        partner_shop: null,
        cancelled_at: null,
        cancel_reason: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return NextResponse.json(demoOrder, { status: 201 });
    }

    const { createServiceClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceClient();

    // Verify product exists and price matches
    const { data: product } = await supabase
      .from('products')
      .select('price, sale_price, is_active')
      .eq('id', parsed.product_id)
      .single();

    if (!product || !product.is_active) {
      return NextResponse.json({ error: '상품을 찾을 수 없어요' }, { status: 404 });
    }

    const expectedPrice = product.sale_price || product.price;
    if (parsed.product_price !== expectedPrice) {
      return NextResponse.json({ error: '가격 정보가 변경되었어요. 새로고침 후 다시 시도해주세요.' }, { status: 400 });
    }

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        sender_name: parsed.sender_name,
        sender_phone: parsed.sender_phone,
        recipient_name: parsed.recipient_name,
        recipient_phone: parsed.recipient_phone,
        recipient_address: parsed.recipient_address,
        recipient_address_detail: parsed.recipient_address_detail,
        recipient_zipcode: parsed.recipient_zipcode,
        product_id: parsed.product_id,
        product_name: parsed.product_name,
        product_price: parsed.product_price,
        quantity: parsed.quantity,
        card_message: parsed.card_message,
        delivery_date: parsed.delivery_date,
        delivery_time_slot: parsed.delivery_time_slot,
        special_instructions: parsed.special_instructions,
        subtotal: parsed.subtotal,
        delivery_fee: parsed.delivery_fee,
        total_amount: parsed.total_amount,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Order creation error:', error);
      return NextResponse.json({ error: '주문 생성에 실패했어요' }, { status: 500 });
    }

    // Add status history
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      status: 'pending',
      note: '주문 생성',
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '입력 정보를 확인해주세요', details: error.errors }, { status: 400 });
    }
    console.error('Order API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했어요' }, { status: 500 });
  }
}
