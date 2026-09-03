"use client"

import { useEffect, useState, RefObject } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"
import { AudioController } from "@/lib/audio"

interface MusicToggleProps {
  audioRef?: RefObject<AudioController | null>
  controller?: AudioController | null
  visible: boolean
}

export default function MusicToggle({ audioRef, controller, visible }: MusicToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setup = (c: AudioController | null) => {
      if (!c) return false
      setIsPlaying(c.isPlaying())
      unsubscribe = c.subscribe((playing) => {
        setIsPlaying(playing)
      })
      return true
    }

    const currentController = controller ?? audioRef?.current ?? null
    if (!setup(currentController)) {
      const interval = setInterval(() => {
        const c = controller ?? audioRef?.current ?? null
        if (setup(c)) {
          clearInterval(interval)
        }
      }, 60)

      return () => {
        clearInterval(interval)
        if (unsubscribe) unsubscribe()
      }
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [controller, audioRef])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const c = controller ?? audioRef?.current
    if (!c) return
    const nowPlaying = c.togglePlay()
    setIsPlaying(nowPlaying)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-4 right-4 sm:top-5 sm:right-5 z-[60]"
          initial={{ opacity: 0, scale: 0, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.button
            type="button"
            onClick={handleClick}
            onPointerDown={(e) => e.stopPropagation()}
            className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#fffaf5]/95 backdrop-blur-md border border-[#f4a0b5]/60 text-[#8c7365] shadow-md hover:text-[#e27d96] hover:border-[#e27d96] cursor-pointer drop-shadow-scrapbook transition-all active:scale-90 select-none touch-manipulation"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
            title={isPlaying ? "Jeda musik" : "Putar musik"}
          >
            {isPlaying ? (
              <div className="relative flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-[#e27d96]" />
                <motion.span
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#e27d96]"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            ) : (
              <VolumeX className="w-5 h-5 text-[#8c7365]" />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
