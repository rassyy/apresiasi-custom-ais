"use client"

import { useState, useRef, useEffect, RefObject } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause } from "lucide-react"
import { ASSETS, VIDEO } from "@/lib/assets"
import { AudioController } from "@/lib/audio"
import { content } from "@/lib/content"
import NextButton from "@/components/ui/NextButton"
import { DoodleSparkle, DoodleHeart } from "@/components/ui/Doodles"

interface VideoSceneProps {
  onNext: () => void
  audioRef?: RefObject<AudioController | null>
  caption?: string
}

export default function VideoScene({
  onNext,
  audioRef,
  caption = content.videoCaption ||
    "seneng banget waktu itu kita bisa main ke pantai bareng, seru dan bikin rindu 🌊✨",
}: VideoSceneProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Ensure video is muted so background music plays uninterrupted
    video.muted = true

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }, [])

  const toggleVideoPlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <motion.div
      key="video-scene"
      className="relative flex flex-col items-center justify-center min-h-[85vh] w-full px-4 select-none"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <div className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center text-center">
        {/* Title Header */}
        <motion.div
          className="relative mb-3 sm:mb-4 flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute -top-3 -right-4 pointer-events-none">
            <DoodleSparkle className="w-5 h-5 text-[#f4a0b5]" delay={0.2} />
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl text-[#4a3b32] font-bold">
            Momen di Pantai 🌊
          </h2>
          <p className="font-handwriting text-lg sm:text-xl text-[#8c7365]">
            Deburan ombak dan senyum manismu...
          </p>
        </motion.div>

        {/* Landscape Video Polaroid Card */}
        <motion.div
          className="relative w-full max-w-[340px] sm:max-w-[420px] p-3 pb-3 bg-[#fffdfa] rounded-sm shadow-xl border border-[#ecdacb] drop-shadow-scrapbook my-2"
          initial={{ y: -40, opacity: 0, rotate: -1.5 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 130, damping: 15, delay: 0.25 }}
        >
          <div className="absolute -top-3 -left-3 pointer-events-none z-30">
            <DoodleHeart className="w-5 h-5 text-[#e27d96]" delay={0.7} />
          </div>
          {/* Washi Tape on top */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 w-16 h-6 pointer-events-none drop-shadow-xs">
            <img
              src={ASSETS.washiTape}
              alt=""
              className="w-full h-full object-contain -rotate-1 opacity-95"
              draggable={false}
            />
          </div>

          {/* Landscape 16:9 Video Container */}
          <div
            className="relative w-full aspect-[16/9] overflow-hidden rounded-xs bg-[#241c18] cursor-pointer flex items-center justify-center group"
            onClick={toggleVideoPlay}
          >
            <video
              ref={videoRef}
              src={VIDEO}
              playsInline
              muted
              autoPlay
              loop
              controls={false}
              className="w-full h-full object-cover"
            />

            {/* Play/Pause overlay */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  className="absolute inset-0 bg-black/35 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-full bg-[#fce7ec]/90 text-[#4a3b32] flex items-center justify-center shadow-lg border border-[#f4a0b5]"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-7 h-7 fill-current ml-1 text-[#e27d96]" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {isPlaying && (
              <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 p-1.5 rounded-full text-white pointer-events-none">
                <Pause className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Polaroid Chin with Caption */}
          <div className="pt-3 pb-1 px-2 text-center min-h-[58px] flex items-center justify-center">
            <p className="font-handwriting text-xl sm:text-2xl text-[#523d32] font-semibold leading-snug">
              &ldquo;{caption}&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Guidance Hint */}
        <p className="font-handwriting text-base sm:text-lg text-[#8c7365] mt-1.5">
          {isPlaying ? "Ketuk video untuk jeda ⏸️" : "Ketuk video untuk putar ▶️"}
        </p>

        {/* Next Scene Button */}
        <div className="h-16 mt-3 flex items-center justify-center z-30">
          <NextButton onClick={onNext} label="Lanjut" />
        </div>
      </div>
    </motion.div>
  )
}

