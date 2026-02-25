'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  cutoffHour: number;
}

export default function CountdownTimer({ cutoffHour }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(cutoffHour, 0, 0, 0);

      if (now >= cutoff) {
        setIsPast(true);
        return;
      }

      const diff = cutoff.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
      setIsPast(false);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [cutoffHour]);

  if (isPast) {
    return (
      <div className="mt-4 p-3 rounded-xl bg-bg-secondary border border-border">
        <p className="text-sm text-text-secondary text-center">
          🌅 내일 오전 배송으로 주문할 수 있어요
        </p>
      </div>
    );
  }

  if (!timeLeft) return null;

  return (
    <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-primary/20" role="timer" aria-live="polite" aria-label={`당일 배송 마감까지 ${timeLeft.hours}시간 ${timeLeft.minutes}분 남음`}>
      <p className="text-sm font-medium text-primary text-center">
        🕐 오늘 받으려면{' '}
        <span className="font-bold tabular-nums">
          {timeLeft.hours}시간 {timeLeft.minutes}분 {timeLeft.seconds}초
        </span>{' '}
        남았어요
      </p>
      <p className="text-xs text-primary/70 text-center mt-1">
        지금 주문하면 오늘 도착
      </p>
    </div>
  );
}
