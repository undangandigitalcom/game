import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameProps } from './types';
import { sound } from '../lib/sound';
import { useFX } from './useFX';
import { useAppStore } from '../lib/store';

export const DinoEscape: React.FC<GameProps> = ({ difficulty, onWin }) => {
  const showToast = useAppStore((s) => s.showToast);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fx = useFX();

  const totalTime = difficulty === 'easy' ? 14 : difficulty === 'hard' ? 24 : 18;

  const [shieldActive, setShieldActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [progressPct, setProgressPct] = useState(0);

  const gameState = useRef({
    running: true,
    elapsed: 0,
    lastTs: performance.now(),
    frame: 0,
    hasShield: false,
    dinoDist: 24,
    runner: { x: 120, y: 0, vy: 0, grounded: true },
    hazards: [] as Array<{ x: number; icon: string }>,
    shields: [] as Array<{ x: number; y: number }>
  });

  const jump = useCallback(() => {
    const s = gameState.current;
    if (s.runner.grounded && s.running) {
      s.runner.vy = -11.4;
      s.runner.grounded = false;
      sound.play('jump');
      fx.dust(s.runner.x + 14, s.runner.y + 30, '#fed7aa');
    }
  }, [fx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    gameState.current.running = true;

    let animId: number;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resize();

    const loop = (now: number) => {
      const s = gameState.current;
      if (!s.running) return;
      const dt = Math.min(0.05, (now - s.lastTs) / 1000);
      s.lastTs = now;
      s.elapsed += dt;
      s.frame++;

      const rem = Math.max(0, Math.ceil(totalTime - s.elapsed));
      const pct = Math.min(100, Math.floor((s.elapsed / totalTime) * 100));
      setTimeLeft(rem);
      setProgressPct(pct);

      if (rem <= 0) {
        s.running = false;
        sound.play('win');
        onWin();
        return;
      }

      const W = canvas.width;
      const H = canvas.height;
      const floor = H - 38;
      const speed = difficulty === 'easy' ? 4.5 : difficulty === 'hard' ? 6.8 : 5.5;

      s.runner.vy += 0.62;
      s.runner.y += s.runner.vy;
      if (s.runner.y >= floor - 30) {
        if (!s.runner.grounded) fx.dust(s.runner.x + 14, floor, '#fdba74');
        s.runner.y = floor - 30;
        s.runner.vy = 0;
        s.runner.grounded = true;
      }

      if (s.frame % (difficulty === 'hard' ? 62 : 82) === 0 && rem > 2) {
        s.hazards.push({ x: W + 20, icon: Math.random() > 0.45 ? '🌵' : '🔥' });
      }
      if (s.frame % 200 === 0 && !s.hasShield && rem > 3) {
        s.shields.push({ x: W + 20, y: floor - 76 });
      }

      if (s.frame % 22 === 0) {
        fx.dust(s.dinoDist + 24, floor, '#f97316');
        if (s.dinoDist > 55) fx.shake(2.5, 4);
      }

      ctx.save();
      fx.applyShake(ctx);

      // Sunset gradient
      const sky = ctx.createLinearGradient(0, 0, 0, floor);
      sky.addColorStop(0, '#7c2d12');
      sky.addColorStop(0.55, '#ea580c');
      sky.addColorStop(1, '#fde047');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Sun & Volcanoes
      ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
      ctx.beginPath();
      ctx.arc(W * 0.78, 52, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#9a3412';
      for (let i = 0; i < 3; i++) {
        const mx = (W + 120) - ((s.frame * 0.8 + i * 210) % (W + 240));
        ctx.beginPath();
        ctx.moveTo(mx - 70, floor);
        ctx.lineTo(mx, floor - 75);
        ctx.lineTo(mx + 70, floor);
        ctx.fill();
      }

      // Ground
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(0, floor, W, H - floor);
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(0, floor, W, 6);

      // Safe zone helicopter
      if (rem <= 2) {
        const safeX = W - ((2 - (totalTime - s.elapsed)) / 2) * (W - 145);
        ctx.font = '44px sans-serif';
        ctx.fillText('🚁', safeX, floor - 42);
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 11px Fredoka, sans-serif';
        ctx.fillText('ZONA AMAN!', safeX - 8, floor - 82);
      }

      // T-Rex
      const trexBounce = Math.abs(Math.sin(s.frame * 0.22)) * -8;
      ctx.font = '50px sans-serif';
      ctx.fillText('🦖', s.dinoDist, floor - 2 + trexBounce);

      // Shields
      s.shields.forEach((sh) => {
        sh.x -= speed;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.beginPath();
        ctx.arc(sh.x + 12, sh.y - 8, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '24px sans-serif';
        ctx.fillText('🛡️', sh.x, sh.y);

        if (Math.abs(sh.x - s.runner.x) < 28 && Math.abs(sh.y - (s.runner.y + 15)) < 32) {
          s.hasShield = true;
          setShieldActive(true);
          sh.x = -100;
          sound.play('shield');
          fx.burst(s.runner.x + 15, s.runner.y + 15, '#38bdf8', 16);
          fx.floatText(s.runner.x + 15, s.runner.y - 10, 'SHIELD ON!', '#7dd3fc');
        }
      });

      // Hazards
      s.hazards.forEach((h) => {
        h.x -= speed;
        ctx.font = '28px sans-serif';
        ctx.fillText(h.icon, h.x, floor - 2);

        if (Math.abs(h.x - s.runner.x) < 22 && s.runner.y + 30 > floor - 22) {
          h.x = -100;
          if (s.hasShield) {
            s.hasShield = false;
            setShieldActive(false);
            sound.play('click');
            fx.burst(s.runner.x + 16, s.runner.y + 16, '#38bdf8', 14);
            fx.floatText(s.runner.x + 16, s.runner.y - 8, 'BLOCKED!', '#bae6fd');
          } else {
            sound.play('hit');
            fx.shake(8, 12);
            fx.burst(s.runner.x + 16, s.runner.y + 16, '#ef4444', 12);
            s.dinoDist = Math.min(82, s.dinoDist + 24);
            showToast('Hati-hati! T-Rex semakin dekat!', 'error');
          }
        }
      });

      s.dinoDist = Math.max(18, s.dinoDist - 0.035);

      // Runner & Shield
      if (s.hasShield) {
        ctx.strokeStyle = '#38bdf8';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(s.runner.x + 15, s.runner.y + 15, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.font = '32px sans-serif';
      ctx.fillText('🏃‍♂️', s.runner.x, s.runner.y + 28);

      fx.updateAndDraw(ctx);
      ctx.restore();

      s.hazards = s.hazards.filter((h) => h.x > -40);
      s.shields = s.shields.filter((sh) => sh.x > -40);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const kd = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', kd);

    return () => {
      gameState.current.running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', kd);
    };
  }, [difficulty, totalTime, jump, fx, onWin, showToast]);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="w-full bg-orange-950/90 text-orange-100 px-4 py-2.5 rounded-2xl mb-2 border border-orange-500/40 shadow-lg">
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1.5">
          <span>
            🛡️ Pelindung: <b className="text-cyan-300">{shieldActive ? 'AKTIF ✨' : 'Nonaktif'}</b>
          </span>
          <span>
            ⏳ Zona Aman: <b className="text-amber-300">{timeLeft}d</b>
          </span>
        </div>
        <div className="w-full h-2 bg-orange-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-emerald-400 transition-all duration-150"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div
        onClick={jump}
        className="relative w-full h-60 sm:h-64 rounded-2xl overflow-hidden border-4 border-orange-600 shadow-2xl game-canvas-container cursor-pointer"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <button
        onClick={jump}
        className="mt-3 w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 active:scale-95 text-white font-display font-bold text-lg shadow-lg border-b-4 border-red-800 transition"
      >
        🏃‍♂️ LOMPATI RINTANGAN (Ketuk Layar)
      </button>
    </div>
  );
};
