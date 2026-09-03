"use client"

import { motion } from "framer-motion"

export default function AmbientLayer() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        aria-hidden="true"
        className="absolute -top-[15vw] -left-[15vw] w-[80vw] max-w-[550px] h-[80vw] max-h-[550px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 160, 181, 0.45) 0%, rgba(253, 246, 238, 0) 70%)",
          willChange: "transform",
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute -bottom-[20vw] -right-[15vw] w-[85vw] max-w-[600px] h-[85vw] max-h-[600px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(254, 215, 226, 0.5) 0%, rgba(254, 240, 225, 0) 70%)",
          willChange: "transform",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 30, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute top-1/3 left-1/4 w-[60vw] max-w-[400px] h-[60vw] max-h-[400px] rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 228, 230, 0.4) 0%, rgba(253, 246, 238, 0) 70%)",
          willChange: "transform",
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, 40, -30, 0],
          scale: [0.95, 1.08, 0.98, 0.95],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <div
        className="fixed inset-0 w-full h-full opacity-[0.035] mix-blend-multiply pointer-events-none z-50 bg-repeat"
        style={{
          backgroundImage: "url('/assets/noise.png')",
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  )
}
