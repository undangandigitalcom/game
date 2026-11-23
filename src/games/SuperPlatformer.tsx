import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameProps } from './types';
import { sound } from '../lib/sound';
import { useFX } from './useFX';
import { useAppStore } from '../lib/store';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const SuperPlatformer: React.FC<GameProps> = ({ difficulty, targetGoal, onWin }) => {
  const showToast = useAppStore((s) => s.showToast);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fx = useFX();
  const starsNeeded = Math.min(Math.max(targetGoal || 3, 3), 5);

  const [starsCount, setStarsCount] = useState(0);
  const [portalActive, setPortalActive] = useState(false);

  const gameState = useRef({
    running: true,
    starsCollected: 0,
    frame: 0,
    keys: { left: false, right: false },
    player: { x: 24, y: 180, w: 26, h: 28, vx: 0, vy: 0, grounded: false, coyote: 0, jumps: 0 },
    platforms: [
      { rx: 0, ry: 0.88, rw: 1, rh: 0.12, main: true },
      { rx: 0.1, ry: 0.68, rw: 0.25, rh: 0.065, main: false },
      { rx: 0.42, ry: 0.54, rw: 0.28, rh: 0.065, main: false },
      { rx: 0.12, ry: 0.36, rw: 0.25, rh: 0.065, main: false },
      { rx: 0.6, ry: 0.28, rw: 0.34, rh: 0.065, main: false }
    ],
    starPositions: [
      { rx: 0.21, ry: 0.57, got: false },
      { rx: 0.55, ry: 0.43, got: false },
      { rx: 0.23, ry: 0.25, got: false },
      { rx: 0.78, ry: 0.77, got: false },
      { rx: 0.48, ry: 0.77, got: false }
    ].slice(0, starsNeeded),
    enemy: { rx: 0.46, dir: 1, speed: difficulty === 'hard' ? 0.0055 : 0.0032 }
  });

  const doJump = useCallback(() => {
    const s = gameState.current;
    if (s.player.coyote > 0 || s.player.jumps < 2) {
      s.player.vy = s.player.jumps === 0 ? -10.5 : -9.2;
      s.player.grounded = false;
      s.player.coyote = 0;
      s.player.jumps++;
      sound.play('jump');
      fx.dust(s.player.x + 13, s.player.y + s.player.h, s.player.jumps === 2 ? '#fde047' : '#ffffff');
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

    const loop = () => {
      const s = gameState.current;
      if (!s.running) return;
      s.frame++;
      const W = canvas.width;
      const H = canvas.height;

      // Sky & clouds
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#0284c7');
      sky.addColorStop(1, '#bae6fd');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      for (let i = 0; i < 3; i++) {
        const cx = ((s.frame * 0.3 + i * 160) % (W + 100)) - 50;
        ctx.beginPath();
        ctx.arc(cx, 36 + i * 35, 16, 0, Math.PI * 2);
        ctx.arc(cx + 18, 32 + i * 35, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      fx.applyShake(ctx);

      if (s.keys.left) s.player.vx = -4.2;
      else if (s.keys.right) s.player.vx = 4.2;
      else s.player.vx *= 0.78;

      s.player.vy += 0.52;
      s.player.x += s.player.vx;
      s.player.y += s.player.vy;
      s.player.grounded = false;

      if (s.player.x < 0) s.player.x = 0;
      if (s.player.x + s.player.w > W) s.player.x = W - s.player.w;

      // Platforms with 3D bevel
      s.platforms.forEach((p) => {
        const px = p.rx * W,
          py = p.ry * H,
          pw = p.rw * W,
          ph = p.rh * H;
        ctx.fillStyle = p.main ? '#15803d' : '#b45309';
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 6);
        ctx.fill();

        ctx.fillStyle = p.main ? '#4ade80' : '#fbbf24';
        ctx.beginPath();
        ctx.roundRect(px, py, pw, Math.max(5, ph * 0.38), [6, 6, 0, 0]);
        ctx.fill();

        if (
          s.player.vy >= 0 &&
          s.player.x + s.player.w > px + 4 &&
          s.player.x < px + pw - 4 &&
          s.player.y + s.player.h >= py &&
          s.player.y + s.player.h <= py + ph + 12
        ) {
          s.player.y = py - s.player.h;
          s.player.vy = 0;
          s.player.grounded = true;
          s.player.coyote = 7;
          s.player.jumps = 0;
        }
      });

      if (!s.player.grounded && s.player.coyote > 0) s.player.coyote--;

      // Portal Door
      const doorX = 0.82 * W;
      const doorY = 0.28 * H - 36;
      const portalOpen = s.starsCollected >= starsNeeded;

      if (portalOpen) {
        ctx.save();
        ctx.translate(doorX + 16, doorY + 18);
        ctx.rotate(s.frame * 0.08);
        const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.5, '#38bdf8');
        grad.addColorStop(1, 'rgba(99,102,241,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.font = '32px sans-serif';
      ctx.fillText(portalOpen ? '🚪' : '🔒', doorX, doorY + 32);

      if (portalOpen && Math.abs(s.player.x - doorX) < 30 && Math.abs(s.player.y - doorY) < 35) {
        s.running = false;
        sound.play('win');
        onWin();
        return;
      }

      // Stars
      s.starPositions.forEach((st, idx) => {
        if (!st.got) {
          const sx = st.rx * W;
          const sy = st.ry * H + Math.sin(s.frame * 0.1 + idx) * 4;
          ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
          ctx.beginPath();
          ctx.arc(sx + 11, sy - 8, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = '22px sans-serif';
          ctx.fillText('⭐', sx, sy);

          if (Math.abs(s.player.x + 12 - (sx + 10)) < 25 && Math.abs(s.player.y + 14 - (sy - 8)) < 25) {
            st.got = true;
            s.starsCollected++;
            setStarsCount(s.starsCollected);
            sound.play('coin');
            fx.burst(sx + 10, sy - 8, '#fde047', 16);
            fx.floatText(sx + 10, sy - 18, '+1 ⭐', '#fef08a');

            if (s.starsCollected >= starsNeeded) {
              setPortalActive(true);
              sound.play('shield');
            }
          }
        }
      });

      // Patrol Enemy
      if (difficulty !== 'easy') {
        s.enemy.rx += s.enemy.dir * s.enemy.speed;
        if (s.enemy.rx < 0.43 || s.enemy.rx > 0.65) s.enemy.dir *= -1;
        const ex = s.enemy.rx * W;
        const ey = 0.54 * H - 22;
        ctx.font = '22px sans-serif';
        ctx.fillText('🦔', ex, ey + 20);

        if (Math.abs(s.player.x - ex) < 20 && Math.abs(s.player.y - ey) < 20) {
          sound.play('hit');
          fx.shake(7, 12);
          fx.burst(s.player.x + 12, s.player.y + 12, '#f43f5e', 14);
          s.player.x = 24;
          s.player.y = 180;
          showToast('Terkena landak! Ulangi dari bawah.', 'error');
        }
      }

      // Player character
      ctx.font = '28px sans-serif';
      ctx.fillText('🦸', s.player.x, s.player.y + s.player.h - 2);

      fx.updateAndDraw(ctx);
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const kd = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') gameState.current.keys.left = true;
      if (e.key === 'ArrowRight') gameState.current.keys.right = true;
      if (e.key === 'ArrowUp' || e.code === 'Space') {
        e.preventDefault();
        doJump();
      }
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') gameState.current.keys.left = false;
      if (e.key === 'ArrowRight') gameState.current.keys.right = false;
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);

    return () => {
      gameState.current.running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, [difficulty, starsNeeded, doJump, fx, onWin, showToast]);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center bg-sky-950/90 text-sky-100 px-4 py-2.5 rounded-2xl mb-2 text-xs sm:text-sm font-bold border border-sky-400/40 shadow-lg">
        <span>
          ⭐ Bintang: <b className="text-yellow-300">{starsCount}/{starsNeeded}</b>
        </span>
        <span className={portalActive ? 'text-emerald-300 animate-pulse' : 'text-sky-300'}>
          {portalActive ? 'Portal aktif! Masuk ke 🚪' : 'Kumpulkan semua bintang!'}
        </span>
      </div>

      <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border-4 border-sky-400 shadow-2xl game-canvas-container">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <div className="grid grid-cols-3 gap-3 w-full mt-3">
        <button
          onPointerDown={() => (gameState.current.keys.left = true)}
          onPointerUp={() => (gameState.current.keys.left = false)}
          onPointerLeave={() => (gameState.current.keys.left = false)}
          className="py-3.5 rounded-2xl bg-sky-600 active:scale-95 text-white font-bold shadow-md border-b-4 border-sky-800 flex justify-center items-center"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={doJump}
          className="py-3.5 rounded-2xl bg-amber-500 active:scale-95 text-white font-display font-bold shadow-md border-b-4 border-amber-700"
        >
          LOMPAT
        </button>
        <button
          onPointerDown={() => (gameState.current.keys.right = true)}
          onPointerUp={() => (gameState.current.keys.right = false)}
          onPointerLeave={() => (gameState.current.keys.right = false)}
          className="py-3.5 rounded-2xl bg-sky-600 active:scale-95 text-white font-bold shadow-md border-b-4 border-sky-800 flex justify-center items-center"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
