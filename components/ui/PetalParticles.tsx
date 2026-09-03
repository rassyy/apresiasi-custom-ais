"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PETALS } from "@/lib/assets"

interface PetalItem {
  id: number
  src: string
  x: number
  size: number
  duration: number
  delay: number
  drift: number
  rotateStart: number
  rotateEnd: number
}

interface PetalParticlesProps {
  count?: number
  className?: string
}

export default function PetalParticles({
  count = 22,
  className = "",
}: PetalParticlesProps) {
  const [petals, setPetals] = useState<PetalItem[]>([])

  useEffect(() => {
    // Generate optimized petals using all available petal assets
    const generated: PetalItem[] = Array.from({ length: count }, (_, i) => {
      const duration = 5.5 + (i % 5) * 0.7 // 5.5s to 8.3s
      return {
        id: i,
        src: PETALS[i % PETALS.length],
        x: ((i * 100) / count + (Math.random() * 6 - 3) + 100) % 100, // evenly distributed across screen width
        size: 16 + (i % 4) * 4, // 16px, 20px, 24px, 28px
        duration,
        // Staggered delays so petals are continuously floating without gaps or initial burst
        delay: -(i * (duration / count)),
        drift: ((i % 2 === 0 ? 1 : -1) * (30 + (i % 3) * 20)),
        rotateStart: (i * 45) % 360 - 180,
        rotateEnd: ((i * 45) % 360 - 180) + 360,
      }
    })
    setPetals(generated)
  }, [count])

  if (petals.length === 0) return null

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-15 select-none ${className}`}
      aria-hidden="true"
    >
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute -top-12 pointer-events-none"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 1.1,
            willChange: "transform, opacity",
            transform: "translateZ(0)",
          }}
          initial={{
            y: -50,
            x: 0,
            opacity: 0,
            scale: 0.75,
            rotate: p.rotateStart,
          }}
          animate={{
            y: "115vh",
            x: [0, p.drift * 0.6, p.drift, p.drift * 0.3],
            opacity: [0, 0.85, 0.9, 0],
            scale: [0.75, 1, 0.95, 0.7],
            rotate: p.rotateEnd,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <img
            src={p.src}
            alt=""
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </motion.div>
      ))}
    </div>
  )
}

