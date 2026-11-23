import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from './types';
import { sound } from '../lib/sound';
import { useAppStore } from '../lib/store';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export const TreasureHunt: React.FC<GameProps> = ({ difficulty, targetGoal, onWin }) => {
  const showToast = useAppStore((s) => s.showToast);
  const size = difficulty === 'easy' ? 6 : difficulty === 'hard' ? 8 : 7;
  const crystalsNeeded = Math.min(Math.max(targetGoal || 3, 2), 5);

  const [player, setPlayer] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [collected, setCollected] = useState(0);
  const [hasKey, setHasKey] = useState(false);
  const [steps, setSteps] = useState(0);
  const [grid, setGrid] = useState<string[][]>([]);
  const [enemies, setEnemies] = useState<Array<{ x: number; y: number; dir: number }>>([]);
  const [shaking, setShaking] = useState(false);

  // Validasi BFS agar seluruh kristal, kunci & peti 100% bisa dijangkau
  const isMapSolvable = (g: string[][]) => {
    const visited = new Set<string>(['0,0']);
    const q: Array<{ x: number; y: number }> = [{ x: 0, y: 0 }];
    while (q.length) {
      const { x, y } = q.shift()!;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
      ]) {
        const nx = x + dx,
          ny = y + dy;
        const k = `${nx},${ny}`;
        if (nx >= 0 && ny >= 0 && nx < size && ny < size && g[ny][nx] !== 'wall' && !visited.has(k)) {
          visited.add(k);
          q.push({ x: nx, y: ny });
        }
      }
    }
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (['crystal', 'key', 'chest'].includes(g[y][x]) && !visited.has(`${x},${y}`)) return false;
      }
    }
    return true;
  };

  const initMap = useCallback(() => {
    let attempts = 0;
    let newGrid: string[][] = [];
    let newEnemies: Array<{ x: number; y: number; dir: number }> = [];

    do {
      attempts++;
      newGrid = Array.from({ length: size }, () => Array(size).fill('grass'));
      newEnemies = [];

      const used = new Set<string>(['0,0']);
      const randPos = () => {
        let x: number, y: number, key: string;
        do {
          x = Math.floor(Math.random() * size);
          y = Math.floor(Math.random() * size);
          key = `${x},${y}`;
        } while (used.has(key));
        used.add(key);
        return { x, y };
      };

      const wallCount = difficulty === 'easy' ? 4 : difficulty === 'hard' ? 11 : 7;
      for (let i = 0; i < wallCount; i++) {
        const p = randPos();
        newGrid[p.y][p.x] = 'wall';
      }
      for (let i = 0; i < crystalsNeeded; i++) {
        const p = randPos();
        newGrid[p.y][p.x] = 'crystal';
      }
      const keyPos = randPos();
      newGrid[keyPos.y][keyPos.x] = 'key';

      const chestPos = randPos();
      newGrid[chestPos.y][chestPos.x] = 'chest';

      if (difficulty !== 'easy') {
        const enemyCount = difficulty === 'hard' ? 2 : 1;
        for (let i = 0; i < enemyCount; i++) {
          const ep = randPos();
          if (ep.x + ep.y > 2) newEnemies.push({ x: ep.x, y: ep.y, dir: 1 });
        }
      }
    } while (!isMapSolvable(newGrid) && attempts < 20);

    setGrid(newGrid);
    setEnemies(newEnemies);
    setPlayer({ x: 0, y: 0 });
    setCollected(0);
    setHasKey(false);
    setSteps(0);
  }, [size, difficulty, crystalsNeeded]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (grid.length === 0) return;
      const nx = player.x + dx;
      const ny = player.y + dy;
      if (nx < 0 || ny < 0 || nx >= size || ny >= size) return;

      if (grid[ny][nx] === 'wall') {
        sound.play('hit');
        setShaking(true);
        setTimeout(() => setShaking(false), 350);
        return;
      }

      setSteps((s) => s + 1);

      if (enemies.some((e) => e.x === nx && e.y === ny)) {
        sound.play('hit');
        setShaking(true);
        setTimeout(() => setShaking(false), 350);
        showToast('Ups! Terkena slime penjaga, kembali ke titik awal.', 'error');
        setPlayer({ x: 0, y: 0 });
        return;
      }

      const tile = grid[ny][nx];
      if (tile === 'crystal') {
        setCollected((c) => c + 1);
        const copy = grid.map((r) => [...r]);
        copy[ny][nx] = 'grass';
        setGrid(copy);
        sound.play('coin');
      } else if (tile === 'key') {
        setHasKey(true);
        const copy = grid.map((r) => [...r]);
        copy[ny][nx] = 'grass';
        setGrid(copy);
        sound.play('shield');
        showToast('Kunci emas ditemukan! Sekarang buka peti 🧰!', 'success');
      } else if (tile === 'chest') {
        if (collected >= crystalsNeeded && hasKey) {
          sound.play('win');
          setTimeout(() => onWin(), 350);
          return;
        } else {
          sound.play('hit');
          showToast(`Kumpulkan ${crystalsNeeded} kristal & 1 kunci dulu ya!`, 'info');
        }
      } else {
        sound.play('click');
      }

      setPlayer({ x: nx, y: ny });
    },
    [grid, player, size, enemies, collected, crystalsNeeded, hasKey, showToast, onWin]
  );

  useEffect(() => {
    if (grid.length === 0) return;
    const intervalTime = difficulty === 'hard' ? 680 : 980;
    const timer = setInterval(() => {
      setEnemies((prev) =>
        prev.map((e) => {
          let nx = e.x + e.dir;
          let dir = e.dir;
          if (nx < 0 || nx >= size || grid[e.y]?.[nx] !== 'grass') {
            dir = -dir;
            nx = e.x + dir;
          }
          if (nx >= 0 && nx < size && grid[e.y]?.[nx] === 'grass') {
            if (nx === player.x && e.y === player.y) {
              sound.play('hit');
              setPlayer({ x: 0, y: 0 });
              showToast('Slime menabrakmu! Kembali ke titik awal.', 'error');
            }
            return { x: nx, y: e.y, dir };
          }
          return { ...e, dir };
        })
      );
    }, intervalTime);

    return () => clearInterval(timer);
  }, [grid, size, player, difficulty, showToast]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowUp' || e.key === 'w') movePlayer(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's') movePlayer(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a') movePlayer(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') movePlayer(1, 0);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [movePlayer]);

  const progress = Math.round(((collected + (hasKey ? 1 : 0)) / (crystalsNeeded + 1)) * 100);
  const chestReady = hasKey && collected >= crystalsNeeded;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="w-full bg-amber-950/90 text-amber-100 px-4 py-2.5 rounded-2xl mb-3 border border-amber-500/50 shadow-lg">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-1.5">
          <span className="flex items-center gap-1">
            💎 Kristal: <b className="text-cyan-300">{collected}/{crystalsNeeded}</b>
          </span>
          <span className="flex items-center gap-1">
            🔑 Kunci: <b className="text-amber-300">{hasKey ? 'Ada ✅' : 'Belum'}</b>
          </span>
          <span className="text-amber-300/80">
            👣 <b>{steps}</b>
          </span>
        </div>
        <div className="w-full h-2 bg-amber-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        className={`grid gap-1.5 p-2.5 bg-gradient-to-br from-emerald-950 to-teal-950 rounded-2xl border-4 border-amber-700 shadow-2xl w-full aspect-square ${
          shaking ? 'animate-shake' : ''
        }`}
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {grid.map((row, y) =>
          row.map((tile, x) => {
            const isPlayer = player.x === x && player.y === y;
            const isEnemy = enemies.some((e) => e.x === x && e.y === y);
            const isAdjacent = Math.abs(x - player.x) + Math.abs(y - player.y) === 1 && tile !== 'wall';
            const isEnemyNext = enemies.some((e) => e.x + e.dir === x && e.y === y && grid[y][x] === 'grass');

            let bg = (x + y) % 2 === 0 ? 'bg-emerald-600' : 'bg-emerald-500/95';
            let content: React.ReactNode = null;

            if (tile === 'wall') {
              bg = 'bg-stone-600';
              content = (x + y) % 2 === 0 ? '🌲' : '🪨';
            } else if (tile === 'crystal') {
              bg = 'bg-teal-600 ring-2 ring-cyan-300/70';
              content = <span className="animate-bounce inline-block drop-shadow">💎</span>;
            } else if (tile === 'key') {
              bg = 'bg-amber-600/80 ring-2 ring-yellow-300';
              content = <span className="animate-pulse inline-block drop-shadow">🔑</span>;
            } else if (tile === 'chest') {
              bg = chestReady ? 'bg-amber-400 ring-4 ring-yellow-200 animate-pulse' : 'bg-amber-800';
              content = chestReady ? '✨🧰' : '🧰';
            }

            if (isEnemyNext && !isPlayer) bg += ' ring-2 ring-rose-400/60';
            if (isAdjacent) bg += ' ring-2 ring-white/70 hover:brightness-110';
            if (isEnemy) {
              bg = 'bg-rose-600';
              content = <span className="animate-bounce inline-block">👾</span>;
            }
            if (isPlayer) {
              bg = 'bg-sky-500 ring-2 ring-white scale-105 z-10';
              content = '🤠';
            }

            return (
              <div
                key={`${x}-${y}`}
                onClick={() => {
                  if (isAdjacent) movePlayer(Math.sign(x - player.x), Math.sign(y - player.y));
                }}
                className={`voxel-tile ${bg} rounded-lg flex items-center justify-center text-base sm:text-2xl cursor-pointer transition-all select-none`}
              >
                {content}
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-amber-200 mt-2.5 text-center font-medium">
        Ketuk kotak bercahaya di sekitar karakter atau gunakan tombol D-Pad!
      </p>

      <div className="grid grid-cols-3 gap-2 mt-2.5 w-44">
        <div />
        <button
          onClick={() => movePlayer(0, -1)}
          className="voxel-tile bg-amber-600 hover:bg-amber-500 active:scale-95 text-white p-3 rounded-xl flex justify-center items-center shadow"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div />
        <button
          onClick={() => movePlayer(-1, 0)}
          className="voxel-tile bg-amber-600 hover:bg-amber-500 active:scale-95 text-white p-3 rounded-xl flex justify-center items-center shadow"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => movePlayer(0, 1)}
          className="voxel-tile bg-amber-600 hover:bg-amber-500 active:scale-95 text-white p-3 rounded-xl flex justify-center items-center shadow"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <button
          onClick={() => movePlayer(1, 0)}
          className="voxel-tile bg-amber-600 hover:bg-amber-500 active:scale-95 text-white p-3 rounded-xl flex justify-center items-center shadow"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
