import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, Users, X, Trophy, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { InvitationCard } from '../components/InvitationCard';

export const Dashboard: React.FC = () => {
  const { invitations, deleteInvitation, rsvps, user } = useAppStore();
  const [selectedStatsInviteId, setSelectedStatsInviteId] = useState<string | null>(null);

  const selectedInvite = invitations.find((i) => i.id === selectedStatsInviteId);
  const selectedRsvps = rsvps.filter((r) => r.inviteId === selectedStatsInviteId);

  const totalViews = invitations.reduce((acc, curr) => acc + curr.viewCount, 0);
  const totalWins = invitations.reduce((acc, curr) => acc + curr.winCount, 0);
  const totalRsvps = rsvps.length;

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-6 sm:py-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide mb-3">
            🎮 DASHBOARD CREATOR SAAS
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-bold mb-2">
            Halo, {user?.name || 'Kreator Pesta'}! 👋
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl">
            Kelola seluruh undangan digital mini-game Anda, pantau jumlah kunjungan, tingkat kemenangan tamu, dan konfirmasi kehadiran RSVP secara langsung.
          </p>
        </div>
        <Link
          to="/editor"
          className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-display font-bold text-base shadow-lg flex items-center gap-2 shrink-0 transition active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Buat Undangan Baru
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-slate-900">{totalViews}</div>
            <div className="text-xs text-slate-500 font-medium">Total Tamu Mengunjungi Link</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-slate-900">{totalWins}</div>
            <div className="text-xs text-slate-500 font-medium">Misi Berhasil Ditaklukkan</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-slate-900">{totalRsvps}</div>
            <div className="text-xs text-slate-500 font-medium">Tamu Mengisi RSVP Kehadiran</div>
          </div>
        </div>
      </div>

      {/* Invitations List Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-slate-900">
          Undangan Pesta Saya ({invitations.length})
        </h2>
      </div>

      {invitations.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
          <div className="text-5xl mb-3">🎪</div>
          <h3 className="font-display text-xl font-bold text-slate-800 mb-1">Belum Ada Undangan Dibuat</h3>
          <p className="text-slate-500 text-sm mb-5 max-w-md mx-auto">
            Mulai buat undangan ulang tahun interaktif pertama Anda dengan memilih mini-game favorit si kecil!
          </p>
          <Link
            to="/editor"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Buat Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {invitations.map((inv) => (
            <InvitationCard
              key={inv.id}
              invitation={inv}
              onSelectStats={(id) => setSelectedStatsInviteId(id)}
              onDelete={(id) => {
                if (window.confirm('Yakin ingin menghapus undangan ini?')) {
                  deleteInvitation(id);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* RSVP Drawer / Detail Panel */}
      {selectedInvite && (
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm animate-pop">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Konfirmasi Kehadiran & Ucapan — {selectedInvite.childName}
              </h3>
              <p className="text-xs text-slate-500">
                Data real-time dari formulir RSVP yang diisi oleh para tamu
              </p>
            </div>
            <button
              onClick={() => setSelectedStatsInviteId(null)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedRsvps.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center bg-slate-50 rounded-2xl">
              Belum ada tamu yang mengisi RSVP untuk undangan ini.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedRsvps.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900">{r.guestName}</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        r.attending === 'Hadir'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {r.attending === 'Hadir' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {r.attending}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "{r.message || 'Selamat ulang tahun!'}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
