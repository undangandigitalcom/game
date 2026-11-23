import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-4xl mb-4 text-indigo-600">
        <Gamepad2 className="w-10 h-10" />
      </div>
      <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">Halaman Tidak Ditemukan (404)</h1>
      <p className="text-slate-500 text-sm max-w-sm mb-6">
        Halaman yang Anda tuju mungkin sudah dipindahkan atau alamat URL tidak sesuai.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-sm transition"
      >
        <Home className="w-4 h-4" /> Kembali ke Beranda
      </Link>
    </div>
  );
};
