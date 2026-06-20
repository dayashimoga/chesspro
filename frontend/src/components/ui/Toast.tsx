import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-emerald-500/90 border-emerald-400/30 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    error: 'bg-red-500/90 border-red-400/30 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]',
    info: 'bg-bg-secondary/90 border-white/10 text-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.05)]',
    warning: 'bg-amber-500/90 border-amber-400/30 text-white shadow-[0_0_30px_rgba(245,158,11,0.3)]',
  };

  const icons = {
    success: '🎉',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md text-sm font-bold animate-fadeIn ${bgColors[type]}`}
    >
      <span>{icons[type]}</span>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-80 focus:outline-none text-[10px]"
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Toast;
