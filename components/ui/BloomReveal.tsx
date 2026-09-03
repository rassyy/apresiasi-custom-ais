"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ASSETS } from "@/lib/assets"

interface BloomRevealProps {
  onComplete: () => void
}

interface FlowerItem {
  id: number
  src: string
  xPct: number
  yPct: number
  sizeVmax: number
  rotate: number
  scaleX: number
  delay: number
  fallDelay: number
  fallY: number
  fallDuration: number
  zIndex: number
  wiggleDuration: number
}

const FLOWER_SOURCES = [
  ASSETS.flowerPeony,
  ASSETS.flowerRose,
  ASSETS.flowerDaisy,
  ASSETS.flowerSunflower,
  ASSETS.flowerLavender,
]

export default function BloomReveal({ onComplete }: BloomRevealProps) {
  const [isFalling, setIsFalling] = useState(false)
  const hasCompleted = useRef(false)

  const flowers: FlowerItem[] = useMemo(() => {
    const list: FlowerItem[] = []
    let idCounter = 0

    const placements = [
      // === LEFT REGION ===
      { x: -6, y: -6, size: 38, z: 12 },
      { x: 15, y: -8, size: 36, z: 14 },
      { x: 14, y: 7, size: 38, z: 28 },
      { x: 22, y: 8, size: 44, z: 34 },
      { x: 28, y: 14, size: 40, z: 35 },
      { x: -8, y: 25, size: 42, z: 16 },
      { x: 16, y: 35, size: 36, z: 24 },
      { x: 2, y: 55, size: 34, z: 28 },
      { x: -6, y: 75, size: 42, z: 18 },
      { x: 18, y: 80, size: 36, z: 26 },
      { x: -4, y: 106, size: 38, z: 15 },
      { x: 22, y: 108, size: 36, z: 17 },

      // === CENTER-LEFT TO CENTER-RIGHT REGION ===
      { x: 36, y: -6, size: 38, z: 15 },
      { x: 55, y: -8, size: 38, z: 16 },
      { x: 32, y: 28, size: 34, z: 25 },
      { x: 48, y: 22, size: 35, z: 27 },
      { x: 44, y: 52, size: 30, z: 32 },
      { x: 32, y: 75, size: 32, z: 24 },
      { x: 52, y: 78, size: 36, z: 29 },
      { x: 38, y: 102, size: 36, z: 18 },
      { x: 56, y: 105, size: 38, z: 19 },

      // === RIGHT REGION ===
      { x: 74, y: -6, size: 45, z: 20 },
      { x: 72, y: 20, size: 42, z: 26 },
      { x: 74, y: 48, size: 45, z: 28 },
      { x: 72, y: 74, size: 45, z: 27 },
      { x: 74, y: 98, size: 45, z: 21 },

      { x: 86, y: -6, size: 55, z: 22 },
      { x: 84, y: 26, size: 60, z: 30 },
      { x: 86, y: 50, size: 55, z: 35 },
      { x: 84, y: 76, size: 60, z: 32 },
      { x: 86, y: 100, size: 55, z: 25 },

      { x: 100, y: -4, size: 65, z: 23 },
      { x: 98, y: 18, size: 70, z: 34 },
      { x: 102, y: 40, size: 75, z: 33 },
      { x: 99, y: 65, size: 75, z: 38 },
      { x: 102, y: 85, size: 70, z: 37 },
      { x: 100, y: 105, size: 65, z: 28 },

      // === ORGANIC OVERLAY ACCENTS ===
      { x: 10, y: 15, size: 36, z: 40 },
      { x: 24, y: 62, size: 34, z: 41 },
      { x: 42, y: 42, size: 36, z: 45 },
      { x: 60, y: 40, size: 34, z: 44 },
      { x: 80, y: 35, size: 42, z: 46 },
      { x: 70, y: 25, size: 40, z: 48 },
      { x: 82, y: 65, size: 42, z: 45 },
      { x: 75, y: 55, size: 40, z: 49 },
      { x: 88, y: 88, size: 44, z: 47 },
    ]

    placements.forEach((p) => {
      const src = FLOWER_SOURCES[idCounter % FLOWER_SOURCES.length]
      const dx = p.x - 50
      const dy = p.y - 50
      const dist = Math.hypot(dx, dy)
      const rotate = Math.random() * 360 - 180
      const scaleX = idCounter % 2 === 0 ? -1 : 1

      const delay = 0.02 + Math.pow(dist / 80, 1.2) * 1.5 + Math.random() * 0.1
      const fallDelay = Math.random() * 0.22
      const fallDuration = 1.1 + Math.random() * 0.25
      const fallY = 850 + Math.random() * 300
      const wiggleDuration = 3 + Math.random() * 3

      list.push({
        id: idCounter,
        src,
        xPct: p.x + (Math.random() - 0.5) * 3,
        yPct: p.y + (Math.random() - 0.5) * 3,
        sizeVmax: p.size * (1.05 + Math.random() * 0.3),
        rotate,
        scaleX,
        delay,
        fallDelay,
        fallY,
        fallDuration,
        zIndex: p.z,
        wiggleDuration,
      })
      idCounter++
    })

    return list
  }, [])

  useEffect(() => {
    const switchTimer = setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true
        onComplete()
        setIsFalling(true)
      }
    }, 3500)

    return () => clearTimeout(switchTimer)
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-50"
      style={{ contain: "layout style paint" }}
    >
      <style>{`
        @keyframes bloom-wiggle {
          0%, 100% { transform: scaleX(var(--sx)) translateZ(0) rotate(0deg); }
          33% { transform: scaleX(var(--sx)) translateZ(0) rotate(3deg); }
          66% { transform: scaleX(var(--sx)) translateZ(0) rotate(-3deg); }
        }
      `}</style>

      <motion.div
        className="absolute inset-0 bg-[#fedfe7] pointer-events-none z-10"
        style={{ willChange: "opacity" }}
        initial={{ opacity: 0 }}
        animate={
          isFalling
            ? { opacity: 0 }
            : { opacity: [0, 0, 0.6, 1] }
        }
        transition={
          isFalling
            ? { duration: 1.2, ease: "easeInOut" }
            : { duration: 1.2, times: [0, 0.2, 0.6, 1], ease: "easeInOut" }
        }
      />

      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          className="absolute"
          style={{
            left: `${flower.xPct}%`,
            top: `${flower.yPct}%`,
            zIndex: flower.zIndex,
            willChange: "transform, opacity",
            transform: "translateZ(0)",
          }}
          initial={{ y: 0, opacity: 1 }}
          animate={
            isFalling
              ? {
                  y: flower.fallY,
                  opacity: [1, 1, 0.5, 0],
                }
              : {
                  y: 0,
                  opacity: 1,
                }
          }
          transition={
            isFalling
              ? {
                  y: {
                    duration: flower.fallDuration,
                    ease: [0.32, 0, 0.67, 0],
                    delay: flower.fallDelay,
                  },
                  opacity: {
                    duration: flower.fallDuration,
                    times: [0, 0.4, 0.8, 1],
                    ease: "easeIn",
                    delay: flower.fallDelay,
                  },
                }
              : { duration: 0 }
          }
        >
          <motion.div
            className="-translate-x-1/2 -translate-y-1/2"
            style={{
              willChange: "transform, opacity",
              transform: "translateZ(0)",
            }}
            initial={{ scale: 0, opacity: 0, rotate: flower.rotate - 35 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: flower.rotate,
            }}
            transition={{
              scale: {
                type: "spring",
                stiffness: 140,
                damping: 16,
                delay: flower.delay,
              },
              opacity: {
                type: "spring",
                stiffness: 140,
                damping: 16,
                delay: flower.delay,
              },
              rotate: {
                type: "spring",
                stiffness: 140,
                damping: 16,
                delay: flower.delay,
              },
            }}
          >
            <img
              src={flower.src}
              alt=""
              className="select-none pointer-events-none object-contain max-w-none"
              style={
                {
                  width: `${flower.sizeVmax}vmax`,
                  height: `${flower.sizeVmax}vmax`,
                  "--sx": flower.scaleX,
                  animation: `bloom-wiggle ${flower.wiggleDuration}s ease-in-out ${flower.delay}s infinite`,
                } as React.CSSProperties
              }
              draggable={false}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
