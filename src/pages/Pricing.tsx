import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { PLANS } from '../lib/constants';
import { useAppStore } from '../lib/store';

export const Pricing: React.FC = () => {
  const { user, setPlan, showToast } = useAppStore();

  const handleSelectPlan = (planId: 'free' | 'pro' | 'business', planName: string) => {
    setPlan(planId);
    showToast(`Paket ${planName} berhasil diaktifkan!`, 'success');
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          PILIHAN PAKET SAAS GAMEINVITE
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 mb-3">
          Satu Harga, Pesta Penuh Kenangan
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Pilih paket yang paling sesuai dengan kebutuhan perayaan pesta Anda atau bisnis Event Organizer Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {PLANS.map((plan) => {
          const isCurrent = user?.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-gradient-to-b from-indigo-900 to-purple-950 text-white border-2 border-indigo-400 shadow-2xl scale-[1.02]'
                  : 'bg-white border border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div>
                {plan.badge && (
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold mb-4">
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
                <p className={`text-xs mb-6 ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span
                    className={`font-display font-bold text-3xl sm:text-4xl ${
                      plan.popular ? 'text-amber-300' : 'text-indigo-600'
                    }`}
                  >
                    {plan.priceFormatted}
                  </span>
                  <span className={`text-xs ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                    /{plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 text-xs">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          plan.popular ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                      />
                      <span className={plan.popular ? 'text-slate-200' : 'text-slate-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan(plan.id, plan.name)}
                className={`w-full py-3.5 rounded-2xl font-display font-bold text-sm text-center transition ${
                  isCurrent
                    ? 'bg-emerald-600 text-white cursor-default'
                    : plan.popular
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg active:scale-95'
                    : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                }`}
              >
                {isCurrent ? '✓ Paket Aktif Saat Ini' : `Pilih Paket ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 max-w-3xl mx-auto">
        <h3 className="font-display font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          Pertanyaan Umum (FAQ)
        </h3>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50">
            <h4 className="font-bold text-slate-900 mb-1">Apakah tamu harus mendownload aplikasi?</h4>
            <p className="text-slate-600 leading-relaxed">
              Sama sekali tidak! Undangan langsung berjalan lancar di browser Chrome, Safari, atau browser bawaan WhatsApp tanpa perlu download apapun.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50">
            <h4 className="font-bold text-slate-900 mb-1">Berapa lama link undangan akan aktif?</h4>
            <p className="text-slate-600 leading-relaxed">
              Untuk paket Pro, undangan dan formulir RSVP aktif hingga 1 tahun penuh, sehingga Anda bisa menyimpan ucapan doa tamu sebagai kenang-kenangan.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50">
            <h4 className="font-bold text-slate-900 mb-1">Bisakah tamu melewati game jika kesulitan?</h4>
            <p className="text-slate-600 leading-relaxed">
              Setiap mini-game telah diuji secara matematis dan BFS agar 100% dapat dimenangkan oleh anak-anak maupun orang dewasa dalam durasi 15-45 detik yang menyenangkan!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
