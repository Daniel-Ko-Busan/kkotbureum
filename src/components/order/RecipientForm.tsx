'use client';

import { useState, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { OrderFormData } from '@/types';
import { DELIVERY_TIME_SLOTS, SAME_DAY_CUTOFF_HOUR } from '@/lib/constants';

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeResult) => void;
        onclose?: () => void;
      }) => { open: () => void };
    };
  }
}

interface DaumPostcodeResult {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  apartment: string;
  buildingName: string;
}

interface RecipientFormProps {
  data: OrderFormData;
  onUpdate: (field: keyof OrderFormData, value: string) => void;
  onNext: () => void;
}

/** 전화번호 자동 포맷팅 (010-1234-5678) */
function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/** 오늘이 당일배송 마감(16시) 이전인지 확인 */
function isSameDayAvailable(): boolean {
  const now = new Date();
  return now.getHours() < SAME_DAY_CUTOFF_HOUR;
}

/** 최소 배송 가능일 (마감 시간 이후면 내일) */
function getMinDeliveryDate(): string {
  const now = new Date();
  if (!isSameDayAvailable()) {
    now.setDate(now.getDate() + 1);
  }
  return now.toISOString().split('T')[0];
}

export default function RecipientForm({ data, onUpdate, onNext }: RecipientFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.senderName.trim()) newErrors.senderName = '이름을 입력해주세요';
    if (!data.senderPhone.trim()) {
      newErrors.senderPhone = '전화번호를 입력해주세요';
    } else if (!/^01[0-9]{8,9}$/.test(data.senderPhone.replace(/-/g, ''))) {
      newErrors.senderPhone = '올바른 전화번호를 입력해주세요 (예: 010-1234-5678)';
    }

    if (!data.recipientName.trim()) newErrors.recipientName = '이름을 입력해주세요';
    if (!data.recipientPhone.trim()) {
      newErrors.recipientPhone = '전화번호를 입력해주세요';
    } else if (!/^01[0-9]{8,9}$/.test(data.recipientPhone.replace(/-/g, ''))) {
      newErrors.recipientPhone = '올바른 전화번호를 입력해주세요 (예: 010-1234-5678)';
    }

    if (!data.recipientAddress.trim()) newErrors.recipientAddress = '주소를 검색해주세요';
    if (!data.deliveryDate) {
      newErrors.deliveryDate = '배송일을 선택해주세요';
    } else {
      const minDate = getMinDeliveryDate();
      if (data.deliveryDate < minDate) {
        newErrors.deliveryDate = isSameDayAvailable()
          ? '오늘 이후 날짜를 선택해주세요'
          : '당일 배송 마감(오후 4시)이 지났어요. 내일 이후 날짜를 선택해주세요';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const handlePhoneChange = useCallback((field: 'senderPhone' | 'recipientPhone', value: string) => {
    onUpdate(field, formatPhoneInput(value));
  }, [onUpdate]);

  const openAddressPicker = useCallback(() => {
    if (!window.daum) {
      alert('주소 검색을 로딩 중이에요. 잠시 후 다시 시도해주세요.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: (result: DaumPostcodeResult) => {
        const address = result.roadAddress || result.jibunAddress;
        onUpdate('recipientAddress', address);
        onUpdate('recipientZipcode', result.zonecode);
        // 상세주소 입력란에 포커스
        setTimeout(() => {
          const detailInput = document.getElementById('address-detail');
          detailInput?.focus();
        }, 100);
      },
    }).open();
  }, [onUpdate]);

  const minDate = getMinDeliveryDate();
  const sameDayCutoffMessage = !isSameDayAvailable()
    ? '당일 배송 마감(오후 4시)이 지났어요'
    : null;

  // 당일 주문 + 정오 이후면 오전 시간대 비활성화
  const now = new Date();
  const isToday = data.deliveryDate === now.toISOString().split('T')[0];
  const isMorningDisabled = isToday && now.getHours() >= 12;

  // 오전이 선택된 상태에서 당일+정오이후가 되면 시간무관으로 전환
  if (isMorningDisabled && data.deliveryTimeSlot === 'morning') {
    onUpdate('deliveryTimeSlot', 'anytime');
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Sender */}
      <section>
        <h3 className="text-base font-semibold text-text-primary mb-3">보내는 분</h3>
        <div className="flex flex-col gap-3">
          <Input
            label="이름"
            placeholder="홍길동"
            value={data.senderName}
            onChange={(e) => onUpdate('senderName', e.target.value)}
            error={errors.senderName}
          />
          <Input
            label="전화번호"
            placeholder="010-1234-5678"
            type="tel"
            inputMode="numeric"
            value={data.senderPhone}
            onChange={(e) => handlePhoneChange('senderPhone', e.target.value)}
            error={errors.senderPhone}
          />
        </div>
      </section>

      {/* Recipient */}
      <section>
        <h3 className="text-base font-semibold text-text-primary mb-3">받는 분</h3>
        <div className="flex flex-col gap-3">
          <Input
            label="이름"
            placeholder="김꽃님"
            value={data.recipientName}
            onChange={(e) => onUpdate('recipientName', e.target.value)}
            error={errors.recipientName}
          />
          <Input
            label="전화번호"
            placeholder="010-1234-5678"
            type="tel"
            inputMode="numeric"
            value={data.recipientPhone}
            onChange={(e) => handlePhoneChange('recipientPhone', e.target.value)}
            error={errors.recipientPhone}
          />

          {/* 주소 검색 (Daum Postcode API) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">주소</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={data.recipientAddress}
                placeholder="주소를 검색해주세요"
                onClick={openAddressPicker}
                className={`flex-1 px-4 py-3 rounded-lg border bg-bg-secondary text-text-primary placeholder:text-text-tertiary cursor-pointer focus:outline-none ${
                  errors.recipientAddress ? 'border-error' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={openAddressPicker}
                className="px-4 py-3 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap"
              >
                주소 검색
              </button>
            </div>
            {data.recipientZipcode && (
              <p className="text-xs text-text-tertiary">우편번호: {data.recipientZipcode}</p>
            )}
            {errors.recipientAddress && <p className="text-sm text-error">{errors.recipientAddress}</p>}
          </div>

          <Input
            id="address-detail"
            label="상세주소"
            placeholder="동/호수, 건물명 등을 입력해주세요"
            value={data.recipientAddressDetail}
            onChange={(e) => onUpdate('recipientAddressDetail', e.target.value)}
          />
        </div>
      </section>

      {/* Delivery */}
      <section>
        <h3 className="text-base font-semibold text-text-primary mb-3">배송 정보</h3>
        <div className="flex flex-col gap-3">
          <div>
            <Input
              label="배송일"
              type="date"
              min={minDate}
              value={data.deliveryDate}
              onChange={(e) => onUpdate('deliveryDate', e.target.value)}
              error={errors.deliveryDate}
            />
            {sameDayCutoffMessage && !errors.deliveryDate && (
              <p className="text-xs text-warning mt-1">{sameDayCutoffMessage}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">희망 시간</label>
            <div className="flex gap-2">
              {DELIVERY_TIME_SLOTS.map((slot) => {
                const disabled = slot.value === 'morning' && isMorningDisabled;
                return (
                  <button
                    key={slot.value}
                    type="button"
                    disabled={disabled}
                    onClick={() => onUpdate('deliveryTimeSlot', slot.value)}
                    className={`flex-1 py-2.5 px-2 rounded-lg border text-sm font-medium transition-colors ${
                      disabled
                        ? 'border-border bg-bg-secondary text-text-tertiary cursor-not-allowed opacity-50'
                        : data.deliveryTimeSlot === slot.value
                          ? 'border-primary bg-blue-50 text-primary'
                          : 'border-border text-text-secondary hover:bg-bg-secondary'
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
            {isMorningDisabled && (
              <p className="text-xs text-text-tertiary mt-1">정오가 지나 오전 배송은 선택할 수 없어요</p>
            )}
          </div>
        </div>
      </section>

      <div className="pt-2">
        <Button onClick={handleNext} fullWidth size="lg">
          다음: 메시지 작성
        </Button>
      </div>
    </div>
  );
}
