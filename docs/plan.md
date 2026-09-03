# Apresiasi Custom (Ais → Adel) — Implementation Plan

Referensi: `docs/design.md` untuk detail arsitektur dan spesifikasi teknis.
Referensi kode: `D:\PROJECT\Lutera\apology-v1\` untuk komponen yang di-reuse.

## Phase 0: Asset Pipeline & Project Scaffold

### Task 0.1: Run convert-assets.js
- Script sudah tersedia di `scripts/convert-assets.js`.
- Jalankan: `node scripts/convert-assets.js`.
- Verifikasi: semua file `.webp` tercipta di `public/assets/`, folder `photos/`, `video/`, `audio/` terisi.

### Task 0.2: Scaffold Next.js 16 Project
- `npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"` (atau manual init karena folder sudah ada).
- Install dependencies:
  ```
  npm install next@latest react@latest react-dom@latest framer-motion@latest lucide-react tailwindcss@latest @tailwindcss/postcss postcss
  npm install -D sharp typescript @types/node @types/react @types/react-dom
  ```
- Konfigurasi `postcss.config.mjs`:
  ```js
  export default { plugins: { "@tailwindcss/postcss": {} } }
  ```
- Konfigurasi `tsconfig.json` path alias `@/*`.

### Task 0.3: Base Files
- **`app/globals.css`** — Copy dari design.md Section 8 (CSS vars, keyframes, utility classes).
- **`app/layout.tsx`** — Fonts (Caveat, Dancing Script, Plus Jakarta Sans), metadata, preload envelope, body classes.
- **`lib/scenes.ts`** — SCENE_ORDER array + Scene type.
- **`lib/assets.ts`** — Asset path constants (dari design.md Section 7.3).
- **`lib/audio.ts`** — Copy dari apology-v1, ganti import path audio.
- **`lib/content.ts`** — Appreciation content (dari design.md Section 9).

**Acceptance:** `npm run dev` berhasil, halaman kosong dengan background `--color-bg` dan font ter-load.

---

## Phase 1: Base Layer + Scene Controller

### Task 1.1: AmbientLayer.tsx
- Copy dari apology-v1 `components/ui/AmbientLayer.tsx`.
- Tidak perlu modifikasi.

### Task 1.2: page.tsx (Scene Controller)
- Implementasi state machine: `currentScene`, `showBloom`, `advance()`.
- `AudioController` ref (init dengan content.music).
- `AnimatePresence mode="wait"` dengan conditional render per scene.
- `MusicToggle` visible mulai scene `cassette`.
- Placeholder: render nama scene sementara untuk scene yang belum diimplementasi.

**Acceptance:** Bisa klik "advance" placeholder di setiap scene, transisi fade berjalan.

---

## Phase 2: EnvelopeScene + BloomReveal

### Task 2.1: PetalParticles.tsx
- Copy dari apology-v1 `components/ui/PetalParticles.tsx`.

### Task 2.2: EnvelopeScene.tsx
- Copy dari apology-v1, adaptasi:
  - Teks: "Ada sesuatu untukmu..." (bukan "Ada surat untukmu...").
  - Hint: "Ketuk amplop untuk membuka".
  - Opened text: "Membuka isi hati... ✨".
  - Callback prop: `onOpen` → trigger showBloom di page.tsx.

### Task 2.3: BloomReveal.tsx
- Copy dari apology-v1, adaptasi:
  - `FLOWER_SOURCES`: 5 bunga (peony, rose, daisy, sunflower, lavender) bukan 3.
  - Round-robin `idCounter % 5`.
  - `onComplete` callback tetap sama.

**Acceptance:** Klik amplop → bloom mekar → auto-advance ke scene berikutnya.

---

## Phase 3: CassetteScene

### Task 3.1: CassetteScene.tsx
- Buat komponen baru (tidak ada di apology-v1).
- Layout: kaset pita `cassette.webp` di tengah.
- 2 reel divs (rounded-full, absolute positioned di atas lubang reel kaset).
  - Posisi reel: perlu fine-tune berdasarkan gambar kaset.
  - Size: ~24x24px atau ~20% dari width kaset.
- State: `isPlaying` boolean.
- Klik kaset → toggle play/pause:
  - Play: `audioRef.current.fadeIn(1000)`, reel spin (`animation: cassette-spin`).
  - Pause: `audioRef.current.pause()`, reel stop.
- Tombol Next muncul 2s setelah first play.
- Props: `onNext`, `audioRef`.

### Task 3.2: MusicToggle.tsx
- Copy dari apology-v1.
- Visible saat `currentScene !== 'envelope' && currentScene !== 'bloom'` (dari page.tsx prop).

### Task 3.3: NextButton.tsx
- Copy dari apology-v1.

**Acceptance:** Klik kaset → audio play, reel spin. Next button muncul. Audio terus bermain di scene berikutnya.

---

## Phase 4: FlowerGameScene

### Task 4.1: DraggableFlower.tsx
- Props: `id`, `src`, `initialX`, `size`, `rotation`, `onCaught(id, src)`, `bouquetRef`.
- Render: `motion.img` dengan `drag` enabled.
- CSS animation `flower-fall` untuk gerakan jatuh continuous.
- `onDragStart`: pause fall animation.
- `onDragEnd`: check collision dengan bouquetRef bounding box.
  - Hit: panggil `onCaught`, animate spring ke stack position.
  - Miss: resume fall atau fade out.
- Bunga yang sudah caught: `pointerEvents: "none"`, tidak bisa di-drag lagi.

### Task 4.2: FlowerGameScene.tsx
- State: `caughtFlowers` array, `spawnedFlowers` array.
- `useEffect` interval: spawn DraggableFlower baru setiap 800ms (max 15 total).
- Buket `bouquet-empty.webp` di bawah (fixed bottom, centered).
- Ref: `bouquetRef` untuk collision detection.
- Teks instruksi: "Tangkap bunga untuk buketmu!".
- Counter: "{caught}/5 bunga".
- Completion: caught >= 5 → 1.5s delay → auto-advance.
- Pass `caughtFlowers` data ke parent (page.tsx) via callback untuk FinalBloomScene.
- Tambah CSS `@keyframes flower-fall` ke globals.css.

**Acceptance:** Bunga jatuh, bisa di-drag ke buket, counter naik, auto-advance setelah 5.

---

## Phase 5: ScrapbookScene

### Task 5.1: PolaroidCard.tsx
- Props: `src`, `alt`, `rotation`, `delay`, `washiTapeRotation`.
- Structure: white border div (polaroid frame) + img + washi tape.
- White border: `p-2 pb-8 bg-white rounded-sm shadow-md`.
- Washi tape: `washi-tape.webp` absolute, rotated, at top-left or top-right corner.
- Framer Motion entrance: spring drop from y=-400.

### Task 5.2: ScrapbookScene.tsx
- Render 5 PolaroidCard dari PHOTOS array.
- Positions & rotations predefined (scattered layout).
- Staggered entrance delay: `index * 0.4s`.
- Props: `onNext`.
- Next button muncul 2.5s setelah mount.

**Acceptance:** 5 foto jatuh dengan spring bounce, washi tape accent, Next button muncul.

---

## Phase 6: VideoScene

### Task 6.1: VideoScene.tsx
- Polaroid frame besar di tengah (reuse PolaroidCard style, tapi inline).
- `<video>` dengan `src="/video/pantai.mp4"`, `playsInline`, `controls={false}`.
- Play button overlay: ikon Play besar, klik → video play + unmute.
- Background overlay: `bg-black/40` fade in.
- `onEnded`: 1.5s delay → advance.
- Skip button: kecil, di pojok, "Lewati →".
- Props: `onNext`.

**Acceptance:** Video play dalam frame polaroid, background gelap, auto-advance atau skip.

---

## Phase 7: MessageScene

### Task 7.1: MessageScene.tsx
- Background: `paper-crumpled.webp` sebagai texture (object-cover, slight opacity).
- Kertas container: entrance spring dari `y: -200`.
- Content: `content.appreciationParagraphs` rendered line-by-line.
- Font: `font-handwriting` (Caveat).
- Staggered text fade-in: tiap paragraf delay `index * 0.6s`.
- `initial: { opacity: 0, y: 10 }` → `animate: { opacity: 1, y: 0 }`.
- Props: `onNext`.
- Next button muncul setelah semua teks visible.

**Acceptance:** Kertas turun, teks muncul satu-satu, estetik handwritten.

---

## Phase 8: FinalBloomScene

### Task 8.1: FinalBloomScene.tsx
- Props: `caughtFlowers` (array of flower src + positions dari FlowerGameScene).
- Buket `bouquet-empty.webp` di tengah, scale-up entrance (spring bouncy).
- Bunga yang ditangkap ditumpuk di atas buket (rerender dari data).
- `PetalParticles` count=30 di background.
- Closing text: `content.closingText` di bawah buket.
- Optional: tombol "Mulai Lagi" kecil di paling bawah (restart semua).

**Acceptance:** Buket + bunga muncul dengan animasi, kelopak hujan, pesan closing.

---

## Phase 9: Polish & Integration

### Task 9.1: Wiring semua scene di page.tsx
- Hapus semua placeholder.
- Pastikan `caughtFlowers` state di page.tsx, pass ke FlowerGameScene dan FinalBloomScene.
- Verifikasi flow lengkap 1-8 berjalan smooth.

### Task 9.2: Responsive testing
- Mobile: semua scene fit dalam `max-w-md`.
- Desktop: ambient layer visible di area luar container.
- Video dan foto tidak overflow container.

### Task 9.3: Performance check
- BloomReveal unmount setelah fall selesai.
- FlowerGameScene: cleanup interval pada unmount.
- Audio: visibility change handler aktif.
- No CSS animation running on unmounted scenes.

### Task 9.4: Final linting
- `npm run lint`.
- `npx tsc --noEmit`.

**Acceptance:** Full flow 1-8 tanpa error, responsive, performant.

---

## Execution Order Summary

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9
```

Setiap phase bisa di-verify secara independen sebelum lanjut ke phase berikutnya. Phase 2-8 bisa dikerjakan paralel setelah Phase 1 selesai (karena scene controller sudah ready), tapi disarankan sequential untuk memastikan flow transisi antar-scene smooth.
