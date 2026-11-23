import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Rocket, Eye, Sparkles } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { GameGenreId, DifficultyLevel, Invitation } from '../lib/types';
import { AVATARS, COLOR_THEMES } from '../lib/constants';
import { GenreSelector } from '../components/GenreSelector';
import { sound } from '../lib/sound';

export const Editor: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const { invitations, saveInvitation, showToast } = useAppStore();

  const [formData, setFormData] = useState<Partial<Invitation>>({
    childName: '',
    age: '7',
    eventDate: '2026-12-20',
    eventTime: '10:00 - 13:00 WIB',
    locationName: '',
    mapsUrl: '',
    avatar: '🦁',
    openingMessage: 'Hai teman-teman! Selesaikan misi game seru ini dulu ya untuk membuka kartu undanganku!',
    gameGenre: 'treasure_hunt',
    difficulty: 'normal',
    targetGoal: 3,
    colorTheme: 'indigo',
    whatsapp: '',
    allowWishes: true
  });

  useEffect(() => {
    if (editId) {
      const existing = invitations.find((i) => i.id === editId);
      if (existing) {
        setFormData(existing);
      }
    }
  }, [editId, invitations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.childName || !formData.age || !formData.locationName) {
      showToast('Mohon lengkapi nama anak, usia, dan alamat lokasi acara.', 'error');
      return;
    }

    const saved = saveInvitation(formData);
    sound.play('win');
    showToast('Undangan berhasil disimpan & siap disebarkan!', 'success');
    navigate(`/dashboard`);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
          {editId ? 'Mode Edit Undangan' : 'Buat Undangan Baru'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* LANGKAH 1: PILIH GENRE */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="mb-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Langkah 1</span>
            <h2 className="font-display text-xl font-bold text-slate-900">Pilih Satu Genre Mini-Game</h2>
            <p className="text-xs text-slate-500">
              Tamu undangan akan langsung memainkan game ini untuk membuka kartu undangan resmi.
            </p>
          </div>

          <GenreSelector
            selectedGenreId={formData.gameGenre as GameGenreId}
            onSelectGenre={(genreId) => {
              sound.play('click');
              setFormData((prev) => ({ ...prev, gameGenre: genreId }));
            }}
          />
        </section>

        {/* LANGKAH 2: TINGKAT KESULITAN & TARGET */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="mb-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Langkah 2</span>
            <h2 className="font-display text-xl font-bold text-slate-900">Tingkat Kesulitan & Target Misi</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Tingkat Kesulitan</label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'normal', 'hard'] as DifficultyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      sound.play('click');
                      setFormData((p) => ({ ...p, difficulty: lvl }));
                    }}
                    className={`py-2.5 rounded-xl font-bold text-xs uppercase border-2 transition ${
                      formData.difficulty === lvl
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Target Item / Kristal / Bintang (2 - 5)
              </label>
              <input
                type="number"
                min={2}
                max={5}
                value={formData.targetGoal || 3}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, targetGoal: parseInt(e.target.value) || 3 }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </section>

        {/* LANGKAH 3: DETAIL ACARA */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Langkah 3</span>
            <h2 className="font-display text-xl font-bold text-slate-900">Detail Acara Pesta</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Anak / Yang Berulang Tahun *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Raka Pratama"
                value={formData.childName || ''}
                onChange={(e) => setFormData((p) => ({ ...p, childName: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Usia Dirayakan *</label>
              <input
                type="text"
                required
                placeholder="Contoh: 7"
                value={formData.age || ''}
                onChange={(e) => setFormData((p) => ({ ...p, age: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Acara *</label>
              <input
                type="date"
                required
                value={formData.eventDate || ''}
                onChange={(e) => setFormData((p) => ({ ...p, eventDate: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Jam Acara *</label>
              <input
                type="text"
                required
                placeholder="Contoh: 10:00 - 13:00 WIB"
                value={formData.eventTime || ''}
                onChange={(e) => setFormData((p) => ({ ...p, eventTime: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat / Lokasi Acara *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Wonderland Kids Cafe, Jl. Kaliurang"
                value={formData.locationName || ''}
                onChange={(e) => setFormData((p) => ({ ...p, locationName: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Link Google Maps</label>
              <input
                type="url"
                placeholder="https://maps.google.com/..."
                value={formData.mapsUrl || ''}
                onChange={(e) => setFormData((p) => ({ ...p, mapsUrl: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pesan Pembuka Rahasia untuk Tamu
            </label>
            <textarea
              rows={2}
              value={formData.openingMessage || ''}
              onChange={(e) => setFormData((p) => ({ ...p, openingMessage: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Avatar & Color Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Avatar Karakter Pesta</label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      sound.play('click');
                      setFormData((p) => ({ ...p, avatar: av }));
                    }}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition ${
                      formData.avatar === av
                        ? 'border-indigo-600 bg-indigo-50 scale-110 shadow-sm'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Tema Warna Kartu</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_THEMES.map((ct) => (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => {
                      sound.play('click');
                      setFormData((p) => ({ ...p, colorTheme: ct.id }));
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 ${ct.bg} ${
                      formData.colorTheme === ct.id
                        ? 'ring-4 ring-slate-300 scale-105 shadow-md'
                        : 'opacity-80'
                    }`}
                  >
                    {formData.colorTheme === ct.id ? '✓ ' : ''}
                    {ct.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp & Allow Wishes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor WhatsApp Konfirmasi RSVP (Awali 62...)
              </label>
              <input
                type="tel"
                placeholder="628123456789"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData((p) => ({ ...p, whatsapp: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowWishes !== false}
                  onChange={(e) => setFormData((p) => ({ ...p, allowWishes: e.target.checked }))}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Izinkan tamu mengirimkan ucapan & doa di kartu
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* SUBMIT BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pb-12">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-display font-bold text-base shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Rocket className="w-5 h-5" />
            {editId ? 'Perbarui Undangan' : 'Publikasikan Undangan'}
          </button>
        </div>
      </form>
    </div>
  );
};
