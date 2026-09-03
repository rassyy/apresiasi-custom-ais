# Dokumentasi Implementasi — Lutera Apresiasi Custom (Ais → Adel)

Dokumen ini merangkum seluruh pekerjaan implementasi, arsitektur sistem, scene flow, perbaikan bug teknis, dan optimasi yang telah diselesaikan untuk proyek web interaktif **Lutera Apresiasi Custom (Ais → Adel)**.

---

## 1. Ringkasan & Konsep Proyek

- **Nama Proyek:** Lutera Apresiasi Custom (Ais → Adel)
- **Tujuan:** Web interaktif apresiasi romantis pasca-KKN dari Ais untuk Adel dengan pesan utama *"Makasih udah jadi penjaga hatiku"*.
- **Lagu Pengiring:** *"Penjaga Hati"* oleh Nadhif Basalamah (`public/audio/penjaga-hati.mp3`).
- **Tema Visual:** Soft Pink Watercolor Scrapbook.
- **Prinsip Layout & Responsive:**
  - Desain *mobile-first* dengan kontainer utama `max-w-md mx-auto` di tengah layar.
  - Layer ambient background desktop/mobile (`AmbientLayer`) terdiri dari radial gradient blobs dan tekstur SVG noise fractal, sehingga partikel animasi yang meluber keluar layar tetap terlihat estetik tanpa terpotong tajam.
  - Zero Three.js / WebGL / Canvas — mengandalkan performa murni Framer Motion 13 dan CSS GPU Keyframes.

---

## 2. Tech Stack & Dependensi

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Framework** | Next.js 16.3.4 (App Router, Turbopack) | Server & Client Components modern |
| **Library UI** | React 19 | State & Hooks manajemen reaktif |
| **Language** | TypeScript 5.8.2 | Strict type safety tanpa error kompilasi |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`) | CSS Variables, drop shadow kustom, utility classes |
| **Animasi** | Framer Motion 13 + CSS Keyframes | Spring transitions, keyframes `cassette-spin` & `flower-fall` |
| **Audio** | Web Audio API (`AudioController`) | Custom class dengan volume fade in/out & auto visibility handling |
| **Ikon** | Lucide React | Ikon modern, ringan, dan tree-shakeable |

---

## 3. Alur Scene (8-Scene Flow)

Urutan scene dikendalikan secara terpusat oleh state machine di `lib/scenes.ts` dan `app/page.tsx`:

```ts
export const SCENE_ORDER = [
  "envelope",
  "cassette",
  "flower-game",
  "scrapbook",
  "video",
  "message",
  "final-bloom",
] as const
```

### Scene 1: Envelope (`components/scenes/EnvelopeScene.tsx`)
- Menampilkan amplop cat air tertutup (`envelope-closed.webp`) dengan hint teks *"Ada sesuatu untukmu..."*.
- Interaksi: Saat amplop diklik, amplop berganti ke animasi amplop terbuka (`envelope-open.webp`), memunculkan teks *"Membuka isi hati... ✨"*, lalu mentrigger overlay mekar bunga (`BloomReveal`).

### Scene 2: Bloom Reveal Overlay (`components/ui/BloomReveal.tsx`)
- Overlay transisi dramatis yang merender 44 bunga cat air (5 variasi: Rose, Peony, Sunflower, Daisy, Lavender).
- Tahap 1: Bunga mekar memancar secara radial dari tengah amplop.
- Tahap 2: Climax hold selama 3.5 detik.
- Tahap 3: Air terjun bunga berjatuhan (*waterfall drop*) ke bawah layar. Saat bunga berjatuhan, scene kaset (`CassetteScene`) langsung ter-mount di latar belakang dan terungkap secara mulus.

### Scene 3: Cassette Scene (`components/scenes/CassetteScene.tsx`)
- Menampilkan kaset pita vintage watercolor (`cassette-tape.webp`) dengan 2 reel tengah yang berputar berkat animasi CSS `@keyframes cassette-spin`.
- Interaksi: Klik kaset memutar lagu *"Penjaga Hati"* dengan Web Audio API `fadeIn(1000ms)`.
- Navigasi: Setelah lagu diputar selama 2 detik, tombol **Lanjut →** (`NextButton`) muncul di bawah kaset. Terdapat kontrol mengambang di pojok kanan atas (`MusicToggle`) untuk mute/unmute audio.

### Scene 4: Flower Game (`components/scenes/FlowerGameScene.tsx` & `DraggableFlower.tsx`)
- Mini-game interaktif merangkai buket bunga. Bunga-bunga cat air berjatuhan secara acak dari atas layar dengan drifting anggun.
- **Mekanisme Tap-to-Catch:** Pengguna cukup men-tap atau mengklik salah satu bunga yang jatuh. Sekali sentuh, bunga langsung terangkai ke dalam kerucut buket di bawah layar dengan animasi spring pop-in.
- **Mahkota Bunga Seimbang (Lush Flower Crown):** Bunga-bunga menempati 5 slot simetris yang mengisi mulut kerucut buket secara pas dan rimbun.
- **Penyelesaian:** Setelah 5 bunga terkumpul (`5 / 5 bunga terpilih`), muncul teks *"Buket cantik siap untuk Adel! 💐"* dan tombol **Lanjut →** untuk melanjutkan ke album foto.

### Scene 5: Scrapbook Scene (`components/scenes/ScrapbookScene.tsx` & `PolaroidCard.tsx`)
- Menampilkan kolase 5 foto kenangan masa KKN dan kebersamaan.
- Foto dibalut frame polaroid putih dengan aksen selotip cat air (*washi tape*) di atasnya.
- Efek kemunculan bertingkat (*staggered drop*) dengan rotasi alami acak (-6° hingga +5°) dan pegas Framer Motion.

### Scene 6: Video Scene (`components/scenes/VideoScene.tsx`)
- Menampilkan video kenangan kencan di pantai (`public/video/pantai.mp4`) di dalam frame polaroid besar.
- **Sinkronisasi Audio Cerdas:** Saat video dimainkan, audio latar belakang otomatis di-pause agar suara video terdengar jelas. Begitu video selesai atau tombol lewati ditekan, musik latar otomatis resume dengan `fadeIn(800ms)`.

### Scene 7: Message Scene (`components/scenes/MessageScene.tsx`)
- Tekstur kertas lecek (*crumpled paper*) turun dari atas layar dengan efek pegas.
- Memuat teks apresiasi tulisan tangan (*handwriting font*) dari Ais untuk Adel atas perjuangan menyelesaikan KKN dan selalu menjaga hati.
- Paragraf teks muncul bertahap (*staggered fade-in*) untuk memberikan kesan membaca surat yang hangat dan intim.

### Scene 8: Final Bloom Reward (`components/scenes/FinalBloomScene.tsx`)
- Menampilkan kembali buket bunga hasil pilihan pengguna yang mekar membesar di tengah layar dengan animasi spring scale-up.
- Diiringi hujan kelopak bunga rimbun (`PetalParticles count=30`) dan badge kutipan penutup: *"Makasih udah jadi penjaga hatiku. Dari Ais dengan penuh cinta"*.
- Dilengkapi tombol putar ulang (*restart*) untuk kembali ke scene awal.

---

## 4. Daftar Perbaikan Bug & Optimasi Teknis

### A. Blank Screen Setelah Bloom Reveal
- **Masalah:** Setelah animasi mekar amplop selesai, layar menjadi putih kosong (*blank white screen*) dan navigasi macet.
- **Akar Penyebab:** Array `SCENE_ORDER` memuat elemen `"bloom"`. Ketika `BloomReveal` selesai, scene berpindah ke `"bloom"`. Namun di `app/page.tsx`, scene `"bloom"` tidak merender komponen apapun di dalam `AnimatePresence` karena bloom adalah fixed overlay.
- **Solusi:** Menghapus `"bloom"` dari `SCENE_ORDER` di `lib/scenes.ts`. Alur scene diubah langsung dari `"envelope"` ke `"cassette"`. Sementara `BloomReveal` menjatuhkan bunga (*waterfall drop*), scene kaset di belakangnya otomatis ter-mount dan terbuka secara mulus.

### B. Hydration Mismatch Warning pada Root Layout
- **Masalah:** Muncul console error React: *"A tree hydrated but some attributes of the server rendered HTML didn't match the client properties"*.
- **Akar Penyebab:** Ekstensi browser atau font Google yang diinjeksi saat SSR Next.js menyebabkan perbedaan atribut/class pada tag `<html>` dan `<body>`.
- **Solusi:** Menambahkan `suppressHydrationWarning` pada elemen `<html>` dan `<body>` di `app/layout.tsx`.

### C. Refactoring Flower Game: Mekanisme Tap-to-Catch
- **Masalah:** Mekanisme drag-and-drop sebelumnya sulit digunakan di layar sentuh HP (touch) dan rawan meleset saat bunga bergerak jatuh.
- **Solusi:** Mekanisme diubah menjadi **sekali sentuh/klik** (`onClick` dan `onTouchStart`) di `components/ui/DraggableFlower.tsx`. Pengguna cukup mengetuk bunga yang jatuh, dan bunga tersebut otomatis terangkai ke buket.

### D. Presisi Posisi & Proporsi Bunga di Buket (`BOUQUET_SLOTS`)
- **Masalah:** Bunga tampak terlalu kecil (~28%), tenggelam di bagian bawah kerucut buket, dan menumpuk miring di sisi kanan sehingga bagian kiri buket kosong melompong.
- **Solusi:**
  - Mengubah wadah buket menjadi rasio 1:1 (`aspect-square`), presisi dengan file gambar `bouquet-empty.webp`.
  - Memperbesar ukuran kelopak bunga menjadi 44%–47% agar mekar penuh (*lush floral crown*).
  - Mengkalibrasi 5 slot koordinat buket:
    - **Slot 1 (Puncak Atas):** `left: 50%`, `top: 25.4%`, size `47%` — memahkotai ujung buket.
    - **Slot 2 (Sayap Kiri):** `left: 37%`, `top: 35.2%`, size `46%` — mengisi lipatan kiri secara seimbang.
    - **Slot 3 (Sayap Kanan):** `left: 63.5%`, `top: 35.2%`, size `46%` — mengisi lipatan kanan secara simetris.
    - **Slot 4 (Jantung Tengah):** `left: 50%`, `top: 42.0%`, size `44%` — mengisi bagian tengah buket.
    - **Slot 5 (Bawah Depan):** `left: 50%`, `top: 50.8%`, size `38%` — bertengger di bibir lipatan kertas depan.
  - Menyamakan koordinat ini pada `FlowerGameScene.tsx` dan `FinalBloomScene.tsx`.

### E. Penambahan Tombol Lanjut pada Mini-Game Buket
- **Masalah:** Saat bunga selesai dirangkai, sistem melakukan auto-advance terburu-buru tanpa tombol, sehingga pengguna tidak sempat melihat hasil buketnya.
- **Solusi:** Menambahkan komponen `<NextButton>` di bawah buket setelah status 5/5 tercapai, sehingga pengguna bebas menikmati hasil karya sebelum menekan tombol **Lanjut**.

---

## 5. Struktur Direktori Proyek

```text
apresiasi-custom-ais/
├── app/
│   ├── favicon.ico
│   ├── globals.css          # Tailwind v4, CSS vars, keyframes (cassette-spin, flower-fall)
│   ├── layout.tsx           # Google Fonts (Caveat, Dancing Script, Plus Jakarta Sans), suppressHydrationWarning
│   └── page.tsx             # Scene controller, state machine, audio controller integration
├── components/
│   ├── scenes/
│   │   ├── EnvelopeScene.tsx
│   │   ├── CassetteScene.tsx
│   │   ├── FlowerGameScene.tsx
│   │   ├── ScrapbookScene.tsx
│   │   ├── VideoScene.tsx
│   │   ├── MessageScene.tsx
│   │   └── FinalBloomScene.tsx
│   └── ui/
│       ├── AmbientLayer.tsx     # Radial gradient blobs + SVG noise
│       ├── BloomReveal.tsx      # Radial bloom animation (5 variasi bunga)
│       ├── DraggableFlower.tsx  # Tap-to-catch falling flower component
│       ├── MusicToggle.tsx      # Floating audio toggle
│       ├── NextButton.tsx       # Scrapbook style next button
│       ├── PetalParticles.tsx   # Falling petal rain
│       └── PolaroidCard.tsx     # Polaroid photo card with washi tape
├── docs/
│   ├── design.md            # Technical design specification
│   └── plan.md              # Implementation plan (Phase 0 - 9)
├── lib/
│   ├── assets.ts            # Centralized asset paths
│   ├── audio.ts             # AudioController class with Web Audio API
│   ├── content.ts           # Appreciation message texts & closing quotes
│   └── scenes.ts            # SCENE_ORDER array & Scene types
├── public/
│   ├── assets/              # WebP assets (envelope, cassette, bouquet, flowers, washi, paper)
│   ├── audio/               # Background music (penjaga-hati.mp3)
│   ├── photos/              # 5 Polaroid photos
│   └── video/               # Pantai date video (pantai.mp4)
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## 6. Hasil Verifikasi Sistem

1. **TypeScript Typecheck:**
   ```bash
   npx tsc --noEmit
   # Exit Code: 0 (Zero type errors)
   ```
2. **ESLint Linting:**
   ```bash
   npm run lint
   # Exit Code: 0 (No warnings or errors across app, components, lib)
   ```
3. **Production Bundle Build:**
   ```bash
   npm run build
   # Exit Code: 0 (Static prerendered successfully)
   ```
4. **Browser Testing:**
   - Flow lengkap dari amplop ➔ mekar radial ➔ pemutaran lagu kaset ➔ tap-to-catch buket bunga ➔ kolase scrapbook ➔ video pantai ➔ surat kertas lecek ➔ buket akhir mekar teruji berjalan mulus tanpa error konsol.
