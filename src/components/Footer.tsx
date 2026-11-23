import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Heart, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-base text-white">GameInvite</span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-4">
              Ubah undangan ulang tahun biasa menjadi petualangan mini-game seru yang berkesan bagi setiap tamu undangan.
            </p>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Siap Produksi 2026
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-3">Produk</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">8 Genre Mini-Game</Link>
              </li>
              <li>
                <Link to="/editor" className="hover:text-white transition">Pembuat Undangan</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition">Paket & Harga</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">Dashboard Creator</Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-3">Mini-Game Populer</h4>
            <ul className="space-y-2 text-slate-400">
              <li>💎 Treasure Hunt (Voxel)</li>
              <li>🌴 Jungle Runner (Parallax)</li>
              <li>🦖 Dino Escape (Survival)</li>
              <li>🚀 Space Mission (Sci-Fi)</li>
              <li>🏰 Castle Defender (Tower)</li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-3">Bantuan & Komunitas</h4>
            <p className="mb-3">Butuh bantuan pengaturan pesta atau kolaborasi Event Organizer?</p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition font-medium"
            >
              <Zap className="w-3.5 h-3.5" /> Chat WhatsApp Support
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-500">
          <p>© 2026 GameInvite SaaS. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-1 text-slate-400">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" /> untuk pesta anak Indonesia
          </div>
        </div>
      </div>
    </footer>
  );
};
