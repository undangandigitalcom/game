import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Share2, Users, Edit3, Trash2, Eye, Trophy } from 'lucide-react';
import { Invitation } from '../lib/types';
import { GAME_GENRES } from '../lib/constants';
import { formatIndoDate, copyToClipboard } from '../lib/utils';
import { useAppStore } from '../lib/store';

interface InvitationCardProps {
  invitation: Invitation;
  onSelectStats: (id: string) => void;
  onDelete: (id: string) => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onSelectStats,
  onDelete
}) => {
  const showToast = useAppStore((s) => s.showToast);
  const genre = GAME_GENRES.find((g) => g.id === invitation.gameGenre) || GAME_GENRES[0];
  const shareUrl = `${window.location.origin}/i/${invitation.slug || invitation.id}`;

  const handleShare = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      showToast('Tautan undangan berhasil disalin!', 'success');
    } else {
      showToast('Gagal menyalin tautan.', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${genre.badgeColor}`}>
            {genre.emoji} {genre.name}
          </span>
          <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
            {invitation.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl shrink-0">
            {invitation.avatar || '🎂'}
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">
              {invitation.childName}
            </h3>
            <p className="text-xs text-slate-500">
              Ulang Tahun ke-{invitation.age} • {formatIndoDate(invitation.eventDate)}
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 mb-4 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
          <span className="flex items-center gap-1 font-medium">
            <Eye className="w-3.5 h-3.5 text-slate-400" /> {invitation.viewCount} Dilihat
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium">
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> {invitation.winCount} Tamu Lolos
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/i/${invitation.slug || invitation.id}`}
            target="_blank"
            className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Play className="w-3.5 h-3.5" /> Buka Undangan
          </Link>
          <button
            onClick={handleShare}
            className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5" /> Salin Link
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onSelectStats(invitation.id)}
            className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 transition"
          >
            <Users className="w-3.5 h-3.5" /> Tamu
          </button>
          <Link
            to={`/editor?id=${invitation.id}`}
            className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 transition"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Link>
          <button
            onClick={() => onDelete(invitation.id)}
            className="py-2 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs flex items-center justify-center gap-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
