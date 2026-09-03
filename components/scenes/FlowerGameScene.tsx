"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ASSETS } from "@/lib/assets"
import DraggableFlower from "@/components/ui/DraggableFlower"
import NextButton from "@/components/ui/NextButton"
import PetalParticles from "@/components/ui/PetalParticles"

export interface CaughtFlower {
  id: number
  src: string
  slotIndex: number
}

export const BOUQUET_SLOTS = [
  // 1: Top center apex
  { left: "50%", top: "15.0%", size: "35%", rotate: -2, zIndex: 10 },
  // 2: Upper left
  { left: "34%", top: "19.0%", size: "33%", rotate: -14, zIndex: 11 },
  // 3: Upper right
  { left: "66%", top: "19.0%", size: "33%", rotate: 14, zIndex: 11 },
  // 4: Outer left wing
  { left: "25%", top: "27.0%", size: "32%", rotate: -20, zIndex: 12 },
  // 5: Outer right wing
  { left: "75%", top: "27.0%", size: "32%", rotate: 20, zIndex: 12 },
  // 6: Mid left center (resting in bouquet mouth)
  { left: "40%", top: "32.0%", size: "34%", rotate: -6, zIndex: 14 },
  // 7: Mid right center (resting in bouquet mouth)
  { left: "60%", top: "32.0%", size: "34%", rotate: 6, zIndex: 14 },
]

interface FlowerGameSceneProps {
  onComplete: (flowers: CaughtFlower[]) => void
}

const FLOWER_VARIETIES = [
  ASSETS.flowerRose,
  ASSETS.flowerPeony,
  ASSETS.flowerSunflower,
  ASSETS.flowerDaisy,
  ASSETS.flowerLavender,
]

interface SpawnItem {
  id: number
  src: string
  initialX: number
  size: number
  rotation: number
  drift: number
  duration: number
}

export default function FlowerGameScene({ onComplete }: FlowerGameSceneProps) {
  const [caughtFlowers, setCaughtFlowers] = useState<CaughtFlower[]>([])
  const [spawnedFlowers, setSpawnedFlowers] = useState<SpawnItem[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const idCounter = useRef(0)

  const handleCaught = useCallback((id: number, src: string) => {
    setCaughtFlowers((prev) => {
      if (prev.length >= 7) return prev
      const slotIndex = prev.length
      const updated = [
        ...prev,
        {
          id,
          src,
          slotIndex,
        },
      ]
      if (updated.length >= 7) {
        setIsCompleted(true)
      }
      return updated
    })
  }, [])

  useEffect(() => {
    if (isCompleted) return

    const interval = setInterval(() => {
      setSpawnedFlowers((prev) => {
        if (prev.length >= 25 || isCompleted) return prev
        const id = idCounter.current++
        const src = FLOWER_VARIETIES[id % FLOWER_VARIETIES.length]
        const initialX = Math.floor(Math.random() * 66) + 16
        const size = Math.floor(Math.random() * 16) + 60
        const rotation = Math.floor(Math.random() * 60) - 30
        const drift = (Math.random() - 0.5) * 80
        const duration = Math.random() * 2 + 4.8

        return [
          ...prev,
          { id, src, initialX, size, rotation, drift, duration },
        ]
      })
    }, 850)

    return () => clearInterval(interval)
  }, [isCompleted])

  const handleSkip = () => {
    const fallbackFlowers: CaughtFlower[] = Array.from({ length: 7 }, (_, idx) => ({
      id: 100 + idx,
      src: FLOWER_VARIETIES[idx % FLOWER_VARIETIES.length],
      slotIndex: idx,
    }))
    onComplete(fallbackFlowers)
  }

  const handleContinue = () => {
    onComplete(caughtFlowers)
  }

  return (
    <motion.div
      key="flower-game-scene"
      className="relative flex flex-col items-center justify-between min-h-[85vh] w-full px-4 select-none"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center pt-2 z-20">
        <motion.h2
          className="font-serif-title text-3xl sm:text-4xl text-[#4a3b32] font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Tangkap bunga buat buket kamu!
        </motion.h2>

        <motion.div
          className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fce7ec]/90 border border-[#f4a0b5]/50 drop-shadow-scrapbook"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="font-handwriting text-xl text-[#e27d96] font-bold">
            {caughtFlowers.length} / 7 bunga terpilih
          </span>
        </motion.div>

        <p className="text-xs text-[#8c7365] mt-1.5 tracking-wide">
          {isCompleted
            ? "Buketmu sudah selesai dirangkai! Tekan tombol Lanjut di bawah 💐"
            : "Sentuh bunga yang berjatuhan untuk memasukkannya ke buket 🌸"}
        </p>
      </div>

      {!isCompleted && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {spawnedFlowers.map((flower) => (
            <DraggableFlower
              key={flower.id}
              id={flower.id}
              src={flower.src}
              initialX={flower.initialX}
              size={flower.size}
              rotation={flower.rotation}
              drift={flower.drift}
              duration={flower.duration}
              onCaught={handleCaught}
            />
          ))}
        </div>
      )}

      <div className="relative w-full max-w-sm flex flex-col items-center pb-4 z-20">
        {isCompleted && <PetalParticles count={22} />}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              className="mb-2 z-30 text-center"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-handwriting text-2xl sm:text-3xl text-[#e27d96] font-bold drop-shadow-scrapbook">
                Buket cantik siap untuk Adel! 💐
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative w-64 sm:w-72 aspect-square flex items-center justify-center select-none"
          animate={
            isCompleted
              ? {
                  scale: [1, 1.08, 1],
                  transition: { duration: 0.8, repeat: 1, ease: "easeInOut" },
                }
              : { scale: 1 }
          }
        >
          <img
            src={ASSETS.bouquetEmpty}
            alt="Buket Kosong"
            className="w-full h-full object-contain pointer-events-none drop-shadow-scrapbook relative z-10"
            draggable={false}
          />

          <div className="absolute inset-0 pointer-events-none">
            {caughtFlowers.map((f) => {
              const slot = BOUQUET_SLOTS[f.slotIndex] || BOUQUET_SLOTS[0]
              return (
                <motion.div
                  key={f.id}
                  className="absolute"
                  style={{
                    left: slot.left,
                    top: slot.top,
                    width: slot.size,
                    height: slot.size,
                    zIndex: slot.zIndex,
                  }}
                  initial={{
                    scale: 0,
                    opacity: 0,
                    x: "-50%",
                    y: "-75%",
                    rotate: slot.rotate,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: "-50%",
                    y: "-50%",
                    rotate: slot.rotate,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 360,
                    damping: 16,
                  }}
                >
                  <img
                    src={f.src}
                    alt="Bunga Buket"
                    className="w-full h-full object-contain drop-shadow-scrapbook"
                    draggable={false}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <div className="h-16 mt-3 flex items-center justify-center z-30">
          {isCompleted ? (
            <NextButton onClick={handleContinue} label="Lanjut" />
          ) : (
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-[#8c7365] hover:text-[#4a3b32] underline cursor-pointer transition-colors"
            >
              Lewati game →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
