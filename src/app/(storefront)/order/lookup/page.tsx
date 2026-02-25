'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { formatPrice, formatPhone, formatDeliveryDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import type { Order } from '@/types';

/** 전화번호 자동 포맷팅 */
function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function OrderLookupPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const handleLookup = async () => {
    if (!orderNumber.trim() || !phone.trim()) {
      setError('주문번호와 전화번호를 모두 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);
    setCancelSuccess(false);

    try {
      const res = await fetch(
        `/api/orders/lookup?orderNumber=${encodeURIComponent(orderNumber.trim())}&phone=${encodeURIComponent(phone.replace(/-/g, ''))}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '주문을 찾을 수 없어요');
        return;
      }

      setOrder(data.order);
    } catch {
      setError('조회에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    if (!confirm('정말 주문을 취소하시겠어요?\n결제하신 금액은 카드사에 따라 3~5 영업일 내 환불돼요.')) return;

    setCancelLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_phone: phone.replace(/-/g, ''),
          cancel_reason: '고객 요청 취소',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || '취소에 실패했어요');
        return;
      }

      setOrder(data.order);
      setCancelSuccess(true);
    } catch {
      alert('취소 처리에 실패했어요. 다시 시도해주세요.');
    } finally {
      setCancelLoading(false);
    }
  };

  const isCancellable = order && ['pending', 'confirmed'].includes(order.status);

  const statusSteps = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered'];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

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
          <h1 className="flex-1 text-center font-semibold text-text-primary">주문 조회</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="px-4 pt-6 pb-8">
        {/* Search Form */}
        {!order && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-1">주문 조회</h2>
              <p className="text-sm text-text-tertiary">주문번호와 주문 시 입력한 전화번호로 조회할 수 있어요</p>
            </div>

            <Input
              label="주문번호"
              placeholder="BU-20260225-0001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
            <Input
              label="주문자 전화번호"
              placeholder="010-1234-5678"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
            />

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-error/20">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <Button onClick={handleLookup} loading={loading} fullWidth size="lg">
              주문 조회하기
            </Button>
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="flex flex-col gap-6">
            {/* Cancel Success Banner */}
            {cancelSuccess && (
              <div className="p-4 rounded-xl bg-green-50 border border-success/20">
                <p className="text-sm font-semibold text-success">주문이 취소되었어요</p>
                <p className="text-xs text-text-secondary mt-1">
                  결제하신 금액은 카드사에 따라 3~5 영업일 내 환불돼요
                </p>
              </div>
            )}

            {/* Status Badge */}
            <div className="text-center">
              <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>

            {/* Status Progress (not for cancelled) */}
            {order.status !== 'cancelled' && currentStepIndex >= 0 && (
              <div className="flex items-center gap-1 px-2">
                {statusSteps.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 gap-1">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      i <= currentStepIndex ? 'bg-primary' : 'bg-border'
                    }`} />
                    <span className={`text-[10px] flex-shrink-0 ${
                      i <= currentStepIndex ? 'text-primary font-medium' : 'text-text-tertiary'
                    }`}>
                      {ORDER_STATUS_LABELS[step]}
                    </span>
                    {i < statusSteps.length - 1 && (
                      <div className={`h-0.5 flex-1 ${
                        i < currentStepIndex ? 'bg-primary' : 'bg-border'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Order Info */}
            <div className="bg-bg-secondary rounded-xl p-4">
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">주문번호</span>
                  <span className="font-semibold text-text-primary">{order.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">상품</span>
                  <span className="text-text-primary">{order.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">받는 분</span>
                  <span className="text-text-primary">{order.recipient_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">배송지</span>
                  <span className="text-text-primary text-right max-w-[200px]">
                    {order.recipient_address}
                    {order.recipient_address_detail && ` ${order.recipient_address_detail}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">배송일</span>
                  <span className="text-text-primary">{formatDeliveryDate(order.delivery_date)}</span>
                </div>
                {order.card_message && (
                  <>
                    <div className="h-px bg-border" />
                    <div>
                      <p className="text-text-tertiary text-xs mb-1">카드 메시지</p>
                      <p className="text-text-primary whitespace-pre-wrap">{order.card_message}</p>
                    </div>
                  </>
                )}
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="text-text-tertiary">결제 금액</span>
                  <span className="font-bold text-primary">{formatPrice(order.total_amount)}</span>
                </div>
                {order.payment_status === 'refunded' && (
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">환불</span>
                    <span className="font-medium text-error">환불 완료</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cancel Button */}
            {isCancellable && !cancelSuccess && (
              <div className="p-4 rounded-xl bg-bg-secondary border border-border">
                <p className="text-sm text-text-secondary mb-3">
                  준비가 시작되기 전까지 주문을 취소할 수 있어요
                </p>
                <Button
                  onClick={handleCancel}
                  loading={cancelLoading}
                  variant="danger"
                  fullWidth
                  size="md"
                >
                  주문 취소하기
                </Button>
              </div>
            )}

            {/* Back / Home */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Button onClick={() => { setOrder(null); setCancelSuccess(false); }} variant="secondary" fullWidth size="lg">
                  다시 조회
                </Button>
              </div>
              <div className="flex-[2]">
                <Link href="/">
                  <Button variant="primary" fullWidth size="lg">
                    홈으로 돌아가기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
