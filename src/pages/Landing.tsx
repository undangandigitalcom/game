import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gamepad2, Gift, Users, Trophy, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { GAME_GENRES, PLANS } from '../lib/constants';

export const Landing: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white py-16 sm:py-24 px-4">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/25 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 mb-6 animate-pop">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>PLATFORM UNDANGAN DIGITAL INTERAKTIF #1 DI INDONESIA</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
            Undangan Pesta Jadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400">Petualangan Game</span> yang Tak Terlupakan!
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Tinggalkan link undangan statis yang membosankan. Tamu pesta harus menaklukkan rintangan mini-game seru sebelum membuka detail kartu undangan resmi & mengirim RSVP!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/editor"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-display font-bold text-lg shadow-xl shadow-orange-950/40 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Gamepad2 className="w-5 h-5" />
              Mulai Buat Undangan Gratis
            </Link>
            <Link
              to="/i/raka-7th-birthday"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2 transition"
            >
              Coba Mainkan Demo Tamu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/10 text-center">
            <div>
              <div className="font-display font-bold text-2xl sm:text-3xl text-amber-300">8 Genre</div>
              <div className="text-xs text-slate-400 mt-0.5">Mini-Game Playable</div>
            </div>
            <div>
              <div className="font-display font-bold text-2xl sm:text-3xl text-cyan-300">98.4%</div>
              <div className="text-xs text-slate-400 mt-0.5">Tamu Selesaikan Misi</div>
            </div>
            <div>
              <div className="font-display font-bold text-2xl sm:text-3xl text-emerald-300">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Responsif HP & PC</div>
            </div>
            <div>
              <div className="font-display font-bold text-2xl sm:text-3xl text-purple-300">0 Detik</div>
              <div className="text-xs text-slate-400 mt-0.5">Tanpa Download Aplikasi</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 GENRE MINI-GAME SHOWCASE */}
      <section className="py-20 px-4 bg-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Koleksi Permainan
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-3">
              8 Pilihan Genre Mini-Game Interaktif
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Sesuaikan dengan kepribadian dan tema favorit si kecil — dari petualangan dinosaurus, luar angkasa, kastil dongeng, hingga pelari hutan lincah!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GAME_GENRES.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
                    {g.emoji}
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border mb-2 ${g.badgeColor}`}>
                    {g.tagline}
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{g.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{g.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span>Kontrol Responsif</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Cara Kerja Mudah
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-12">
            Hanya 3 Langkah untuk Membuat Pesta Heboh
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-display font-bold text-xl flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                1
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Pilih Mini-Game Favorit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilih dari 8 genre permainan yang paling disukai si kecil. Atur tingkat kesulitan mudah, sedang, atau tantangan.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-left">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-display font-bold text-xl flex items-center justify-center mb-4 shadow-md shadow-purple-200">
                2
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Isi Detail Pesta Ulang Tahun</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lengkapi nama anak, usia, hari & tanggal pesta, jam, peta lokasi Google Maps, dan pesan rahasia untuk para tamu.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-display font-bold text-xl flex items-center justify-center mb-4 shadow-md shadow-emerald-200">
                3
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Bagikan & Pantau RSVP</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kirim link undangan via WhatsApp. Tamu main game, konfirmasi kehadiran RSVP secara otomatis masuk ke dashboard Anda!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION PREVIEW */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
              Pilihan Paket Terjangkau
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2 mb-3">
              Investasi Kecil untuk Momen Istimewa Seumur Hidup
            </h2>
            <p className="text-slate-400 text-sm">
              Mulai gratis, lalu upgrade jika membutuhkan fitur premium tanpa watermark dan RSVP tanpa batas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-900/90 to-purple-950 border-2 border-indigo-400 shadow-2xl scale-[1.02]'
                    : 'bg-slate-800/80 border border-slate-700'
                }`}
              >
                <div>
                  {plan.badge && (
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold mb-4">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="font-display font-bold text-xl text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-display font-bold text-3xl sm:text-4xl text-amber-300">
                      {plan.priceFormatted}
                    </span>
                    <span className="text-xs text-slate-400">/{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs text-slate-300">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/editor"
                  className={`w-full py-3.5 rounded-2xl font-display font-bold text-sm text-center transition ${
                    plan.popular
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  Pilih Paket {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
            Siap Bikin Teman-Teman Si Kecil Kagum?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Hanya butuh 3 menit untuk merancang undangan mini-game pertama Anda. Buat sekarang dan rasakan keseruannya!
          </p>
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-display font-bold text-base shadow-xl hover:bg-indigo-50 transition active:scale-95"
          >
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" /> Buat Undangan Interaktif Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
};
