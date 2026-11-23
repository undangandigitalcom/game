import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from './types';
import { sound } from '../lib/sound';
import { useAppStore } from '../lib/store';

interface CardItem {
  id: number;
  icon: string;
  matched: boolean;
  open: boolean;
}

export const MemoryQuest: React.FC<GameProps> = ({ difficulty, onWin }) => {
  const showToast = useAppStore((s) => s.showToast);
  const pairCount = difficulty === 'easy' ? 4 : difficulty === 'hard' ? 8 : 6;
  const maxMistakes = difficulty === 'easy' ? 8 : difficulty === 'hard' ? 9 : 10;
  const icons = ['🎂', '🎈', '🎁', '🦄', '🚀', '👑', '🍦', '🎸'];

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<CardItem[]>([]);
  const [matched, setMatched] = useState(0);
  const [lives, setLives] = useState(maxMistakes);
  const [streak, setStreak] = useState(0);
  const [lock, setLock] = useState(false);

  const setup = useCallback(() => {
    const selected = icons.slice(0, pairCount);
    const shuffled = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({ id: idx, icon, matched: false, open: false }));

    setCards(shuffled);
    setFlipped([]);
    setMatched(0);
    setLives(maxMistakes);
    setStreak(0);
    setLock(false);
  }, [pairCount, maxMistakes]);

  useEffect(() => {
    setup();
  }, [setup]);

  const handleCardClick = (card: CardItem) => {
    if (lock || card.open || card.matched) return;

    sound.play('click');
    const updatedCards = cards.map((c) => (c.id === card.id ? { ...c, open: true } : c));
    setCards(updatedCards);

    const newFlipped = [...flipped, { ...card, open: true }];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLock(true);
      const [c1, c2] = newFlipped;

      if (c1.icon === c2.icon) {
        // Matched
        const nextMatched = matched + 1;
        setMatched(nextMatched);
        const nextStreak = streak + 1;
        setStreak(nextStreak);

        if (nextStreak >= 2) {
          setLives((l) => l + 1);
          sound.play('combo');
          showToast(`🔥 Combo x${nextStreak}! Bonus +1 ❤️`, 'success');
        } else {
          sound.play('coin');
        }

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.icon === c1.icon ? { ...c, matched: true, open: true } : c))
          );
          setFlipped([]);
          setLock(false);

          if (nextMatched === pairCount) {
            sound.play('win');
            setTimeout(() => onWin(), 420);
          }
        }, 300);
      } else {
        // Not matched
        setStreak(0);
        const nextLives = lives - 1;
        setLives(nextLives);
        sound.play('hit');

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === c1.id || c.id === c2.id ? { ...c, open: false } : c))
          );
          setFlipped([]);
          setLock(false);

          if (nextLives <= 0) {
            showToast('Nyawa habis! Kartu diacak ulang.', 'error');
            setup();
          }
        }, 720);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center bg-teal-950/90 text-teal-100 px-4 py-2.5 rounded-2xl mb-3 text-xs sm:text-sm font-bold border border-teal-400/40 shadow-lg">
        <span>
          🃏 Cocok: <b className="text-emerald-300">{matched}/{pairCount}</b>
        </span>
        {streak >= 2 && <span className="text-amber-300 font-bold">🔥 Combo x{streak}!</span>}
        <span>
          ❤️ Nyawa: <b className="text-rose-300">{Math.max(0, lives)}</b>
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 w-full">
        {cards.map((card) => {
          const isShown = card.open || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="aspect-square perspective-1000 focus:outline-none"
            >
              <div
                className={`relative w-full h-full transform-style-3d ${
                  isShown ? 'rotate-y-180' : ''
                }`}
              >
                {/* Sisi Belakang Kartu */}
                <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-700 border-b-4 border-teal-900 shadow-lg flex items-center justify-center text-2xl sm:text-3xl text-amber-200 font-display font-bold">
                  ✨
                </div>

                {/* Sisi Depan Kartu */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl shadow-lg flex items-center justify-center text-3xl sm:text-4xl border-b-4 ${
                    card.matched
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-700 ring-2 ring-emerald-200'
                      : 'bg-white border-teal-300'
                  }`}
                >
                  {card.icon}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
