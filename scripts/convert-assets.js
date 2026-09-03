const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets')

const CONVERT_MAP = {
  'envelope cat air v2-removebackgrounds-ai.png': 'envelope-closed.webp',
  'envelope buka cat air v2-removebackgrounds-ai.png': 'envelope-open.webp',
  'kaset pita-removebackgrounds-ai.png': 'cassette.webp',
  'bouqet kosong-removebackgrounds-ai.png': 'bouquet-empty.webp',
  'pink peony-remove-bg-io.png': 'flower-peony.webp',
  'pink pastel rose-remove-bg-io.png': 'flower-rose.webp',
  'Open_daisy_flower_isolated_202609021859-removebackgrounds-ai.png': 'flower-daisy.webp',
  'make_sunflower_202609021900-removebackgrounds-ai.png': 'flower-sunflower.webp',
  'Lavender_bloom_on_white_background_202609021859-removebackgrounds-ai.png': 'flower-lavender.webp',
  'remove_all_leaf_202609021902-removebackgrounds-ai.png': 'leaf.webp',
  'heart red cat air.png': 'heart-red.webp',
  'petal pink cat air.png': 'petal-pink.webp',
  'tape pink-removebackgrounds-ai.png': 'washi-tape.webp',
  'watercolor splash-removebackgrounds-ai.png': 'splash.webp',
  'Watercolor_splash_texture_202608292247-remove-bg-io.png': 'splash-2.webp',
  'kertas lecek.png': 'paper-crumpled.webp',
}

const MEDIA_MOVES = {
  'foto ais berdua 1.jpg': 'photos/photo-1.jpg',
  'foto ais berdua 2.jpg': 'photos/photo-2.jpg',
  'foto ais berdua 3.jpg': 'photos/photo-3.jpg',
  'foto cust berdua.jpeg': 'photos/photo-4.jpeg',
  'foto pap si cewe cust.jpeg': 'photos/photo-5.jpeg',
  'video cust ais pantai date.mp4': 'video/pantai.mp4',
  'Nadhif Basalamah - penjaga hati (Lirik) [HxR32xRuLM0].m4a': 'audio/penjaga-hati.m4a',
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

async function convertPngToWebp() {
  console.log('=== Converting PNG → WebP ===')

  for (const [src, dst] of Object.entries(CONVERT_MAP)) {
    const srcPath = path.join(ASSETS_DIR, src)
    const dstPath = path.join(ASSETS_DIR, dst)

    if (!fs.existsSync(srcPath)) {
      console.log(`SKIP (not found): ${src}`)
      continue
    }

    if (fs.existsSync(dstPath)) {
      console.log(`SKIP (exists): ${dst}`)
      continue
    }

    await sharp(srcPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(dstPath)

    const srcSize = fs.statSync(srcPath).size
    const dstSize = fs.statSync(dstPath).size
    const saved = ((1 - dstSize / srcSize) * 100).toFixed(1)
    console.log(`OK: ${src} → ${dst} (${(srcSize / 1024).toFixed(0)}KB → ${(dstSize / 1024).toFixed(0)}KB, -${saved}%)`)
  }
}

async function moveMedia() {
  console.log('')
  console.log('=== Moving & Renaming Media ===')

  for (const [src, dst] of Object.entries(MEDIA_MOVES)) {
    const srcPath = path.join(PUBLIC_DIR, src)
    const dstPath = path.join(PUBLIC_DIR, dst)

    if (!fs.existsSync(srcPath)) {
      console.log(`SKIP (not found): ${src}`)
      continue
    }

    if (fs.existsSync(dstPath)) {
      console.log(`SKIP (exists): ${dst}`)
      continue
    }

    ensureDir(path.dirname(dstPath))
    fs.copyFileSync(srcPath, dstPath)

    const size = fs.statSync(dstPath).size
    console.log(`OK: ${src} → ${dst} (${(size / 1024).toFixed(0)}KB)`)
  }
}

async function main() {
  await convertPngToWebp()
  await moveMedia()
  console.log('')
  console.log('Done!')
}

main().catch(console.error)
