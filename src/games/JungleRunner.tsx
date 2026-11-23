import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameProps } from './types';
import { sound } from '../lib/sound';
import { useFX } from './useFX';
import { useAppStore } from '../lib/store';

export const JungleRunner: React.FC<GameProps> = ({ difficulty, onWin }) => {
  const showToast = useAppStore((s) => s.showToast);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fx = useFX();

  const goalDist = difficulty === 'easy' ? 750 : difficulty === 'hard' ? 1350 : 1050;
  const speedBase = difficulty === 'easy' ? 4.2 : difficulty === 'hard' ? 6.4 : 5.2;

  const [coins, setCoins] = useState(0);
  const [distPct, setDistPct] = useState(0);

  const gameState = useRef({
    dist: 0,
    coins: 0,
    frame: 0,
    running: true,
    player: { x: 60, y: 0, vy: 0, jumps: 0, size: 32, invuln: 0 },
    obstacles: [] as Array<{ x: number; w: number; h: number; type: string }>,
    pits: [] as Array<{ x: number; w: number }>,
    coinItems: [] as Array<{ x: number; y: number; collected: boolean }>
  });

  const jump = useCallback(() => {
    const s = gameState.current;
    if (!s.running) return;
    if (s.player.jumps < 2) {
      s.player.vy = s.player.jumps === 0 ? -11.5 : -10.2;
      s.player.jumps++;
      sound.play('jump');
      fx.dust(s.player.x + 14, s.player.y + s.player.size, s.player.jumps === 2 ? '#fde047' : 'rgba(255,255,255,0.85)');
      if (s.player.jumps === 2) {
        fx.floatText(s.player.x + 16, s.player.y, 'DOUBLE!', '#fde047');
      }
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
    window.addEventListener('resize', resize);

    const loop = () => {
      const s = gameState.current;
      if (!s.running) return;
      s.frame++;
      const W = canvas.width;
      const H = canvas.height;
      const groundY = H - 42;

      s.dist += speedBase * 0.48;
      const pct = Math.min(100, Math.floor((s.dist / goalDist) * 100));
      setDistPct(pct);

      if (pct >= 100) {
        s.running = false;
        sound.play('win');
        onWin();
        return;
      }

      // Cek apakah pemain di atas lubang
      const overPit = s.pits.some((p) => s.player.x + 18 > p.x && s.player.x + 10 < p.x + p.w);

      s.player.vy += 0.62;
      s.player.y += s.player.vy;
      if (!overPit && s.player.y >= groundY - s.player.size) {
        if (s.player.vy > 4) fx.dust(s.player.x + 14, groundY);
        s.player.y = groundY - s.player.size;
        s.player.vy = 0;
        s.player.jumps = 0;
      } else if (overPit && s.player.y > H) {
        sound.play('hit');
        fx.shake(8, 14);
        s.dist = Math.max(0, s.dist - 150);
        s.player.y = groundY - s.player.size - 60;
        s.player.vy = -4;
        s.player.invuln = 45;
        showToast('Ups! Terperosok lubang hutan, ayo lompat!', 'error');
      }

      if (s.player.invuln > 0) s.player.invuln--;

      // Spawn obstacles, pits & coins
      if (s.frame % (difficulty === 'hard' ? 72 : 90) === 0 && pct < 90) {
        if (Math.random() < 0.35) {
          s.pits.push({ x: W + 20, w: difficulty === 'hard' ? 68 : 54 });
        } else {
          s.obstacles.push({ x: W + 20, w: 28, h: 28, type: Math.random() > 0.5 ? '🪨' : '🪵' });
        }
      }
      if (s.frame % 42 === 0 && pct < 94) {
        s.coinItems.push({ x: W + 20, y: groundY - 52 - Math.random() * 58, collected: false });
      }

      ctx.save();
      fx.applyShake(ctx);

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, groundY);
      sky.addColorStop(0, '#38bdf8');
      sky.addColorStop(1, '#bbf7d0');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Sun & parallax clouds
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(W - 55, 42, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      for (let i = 0; i < 3; i++) {
        const cx = (W + 140) - ((s.dist * 0.25 + i * 180) % (W + 180));
        ctx.beginPath();
        ctx.arc(cx, 38 + i * 16, 16, 0, Math.PI * 2);
        ctx.arc(cx + 16, 34 + i * 16, 20, 0, Math.PI * 2);
        ctx.arc(cx + 32, 38 + i * 16, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hills & Palm trees
      ctx.fillStyle = '#22c55e';
      for (let i = 0; i < 3; i++) {
        const hx = (W + 150) - ((s.dist * 0.55 + i * 240) % (W + 300));
        ctx.beginPath();
        ctx.arc(hx, groundY + 10, 95, Math.PI, 0);
        ctx.fill();
      }
      ctx.font = '36px sans-serif';
      for (let i = 0; i < 4; i++) {
        const tx = (W + 80) - ((s.dist * 0.85 + i * 165) % (W + 160));
        ctx.fillText('🌴', tx, groundY - 4);
      }

      // Ground
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, groundY, W, 11);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, groundY + 11, W, H - groundY);

      // Pits
      s.pits.forEach((p) => {
        p.x -= speedBase;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(p.x, groundY, p.w, H - groundY);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(p.x, groundY, p.w, 3);
      });

      // Finish line
      if (pct > 84) {
        const finishX = W - ((pct - 84) / 16) * (W - 72);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(finishX, groundY - 88, 8, 88);
        ctx.font = '28px sans-serif';
        ctx.fillText('🏁', finishX - 6, groundY - 90);
      }

      // Coins
      s.coinItems.forEach((c) => {
        c.x -= speedBase;
        if (!c.collected) {
          const bob = Math.sin(s.frame * 0.15 + c.x * 0.05) * 4;
          ctx.font = '22px sans-serif';
          ctx.fillText('🪙', c.x, c.y + bob);
          if (Math.abs(c.x - s.player.x) < 28 && Math.abs(c.y - (s.player.y + 16)) < 30) {
            c.collected = true;
            s.coins++;
            setCoins(s.coins);
            sound.play('coin');
            fx.burst(c.x + 10, c.y, '#facc15', 10);
            fx.floatText(c.x + 10, c.y - 10, '+1 🪙', '#fef08a');
          }
        }
      });

      // Obstacles
      s.obstacles.forEach((o) => {
        o.x -= speedBase;
        ctx.font = '28px sans-serif';
        ctx.fillText(o.type, o.x, groundY - 2);
        if (
          s.player.invuln <= 0 &&
          s.player.x + 20 > o.x + 4 &&
          s.player.x + 6 < o.x + o.w - 4 &&
          s.player.y + s.player.size > groundY - o.h + 6
        ) {
          sound.play('hit');
          fx.shake(7, 12);
          fx.burst(s.player.x + 16, s.player.y + 16, '#ef4444', 12);
          s.dist = Math.max(0, s.dist - 140);
          s.player.invuln = 40;
          o.x = -100;
          showToast('Aduh! Menabrak rintangan, jarak mundur sedikit!', 'error');
        }
      });

      s.obstacles = s.obstacles.filter((o) => o.x > -40);
      s.pits = s.pits.filter((p) => p.x + p.w > -20);
      s.coinItems = s.coinItems.filter((c) => c.x > -40 && !c.collected);

      // Player
      if (s.player.invuln % 6 < 4) {
        const runTilt = s.player.jumps === 0 ? Math.sin(s.frame * 0.35) * 0.12 : -0.15;
        ctx.save();
        ctx.translate(s.player.x + 16, s.player.y + 16);
        ctx.rotate(runTilt);
        ctx.font = '32px sans-serif';
        ctx.fillText('🏃', -16, 14);
        ctx.restore();
      }

      fx.updateAndDraw(ctx);
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      gameState.current.running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKey);
    };
  }, [difficulty, goalDist, speedBase, jump, fx, onWin, showToast]);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="w-full bg-green-950/90 text-lime-100 px-4 py-2.5 rounded-2xl mb-2 border border-lime-500/40 shadow-lg">
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-1.5">
          <span>
            🪙 Koin: <b className="text-amber-300">{coins}</b>
          </span>
          <span>
            🏁 Garis Finis: <b className="text-lime-300">{distPct}%</b>
          </span>
        </div>
        <div className="w-full h-2.5 bg-green-900 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-lime-400 to-amber-400 transition-all duration-100"
            style={{ width: `${distPct}%` }}
          />
        </div>
      </div>

      <div
        onClick={jump}
        className="relative w-full h-60 sm:h-64 rounded-2xl overflow-hidden border-4 border-lime-700 shadow-2xl game-canvas-container cursor-pointer"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <button
        onClick={jump}
        className="mt-3 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 active:scale-95 text-white font-display font-bold text-lg shadow-lg border-b-4 border-orange-700 transition"
      >
        🦘 LOMPAT / DOUBLE JUMP (Ketuk Layar)
      </button>
    </div>
  );
};
