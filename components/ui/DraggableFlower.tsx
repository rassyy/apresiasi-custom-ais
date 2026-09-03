"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DraggableFlowerProps {
  id: number
  src: string
  initialX: number
  size: number
  rotation: number
  drift: number
  duration: number
  onCaught: (id: number, src: string) => void
}

export default function DraggableFlower({
  id,
  src,
  initialX,
  size,
  rotation,
  drift,
  duration,
  onCaught,
}: DraggableFlowerProps) {
  const [isCaught, setIsCaught] = useState(false)

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    if (isCaught) return
    setIsCaught(true)
    onCaught(id, src)
  }

  return (
    <AnimatePresence>
      {!isCaught && (
        <div
          className="fixed z-30 pointer-events-auto cursor-pointer select-none"
          style={
            {
              left: `${initialX}%`,
              width: `${size}px`,
              height: `${size}px`,
              top: 0,
              "--drift": `${drift}px`,
              animation: `flower-fall ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
            } as React.CSSProperties
          }
          onClick={handleTap}
          onTouchStart={handleTap}
        >
          <motion.div
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            exit={{
              scale: [1, 1.35, 0],
              opacity: [1, 1, 0],
              transition: { duration: 0.3 },
            }}
            className="w-full h-full flex items-center justify-center p-1"
          >
            <img
              src={src}
              alt="Bunga"
              className="w-full h-full object-contain pointer-events-none drop-shadow-floating transition-transform"
              style={{ transform: `rotate(${rotation}deg)` }}
              draggable={false}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
