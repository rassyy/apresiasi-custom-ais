"use client"

import { motion } from "framer-motion"
import { ASSETS } from "@/lib/assets"

interface PolaroidCardProps {
  src: string
  alt?: string
  rotation?: number
  delay?: number
  tapePosition?: "top-left" | "top-right" | "top-center"
  className?: string
  widthClass?: string
}

export default function PolaroidCard({
  src,
  alt = "Foto Kenangan",
  rotation = 0,
  delay = 0,
  tapePosition = "top-left",
  className = "",
  widthClass = "w-36 sm:w-44",
}: PolaroidCardProps) {
  const getTapeStyle = () => {
    switch (tapePosition) {
      case "top-left":
        return "-top-3 -left-3 rotate-[-12deg]"
      case "top-right":
        return "-top-3 -right-3 rotate-[12deg]"
      case "top-center":
        return "-top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]"
    }
  }

  return (
    <motion.div
      className={`relative cursor-pointer select-none ${className}`}
      initial={{ y: -350, opacity: 0, scale: 0.8, rotate: rotation - 25 }}
      animate={{ y: 0, opacity: 1, scale: 1, rotate: rotation }}
      whileHover={{ scale: 1.08, zIndex: 50, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 13,
        delay,
      }}
    >
      <div
        className={`relative ${widthClass} p-2 pb-6 sm:pb-8 bg-[#fffdfa] rounded-xs shadow-md border border-[#f4e1d2]/40 drop-shadow-scrapbook transition-shadow hover:shadow-xl`}
      >
        <div className="absolute z-20 pointer-events-none w-14 sm:w-16 h-5 sm:h-6 -mt-1 drop-shadow-xs">
          <img
            src={ASSETS.washiTape}
            alt="Washi Tape"
            className={`w-full h-full object-contain ${getTapeStyle()}`}
            draggable={false}
          />
        </div>

        <div className="relative w-full aspect-square overflow-hidden rounded-xs bg-[#f8f1ea]">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover pointer-events-none"
            loading="lazy"
            draggable={false}
          />
        </div>

        <div className="mt-2 text-center">
          <span className="font-handwriting text-xs sm:text-sm text-[#8c7365]">
            ♥
          </span>
        </div>
      </div>
    </motion.div>
  )
}
