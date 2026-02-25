import { getTodayOrders, getRecentOrders } from '@/lib/demo/queries';
import { formatPrice } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const todayOrders = await getTodayOrders();

  const totalOrders = todayOrders?.length || 0;
  const totalRevenue = todayOrders?.reduce((sum, o) => sum + (o.payment_status === 'paid' ? o.total_amount : 0), 0) || 0;
  const awaitingOrders = todayOrders?.filter((o) => o.status === 'pending').length || 0;
  const pendingOrders = todayOrders?.filter((o) => o.status === 'confirmed').length || 0;
  const deliveringOrders = todayOrders?.filter((o) => o.status === 'delivering').length || 0;

  const recentOrders = await getRecentOrders(5);

  return (
    <div>
      <h1 className="text-xl font-bold text-text-primary mb-6">대시보드</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <Card>
          <p className="text-xs text-text-tertiary">오늘 주문</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{totalOrders}건</p>
        </Card>
        <Card>
          <p className="text-xs text-text-tertiary">오늘 매출</p>
          <p className="text-2xl font-bold text-primary mt-1">{formatPrice(totalRevenue)}</p>
        </Card>
        <Card>
          <p className="text-xs text-text-tertiary">접수 대기</p>
          <p className="text-2xl font-bold text-text-secondary mt-1">{awaitingOrders}건</p>
        </Card>
        <Card>
          <p className="text-xs text-text-tertiary">준비 필요</p>
          <p className="text-2xl font-bold text-warning mt-1">{pendingOrders}건</p>
        </Card>
        <Card>
          <p className="text-xs text-text-tertiary">배송중</p>
          <p className="text-2xl font-bold text-success mt-1">{deliveringOrders}건</p>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary">최근 주문</h2>
        <Link href="/admin/orders" className="text-sm text-primary font-medium">
          전체보기
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {recentOrders?.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`}>
            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{order.order_number}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {order.recipient_name} · {order.product_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text-primary">{formatPrice(order.total_amount)}</p>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                    order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'delivering' ? 'bg-purple-100 text-purple-600' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status === 'pending' ? '접수 대기' :
                     order.status === 'confirmed' ? '접수 완료' :
                     order.status === 'preparing' ? '준비중' :
                     order.status === 'delivering' ? '배송중' :
                     order.status === 'delivered' ? '배송 완료' :
                     '취소'}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {(!recentOrders || recentOrders.length === 0) && (
          <div className="text-center py-12 text-text-tertiary text-sm">
            아직 주문이 없어요
          </div>
        )}
      </div>
    </div>
  );
}
