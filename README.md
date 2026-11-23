# 🎮 GameInvite SaaS — Platform Undangan Digital Mini-Game Interaktif

GameInvite adalah platform **SaaS (Software-as-a-Service)** modern yang mengubah undangan digital biasa menjadi petualangan mini-game interaktif yang seru dan tak terlupakan. 

Tamu undangan tidak hanya sekadar membaca tanggal dan tempat acara, melainkan harus menaklukkan rintangan mini-game (berdurasi 15–45 detik) sebelum gembok kartu undangan resmi terbuka, melihat hitung mundur (countdown), membuka lokasi Google Maps, serta mengirim konfirmasi kehadiran (**RSVP**) dan doa ucapan selamat.

---

## 🌟 Fitur Utama SaaS

### 1. 8 Genre Mini-Game Interaktif (100% Playable di HP & Laptop)
1. **Treasure Hunt (Voxel Grid)**: Peta petak hutan voxel dengan algoritma BFS *solvable guarantee*. Kumpulkan 3 kristal bercahaya, hindari slime musuh yang berpatroli, temukan kunci emas, dan buka peti rahasia.
2. **Jungle Runner**: Game lari ritmis dengan rintangan batu, lubang jurang, mekanisme *Double Jump* di udara, koin emas berkilau, dan pemandangan hutan tropis berlapis *parallax*.
3. **Super Platformer**: Lompat awan dengan *Coyote Time* & *Double Jump*, hindari monster landak berduri, kumpulkan bintang, dan masuki portal kemenangan.
4. **Dino Escape**: Bertahan hidup dari kejaran T-Rex purba, lompati kaktus dan api, ambil perisai pelindung aura biru, dan capai helikopter zona aman.
5. **Space Mission**: Kendalikan roket luar angkasa, hindari asteroid berputar, kumpulkan sel energi berkilau dengan tarikan magnet, dan mendarat di planet perayaan.
6. **Puzzle Master**: Teka-teki geser (3x3 atau 4x4) ubin pesta ceria dengan jaminan algoritma *solvable*, indikator ubin warna hijau bila tepat posisi, dan tombol petunjuk (*hint*).
7. **Castle Defender**: Tower defense mini 3 gelombang goblin. Bangun Menara Pemanah (50 koin) dan upgrade ke Meriam Sihir (60 koin) untuk mempertahankan kastil pesta.
8. **Memory Quest**: Permainan memori kartu balik 3D dengan sistem kombo streak berturut-turut untuk mendapatkan ekstra nyawa.

### 2. Audio Engine Tanpa Aset Eksternal (Tone.js Synthesizer)
- Menghasilkan efek audio retro/arcade secara native menggunakan sintesis gelombang audio Web Audio API (Tone.js).
- Suara koin, lompat, kena musuh, klik, kemenangan fanfare, pelindung, tembakan sihir, dan combo streak tanpa perlu download file MP3/WAV besar.
- Pengaturan tombol mute/unmute suara yang tersimpan di memori perangkat.

### 3. Editor Undangan Multi-Langkah (Creator Studio)
- **Langkah 1**: Pemilihan visual 8 genre game dengan kartu preview.
- **Langkah 2**: Konfigurasi tingkat kesulitan (*Easy*, *Normal*, *Hard*) dan target misi (2–5 item).
- **Langkah 3**: Form detail acara (Nama anak, usia ke-N, tanggal, jam acara, lokasi, link Google Maps, dan pesan pembuka rahasia).
- **Langkah 4**: Personalisasi avatar karakter lucu dan palet tema warna (Indigo, Emerald, Rose, Amber, Ocean Blue, Magic Purple).
- **Langkah 5**: Integrasi WhatsApp RSVP langsung dan tombol aktivasi dinding ucapan/doa tamu.

### 4. Pengalaman Tamu 4 Tahap (Guest Experience)
- **Tahap 1 (Intro Terkunci)**: Halaman sambutan bertema genre dengan avatar, pesan rahasia yang terkunci gembok, dan tombol "Mulai Bermain".
- **Tahap 2 (Arena Permainan)**: Permainan game responsif dengan D-Pad sentuh di ponsel atau keyboard (panah/spasi/WASD) di PC.
- **Tahap 3 (Kemenangan)**: Hujan konfeti layar penuh canvas, animasi piala, dan tombol gembok terbuka.
- **Tahap 4 (Kartu Resmi Terbuka)**:
  - Kartu undangan resmi dengan palet warna pilihan kreator.
  - Live Countdown Timer (Hari, Jam, Menit, Detik) menuju hari H.
  - Detail tanggal, jam, dan tombol Google Maps.
  - Formulir RSVP kehadiran (Hadir / Tidak Hadir) & ucapan selamat.
  - Tombol kirim konfirmasi otomatis via WhatsApp.
  - Feed ucapan & doa dari teman-teman yang telah mengisi RSVP.

### 5. Creator Dashboard & Analytics
- Statistik real-time: Total penayangan link, jumlah tamu yang memainkan game, persentase keberhasilan misi, dan total RSVP yang masuk.
- Panel rincian tamu RSVP per undangan.
- Fitur Salin Link, Edit Undangan, dan Hapus.

---

## 🏗️ Arsitektur Proyek

```
udgame/
├── server/                    # Backend API (Express.js + TypeScript)
│   ├── index.ts               # Server entry point & static file serving
│   ├── middleware/
│   │   ├── auth.ts            # Middleware otentikasi JWT / session
│   │   └── rateLimit.ts       # Rate limiting perlindungan API dari spam
│   └── routes/
│       ├── auth.ts            # Endpoint otentikasi pengguna
│       ├── invitations.ts     # CRUD REST API data undangan & slug
│       └── rsvps.ts           # Endpoint pengiriman & listing RSVP
├── src/                       # Frontend SPA (React 18 + Vite + Tailwind CSS)
│   ├── App.tsx                # Client-side routing
│   ├── main.tsx               # React mount root
│   ├── components/            # Komponen UI modular
│   │   ├── CountdownTimer.tsx # Live Countdown Timer
│   │   ├── Footer.tsx         # SaaS footer
│   │   ├── GenreSelector.tsx  # Pemilih 8 genre game
│   │   ├── InvitationCard.tsx # Kartu dashboard kreator
│   │   ├── Layout.tsx         # Wrapper tata letak utama
│   │   ├── Navbar.tsx         # Top bar navigasi & sound toggle
│   │   └── Toast.tsx          # Sistem notifikasi toast kustom
│   ├── games/                 # Engine modular 8 permainan
│   │   ├── CastleDefender.tsx
│   │   ├── DinoEscape.tsx
│   │   ├── GameEngine.tsx     # Router pemilih game aktif
│   │   ├── JungleRunner.tsx
│   │   ├── MemoryQuest.tsx
│   │   ├── PuzzleMaster.tsx
│   │   ├── SpaceMission.tsx
│   │   ├── SuperPlatformer.tsx
│   │   ├── TreasureHunt.tsx
│   │   ├── types.ts           # Definisi tipe engine game
│   │   └── useFX.ts           # Hook partikel canvas & screen shake
│   ├── lib/                   # Utilitas, State & Audio
│   │   ├── constants.ts       # Master data genre, avatar, paket harga
│   │   ├── sound.ts           # Tone.js Sound Synthesizer Singleton
│   │   ├── store.ts           # Zustand global state (dengan persistensi)
│   │   ├── types.ts           # TypeScript interfaces domain
│   │   └── utils.ts           # Helper date, slug, copy, confetti
│   ├── pages/                 # Halaman aplikasi
│   │   ├── Auth.tsx           # Halaman login/daftar
│   │   ├── Dashboard.tsx      # Dashboard kreator & manajemen RSVP
│   │   ├── Editor.tsx         # Studio pembuat undangan multi-step
│   │   ├── GuestView.tsx      # Alur 4 tahap tamu undangan (/i/:slug)
│   │   ├── Landing.tsx        # Halaman depan pemasaran SaaS
│   │   ├── NotFound.tsx       # Halaman 404
│   │   └── Pricing.tsx        # Halaman tabel paket & FAQ
│   └── styles/
│       └── globals.css        # Tailwind styling & 3D card animation
├── Dockerfile                 # Multi-stage production container build
├── docker-compose.yml         # Orkestrasi Docker container
├── package.json               # Konfigurasi dependensi
├── tsconfig.json              # Konfigurasi TypeScript
├── tailwind.config.js         # Konfigurasi tema Tailwind CSS
└── vite.config.ts             # Konfigurasi bundler Vite
```

---

## 🚀 Panduan Menjalankan Aplikasi

### Kebutuhan Sistem:
- **Node.js**: Versi 18+ (Direkomendasikan v20 atau v22)
- **NPM**: Versi 9+

### 1. Menjalankan Mode Pengembangan (Development)

Jalankan perintah berikut di terminal:

```bash
cd /Users/manbook/udgame

# Menjalankan frontend Vite server (port 3000):
npm run dev
```

Buka peramban di `http://localhost:3000`.

Untuk menjalankan server backend Express di port 3001:
```bash
npm run server
```

### 2. Membangun & Menjalankan Mode Produksi (Production)

```bash
# 1. Compile TypeScript & build bundle produksi ke folder /dist:
npm run build

# 2. Jalankan server produksi yang menyajikan API & aset web sekaligus:
npm run start
```

Aplikasi siap diakses di `http://localhost:3001`.

### 3. Menjalankan via Docker / Docker Compose

Untuk deployment ke VPS seperti DigitalOcean, AWS EC2, GCP, atau Railway:

```bash
docker compose up -d --build
```

Aplikasi akan otomatis ter-compile dan berjalan di port 3001 dengan monitoring healthcheck.

---

## 🔒 Keamanan & Praktik Terbaik Produksi
- **Sanitasi Data**: Nilai input HTML/teks dibersihkan dari potensi XSS.
- **Rate Limiting**: Endpoint API dilindungi oleh middleware pembatas frekuensi request.
- **Audio Autoplay Safety**: Audio context Tone.js hanya aktif setelah ada interaksi pertama dari pengguna (mematuhi kebijakan autoplay browser modern).
- **Offline & Low-Bandwidth Friendly**: Ukuran aset sangat ringan karena grafis dibuat menggunakan Canvas 2D murni dan efek audio disintesis secara real-time.
