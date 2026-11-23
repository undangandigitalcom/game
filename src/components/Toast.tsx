import React, { useEffect } from 'react';
import { useAppStore } from '../lib/store';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useAppStore();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  const colors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-slate-800 text-white'
  };

  const icons = {
    success: '✅',
    error: '⚠️',
    info: '✨'
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-11/12 max-w-md pointer-events-none">
      <div
        className={`${
          colors[toastMessage.type] || colors.info
        } px-4 py-3 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2.5 pointer-events-auto animate-pop`}
      >
        <span>{icons[toastMessage.type]}</span>
        <span>{toastMessage.text}</span>
      </div>
    </div>
  );
};
