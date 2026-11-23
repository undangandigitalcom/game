import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Volume2, VolumeX, Plus, Sparkles, User, LayoutDashboard, Compass } from 'lucide-react';
import { sound } from '../lib/sound';
import { useAppStore } from '../lib/store';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { soundEnabled, setSoundEnabled, user } = useAppStore();

  const handleToggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-slate-900 tracking-tight block leading-none">
              GameInvite
            </span>
            <span className="text-[11px] font-medium text-indigo-600">Interactive Party SaaS</span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              isActive('/') ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Beranda
          </Link>
          <Link
            to="/dashboard"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              isActive('/dashboard') ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <Link
            to="/pricing"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              isActive('/pricing') ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Harga & Paket
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle Button */}
          <button
            onClick={handleToggleSound}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* User Badge or Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/editor"
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Buat Undangan</span>
                <span className="sm:hidden">Buat</span>
              </Link>
              <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200 text-xs font-semibold text-slate-700">
                <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
                </span>
                <span className="max-w-[100px] truncate">{user.name}</span>
              </div>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
