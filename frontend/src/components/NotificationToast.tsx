'use client';
import { useState, useEffect } from 'react';
import { Bell, X, Zap } from 'lucide-react';

export default function NotificationToast({ message, type = 'info' }: { message: string, type?: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-6 z-[100] animate-in slide-in-from-right-10">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 max-w-sm">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Zap size={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-800">StudySync Alert</p>
          <p className="text-xs text-slate-500">{message}</p>
        </div>
        <button onClick={() => setVisible(false)} className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}