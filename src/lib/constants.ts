export const SITE_NAME = '꽃부름';
export const SITE_DESCRIPTION = '부산 당일 꽃배달, 꽃부름. 3분이면 주문 끝, 오늘 도착해요.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kkotbureum.vercel.app';

// 당일 배송 마감 시간 (16:00 KST)
export const SAME_DAY_CUTOFF_HOUR = 16;

// 배송 시간대
export const DELIVERY_TIME_SLOTS = [
  { value: 'morning', label: '오전 (10:00~12:00)' },
  { value: 'afternoon', label: '오후 (12:00~17:00)' },
  { value: 'anytime', label: '시간 무관' },
] as const;

// 주문 상태 라벨
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '접수 대기',
  confirmed: '접수 완료',
  preparing: '준비중',
  delivering: '배송중',
  delivered: '배송 완료',
  cancelled: '취소',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  confirmed: 'bg-blue-100 text-blue-600',
  preparing: 'bg-yellow-100 text-yellow-700',
  delivering: 'bg-purple-100 text-purple-600',
  delivered: 'bg-green-100 text-green-600',
  cancelled: 'bg-red-100 text-red-600',
};

// 미션 카테고리
export const MISSION_CATEGORIES = [
  { slug: 'emergency', name: '오늘 큰일남', emoji: '🚨', description: '생일, 기념일 깜빡했을 때' },
  { slug: 'gratitude', name: '고마운 사람', emoji: '🙏', description: '감사한 마음을 꽃으로' },
  { slug: 'just_because', name: '괜히 보내봄', emoji: '🌸', description: '이유 없이, 그냥' },
  { slug: 'celebration', name: '축하해줘야 함', emoji: '🎉', description: '승진, 개업, 합격' },
  { slug: 'apology', name: '잘못했어요', emoji: '😢', description: '미안한 마음을 꽃으로' },
  { slug: 'love', name: '사랑합니다', emoji: '💕', description: '사랑하는 사람에게' },
] as const;

// 가격 포맷
export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

// 날짜 포맷 (2026-02-25 → 2월 25일 (수))
export function formatDeliveryDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

// 전화번호 포맷
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}
