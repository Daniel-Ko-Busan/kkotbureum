'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import type { OrderStatus } from '@/types';

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const nextActions: Record<string, { label: string; status: string; variant: 'primary' | 'secondary' | 'danger' }[]> = {
  pending: [
    { label: '접수 확인', status: 'confirmed', variant: 'primary' },
    { label: '취소', status: 'cancelled', variant: 'danger' },
  ],
  confirmed: [
    { label: '준비 시작', status: 'preparing', variant: 'primary' },
    { label: '취소', status: 'cancelled', variant: 'danger' },
  ],
  preparing: [
    { label: '배송 출발', status: 'delivering', variant: 'primary' },
  ],
  delivering: [
    { label: '배송 완료', status: 'delivered', variant: 'primary' },
  ],
  delivered: [],
  cancelled: [],
};

export default function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);

  const actions = nextActions[currentStatus] || [];

  if (actions.length === 0) return null;

  const statusLabels: Record<string, string> = {
    confirmed: '접수 확인',
    preparing: '준비 시작',
    delivering: '배송 출발',
    delivered: '배송 완료',
    cancelled: '주문 취소',
  };

  const handleAction = async (status: string) => {
    if (status === 'cancelled' && !showCancel) {
      setShowCancel(true);
      return;
    }

    // 되돌릴 수 없는 상태 변경 확인
    const label = statusLabels[status] || status;
    if (!confirm(`"${label}" 상태로 변경하시겠어요?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    setLoading(status);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          cancel_reason: status === 'cancelled' ? cancelReason : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.smsWarning) {
          alert(data.smsWarning);
        }
        // 페이지 전체 리로드 (데모 모드에서 서버 컴포넌트 캐시 우회)
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || '상태 변경에 실패했어요');
      }
    } catch {
      alert('오류가 발생했어요');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <h2 className="text-sm font-semibold text-text-primary mb-3">상태 변경</h2>

      {showCancel && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="취소 사유를 입력해주세요"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      <div className="flex gap-2">
        {actions.map((action) => (
          <Button
            key={action.status}
            variant={action.variant}
            size="md"
            onClick={() => handleAction(action.status)}
            loading={loading === action.status}
            disabled={loading !== null}
            className="flex-1"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
