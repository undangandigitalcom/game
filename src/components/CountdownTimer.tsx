import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDateStr: string;
  isDark?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDateStr, isDark = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const target = new Date(targetDateStr + 'T09:00:00').getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  return (
    <div
      className={`grid grid-cols-4 gap-2 mb-6 p-3 rounded-2xl ${
        isDark ? 'bg-slate-800/80 border border-indigo-500/30' : 'bg-slate-900 text-white'
      }`}
    >
      <div>
        <span className="font-display text-xl sm:text-2xl font-bold text-amber-400 block">
          {timeLeft.days}
        </span>
        <span className="text-[10px] uppercase text-slate-300">Hari</span>
      </div>
      <div>
        <span className="font-display text-xl sm:text-2xl font-bold text-amber-400 block">
          {timeLeft.hours}
        </span>
        <span className="text-[10px] uppercase text-slate-300">Jam</span>
      </div>
      <div>
        <span className="font-display text-xl sm:text-2xl font-bold text-amber-400 block">
          {timeLeft.minutes}
        </span>
        <span className="text-[10px] uppercase text-slate-300">Menit</span>
      </div>
      <div>
        <span className="font-display text-xl sm:text-2xl font-bold text-amber-400 block">
          {timeLeft.seconds}
        </span>
        <span className="text-[10px] uppercase text-slate-300">Detik</span>
      </div>
    </div>
  );
};
