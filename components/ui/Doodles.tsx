"use client"

import { motion } from "framer-motion"

export function DoodleSparkle({
  className = "w-5 h-5 text-[#e27d96]",
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.6, 1, 0.6] }}
      transition={{
        duration: 2.2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    >
      {/* 4-point sparkle star */}
      <path d="M12 1 C12.5 7, 17 11.5, 23 12 C17 12.5, 12.5 17, 12 23 C11.5 17, 7 12.5, 1 12 C7 11.5, 11.5 7, 12 1 Z" />
      <circle cx="3" cy="4" r="1" />
      <circle cx="20" cy="19" r="1.2" />
    </motion.svg>
  )
}

export function DoodleHeart({
  className = "w-6 h-6 text-[#e27d96]",
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  return (
    <motion.svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={{ scale: 0.9, rotate: -6 }}
      animate={{ scale: [0.9, 1.08, 0.9], rotate: [-6, 2, -6] }}
      transition={{
        duration: 2.6,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    >
      {/* Hand-drawn sketched heart */}
      <path d="M16 26 C13 23, 4 17, 4 10 C4 5.5, 7.5 3, 11.5 3 C14.5 3, 15.5 5, 16 6.5 C16.5 5, 17.5 3, 20.5 3 C24.5 3, 28 5.5, 28 10 C28 17, 19 23, 16 26 Z" />
      <path d="M7 8 C8 6, 9.5 5, 11 5" strokeWidth="1.6" opacity="0.6" />
    </motion.svg>
  )
}

export function DoodleMusicNote({
  className = "w-6 h-6 text-[#b38870]",
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  return (
    <motion.svg
      viewBox="0 0 28 28"
      fill="currentColor"
      className={className}
      initial={{ y: 0, rotate: -8, opacity: 0.8 }}
      animate={{
        y: [-3, 3, -3],
        rotate: [-8, 8, -8],
        opacity: [0.75, 1, 0.75],
      }}
      transition={{
        duration: 2.4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    >
      {/* Double eighth note doodle */}
      <path d="M8 20 A3.5 3.5 0 1 1 5 16.5 L5 6 L19 3 L19 16 A3.5 3.5 0 1 1 16 12.5 L16 5.5 L8 7.5 L8 20 Z" />
      {/* Little sparkle accent */}
      <path
        d="M23 7 L24.5 9 L26.5 9 L25 10.5 L25.5 12.5 L23.5 11.5 L22 13 L22 11 L20 10 L22 9 Z"
        opacity="0.75"
      />
    </motion.svg>
  )
}

export function DoodleMusicSingle({
  className = "w-5 h-5 text-[#c56580]",
  delay = 0.5,
}: {
  className?: string
  delay?: number
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      initial={{ y: 0, rotate: 6, opacity: 0.8 }}
      animate={{
        y: [3, -3, 3],
        rotate: [6, -10, 6],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 2.8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    >
      {/* Single note with flag */}
      <path d="M12 18 A3.5 3.5 0 1 1 9 14.5 L9 4 C12 4, 16 5, 17 8 C15.5 8, 12 7.5, 12 7 Z" />
    </motion.svg>
  )
}

export function DoodleArrow({
  className = "w-8 h-8 text-[#e27d96]",
  direction = "down",
}: {
  className?: string
  direction?: "down" | "left" | "right" | "up"
}) {
  const rotation =
    direction === "left"
      ? -90
      : direction === "right"
      ? 90
      : direction === "up"
      ? 180
      : 0

  return (
    <motion.svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ rotate: rotation }}
      animate={{ y: [0, 4, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      {/* Playful curved hand-drawn arrow */}
      <path d="M10 4 C18 8, 22 16, 18 26" />
      <path d="M12 22 L18 26 L22 20" />
    </motion.svg>
  )
}

export function DoodleSquiggle({
  className = "w-20 h-3 text-[#f4a0b5]",
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 60 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Wavy cute underline */}
      <path d="M2 6 Q 8 2, 14 6 T 26 6 T 38 6 T 50 6 T 58 6" />
    </svg>
  )
}

export function DoodleFlowerMini({
  className = "w-5 h-5 text-[#fbcfe8]",
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.8" />
      <path d="M12 4 C10.5 6.5, 13.5 6.5, 12 9" />
      <path d="M12 15 C10.5 17.5, 13.5 17.5, 12 20" />
      <path d="M4 12 C6.5 10.5, 6.5 13.5, 9 12" />
      <path d="M15 12 C17.5 10.5, 17.5 13.5, 20 12" />
    </svg>
  )
}
