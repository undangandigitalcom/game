import React from 'react';
import { GameGenreId } from '../lib/types';
import { GAME_GENRES } from '../lib/constants';
import { Check } from 'lucide-react';

interface GenreSelectorProps {
  selectedGenreId: GameGenreId;
  onSelectGenre: (genreId: GameGenreId) => void;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenreId,
  onSelectGenre
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {GAME_GENRES.map((g) => {
        const active = selectedGenreId === g.id;
        return (
          <div
            key={g.id}
            onClick={() => onSelectGenre(g.id)}
            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all ${
              active
                ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-200 scale-[1.01]'
                : 'border-slate-200 hover:border-indigo-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{g.emoji}</span>
              {active && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900">{g.name}</h3>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{g.description}</p>
          </div>
        );
      })}
    </div>
  );
};
