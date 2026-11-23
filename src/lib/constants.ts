import { GameGenre, ColorTheme, PlanFeature } from './types';

export const GAME_GENRES: GameGenre[] = [
  {
    id: 'treasure_hunt',
    name: 'Treasure Hunt',
    tagline: 'Petualangan Voxel Mencari Harta Karun',
    description: 'Jelajahi peta hutan voxel, kumpulkan kristal berkilau, temukan kunci emas, dan buka peti rahasia pesta!',
    icon: 'gem',
    emoji: '💎',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    themeStyle: {
      bg: 'from-emerald-800 via-teal-900 to-slate-900',
      card: 'bg-amber-50 border-4 border-amber-700 shadow-[6px_6px_0px_#78350f]',
      accent: '#d97706',
      fontStyle: 'voxel'
    },
    controlsHint: 'Gunakan tombol panah / D-Pad atau ketuk petak di samping karakter untuk melangkah!'
  },
  {
    id: 'jungle_runner',
    name: 'Jungle Runner',
    tagline: 'Lari Lincah Menembus Hutan Rimba',
    description: 'Berlari secepat kilat di jalur rimba, lompati batu & lubang jurang, kumpulkan koin hingga garis finis!',
    icon: 'trees',
    emoji: '🌴',
    badgeColor: 'bg-green-100 text-green-800 border-green-300',
    themeStyle: {
      bg: 'from-green-700 via-emerald-800 to-lime-950',
      card: 'bg-lime-50 border-4 border-green-700 shadow-xl',
      accent: '#15803d',
      fontStyle: 'jungle'
    },
    controlsHint: 'Ketuk layar atau tekan Spasi untuk melompat (bisa Double Jump di udara)!'
  },
  {
    id: 'super_platformer',
    name: 'Super Platformer',
    tagline: 'Lompat Awan & Kumpulkan Bintang',
    description: 'Lompati platform melayang, hindari monster landak berduri, kumpulkan bintang emas, dan capai portal kemenangan!',
    icon: 'star',
    emoji: '⭐',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    themeStyle: {
      bg: 'from-sky-500 via-blue-600 to-indigo-800',
      card: 'bg-white border-4 border-sky-500 shadow-xl',
      accent: '#0284c7',
      fontStyle: 'arcade'
    },
    controlsHint: 'Gunakan tombol Kiri, Kanan, dan Lompat di layar (atau tombol panah keyboard).'
  },
  {
    id: 'dino_escape',
    name: 'Dino Escape',
    tagline: 'Lari dari Kejaran T-Rex Purba!',
    description: 'T-Rex raksasa mengejar dari belakang! Terus berlari, lompati kaktus, ambil perisai pelindung sampai helikopter evakuasi!',
    icon: 'flame',
    emoji: '🦖',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    themeStyle: {
      bg: 'from-orange-700 via-amber-800 to-stone-900',
      card: 'bg-orange-50 border-4 border-orange-600 shadow-xl',
      accent: '#ea580c',
      fontStyle: 'dino'
    },
    controlsHint: 'Ketuk layar atau tekan Spasi untuk melompat! Ambil perisai biru agar kebal benturan.'
  },
  {
    id: 'space_mission',
    name: 'Space Mission',
    tagline: 'Misi Roket Menuju Planet Pesta',
    description: 'Kendalikan pesawat roket, hindari asteroid berputar, kumpulkan sel energi berkilau, dan mendarat di planet tujuan!',
    icon: 'rocket',
    emoji: '🚀',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    themeStyle: {
      bg: 'from-slate-950 via-indigo-950 to-purple-950',
      card: 'bg-slate-900 text-white border-2 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.4)]',
      accent: '#6366f1',
      fontStyle: 'scifi'
    },
    controlsHint: 'Geser sentuhan atau gunakan tombol Naik / Turun untuk mengarahkan roket!'
  },
  {
    id: 'puzzle_master',
    name: 'Puzzle Master',
    tagline: 'Pecahkan Kode & Gerbang Rahasia',
    description: 'Susun ubin angka bergambar pesta berurutan dengan tepat untuk membuka gerbang rahasia pesta!',
    icon: 'puzzle',
    emoji: '🧩',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    themeStyle: {
      bg: 'from-purple-800 via-fuchsia-900 to-slate-900',
      card: 'bg-purple-50 border-4 border-purple-600 shadow-xl',
      accent: '#9333ea',
      fontStyle: 'royal'
    },
    controlsHint: 'Ketuk kotak di sebelah ruang kosong untuk menggeser. Gunakan petunjuk bila butuh bantuan!'
  },
  {
    id: 'castle_defender',
    name: 'Castle Defender',
    tagline: 'Pertahankan Kastil Kerajaan Pesta!',
    description: 'Kumpulkan koin emas, bangun menara pemanah & meriam sihir, dan halau 3 gelombang pasukan goblin!',
    icon: 'castle',
    emoji: '🏰',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    themeStyle: {
      bg: 'from-rose-900 via-red-950 to-slate-900',
      card: 'bg-rose-50 border-4 border-rose-700 shadow-xl',
      accent: '#be123c',
      fontStyle: 'medieval'
    },
    controlsHint: 'Ketuk slot menara di samping jalur untuk membangun pertahanan & upgrade ke meriam sihir!'
  },
  {
    id: 'memory_quest',
    name: 'Memory Quest',
    tagline: 'Uji Ingatan Kartu Ajaib',
    description: 'Buka kartu satu per satu, ingat posisi ikon pesta, dan cocokkan semua pasangan sebelum nyawa habis!',
    icon: 'brain',
    emoji: '🃏',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    themeStyle: {
      bg: 'from-teal-700 via-cyan-800 to-blue-900',
      card: 'bg-cyan-50 border-4 border-teal-600 shadow-xl',
      accent: '#0d9488',
      fontStyle: 'magic'
    },
    controlsHint: 'Ketuk dua kartu untuk membuka dan mencocokkan gambar. Dapatkan Combo streak untuk ekstra nyawa!'
  }
];

export const AVATARS = ['🎂', '🦁', '🦄', '🚀', '🦖', '👸', '🦸‍♂️', '🐼', '🦊', '🤖', '🧚‍♀️', '👑', '🎪', '🧸'];

export const COLOR_THEMES: ColorTheme[] = [
  { id: 'indigo', name: 'Royal Indigo', primary: '#4f46e5', bg: 'bg-indigo-600', light: 'bg-indigo-50 text-indigo-700' },
  { id: 'emerald', name: 'Jungle Green', primary: '#059669', bg: 'bg-emerald-600', light: 'bg-emerald-50 text-emerald-700' },
  { id: 'rose', name: 'Candy Pink', primary: '#e11d48', bg: 'bg-rose-600', light: 'bg-rose-50 text-rose-700' },
  { id: 'amber', name: 'Golden Sun', primary: '#d97706', bg: 'bg-amber-600', light: 'bg-amber-50 text-amber-700' },
  { id: 'sky', name: 'Ocean Blue', primary: '#0284c7', bg: 'bg-sky-600', light: 'bg-sky-50 text-sky-700' },
  { id: 'purple', name: 'Magic Purple', primary: '#9333ea', bg: 'bg-purple-600', light: 'bg-purple-50 text-purple-700' },
];

export const PLANS: PlanFeature[] = [
  {
    id: 'free',
    name: 'Starter',
    priceFormatted: 'Gratis',
    period: 'selamanya',
    description: 'Cocok untuk mencoba membuat 1 undangan pesta interaktif keluarga.',
    features: [
      '1 Undangan Aktif',
      'Pilihan 3 Genre Mini-Game',
      'Batas hingga 30 RSVP',
      'Audio & Sound FX Lengkap',
      'Integrasi WhatsApp RSVP',
      'Subdomain gameinvite.id/i/nama'
    ],
    maxInvitations: 1,
    unlimitedRSVP: false,
    allGenres: false,
    customBranding: false,
    analytics: false,
  },
  {
    id: 'pro',
    name: 'Pro Party Maker',
    badge: 'Paling Populer',
    popular: true,
    priceFormatted: 'Rp 49.000',
    period: 'per acara',
    description: 'Pilihan favorit para orang tua untuk pesta ulang tahun spektakuler anak.',
    features: [
      'Hingga 5 Undangan Aktif',
      'Bebas Pilih Seluruh 8 Genre Mini-Game',
      'RSVP & Ucapan Tamu Tanpa Batas',
      'Kustomisasi Target & Tingkat Kesulitan',
      'Ekspor Data Tamu ke Excel/CSV',
      'Statistik Real-time Jumlah Tamu & Tingkat Kemenangan',
      'Bebas Watermark GameInvite',
      'Tautan Aktif Selama 1 Tahun Penuh'
    ],
    maxInvitations: 5,
    unlimitedRSVP: true,
    allGenres: true,
    customBranding: true,
    analytics: true,
  },
  {
    id: 'business',
    name: 'Event Organizer & Agency',
    priceFormatted: 'Rp 149.000',
    period: 'per bulan',
    description: 'Solusi lengkap bagi Event Organizer, Birthday Planner, dan fotografer.',
    features: [
      'Undangan Aktif Tanpa Batas',
      'Semua Fitur Pro Termasuk',
      'Custom Domain / Subdomain Klien',
      'White-label Logo Sendiri di Footer',
      'Dashboard Multi-Event Manajemen Klien',
      'Akses API Webhook & Notifikasi WA Otomatis',
      'Dukungan Prioritas WhatsApp 24/7'
    ],
    maxInvitations: 9999,
    unlimitedRSVP: true,
    allGenres: true,
    customBranding: true,
    analytics: true,
  }
];
