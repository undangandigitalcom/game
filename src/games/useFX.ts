import { useRef } from 'react';
import { Particle, FloatingText } from './types';

export function useFX() {
  const particlesRef = useRef<Particle[]>([]);
  const textsRef = useRef<FloatingText[]>([]);
  const shakeFramesRef = useRef<number>(0);
  const shakePowerRef = useRef<number>(0);

  const burst = (x: number, y: number, color = '#facc15', count = 14) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 1.5 + Math.random() * 3.8;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        life: 24 + Math.random() * 18,
        maxLife: 42,
        color,
        size: 2.5 + Math.random() * 3.5,
        gravity: 0.14
      });
    }
  };

  const dust = (x: number, y: number, color = 'rgba(255,255,255,0.75)') => {
    for (let i = 0; i < 6; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 14,
        y,
        vx: (Math.random() - 0.5) * 2.2,
        vy: -Math.random() * 1.8,
        life: 16 + Math.random() * 10,
        maxLife: 26,
        color,
        size: 3 + Math.random() * 3,
        gravity: 0.03
      });
    }
  };

  const floatText = (x: number, y: number, text: string, color = '#fef08a') => {
    textsRef.current.push({ x, y, text, color, life: 40, maxLife: 40 });
  };

  const shake = (power = 6, frames = 12) => {
    shakePowerRef.current = power;
    shakeFramesRef.current = frames;
  };

  const applyShake = (ctx: CanvasRenderingContext2D) => {
    if (shakeFramesRef.current > 0) {
      shakeFramesRef.current--;
      const dx = (Math.random() - 0.5) * shakePowerRef.current * 2;
      const dy = (Math.random() - 0.5) * shakePowerRef.current * 2;
      ctx.translate(dx, dy);
    }
  };

  const updateAndDraw = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life--;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const texts = textsRef.current;
    for (let i = texts.length - 1; i >= 0; i--) {
      const t = texts[i];
      t.y -= 0.9;
      t.life--;
      if (t.life <= 0) {
        texts.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, t.life / t.maxLife);
      ctx.font = 'bold 14px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0,0,0,0.65)';
      ctx.lineWidth = 3;
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
  };

  return { burst, dust, floatText, shake, applyShake, updateAndDraw };
}
