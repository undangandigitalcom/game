import React, { useRef, useEffect, useState } from 'react';
import { GameProps } from './types';
import { sound } from '../lib/sound';
import { useFX } from './useFX';
import { useAppStore } from '../lib/store';

export const SpaceMission: React.FC<GameProps> = ({ difficulty, targetGoal, onWin }) => {
  const showToast = useAppStore((s) => s.showToast);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fx = useFX();
  const energyNeeded = Math.min(Math.max(targetGoal || 4, 3), 7);

  const [energy, setEnergy] = useState(0);
  const [missionStatus, setMissionStatus] = useState('Mengisi Daya');

  const gameState = useRef({
    running: true,
    energy: 0,
    frame: 0,
    moveDir: 0,
    ship: { x: 54, y: 120 },
    asteroids: [] as Array<{ x: number; y: number; r: number; rot: number; vrot: number }>,
    cells: [] as Array<{ x: number; y: number }>,
    stars: Array.from({ length: 42 }, () => ({
      x: Math.random() * 500,
      y: Math.random() * 280,
      s: Math.random() > 0.7 ? 2.5 : 1.2,
      spd: 0.6 + Math.random() * 2.2
    }))
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resize();

    const loop = () => {
      const s = gameState.current;
      if (!s.running) return;
      s.frame++;
      const W = canvas.width;
      const H = canvas.height;
      const speed = difficulty === 'easy' ? 3.5 : difficulty === 'hard' ? 5.8 : 4.5;

      s.ship.y += s.moveDir * 4.8;
      s.ship.y = Math.max(24, Math.min(H - 24, s.ship.y));

      // Rocket flame particle
      if (s.frame % 2 === 0) {
        fx.dust(s.ship.x - 18, s.ship.y + (Math.random() - 0.5) * 6, Math.random() > 0.5 ? '#f97316' : '#fde047');
      }

      if (s.frame % (difficulty === 'hard' ? 34 : 48) === 0 && s.energy < energyNeeded) {
        s.asteroids.push({
          x: W + 25,
          y: 26 + Math.random() * (H - 52),
          r: 13 + Math.random() * 8,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.08
        });
      }
      if (s.frame % 70 === 0 && s.energy < energyNeeded) {
        s.cells.push({ x: W + 20, y: 26 + Math.random() * (H - 52) });
      }

      ctx.save();
      fx.applyShake(ctx);

      // Nebula background
      const bg = ctx.createRadialGradient(W * 0.7, H * 0.3, 15, W * 0.5, H * 0.5, W);
      bg.addColorStop(0, '#312e81');
      bg.addColorStop(0.5, '#0f172a');
      bg.addColorStop(1, '#020617');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // 2-layer star parallax
      s.stars.forEach((st) => {
        st.x -= st.spd;
        if (st.x < 0) {
          st.x = W;
          st.y = Math.random() * H;
        }
        ctx.fillStyle = st.s > 2 ? '#e0e7ff' : 'rgba(255,255,255,0.65)';
        ctx.fillRect(st.x, st.y, st.s, st.s);
      });

      // Target Planet
      if (s.energy >= energyNeeded) {
        const px = W - 64;
        const py = H / 2;
        ctx.fillStyle = 'rgba(99,102,241,0.22)';
        ctx.beginPath();
        ctx.arc(px, py, 44, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '56px sans-serif';
        ctx.fillText('🪐', px - 28, py + 20);

        if (s.ship.x > px - 42) {
          s.running = false;
          sound.play('win');
          onWin();
          return;
        }
        s.ship.x += 2.8;
        s.ship.y += (py - s.ship.y) * 0.08;
      }

      // Energy cells with magnet effect
      s.cells.forEach((c) => {
        c.x -= speed;
        const d = Math.hypot(c.x - s.ship.x, c.y - s.ship.y);
        if (d < 65) {
          c.x += (s.ship.x - c.x) * 0.08;
          c.y += (s.ship.y - c.y) * 0.08;
        }
        ctx.fillStyle = 'rgba(34, 211, 238, 0.28)';
        ctx.beginPath();
        ctx.arc(c.x + 10, c.y - 6, 15 + Math.sin(s.frame * 0.2) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '22px sans-serif';
        ctx.fillText('⚡', c.x, c.y);

        if (d < 28) {
          c.x = -100;
          s.energy = Math.min(energyNeeded, s.energy + 1);
          setEnergy(s.energy);
          sound.play('coin');
          fx.burst(s.ship.x + 10, s.ship.y, '#22d3ee', 14);
          fx.floatText(s.ship.x + 10, s.ship.y - 16, '+1 ⚡', '#67e8f9');

          if (s.energy >= energyNeeded) {
            setMissionStatus('Mendarat ke Planet! 🚀');
            sound.play('shield');
          }
        }
      });

      // Rotating Asteroids
      s.asteroids.forEach((a) => {
        a.x -= speed * 1.15;
        a.rot += a.vrot;
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.rot);
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 7; i++) {
          const ang = (i / 7) * Math.PI * 2;
          const rad = a.r * (i % 2 === 0 ? 1 : 0.78);
          const vx = Math.cos(ang) * rad,
            vy = Math.sin(ang) * rad;
          if (i === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(-a.r * 0.25, -a.r * 0.1, a.r * 0.24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (Math.hypot(a.x - s.ship.x, a.y - s.ship.y) < a.r + 14 && s.energy < energyNeeded) {
          a.x = -100;
          s.energy = Math.max(0, s.energy - 1);
          setEnergy(s.energy);
          sound.play('hit');
          fx.shake(7, 12);
          fx.burst(s.ship.x, s.ship.y, '#f43f5e', 16);
          showToast('Terkena asteroid! 1 sel energi berkurang.', 'error');
        }
      });

      // Rocket Ship
      ctx.save();
      ctx.translate(s.ship.x, s.ship.y);
      ctx.rotate(Math.PI / 4 + s.moveDir * 0.14);
      ctx.font = '34px sans-serif';
      ctx.fillText('🚀', -17, 12);
      ctx.restore();

      fx.updateAndDraw(ctx);
      ctx.restore();

      s.asteroids = s.asteroids.filter((a) => a.x > -40);
      s.cells = s.cells.filter((c) => c.x > -40);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const kd = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') gameState.current.moveDir = -1;
      if (e.key === 'ArrowDown') gameState.current.moveDir = 1;
    };
    const ku = () => {
      gameState.current.moveDir = 0;
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);

    return () => {
      gameState.current.running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, [difficulty, energyNeeded, fx, onWin, showToast]);

  const progress = Math.round((energy / energyNeeded) * 100);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="w-full bg-indigo-950 text-indigo-100 px-4 py-2.5 rounded-2xl mb-2 border border-indigo-400/40 shadow-lg">
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1.5">
          <span>
            ⚡ Sel Energi: <b className="text-cyan-300">{energy}/{energyNeeded}</b>
          </span>
          <span>
            🪐 Status: <b className="text-amber-300">{missionStatus}</b>
          </span>
        </div>
        <div className="w-full h-2 bg-indigo-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        onPointerMove={(e) => {
          if (e.buttons > 0 || e.pointerType === 'touch') {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
              gameState.current.ship.y = e.clientY - rect.top;
            }
          }
        }}
        className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border-4 border-indigo-500 shadow-2xl bg-slate-950 game-canvas-container"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <div className="grid grid-cols-2 gap-3 w-full mt-3">
        <button
          onPointerDown={() => (gameState.current.moveDir = -1)}
          onPointerUp={() => (gameState.current.moveDir = 0)}
          onPointerLeave={() => (gameState.current.moveDir = 0)}
          className="py-3.5 rounded-2xl bg-indigo-600 active:scale-95 text-white font-bold shadow-md border-b-4 border-indigo-800"
        >
          ⬆️ NAIK
        </button>
        <button
          onPointerDown={() => (gameState.current.moveDir = 1)}
          onPointerUp={() => (gameState.current.moveDir = 0)}
          onPointerLeave={() => (gameState.current.moveDir = 0)}
          className="py-3.5 rounded-2xl bg-indigo-600 active:scale-95 text-white font-bold shadow-md border-b-4 border-indigo-800"
        >
          ⬇️ TURUN
        </button>
      </div>
    </div>
  );
};
