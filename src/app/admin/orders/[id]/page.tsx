import { getOrderById, getOrderStatusHistory } from '@/lib/demo/queries';
import { formatPrice, formatPhone, formatDeliveryDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import Card from '@/components/ui/Card';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import OrderStatusActions from './OrderStatusActions';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const history = await getOrderStatusHistory(id);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="p-1 -ml-1 hover:bg-bg-secondary rounded-lg">
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-text-primary">{order.order_number}</h1>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Order Info */}
        <Card>
          <h2 className="text-sm font-semibold text-text-primary mb-3">주문 정보</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-tertiary">상품</span>
              <span className="text-text-primary font-medium">{order.product_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">금액</span>
              <span className="text-primary font-bold">{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">결제</span>
              <span className="text-text-primary">
                {order.payment_status === 'paid' ? '결제완료' : order.payment_status === 'refunded' ? '환불됨' : '미결제'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">배송일</span>
              <span className="text-text-primary">{formatDeliveryDate(order.delivery_date)}</span>
            </div>
            {order.card_message && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-text-tertiary text-xs mb-1">카드 메시지</p>
                <p className="text-text-primary whitespace-pre-wrap">{order.card_message}</p>
              </div>
            )}
            {order.special_instructions && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-text-tertiary text-xs mb-1">요청사항</p>
                <p className="text-text-primary">{order.special_instructions}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Customer Info */}
        <Card>
          <h2 className="text-sm font-semibold text-text-primary mb-3">고객 정보</h2>
          <div className="flex flex-col gap-3 text-sm">
            <div>
              <p className="text-text-tertiary text-xs">보내는 분</p>
              <p className="text-text-primary font-medium">{order.sender_name}</p>
              <p className="text-text-secondary">{formatPhone(order.sender_phone)}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-xs">받는 분</p>
              <p className="text-text-primary font-medium">{order.recipient_name}</p>
              <p className="text-text-secondary">{formatPhone(order.recipient_phone)}</p>
              <p className="text-text-secondary mt-1">
                {order.recipient_address}
                {order.recipient_address_detail && ` ${order.recipient_address_detail}`}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Actions */}
      <div className="mt-6">
        <OrderStatusActions orderId={order.id} currentStatus={order.status} />
      </div>

      {/* Status History */}
      {history && history.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-text-primary mb-3">상태 이력</h2>
          <div className="flex flex-col gap-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-text-primary font-medium">{ORDER_STATUS_LABELS[h.status]}</p>
                  {h.note && <p className="text-text-tertiary text-xs">{h.note}</p>}
                  <p className="text-text-tertiary text-xs">
                    {new Date(h.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
