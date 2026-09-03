"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface NextButtonProps {
  onClick: () => void
  label?: string
  className?: string
  disabled?: boolean
}

export default function NextButton({
  onClick,
  label = "Lanjut",
  className = "",
  disabled = false,
}: NextButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-handwriting text-xl font-bold text-[#4a3b32] bg-gradient-to-r from-[#fce7ec] to-[#f4a0b5]/60 border border-[#f4a0b5] shadow-sm cursor-pointer drop-shadow-scrapbook overflow-hidden transition-colors hover:from-[#fcd9e2] hover:to-[#f4a0b5]/80 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
    >
      <span>{label}</span>
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRight className="w-5 h-5 text-[#8c7365] group-hover:text-[#4a3b32]" />
      </motion.span>
    </motion.button>
  )
}
