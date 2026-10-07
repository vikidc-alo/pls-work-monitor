PLS WORK MONITOR V1.6

Sistem Internal Monitoring Operasional Riksa Uji K3 — PT Prima Laksana Sarana (PLS)

PLS Work Monitor V1.6 adalah sistem dashboard internal untuk memonitor kunjungan lapangan (visit), rincian objek pengujian K3 (detail pekerjaan), kalkulasi progress berbobot unit, log kendala teknis, serta status laporan pemeriksaan K3.

1. Tech Stack

Framework: React 18+

Build Tool: Vite

Bahasa: TypeScript (Strict Mode)

Styling: Tailwind CSS (Identitas Maroon #7A1215 & Dark Green #0F4A32)

Penyimpanan Data Saat Ini: LocalStorage Service Layer dengan auto-seeding

Target Integrasi Berikutnya: Supabase (PostgreSQL + RLS)

2. Struktur Project

pls-work-monitor/
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .gitignore
├── README.md
│
└── src/
    ├── main.tsx
    └── App.tsx


3. Menjalankan Project

A. Persiapan dan Instalasi

Pastikan Node.js (v18 ke atas) telah terpasang di komputer Anda.

# 1. Install dependencies
npm install


B. Menjalankan Server Pengembangan (Dev)

# 2. Jalankan development server
npm run dev


Aplikasi otomatis terbuka di browser pada http://localhost:3000.

C. Build Produksi & Type Checking

# 3. Lakukan kompilasi TypeScript dan Vite build
npm run build


File siap saji akan dibuat di dalam folder dist/.

4. Deployment ke Vercel

Project ini siap di-deploy langsung ke Vercel tanpa konfigurasi server rumit:

Hubungkan repository GitHub Anda ke Vercel.

Vercel akan secara otomatis mendeteksi konfigurasi Vite:

Framework Preset: Vite

Build Command: npm run build

Output Directory: dist

Tidak diperlukan Environment Variable rahasia pada tahap V1.6.

5. Konsep Arsitektur Data V1.6

Prinsip Utama: 1 Visit = 1 Perusahaan + 1 Tanggal + 1 Lokasi + Multi Kategori + Multi Personel + Multi Pekerjaan/Objek.

Kalkulasi Progress Berbobot: Progress visit dihitung dari total unit selesai dibagi total target unit (SUM(Selesai) / SUM(Target) * 100%).

Single Source of Truth: Semua jadwal dan detail pekerjaan mengacu pada ID master klien dan personel aktif.