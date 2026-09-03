"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ASSETS } from "@/lib/assets"
import PetalParticles from "@/components/ui/PetalParticles"

interface EnvelopeSceneProps {
  onOpen: () => void
}

export default function EnvelopeScene({ onOpen }: EnvelopeSceneProps) {
  const [opened, setOpened] = useState(false)

  const handleOpen = () => {
    if (opened) return
    setOpened(true)
    setTimeout(() => {
      onOpen()
    }, 1200)
  }

  return (
    <motion.div
      key="envelope-scene"
      className="relative flex flex-col items-center justify-center min-h-[85vh] w-full px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.4 },
      }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <PetalParticles count={18} />

      <div className="relative flex flex-col items-center justify-center w-full max-w-sm">
        <motion.div
          className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 cursor-pointer flex items-center justify-center"
          onClick={handleOpen}
          whileHover={!opened ? { scale: 1.04, y: -4 } : {}}
          whileTap={!opened ? { scale: 0.96 } : {}}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
        >
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.img
                key="envelope-closed"
                src={ASSETS.envelopeClosed}
                alt="Amplop Tertutup"
                className="w-full h-full object-contain select-none pointer-events-none"
                style={{
                  filter: "drop-shadow(0 12px 24px rgba(74, 59, 50, 0.16))",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 140, damping: 14 }}
                draggable={false}
              />
            ) : (
              <motion.img
                key="envelope-open"
                src={ASSETS.envelopeOpen}
                alt="Amplop Terbuka"
                className="w-full h-full object-contain select-none pointer-events-none"
                style={{
                  filter: "drop-shadow(0 14px 28px rgba(74, 59, 50, 0.18))",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 12 }}
                draggable={false}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {!opened && (
          <motion.div
            className="mt-6 flex flex-col items-center gap-1 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 120, damping: 14 }}
          >
            <p className="font-handwriting text-2xl sm:text-3xl text-[#4a3b32] font-semibold tracking-wide">
              Ada sesuatu untukmu...
            </p>
            <motion.p
              className="text-xs uppercase tracking-widest text-[#8c7365] font-medium"
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Ketuk amplop untuk membuka
            </motion.p>
          </motion.div>
        )}

        {opened && (
          <motion.div
            className="mt-6 text-center z-30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 14 }}
          >
            <p className="font-handwriting text-2xl sm:text-3xl text-[#e27d96] font-bold">
              Membuka isi hati... ✨
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
