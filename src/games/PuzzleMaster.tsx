import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from './types';
import { sound } from '../lib/sound';

export const PuzzleMaster: React.FC<GameProps> = ({ difficulty, onWin }) => {
  const dim = difficulty === 'hard' ? 4 : 3;
  const total = dim * dim;
  const symbols = ['🎂', '🎈', '🎁', '🎉', '👑', '🧁', '🍭', '🎪', '🦄', '🌟', '🎵', '🎠', '🍦', '🧸', '🎨'];

  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [hintIdx, setHintIdx] = useState(-1);

  const initPuzzle = useCallback(() => {
    const initialTiles = Array.from({ length: total - 1 }, (_, i) => i + 1);
    initialTiles.push(0);
    const shuffleSteps = difficulty === 'easy' ? 12 : difficulty === 'hard' ? 42 : 24;
    let emptyIdx = total - 1;
    let prevIdx = -1;

    for (let s = 0; s < shuffleSteps; s++) {
      const r = Math.floor(emptyIdx / dim);
      const c = emptyIdx % dim;
      const neighbors: number[] = [];
      if (r > 0) neighbors.push(emptyIdx - dim);
      if (r < dim - 1) neighbors.push(emptyIdx + dim);
      if (c > 0) neighbors.push(emptyIdx - 1);
      if (c < dim - 1) neighbors.push(emptyIdx + 1);
      const valid = neighbors.filter((n) => n !== prevIdx);
      const next = valid[Math.floor(Math.random() * valid.length)];
      [initialTiles[emptyIdx], initialTiles[next]] = [initialTiles[next], initialTiles[emptyIdx]];
      prevIdx = emptyIdx;
      emptyIdx = next;
    }

    setTiles(initialTiles);
    setMoves(0);
    setHintIdx(-1);
  }, [dim, total, difficulty]);

  useEffect(() => {
    initPuzzle();
  }, [initPuzzle]);

  const checkWin = (currentTiles: number[]) => {
    for (let i = 0; i < total - 1; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[total - 1] === 0;
  };

  const handleTileClick = (idx: number) => {
    const emptyIdx = tiles.indexOf(0);
    const er = Math.floor(emptyIdx / dim);
    const ec = emptyIdx % dim;
    const r = Math.floor(idx / dim);
    const c = idx % dim;

    if (Math.abs(r - er) + Math.abs(c - ec) === 1) {
      const copy = [...tiles];
      [copy[idx], copy[emptyIdx]] = [copy[emptyIdx], copy[idx]];
      setTiles(copy);
      setMoves((m) => m + 1);
      setHintIdx(-1);
      sound.play('click');

      if (checkWin(copy)) {
        sound.play('win');
        setTimeout(() => onWin(), 320);
      }
    }
  };

  const showHint = () => {
    const emptyIdx = tiles.indexOf(0);
    const er = Math.floor(emptyIdx / dim);
    const ec = emptyIdx % dim;
    const neighbors: number[] = [];
    if (er > 0) neighbors.push(emptyIdx - dim);
    if (er < dim - 1) neighbors.push(emptyIdx + dim);
    if (ec > 0) neighbors.push(emptyIdx - 1);
    if (ec < dim - 1) neighbors.push(emptyIdx + 1);

    neighbors.sort((a, b) => {
      const targetA = tiles[a] - 1;
      const distA = Math.abs(Math.floor(targetA / dim) - er) + Math.abs((targetA % dim) - ec);
      const targetB = tiles[b] - 1;
      const distB = Math.abs(Math.floor(targetB / dim) - er) + Math.abs((targetB % dim) - ec);
      return distA - distB;
    });

    setHintIdx(neighbors[0]);
    sound.play('shield');
  };

  const emptyIdx = tiles.indexOf(0);
  const er = Math.floor(emptyIdx / dim);
  const ec = emptyIdx % dim;

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center bg-purple-950/90 text-purple-100 px-4 py-2.5 rounded-2xl mb-3 text-xs sm:text-sm font-bold border border-purple-400/40 shadow-lg">
        <span>
          🧩 Langkah: <b className="text-amber-300">{moves}</b>
        </span>
        <button
          onClick={showHint}
          className="px-3 py-1 rounded-lg bg-amber-400 text-purple-950 text-xs font-bold hover:bg-amber-300 active:scale-95 transition"
        >
          💡 Petunjuk
        </button>
      </div>

      <div
        className="grid gap-2 p-3 bg-purple-950 rounded-2xl border-4 border-purple-500 shadow-2xl w-full aspect-square"
        style={{ gridTemplateColumns: `repeat(${dim}, minmax(0, 1fr))` }}
      >
        {tiles.map((val, idx) => {
          if (val === 0) {
            return (
              <div
                key={idx}
                className="bg-purple-900/40 rounded-xl border-2 border-dashed border-purple-700/60"
              />
            );
          }

          const isCorrect = val === idx + 1;
          const r = Math.floor(idx / dim);
          const c = idx % dim;
          const movable = Math.abs(r - er) + Math.abs(c - ec) === 1;
          const isHinted = idx === hintIdx;

          return (
            <button
              key={idx}
              onClick={() => movable && handleTileClick(idx)}
              className={`voxel-tile rounded-xl flex flex-col items-center justify-center transition-all relative ${
                isCorrect
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
                  : 'bg-gradient-to-br from-amber-300 to-amber-500 text-purple-950'
              } ${movable ? 'cursor-pointer hover:brightness-105' : 'opacity-90'} ${
                isHinted ? 'ring-4 ring-white animate-pulse' : ''
              }`}
            >
              {isCorrect && (
                <span className="absolute top-1 right-1.5 text-[10px] font-bold">✓</span>
              )}
              <span className="text-xl sm:text-2xl leading-none">{symbols[val - 1]}</span>
              <span className="font-display font-bold text-sm sm:text-base mt-0.5">{val}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-purple-200 mt-3 text-center">
        Ubin berwarna <b className="text-emerald-300">hijau</b> berarti sudah di posisi yang tepat!
      </p>
    </div>
  );
};
