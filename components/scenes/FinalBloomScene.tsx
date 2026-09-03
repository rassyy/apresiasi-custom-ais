"use client"

import { motion } from "framer-motion"
import { RotateCcw, Heart } from "lucide-react"
import { ASSETS } from "@/lib/assets"
import { content } from "@/lib/content"
import { CaughtFlower, BOUQUET_SLOTS } from "@/components/scenes/FlowerGameScene"
import PetalParticles from "@/components/ui/PetalParticles"

interface FinalBloomSceneProps {
  caughtFlowers?: CaughtFlower[]
  onRestart?: () => void
}

const DEFAULT_FLOWERS: CaughtFlower[] = [
  { id: 1, src: ASSETS.flowerRose, slotIndex: 0 },
  { id: 2, src: ASSETS.flowerPeony, slotIndex: 1 },
  { id: 3, src: ASSETS.flowerSunflower, slotIndex: 2 },
  { id: 4, src: ASSETS.flowerDaisy, slotIndex: 3 },
  { id: 5, src: ASSETS.flowerLavender, slotIndex: 4 },
  { id: 6, src: ASSETS.flowerRose, slotIndex: 5 },
  { id: 7, src: ASSETS.flowerPeony, slotIndex: 6 },
]

export default function FinalBloomScene({
  caughtFlowers = [],
  onRestart,
}: FinalBloomSceneProps) {
  const displayFlowers =
    caughtFlowers.length > 0 ? caughtFlowers : DEFAULT_FLOWERS

  return (
    <motion.div
      key="final-bloom-scene"
      className="relative flex flex-col items-center justify-between min-h-[90vh] w-full px-4 py-6 select-none"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <PetalParticles count={30} />

      <div className="text-center pt-2 z-20">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fce7ec]/80 border border-[#f4a0b5]/40 mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Heart className="w-4 h-4 text-[#e27d96] fill-current" />
          <span className="font-handwriting text-base text-[#8c7365]">
            Untuk Adel tercinta
          </span>
        </motion.div>

        <motion.h2
          className="font-serif-title text-3xl sm:text-4xl text-[#4a3b32] font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Buket Pilihanmu 💐
        </motion.h2>
      </div>

      <motion.div
        className="relative w-64 sm:w-72 aspect-square flex items-center justify-center my-auto z-20"
        initial={{ scale: 0, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 15,
          delay: 0.3,
        }}
      >
        <img
          src={ASSETS.bouquetEmpty}
          alt="Buket Cantik"
          className="w-full h-full object-contain pointer-events-none drop-shadow-scrapbook relative z-10"
          draggable={false}
        />

        <div className="absolute inset-0 pointer-events-none">
          {displayFlowers.slice(0, 7).map((f, i) => {
            const slotIndex = f.slotIndex ?? i
            const slot = BOUQUET_SLOTS[slotIndex] || BOUQUET_SLOTS[0]
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
                  y: "-70%",
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
                  stiffness: 280,
                  damping: 16,
                  delay: 0.5 + i * 0.15,
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

      <div className="w-full max-w-sm flex flex-col items-center text-center pb-4 z-20">
        <motion.div
          className="p-4 rounded-xl bg-[#fffaf5]/80 backdrop-blur-xs border border-[#f4a0b5]/30 shadow-sm drop-shadow-scrapbook mb-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, type: "spring", stiffness: 120, damping: 14 }}
        >
          <p className="font-handwriting text-2xl sm:text-3xl text-[#e27d96] font-bold">
            &ldquo;{content.closingText}&rdquo;
          </p>
          <p className="font-handwriting text-base text-[#8c7365] mt-1">
            Dari Ais dengan penuh cinta
          </p>
        </motion.div>

        {onRestart && (
          <motion.button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-[#8c7365] hover:text-[#4a3b32] bg-[#fffaf5]/70 hover:bg-[#fffaf5] border border-[#f4a0b5]/40 cursor-pointer drop-shadow-xs transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Putar Kembali dari Awal</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
