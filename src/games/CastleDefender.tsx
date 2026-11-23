import React, { useRef, useEffect, useState } from 'react';
import { GameProps } from './types';
import { sound } from '../lib/sound';
import { useFX } from './useFX';
import { useAppStore } from '../lib/store';

export const CastleDefender: React.FC<GameProps> = ({ difficulty, onWin }) => {
  const showToast = useAppStore((s) => s.showToast);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fx = useFX();

  const maxWaves = 3;
  const initialCastleHp = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 3 : 4;
  const enemiesPerWave = difficulty === 'easy' ? 4 : difficulty === 'hard' ? 7 : 5;

  const [coins, setCoins] = useState(110);
  const [castleHp, setCastleHp] = useState(initialCastleHp);
  const [wave, setWave] = useState(1);

  const gameState = useRef({
    running: true,
    coins: 110,
    castleHp: initialCastleHp,
    wave: 1,
    spawnedInWave: 0,
    frame: 0,
    slots: [
      { rx: 0.22, ry: 0.26, level: 0, cooldown: 0 },
      { rx: 0.48, ry: 0.26, level: 0, cooldown: 0 },
      { rx: 0.72, ry: 0.26, level: 0, cooldown: 0 },
      { rx: 0.35, ry: 0.78, level: 0, cooldown: 0 },
      { rx: 0.62, ry: 0.78, level: 0, cooldown: 0 }
    ],
    enemies: [] as Array<{ x: number; y: number; hp: number; maxHp: number; speed: number }>,
    projectiles: [] as Array<{
      x: number;
      y: number;
      target: { x: number; y: number; hp: number };
      dmg: number;
      magic: boolean;
      done?: boolean;
    }>
  });

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

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const s = gameState.current;
      if (!s.running) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const cx = clientX - rect.left;
      const cy = clientY - rect.top;
      const W = canvas.width;
      const H = canvas.height;

      s.slots.forEach((slot) => {
        const sx = slot.rx * W;
        const sy = slot.ry * H;
        if (Math.hypot(cx - sx, cy - sy) < 28) {
          if (slot.level === 0) {
            if (s.coins >= 50) {
              s.coins -= 50;
              slot.level = 1;
              setCoins(s.coins);
              sound.play('shield');
              fx.burst(sx, sy, '#93c5fd', 14);
              fx.floatText(sx, sy - 16, 'MENARA!', '#bae6fd');
            } else {
              sound.play('hit');
              showToast('Butuh 50 🪙 untuk bangun menara!', 'error');
            }
          } else if (slot.level === 1) {
            if (s.coins >= 60) {
              s.coins -= 60;
              slot.level = 2;
              setCoins(s.coins);
              sound.play('upgrade');
              fx.burst(sx, sy, '#c084fc', 18);
              fx.floatText(sx, sy - 16, 'UPGRADE 🔮!', '#e9d5ff');
            } else {
              sound.play('hit');
              showToast('Butuh 60 🪙 untuk upgrade ke Meriam Sihir!', 'info');
            }
          }
        }
      });
    };

    canvas.addEventListener('click', handlePointerDown);

    const loop = () => {
      const s = gameState.current;
      if (!s.running) return;
      s.frame++;
      const W = canvas.width;
      const H = canvas.height;
      const pathY = H * 0.52;

      if (s.spawnedInWave < enemiesPerWave && s.frame % 72 === 0) {
        s.spawnedInWave++;
        const maxHp = 2 + s.wave * 2;
        s.enemies.push({
          x: -20,
          y: pathY,
          hp: maxHp,
          maxHp,
          speed: (difficulty === 'hard' ? 1.25 : 0.95) + s.wave * 0.14
        });
      }

      if (s.spawnedInWave >= enemiesPerWave && s.enemies.length === 0) {
        if (s.wave >= maxWaves) {
          s.running = false;
          sound.play('win');
          onWin();
          return;
        } else {
          s.wave++;
          s.spawnedInWave = 0;
          s.coins += 45;
          setWave(s.wave);
          setCoins(s.coins);
          sound.play('coin');
          showToast(`Gelombang ${s.wave} dimulai! Bonus +45 🪙`, 'info');
        }
      }

      ctx.save();
      fx.applyShake(ctx);

      // Grass field
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#166534';
      for (let i = 0; i < 14; i++) {
        ctx.fillRect((i * 53) % W, (i * 37) % H, 10, 4);
      }

      // Stone path
      ctx.fillStyle = '#92400e';
      ctx.fillRect(0, pathY - 22, W - 45, 44);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(0, pathY - 18, W - 45, 36);

      // Castle
      ctx.font = '48px sans-serif';
      ctx.fillText('🏰', W - 60, pathY + 18);

      // Slots & Towers
      s.slots.forEach((slot) => {
        const sx = slot.rx * W;
        const sy = slot.ry * H;
        if (slot.level === 0) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.35)';
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sx, sy, 19, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('+50', sx - 10, sy + 4);
        } else {
          ctx.strokeStyle = slot.level === 2 ? 'rgba(192,132,252,0.22)' : 'rgba(255,255,255,0.12)';
          ctx.beginPath();
          ctx.arc(sx, sy, slot.level === 2 ? 175 : 145, 0, Math.PI * 2);
          ctx.stroke();

          ctx.font = '30px sans-serif';
          ctx.fillText(slot.level === 2 ? '🔮' : '🗼', sx - 15, sy + 11);

          if (slot.cooldown > 0) slot.cooldown--;
          else if (s.enemies.length > 0) {
            const range = slot.level === 2 ? 175 : 145;
            const target = s.enemies.find((en) => Math.hypot(en.x - sx, en.y - sy) < range);
            if (target) {
              s.projectiles.push({
                x: sx,
                y: sy,
                target,
                dmg: slot.level === 2 ? 2 : 1,
                magic: slot.level === 2
              });
              slot.cooldown = slot.level === 2 ? 28 : 40;
              sound.play('shoot');
            }
          }
        }
      });

      // Projectiles
      s.projectiles.forEach((p) => {
        const dx = p.target.x - p.x;
        const dy = p.target.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 12) {
          p.target.hp -= p.dmg;
          p.done = true;
          fx.burst(p.x, p.y, p.magic ? '#c084fc' : '#fef08a', 6);
        } else {
          p.x += (dx / dist) * 6.5;
          p.y += (dy / dist) * 6.5;
          ctx.fillStyle = p.magic ? '#c084fc' : '#fef08a';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.magic ? 5.5 : 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      s.projectiles = s.projectiles.filter((p) => !p.done && p.target.hp > 0);

      // Goblins
      s.enemies.forEach((en) => {
        en.x += en.speed;
        const wobble = Math.sin(s.frame * 0.25 + en.x * 0.05) * 2.5;
        ctx.font = '26px sans-serif';
        ctx.fillText('🧌', en.x - 13, en.y + 8 + wobble);

        const hpW = 24;
        ctx.fillStyle = '#450a0a';
        ctx.fillRect(en.x - hpW / 2, en.y - 22, hpW, 4);
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(en.x - hpW / 2, en.y - 22, hpW * Math.max(0, en.hp / en.maxHp), 4);

        if (en.hp <= 0) {
          s.coins += 22;
          setCoins(s.coins);
          sound.play('coin');
          fx.burst(en.x, en.y, '#facc15', 10);
          fx.floatText(en.x, en.y - 16, '+22 🪙', '#fef08a');
        } else if (en.x >= W - 55) {
          en.hp = 0;
          s.castleHp--;
          setCastleHp(Math.max(0, s.castleHp));
          sound.play('hit');
          fx.shake(8, 14);

          if (s.castleHp <= 0) {
            s.castleHp = 4;
            s.wave = 1;
            s.spawnedInWave = 0;
            s.enemies = [];
            setCastleHp(4);
            setWave(1);
            showToast('Kastil jebol! Gelombang diulang dari awal.', 'error');
          }
        }
      });
      s.enemies = s.enemies.filter((en) => en.hp > 0);

      fx.updateAndDraw(ctx);
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      gameState.current.running = false;
      cancelAnimationFrame(animId);
      canvas.removeEventListener('click', handlePointerDown);
    };
  }, [difficulty, initialCastleHp, enemiesPerWave, fx, onWin, showToast]);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center bg-rose-950/90 text-rose-100 px-3.5 py-2.5 rounded-2xl mb-2 text-xs sm:text-sm font-bold border border-rose-500/40 shadow-lg">
        <span>
          ❤️ Kastil: <b className="text-rose-400">{castleHp}</b>
        </span>
        <span>
          🌊 Gelombang: <b className="text-amber-300">{wave}/{maxWaves}</b>
        </span>
        <span>
          🪙 Koin: <b className="text-yellow-300">{coins}</b>
        </span>
      </div>

      <div className="relative w-full h-64 rounded-2xl overflow-hidden border-4 border-rose-700 shadow-2xl bg-emerald-800 game-canvas-container">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <p className="text-xs text-rose-200 mt-2.5 text-center">
        Ketuk slot biru untuk bangun Menara (50 🪙). Ketuk lagi untuk upgrade ke Meriam Sihir (60 🪙)!
      </p>
    </div>
  );
};
