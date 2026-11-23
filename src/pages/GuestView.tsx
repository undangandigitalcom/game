import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Unlock, Volume2, VolumeX, Calendar, Clock, MapPin, Navigation, Send, MessageCircle } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { GAME_GENRES, COLOR_THEMES } from '../lib/constants';
import { formatIndoDate, launchConfetti } from '../lib/utils';
import { sound } from '../lib/sound';
import { GameEngine } from '../games/GameEngine';
import { CountdownTimer } from '../components/CountdownTimer';

export const GuestView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getInvitationBySlugOrId, getRSVPsByInviteId, addRSVP, incrementStats, soundEnabled, setSoundEnabled, showToast } =
    useAppStore();

  const [stage, setStage] = useState<'intro' | 'playing' | 'victory' | 'unlocked'>('intro');
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'Hadir' | 'Tidak Hadir'>('Hadir');
  const [rsvpMsg, setRsvpMsg] = useState('');

  const invitation = getInvitationBySlugOrId(slug || 'demo-raka');

  useEffect(() => {
    if (invitation) {
      incrementStats(invitation.id, 'view');
    }
  }, [invitation?.id]);

  if (!invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white">
        <h1 className="font-display text-3xl font-bold mb-2">Undangan Tidak Ditemukan</h1>
        <p className="text-slate-400 text-sm mb-6">Tautan undangan mungkin telah kedaluwarsa atau salah diketik.</p>
        <Link to="/" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const genre = GAME_GENRES.find((g) => g.id === invitation.gameGenre) || GAME_GENRES[0];
  const colorCfg = COLOR_THEMES.find((c) => c.id === invitation.colorTheme) || COLOR_THEMES[0];
  const isDarkSciFi = invitation.gameGenre === 'space_mission';
  const rsvpList = getRSVPsByInviteId(invitation.id);

  const handleToggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  const handleStartGame = () => {
    sound.play('click');
    incrementStats(invitation.id, 'play');
    setStage('playing');
  };

  const handleGameWin = () => {
    incrementStats(invitation.id, 'win');
    setStage('victory');
    launchConfetti();
  };

  const handleUnlockInvitation = () => {
    sound.play('win');
    setStage('unlocked');
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    addRSVP({
      inviteId: invitation.id,
      guestName: rsvpName.trim(),
      attending: rsvpStatus,
      message: rsvpMsg.trim()
    });

    sound.play('win');
    showToast('Terima kasih! Konfirmasi kehadiran Anda berhasil dikirim.', 'success');
    setRsvpName('');
    setRsvpMsg('');
  };

  const handleWhatsAppShare = () => {
    if (!invitation.whatsapp) return;
    const phone = invitation.whatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Halo! Saya *${rsvpName.trim() || 'Tamu Undangan'}* mengonfirmasi *${rsvpStatus}* di acara ulang tahun *${invitation.childName}* ke-${invitation.age}.\n\nUcapan: ${rsvpMsg.trim() || 'Selamat ulang tahun!'}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${genre.themeStyle.bg} text-white selection:bg-amber-400 selection:text-slate-950`}>
      {/* Sound Toggle Header */}
      <div className="p-4 flex justify-between items-center max-w-4xl mx-auto w-full">
        <Link to="/" className="text-xs font-semibold text-white/70 hover:text-white flex items-center gap-1.5">
          ✨ GameInvite
        </Link>
        <button
          onClick={handleToggleSound}
          className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white/60" />}
        </button>
      </div>

      {/* STAGE 1: INTRO (TERKUNCI) */}
      {stage === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center p-5 text-center relative overflow-hidden">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl animate-pop">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/20 flex items-center justify-center text-5xl mb-4 animate-float shadow-lg">
              {invitation.avatar || '🎂'}
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold mb-3">
              🔒 UNDANGAN RAHASIA TERKUNCI
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
              Pesta Ulang Tahun {invitation.childName} ke-{invitation.age}!
            </h1>
            <p className="text-white/85 text-sm mb-6 leading-relaxed">
              "{invitation.openingMessage}"
            </p>

            <div className="bg-black/25 rounded-2xl p-4 mb-6 text-left border border-white/10">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-2xl">{genre.emoji}</span>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/60 font-bold">Misi Pembuka Undangan</p>
                  <p className="font-display font-bold text-base text-amber-300">{genre.name}</p>
                </div>
              </div>
              <p className="text-xs text-white/80 mt-1">{genre.description}</p>
            </div>

            <button
              onClick={handleStartGame}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-display font-bold text-lg shadow-xl shadow-orange-950/40 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Play className="w-6 h-6 fill-current" />
              MULAI BERMAIN
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: ARENA PLAYING */}
      {stage === 'playing' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{genre.emoji}</span>
              <div>
                <h2 className="font-display font-bold text-base sm:text-lg leading-none">{genre.name}</h2>
                <span className="text-[11px] text-white/75">Taklukkan misi untuk membuka gembok undangan!</span>
              </div>
            </div>
          </div>

          <GameEngine
            genreId={invitation.gameGenre}
            difficulty={invitation.difficulty}
            targetGoal={invitation.targetGoal}
            onWin={handleGameWin}
          />
        </div>
      )}

      {/* STAGE 3: VICTORY SCREEN */}
      {stage === 'victory' && (
        <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
          <div className="max-w-md w-full bg-white/15 backdrop-blur-md border-2 border-amber-300/60 rounded-3xl p-8 shadow-2xl animate-pop">
            <div className="text-6xl mb-3 animate-bounce">🏆</div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold mb-2">
              MISI BERHASIL DISELESAIKAN!
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">Hebat! Kamu Berhasil!</h2>
            <p className="text-white/85 text-sm mb-6">
              Gembok rahasia telah terbuka. Sekarang kamu bisa melihat detail pesta ulang tahun <b>{invitation.childName}</b>!
            </p>
            <div className="space-y-3">
              <button
                onClick={handleUnlockInvitation}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-display font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Unlock className="w-5 h-5" />
                BUKA UNDANGAN RESMI
              </button>
              <button
                onClick={handleStartGame}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 font-semibold text-xs transition"
              >
                🔄 Mainkan Ulang Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: UNLOCKED OFFICIAL INVITATION */}
      {stage === 'unlocked' && (
        <div className="flex-1 py-8 px-4">
          <div className="max-w-xl mx-auto space-y-6 animate-pop">
            {/* KARTU UNDANGAN UTAMA */}
            <div className={`${genre.themeStyle.card} rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl`}>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                  isDarkSciFi ? 'bg-indigo-500/30 text-indigo-200' : colorCfg.light
                }`}
              >
                {genre.emoji} UNDANGAN RESMI • {genre.name.toUpperCase()}
              </div>

              <div
                className={`w-24 h-24 mx-auto rounded-3xl ${
                  isDarkSciFi ? 'bg-indigo-900' : 'bg-amber-100'
                } flex items-center justify-center text-5xl mb-4 shadow-inner`}
              >
                {invitation.avatar || '🎂'}
              </div>

              <p className={`text-xs uppercase tracking-widest font-bold ${isDarkSciFi ? 'text-indigo-300' : 'text-slate-500'} mb-1`}>
                Kamu Diundang Ke Pesta Ulang Tahun
              </p>
              <h1 className={`font-display text-3xl sm:text-4xl font-bold ${isDarkSciFi ? 'text-white' : 'text-slate-900'} mb-1`}>
                {invitation.childName}
              </h1>
              <div className={`inline-block px-4 py-1 rounded-full ${colorCfg.bg} text-white font-display font-bold text-sm mb-5`}>
                Merayakan Usia ke-{invitation.age} Tahun! 🎉
              </div>

              {/* Countdown Timer */}
              <CountdownTimer targetDateStr={invitation.eventDate} isDark={isDarkSciFi} />

              {/* Detail Waktu & Tempat */}
              <div
                className={`space-y-3 text-left ${
                  isDarkSciFi ? 'bg-slate-800/60 text-slate-200' : 'bg-white/80 text-slate-700'
                } p-4 rounded-2xl border ${isDarkSciFi ? 'border-indigo-500/30' : 'border-slate-200/80'} mb-5`}
              >
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold uppercase opacity-60">Hari & Tanggal</p>
                    <p className="font-bold text-sm">{formatIndoDate(invitation.eventDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold uppercase opacity-60">Waktu Acara</p>
                    <p className="font-bold text-sm">{invitation.eventTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold uppercase opacity-60">Lokasi Pesta</p>
                    <p className="font-bold text-sm">{invitation.locationName}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                {invitation.mapsUrl && (
                  <a
                    href={invitation.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 py-3.5 px-4 rounded-2xl ${colorCfg.bg} hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition`}
                  >
                    <Navigation className="w-4 h-4" /> BUKA GOOGLE MAPS
                  </a>
                )}
                <button
                  onClick={handleStartGame}
                  className={`py-3.5 px-4 rounded-2xl ${
                    isDarkSciFi ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'
                  } font-bold text-xs flex items-center justify-center gap-1.5 transition`}
                >
                  🎮 Main Lagi
                </button>
              </div>
            </div>

            {/* FORM RSVP & UCAPAN TAMU */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200">
              <h3 className="font-display text-xl font-bold mb-1">Konfirmasi Kehadiran (RSVP)</h3>
              <p className="text-xs text-slate-500 mb-4">
                Kirim konfirmasi kehadiran dan doa terbaik untuk {invitation.childName}
              </p>

              <form onSubmit={handleRsvpSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Tamu / Keluarga *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Keluarga Budi & Dika"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Kehadiran *</label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as 'Hadir' | 'Tidak Hadir')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Hadir">✅ Ya, Saya Akan Hadir!</option>
                    <option value="Tidak Hadir">❌ Maaf, Tidak Bisa Hadir</option>
                  </select>
                </div>
                {invitation.allowWishes && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ucapan & Doa Ulang Tahun</label>
                    <textarea
                      rows={2}
                      placeholder="Selamat ulang tahun! Semoga panjang umur & sehat selalu..."
                      value={rsvpMsg}
                      onChange={(e) => setRsvpMsg(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" /> Kirim RSVP & Ucapan
                  </button>
                  {invitation.whatsapp && (
                    <button
                      type="button"
                      onClick={handleWhatsAppShare}
                      className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageCircle className="w-4 h-4" /> Kirim via WhatsApp
                    </button>
                  )}
                </div>
              </form>

              {invitation.allowWishes && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h4 className="font-display font-bold text-sm text-slate-800 mb-3">💌 Ucapan & Doa Teman-Teman ({rsvpList.length})</h4>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {rsvpList.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-2xl">
                        Jadilah yang pertama mengirimkan doa untuk {invitation.childName}!
                      </p>
                    ) : (
                      rsvpList.map((r) => (
                        <div key={r.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900">{r.guestName}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                r.attending === 'Hadir'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {r.attending}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 italic">{r.message || 'Selamat ulang tahun!'}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
