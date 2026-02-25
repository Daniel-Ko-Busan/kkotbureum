'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: 'bg-success',
    error: 'bg-error',
    info: 'bg-text-primary',
  };

  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      <div className={`${colors[type]} text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium max-w-[calc(100vw-2rem)]`}>
        {message}
      </div>
    </div>
  );
}
