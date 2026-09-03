# Apresiasi Custom (Ais → Adel) — Technical Design Spec

## 1. Overview

Produk Lutera Apresiasi: web interaktif ucapan terima kasih setelah KKN, dari Ais untuk Adel.
Single-page, navigasi antar section via auto-advance atau tombol Next.
Visual: **Soft Pink Watercolor Scrapbook**.
Pesan inti: "Makasih udah jaga hati".

### Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **Framer Motion 13**
- **Sharp** (asset conversion script, dev-only)
- **Lucide React** (icons)
- Zero WebGL/Canvas — murni DOM + CSS + Framer Motion

### Responsive Rules

- **Core Layout:** `max-w-md mx-auto` untuk kontainer utama.
- **Desktop:** UI di tengah. Area luar diisi ambient background (breathing gradient blobs) agar animasi partikel tidak terpotong.
- **Mobile:** Kontainer 100% layar.
- Tiap scene: `min-h-dvh flex items-center justify-center`.

## 2. Scene Flow (8 Scenes — State Machine)

```
envelope → bloom → cassette → flower-game → scrapbook → video → message → final-bloom
```

| # | Scene ID       | Komponen            | Navigasi Keluar                                    |
|---|----------------|---------------------|---------------------------------------------------|
| 1 | `envelope`     | `EnvelopeScene`     | Auto-advance setelah klik amplop (1.2s delay)      |
| 2 | `bloom`        | `BloomReveal` (overlay) | Auto-advance setelah climax hold (~3.5s)       |
| 3 | `cassette`     | `CassetteScene`     | Tombol Next (muncul setelah audio play)            |
| 4 | `flower-game`  | `FlowerGameScene`   | Auto-advance setelah 5+ bunga ditangkap            |
| 5 | `scrapbook`    | `ScrapbookScene`    | Tombol Next                                        |
| 6 | `video`        | `VideoScene`        | Auto-advance setelah video selesai / tombol skip   |
| 7 | `message`      | `MessageScene`      | Tombol Next                                        |
| 8 | `final-bloom`  | `FinalBloomScene`   | Terminal (tidak ada Next)                          |

### State Management

```ts
type Scene = 'envelope' | 'bloom' | 'cassette' | 'flower-game' | 'scrapbook' | 'video' | 'message' | 'final-bloom'

const SCENE_ORDER: Scene[] = ['envelope', 'bloom', 'cassette', 'flower-game', 'scrapbook', 'video', 'message', 'final-bloom']
const [currentScene, setCurrentScene] = useState<Scene>('envelope')
const advance = () => setCurrentScene(prev => SCENE_ORDER[SCENE_ORDER.indexOf(prev) + 1])
```

- Satu `currentScene` state di `page.tsx`.
- `showBloom` boolean terpisah untuk overlay BloomReveal (karena overlay harus tetap render saat scene sudah advance ke `cassette`).
- Tidak perlu state library — cukup useState.

### Transisi Antar-Scene

```tsx
<AnimatePresence mode="wait">
  {currentScene === 'envelope' && <EnvelopeScene key="envelope" ... />}
  {currentScene === 'cassette' && <CassetteScene key="cassette" ... />}
  {/* dst */}
</AnimatePresence>
```

- Default exit: `opacity: 0, scale: 0.95`, 300ms ease-out.
- Default enter: `opacity: [0,1], y: [20,0]`, spring `stiffness: 120, damping: 14`.
- BloomReveal → tidak via AnimatePresence, tapi via conditional `{showBloom && <BloomReveal />}` karena dia overlay fixed.

## 3. Component Architecture

```
app/
  page.tsx              # Scene controller + AudioController ref + showBloom state
  layout.tsx            # Metadata, fonts (Caveat, Dancing Script, Plus Jakarta Sans), preload
  globals.css           # Tailwind v4, CSS vars, keyframes, utility classes

components/
  scenes/
    EnvelopeScene.tsx    # Amplop tertutup → terbuka, trigger bloom
    CassetteScene.tsx    # Kaset pita + reel spin + audio trigger
    FlowerGameScene.tsx  # Drag-and-drop bunga ke buket kosong
    ScrapbookScene.tsx   # 5 foto polaroid jatuh spring + washi tape
    VideoScene.tsx       # Video pantai dalam frame polaroid, bg redup
    MessageScene.tsx     # Kertas lecek + handwritten appreciation text
    FinalBloomScene.tsx  # Buket + bunga hasil tangkapan + petal rain

  ui/
    AmbientLayer.tsx     # 3 breathing gradient blobs + SVG noise overlay
    BloomReveal.tsx      # Bloom bunga mekar radial (44 bunga, reuse logic)
    PetalParticles.tsx   # Hujan kelopak bunga SVG
    MusicToggle.tsx      # Floating play/mute toggle (top-right corner)
    NextButton.tsx       # Scrapbook-style next button (reusable)
    DraggableFlower.tsx  # Individual draggable flower for FlowerGameScene
    PolaroidCard.tsx     # Reusable polaroid frame + washi tape accent

lib/
  assets.ts             # Centralized asset path constants
  audio.ts              # AudioController class (play, pause, fadeIn, fadeOut, visibility)
  content.ts            # Data: appreciation text, scene metadata
  scenes.ts             # SCENE_ORDER array + Scene type

scripts/
  convert-assets.js     # PNG→WebP conversion + rename + organize media
```

## 4. Scene Detail

### 4.1 EnvelopeScene (Scene 1)

Reuse pattern dari apology-v1 `EnvelopeScene.tsx`.

- Amplop tertutup `envelope-closed.webp` di tengah (`w-64 h-64 sm:w-72 sm:h-72`).
- `PetalParticles` di background (count=18).
- Teks: "Ada sesuatu untukmu..." + hint "Ketuk amplop untuk membuka".
- User klik → swap ke `envelope-open.webp` (AnimatePresence mode="wait").
- 1200ms delay → panggil `onOpen()` yang trigger `showBloom = true`.
- Scene TIDAK auto-advance sendiri — BloomReveal yang akan trigger advance ke `cassette`.

### 4.2 BloomReveal (Scene 2 — Overlay)

Reuse dari apology-v1 `BloomReveal.tsx` dengan adaptasi:

- Ganti `FLOWER_SOURCES` ke 5 variasi: peony, rose, daisy, sunflower, lavender.
- Tetap 44 bunga, 4 region (left, center, right, organic overlay).
- Radial bloom delay formula: `Math.pow(dist / 80, 1.2) * 1.5`.
- CSS `@keyframes bloom-wiggle` inline via `<style>` tag.
- Climax hold 3500ms → `onComplete()` → advance scene ke `cassette`.
- Pink background overlay fade: `bg-[#fedfe7]`, opacity 0→1 saat bloom, 1→0 saat fall.
- 4600ms setelah onComplete → unmount BloomReveal (`showBloom = false`).

### 4.3 CassetteScene (Scene 3)

**Layout:**
- Kaset pita watercolor `cassette.webp` di tengah.
- 2 "reel" lingkaran (div rounded-full) diposisikan absolute di atas gambar kaset, di lubang reel.
- Teks: "Putar kaset ini untukmu..." di atas.

**Interaksi:**
- User klik kaset → toggle audio play/pause.
- Saat playing: kedua reel berputar via CSS `animation: cassette-spin 2s linear infinite`.
- Saat paused: reel berhenti (`animation-play-state: paused`).
- Kaset punya subtle pulse saat playing (`scale: [1, 1.02, 1]`, infinite).

**Audio:**
- `audioRef.current.fadeIn(1000)` saat pertama kali play.
- Audio terus bermain di background sepanjang sisa flow.
- `MusicToggle` muncul di pojok kanan atas mulai scene ini.

**Navigasi:**
- Tombol Next muncul 2 detik setelah audio pertama kali diputar.

### 4.4 FlowerGameScene (Scene 4)

**Konsep:**
- Bunga berjatuhan dari atas layar secara terus-menerus.
- Buket kosong `bouquet-empty.webp` di bawah layar.
- User men-drag bunga yang jatuh ke area buket untuk "menangkap" mereka.
- Bunga yang ditangkap numpuk visual di atas buket.

**Implementasi Jatuh:**
- 8-12 `DraggableFlower` spawn secara staggered (setiap 800ms spawn baru).
- Posisi awal: random x (10%-90%), y = -100px.
- Animasi jatuh: CSS `@keyframes flower-fall` → `translateY(-100px)` ke `translateY(110vh)`, durasi 4-6s (random), slight horizontal drift via `translateX` oscillation.
- Setiap bunga: random dari 5 variasi (rose, peony, daisy, sunflower, lavender).
- Random rotation dan size variation (50-80px).

**DraggableFlower Component:**
- Framer Motion `drag` enabled, `dragMomentum={false}`.
- Saat user mulai drag: pause CSS fall animation (set `animation-play-state: paused`).
- `onDragEnd`: cek posisi akhir vs bounding box buket.
  - Hit: bunga animate spring ke posisi stack di atas buket, `caught = true`.
  - Miss: bunga resume fall animation atau fade out.

**Drop Zone Detection:**
```ts
const bouquetRect = bouquetRef.current.getBoundingClientRect()
const flowerCenter = { x: event.clientX, y: event.clientY }
const isInZone = (
  flowerCenter.x > bouquetRect.left - 30 &&
  flowerCenter.x < bouquetRect.right + 30 &&
  flowerCenter.y > bouquetRect.top - 40 &&
  flowerCenter.y < bouquetRect.bottom + 20
)
```

**Stacking Visual:**
- Bunga yang ditangkap: position absolute di atas buket.
- Offset: `x: random(-25, 25)px`, `y: -(caughtIndex * 12)px`.
- Slight random rotation: `rotate: random(-20, 20)deg`.
- Z-index increment per bunga.

**Completion:**
- Setelah 5+ bunga ditangkap: 1s delay → buket pulse scale(`[1, 1.08, 1]`) → auto-advance.
- State `caughtFlowers` array disimpan untuk digunakan di `FinalBloomScene`.

**Instruksi UI:**
- Teks: "Tangkap bunga untuk buketmu!" di atas.
- Counter: "3/5 bunga" di bawah teks.

### 4.5 ScrapbookScene (Scene 5)

**Layout:**
- 5 foto polaroid (`PolaroidCard`) tersebar scattered/overlapping.
- Container `max-w-md` dengan `relative` positioning.

**PolaroidCard Component:**
- Props: `src`, `alt`, `rotation`, `washiTapePosition`.
- Structure:
  ```
  <div> (white border padding = polaroid frame)
    <img src={photo} />
    <div> (washi tape strip, absolute positioned)
  </div>
  ```
- White border: `p-2 pb-8 bg-white rounded-sm`.
- Washi tape: `washi-tape.webp` rotated, positioned at random corner.

**Animasi Masuk:**
- Staggered drop: delay `index * 0.4s`.
- `initial: { y: -400, rotate: random(-30, 30), opacity: 0, scale: 0.8 }`
- `animate: { y: targetY, rotate: finalTilt, opacity: 1, scale: 1 }`
- `transition: { type: "spring", stiffness: 100, damping: 12 }`
- Setiap polaroid memiliki slight tilt final berbeda (randomized -8 to 8 deg).

**Layout Positions (5 foto):**
```ts
const PHOTO_POSITIONS = [
  { x: '5%',  y: '8%',  rotate: -6,  z: 10 },
  { x: '35%', y: '3%',  rotate: 4,   z: 15 },
  { x: '15%', y: '40%', rotate: -3,  z: 20 },
  { x: '45%', y: '35%', rotate: 7,   z: 25 },
  { x: '25%', y: '65%', rotate: -5,  z: 30 },
]
```

**Navigasi:** Tombol Next di bawah, muncul setelah semua foto landed (delay 2.5s).

### 4.6 VideoScene (Scene 6)

**Layout:**
- Background overlay: `bg-black/40` fade in saat scene mount.
- Frame polaroid besar di tengah (sama style dengan PolaroidCard tapi lebih besar).
- `<video>` di dalam frame.

**Video:**
- Source: `/video/pantai.mp4`.
- Autoplay dengan `muted` awal + play button overlay besar.
- User klik play → video unmute dan play.
- Atau: langsung autoplay muted, dengan tombol unmute.

**Navigasi:**
- `onEnded` → 1.5s delay → auto-advance.
- Skip button (kecil, di pojok): "Lewati →".

### 4.7 MessageScene (Scene 7)

**Layout:**
- `paper-crumpled.webp` sebagai background image (object-cover, opacity overlay).
- Kertas turun dari atas: `initial: { y: -200, opacity: 0 }`, spring animate.

**Teks Apresiasi (handwritten font):**
```
Halo Adel,

Selamat ya, KKN-nya udah kelar!

Aku cuma mau bilang...
Makasih udah jaga hati buat aku selama ini.

Di tengah semua kesibukan, kamu tetep jadi tempat
yang paling nyaman buat pulang.

Makasih udah sabar, udah ngerti,
udah selalu ada meskipun aku nggak selalu bisa
ada di sana.

Kamu tuh lebih dari cukup.
Dan aku bersyukur banget punya kamu.

Dengan sayang,
Ais
```

**Animasi teks:**
- Line-by-line staggered fade-in: tiap paragraf delay `index * 0.5s`.
- `initial: { opacity: 0, y: 10 }` → `animate: { opacity: 1, y: 0 }`.
- Font: `font-handwriting` (Caveat).

**Navigasi:** Tombol Next di bawah, muncul setelah semua teks muncul.

### 4.8 FinalBloomScene (Scene 8)

**Layout:**
- Buket `bouquet-empty.webp` di tengah, dengan bunga-bunga yang ditangkap dari FlowerGameScene ditumpuk di atasnya.
- Scale up entrance: `initial: { scale: 0, opacity: 0 }` → `animate: { scale: 1, opacity: 1 }`, spring bouncy.

**Efek:**
- `PetalParticles` hujan kelopak bunga (count=30, warna pink/peach).
- Background breathing ambient tetap aktif.

**Closing text:**
- "Buket spesial dari Adel untuk Ais" (kecil, di bawah buket).
- Atau bisa dibuat: "Makasih udah jadi penjaga hatiku."

**Terminal:** Tidak ada tombol Next. Opsional: tombol kecil "Mulai Lagi" untuk restart.

## 5. Reusable UI Components

### 5.1 AmbientLayer

Reuse dari apology-v1. 3 radial gradient blobs (`blur-3xl`) yang bergerak lambat:
- Blob 1: top-left, pink, 18s cycle.
- Blob 2: bottom-right, peach, 22s cycle.
- Blob 3: center, soft pink, 20s cycle.
- SVG noise overlay: `feTurbulence` fractalNoise, opacity 4%, `mix-blend-mode: multiply`.

### 5.2 BloomReveal

Reuse dari apology-v1 dengan adaptasi sumber bunga.

### 5.3 PetalParticles

Reuse dari apology-v1. SVG petal shapes yang jatuh dari atas, random x, staggered, infinite repeat.

### 5.4 MusicToggle

Reuse dari apology-v1. Floating button top-right, Volume2/VolumeX icons. Visible mulai scene `cassette`.

### 5.5 NextButton

Reuse dari apology-v1. Scrapbook-style rounded-full button dengan ArrowRight icon bounce.

## 6. Audio System

Reuse `AudioController` class dari apology-v1:
- `play()`, `pause()`, `toggleMute()`, `fadeIn()`, `fadeOut()`.
- `subscribe()` pattern untuk reactive UI.
- Visibility change handler (pause saat tab hidden, resume saat visible).
- Audio source: `/audio/penjaga-hati.m4a`.
- Loop: `true`.
- Max volume: `0.8`.

## 7. Asset Pipeline

### 7.1 PNG → WebP Conversion

Script `scripts/convert-assets.js` menggunakan Sharp:

| Source PNG | Target WebP |
|-----------|-------------|
| `envelope cat air v2-removebackgrounds-ai.png` | `envelope-closed.webp` |
| `envelope buka cat air v2-removebackgrounds-ai.png` | `envelope-open.webp` |
| `kaset pita-removebackgrounds-ai.png` | `cassette.webp` |
| `bouqet kosong-removebackgrounds-ai.png` | `bouquet-empty.webp` |
| `pink peony-remove-bg-io.png` | `flower-peony.webp` |
| `pink pastel rose-remove-bg-io.png` | `flower-rose.webp` |
| `Open_daisy_flower_isolated_202609021859-removebackgrounds-ai.png` | `flower-daisy.webp` |
| `make_sunflower_202609021900-removebackgrounds-ai.png` | `flower-sunflower.webp` |
| `Lavender_bloom_on_white_background_202609021859-removebackgrounds-ai.png` | `flower-lavender.webp` |
| `remove_all_leaf_202609021902-removebackgrounds-ai.png` | `leaf.webp` |
| `heart red cat air.png` | `heart-red.webp` |
| `petal pink cat air.png` | `petal-pink.webp` |
| `tape pink-removebackgrounds-ai.png` | `washi-tape.webp` |
| `watercolor splash-removebackgrounds-ai.png` | `splash.webp` |
| `Watercolor_splash_texture_202608292247-remove-bg-io.png` | `splash-2.webp` |
| `kertas lecek.png` | `paper-crumpled.webp` |

Quality: 85, effort: 6.

### 7.2 Media Reorganization

| Source | Target |
|--------|--------|
| `foto ais berdua 1.jpg` | `photos/photo-1.jpg` |
| `foto ais berdua 2.jpg` | `photos/photo-2.jpg` |
| `foto ais berdua 3.jpg` | `photos/photo-3.jpg` |
| `foto cust berdua.jpeg` | `photos/photo-4.jpeg` |
| `foto pap si cewe cust.jpeg` | `photos/photo-5.jpeg` |
| `video cust ais pantai date.mp4` | `video/pantai.mp4` |
| `Nadhif Basalamah - penjaga hati (Lirik) [HxR32xRuLM0].m4a` | `audio/penjaga-hati.m4a` |

### 7.3 Centralized Asset Paths

```ts
// lib/assets.ts
export const ASSETS = {
  envelopeClosed: '/assets/envelope-closed.webp',
  envelopeOpen: '/assets/envelope-open.webp',
  cassette: '/assets/cassette.webp',
  bouquetEmpty: '/assets/bouquet-empty.webp',
  flowerPeony: '/assets/flower-peony.webp',
  flowerRose: '/assets/flower-rose.webp',
  flowerDaisy: '/assets/flower-daisy.webp',
  flowerSunflower: '/assets/flower-sunflower.webp',
  flowerLavender: '/assets/flower-lavender.webp',
  leaf: '/assets/leaf.webp',
  heartRed: '/assets/heart-red.webp',
  petalPink: '/assets/petal-pink.webp',
  washiTape: '/assets/washi-tape.webp',
  splash: '/assets/splash.webp',
  splash2: '/assets/splash-2.webp',
  paperCrumpled: '/assets/paper-crumpled.webp',
} as const

export const PHOTOS = [
  '/photos/photo-1.jpg',
  '/photos/photo-2.jpg',
  '/photos/photo-3.jpg',
  '/photos/photo-4.jpeg',
  '/photos/photo-5.jpeg',
] as const

export const VIDEO = '/video/pantai.mp4'
export const AUDIO = '/audio/penjaga-hati.m4a'
```

### 7.4 Preload Strategy

- `<link rel="preload" as="image" href="/assets/envelope-closed.webp">` di `layout.tsx`.
- Audio: `preload="metadata"` awal, full load saat user interact.
- Foto/video: lazy load (default).

## 8. CSS & Keyframes

```css
/* globals.css */
@import "tailwindcss";

:root {
  --color-accent: #f4a0b5;
  --color-accent-dark: #e27d96;
  --color-accent-light: #fce7ec;
  --color-bg: #fdf6ee;
  --color-text-main: #4a3b32;
  --color-text-muted: #8c7365;
}

@layer base {
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body {
    margin: 0; padding: 0; width: 100%;
    min-height: 100%; overflow-x: hidden;
    background-color: var(--color-bg);
    color: var(--color-text-main);
    font-family: var(--font-body), system-ui, sans-serif;
  }
}

.font-handwriting { font-family: var(--font-handwriting), cursive; }
.font-serif-title { font-family: var(--font-serif-title), cursive, serif; }

.drop-shadow-scrapbook {
  filter: drop-shadow(0 8px 16px rgba(74, 59, 50, 0.12))
          drop-shadow(0 2px 4px rgba(74, 59, 50, 0.08));
}
.drop-shadow-floating {
  filter: drop-shadow(0 12px 24px rgba(244, 160, 181, 0.25))
          drop-shadow(0 4px 8px rgba(74, 59, 50, 0.1));
}
.drop-shadow-glow {
  filter: drop-shadow(0 0 16px rgba(244, 160, 181, 0.45));
}

@keyframes cassette-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## 9. Content Data

```ts
// lib/content.ts
export interface AppreciationContent {
  sender: string
  recipient: string
  appreciationParagraphs: string[]
  closingText: string
  music: string
}

export const content: AppreciationContent = {
  sender: "Ais",
  recipient: "Adel",
  appreciationParagraphs: [
    "Halo Adel,",
    "Selamat ya, KKN-nya udah kelar!",
    "Aku cuma mau bilang...\nMakasih udah jaga hati buat aku selama ini.",
    "Di tengah semua kesibukan, kamu tetep jadi tempat yang paling nyaman buat pulang.",
    "Makasih udah sabar, udah ngerti, udah selalu ada meskipun aku nggak selalu bisa ada di sana.",
    "Kamu tuh lebih dari cukup.\nDan aku bersyukur banget punya kamu.",
    "Dengan sayang,\nAis",
  ],
  closingText: "Makasih udah jadi penjaga hatiku.",
  music: "/audio/penjaga-hati.m4a",
}
```

## 10. Fonts

Google Fonts via `next/font/google`:
- **Caveat** (400, 600, 700) → `--font-handwriting` — untuk teks handwritten.
- **Dancing Script** (500, 700) → `--font-serif-title` — untuk judul romantis.
- **Plus Jakarta Sans** (400, 500, 600) → `--font-body` — untuk body text / hint.

## 11. Dependencies

```json
{
  "dependencies": {
    "next": "^16",
    "react": "^19",
    "react-dom": "^19",
    "framer-motion": "^13",
    "lucide-react": "^1",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4"
  },
  "devDependencies": {
    "sharp": "^0.35",
    "typescript": "^7",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "postcss": "^8"
  }
}
```

## 12. Performance Rules

1. CSS Keyframes untuk animasi infinite (cassette-spin, bloom-wiggle). BUKAN Framer Motion `repeat: Infinity` pada 40+ elemen.
2. `contain: "layout style paint"` pada kontainer bloom.
3. `transform: "translateZ(0)"` pada elemen statis untuk GPU compositing.
4. `will-change: "transform, opacity"` pada elemen yang animasinya berat.
5. Unmount BloomReveal dari DOM setelah animasi jatuh selesai.
6. Semua gambar WebP (bukan PNG) untuk ukuran file kecil.
7. CSS `drop-shadow()` runtime, bukan baked-in shadow dari AI-generated image.
