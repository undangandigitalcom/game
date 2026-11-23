import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Gamepad2, Sparkles, ArrowRight } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { sound } from '../lib/sound';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, showToast } = useAppStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    login(name.trim(), email.trim());
    sound.play('win');
    showToast(`Selamat datang, ${name}!`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-indigo-200">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900">Masuk ke GameInvite</h2>
          <p className="text-xs text-slate-500 mt-1">
            Mulai kelola undangan ulang tahun interaktif Anda dengan mudah
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap / Panggilan</label>
            <input
              type="text"
              required
              placeholder="Contoh: Bunda Sarah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
            <input
              type="email"
              required
              placeholder="sarah@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            Lanjutkan ke Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Dengan masuk, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi GameInvite SaaS 2026.
          </p>
        </div>
      </div>
    </div>
  );
};
