"use client"

import { useState, useEffect, RefObject } from "react"
import { motion } from "framer-motion"
import { Music } from "lucide-react"
import { ASSETS } from "@/lib/assets"
import { AudioController } from "@/lib/audio"
import { content } from "@/lib/content"
import NextButton from "@/components/ui/NextButton"
import PetalParticles from "@/components/ui/PetalParticles"
import { DoodleArrow } from "@/components/ui/Doodles"

interface CassetteSceneProps {
  onNext: () => void
  audioRef: RefObject<AudioController | null>
  musicTitle?: string
  musicArtist?: string
  cassetteNote?: string
}

export default function CassetteScene({
  onNext,
  audioRef,
  musicTitle,
  musicArtist,
  cassetteNote,
}: CassetteSceneProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [showNext, setShowNext] = useState(false)

  const displayTitle = musicTitle ?? content.musicTitle ?? "Penjaga Hati"
  const displayArtist = musicArtist ?? content.musicArtist ?? "Nadhif Basalamah"
  const fullSongTitle = displayArtist ? `${displayTitle} — ${displayArtist}` : displayTitle
  const displayNote =
    cassetteNote ??
    content.cassetteNote ??
    "masih inget lagu ini nggak? dulu kamu pernah minta aku cover lagu ini"

  useEffect(() => {
    const controller = audioRef.current
    if (!controller) return

    const unsubscribe = controller.subscribe((playing) => {
      setIsPlaying(playing)
      if (playing && !hasPlayed) {
        setHasPlayed(true)
        setTimeout(() => setShowNext(true), 2000)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [audioRef, hasPlayed])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.fadeIn(1000)
      if (!hasPlayed) {
        setHasPlayed(true)
        setTimeout(() => setShowNext(true), 2000)
      }
    }
  }

  return (
    <motion.div
      key="cassette-scene"
      className="relative flex flex-col items-center justify-center min-h-[85vh] w-full px-4 py-2"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <PetalParticles count={20} />

      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Title Header */}
        <motion.div
          className="mb-3 sm:mb-4 flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 14 }}
        >
          <h2 className="font-serif-title text-3xl sm:text-4xl text-[#4a3b32] font-bold">
            Putar kaset ini untukmu
          </h2>
          <p className="font-handwriting text-lg sm:text-xl text-[#8c7365]">
            {isPlaying ? "Lagu sedang diputar" : "Sebuah lagu kecil untukmu"}
          </p>
        </motion.div>

        {/* Cassette Area */}
        <div className="relative flex items-center justify-center my-1 w-full">
          {/* Curved hand-drawn doodle arrow pointing toward the cassette */}
          {!isPlaying && (
            <div className="absolute -top-3.5 right-6 sm:right-10 pointer-events-none z-20">
              <DoodleArrow
                className="w-8 h-8 sm:w-9 sm:h-9 text-[#e27d96] -rotate-12"
                direction="down"
              />
            </div>
          )}

          <motion.div
            className="relative w-60 sm:w-72 aspect-square cursor-pointer flex items-center justify-center select-none"
            onClick={togglePlay}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            animate={
              isPlaying
                ? {
                    scale: [1, 1.02, 1],
                    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }
                : { scale: 1 }
            }
          >
            <img
              src={ASSETS.cassette}
              alt="Kaset Pita"
              className="w-full h-full object-contain pointer-events-none drop-shadow-scrapbook"
              draggable={false}
            />

            <div
              className="absolute left-[38.5%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center pointer-events-none"
              style={{
                animation: isPlaying ? "cassette-spin 2s linear infinite" : "none",
              }}
            >
              <svg viewBox="0 0 40 40" className="w-full h-full text-[#8c7365]/80">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="5 3"
                />
                <circle cx="20" cy="20" r="7" fill="#4a3b32" />
                <line x1="20" y1="2" x2="20" y2="38" stroke="currentColor" strokeWidth="2.5" />
                <line x1="2" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="2.5" />
                <line x1="7.3" y1="7.3" x2="32.7" y2="32.7" stroke="currentColor" strokeWidth="2.5" />
                <line x1="7.3" y1="32.7" x2="32.7" y2="7.3" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>

            <div
              className="absolute left-[61.5%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center pointer-events-none"
              style={{
                animation: isPlaying ? "cassette-spin 2s linear infinite" : "none",
              }}
            >
              <svg viewBox="0 0 40 40" className="w-full h-full text-[#8c7365]/80">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="5 3"
                />
                <circle cx="20" cy="20" r="7" fill="#4a3b32" />
                <line x1="20" y1="2" x2="20" y2="38" stroke="currentColor" strokeWidth="2.5" />
                <line x1="2" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="2.5" />
                <line x1="7.3" y1="7.3" x2="32.7" y2="32.7" stroke="currentColor" strokeWidth="2.5" />
                <line x1="7.3" y1="32.7" x2="32.7" y2="7.3" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Prominent Tap-to-play Instruction Badge */}
            {/* Small subtle tap instruction (compact, no emoji) */}
            {!isPlaying && (
              <motion.div
                className="absolute -bottom-1.5 bg-[#fffdfa] border border-[#ecdacb] text-[#7a5f50] px-2.5 py-0.5 rounded-full shadow-2xs z-30 pointer-events-none"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: [0.75, 1, 0.75], y: [0, -2, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="font-handwriting text-xs sm:text-sm tracking-wide">
                  ketuk untuk memutar lagu
                </span>
              </motion.div>
            )}

            {isPlaying && (
              <motion.div
                className="absolute -bottom-1.5 bg-[#fffdfa]/95 border border-[#ecdacb] text-[#8c7365] px-2.5 py-0.5 rounded-full shadow-2xs z-30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="font-handwriting text-xs tracking-wide">
                  ketuk untuk jeda
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Song Info & Note Card */}
        <motion.div
          className="relative mt-2 w-full max-w-[320px] bg-[#fffaf5]/90 backdrop-blur-xs border border-[#eedfd0] rounded-2xl px-4 py-3.5 shadow-sm text-center flex flex-col items-center gap-1.5 drop-shadow-scrapbook"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 pointer-events-none">
            <img
              src={ASSETS.washiTape}
              alt=""
              className="w-full h-full object-contain -rotate-1 opacity-90"
              draggable={false}
            />
          </div>

          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#fce7ec]/80 border border-[#f4a0b5]/40 text-[#4a3b32] text-xs sm:text-sm font-medium">
            <Music className="w-3.5 h-3.5 text-[#e27d96]" />
            <span className="font-semibold tracking-wide">{fullSongTitle}</span>
            {isPlaying && (
              <span className="flex items-end gap-0.5 h-3 ml-0.5" aria-hidden="true">
                <span className="w-0.5 h-full bg-[#e27d96] rounded-full animate-[pulse_0.7s_ease-in-out_infinite]" />
                <span className="w-0.5 h-2 bg-[#e27d96] rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" />
                <span className="w-0.5 h-3.5 bg-[#e27d96] rounded-full animate-[pulse_0.9s_ease-in-out_infinite]" />
              </span>
            )}
          </div>

          <p className="font-handwriting text-xl sm:text-2xl text-[#6b4e3d] leading-snug pt-0.5">
            &ldquo;{displayNote}&rdquo;
          </p>
        </motion.div>

        <div className="h-16 mt-4 flex items-center justify-center">
          {showNext && <NextButton onClick={onNext} label="Lanjut" />}
        </div>
      </div>
    </motion.div>
  )
}

