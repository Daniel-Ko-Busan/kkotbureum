import { getOrders } from '@/lib/demo/queries';
import { formatPrice, formatDeliveryDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import type { Metadata } from 'next';
import OrderSearch from './OrderSearch';

export const metadata: Metadata = { title: '주문 관리' };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status: filterStatus, q: searchQuery } = await searchParams;
  let orders = await getOrders(filterStatus);

  // 서버 사이드 검색 필터링
  if (searchQuery && orders) {
    const query = searchQuery.toLowerCase();
    orders = orders.filter((order) =>
      order.order_number?.toLowerCase().includes(query) ||
      order.recipient_name?.toLowerCase().includes(query) ||
      order.sender_name?.toLowerCase().includes(query) ||
      order.sender_phone?.replace(/-/g, '').includes(query.replace(/-/g, '')) ||
      order.product_name?.toLowerCase().includes(query)
    );
  }

  const statuses = ['all', 'pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];

  return (
    <div>
      <h1 className="text-xl font-bold text-text-primary mb-4">주문 관리</h1>

      {/* Search */}
      <OrderSearch />

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 -mx-4 px-4">
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders${s === 'all' ? '' : `?status=${s}`}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              (filterStatus || 'all') === s
                ? 'bg-primary text-white'
                : 'bg-bg-secondary text-text-secondary hover:bg-border'
            }`}
          >
            {s === 'all' ? '전체' : ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-2">
        {orders?.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`}>
            <Card hover>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary">{order.order_number}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">
                    {order.sender_name} → {order.recipient_name} · {order.product_name}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    배송일: {formatDeliveryDate(order.delivery_date)}
                  </p>
                </div>
                <div className="text-right ml-3">
                  <p className="text-sm font-bold text-text-primary">{formatPrice(order.total_amount)}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {(!orders || orders.length === 0) && (
          <div className="text-center py-12 text-text-tertiary text-sm">
            {searchQuery ? `"${searchQuery}" 검색 결과가 없어요` : filterStatus ? '해당 상태의 주문이 없어요' : '아직 주문이 없어요'}
          </div>
        )}
      </div>
    </div>
  );
}
