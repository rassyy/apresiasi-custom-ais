"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ASSETS } from "@/lib/assets"
import { content, PhotoMemory } from "@/lib/content"
import NextButton from "@/components/ui/NextButton"
import { DoodleSparkle, DoodleHeart, DoodleSquiggle } from "@/components/ui/Doodles"

interface ScrapbookSceneProps {
  onNext: () => void
}

const DEFAULT_PHOTOS: PhotoMemory[] = [
  {
    src: "/photos/memory-5.webp",
    caption: "masyaAllah paling seneng kalo di pap, cantik banget!",
    aspect: "landscape",
  },
  {
    src: "/photos/memory-4.webp",
    caption: "moment first time kita berdua main ke caffe, seru!",
    aspect: "landscape",
  },
  {
    src: "/photos/memory-3.webp",
    caption: "akhirnya kesampaian bisa foto studio bareng kamu",
    aspect: "portrait",
  },
  {
    src: "/photos/memory-2.webp",
    caption: "inget banget waktu itu bingung mau pose apa hehe",
    aspect: "portrait",
  },
  {
    src: "/photos/memory-1.webp",
    caption: "intinya aku sayang banget sama kamu",
    aspect: "portrait",
  },
]

export default function ScrapbookScene({ onNext }: ScrapbookSceneProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showNext, setShowNext] = useState(false)
  const [seenIndices, setSeenIndices] = useState<Set<number>>(() => new Set([0]))

  const photos: PhotoMemory[] = useMemo(
    () =>
      content.photoMemories && content.photoMemories.length > 0
        ? content.photoMemories
        : DEFAULT_PHOTOS,
    []
  )

  const goToNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => {
      const next = (prev + 1) % photos.length
      setSeenIndices((seen) => new Set(seen).add(next))
      return next
    })
  }, [photos.length])

  const goToPrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => {
      const next = (prev - 1 + photos.length) % photos.length
      setSeenIndices((seen) => new Set(seen).add(next))
      return next
    })
  }, [photos.length])

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -40 || info.velocity.x < -200) {
      goToNext()
    } else if (info.offset.x > 40 || info.velocity.x > 200) {
      goToPrev()
    }
  }

  // Show "Lanjut" button after a few seconds or when reaching the end
  useEffect(() => {
    if (seenIndices.size >= photos.length || currentIndex === photos.length - 1) {
      setShowNext(true)
    }
  }, [seenIndices, currentIndex, photos.length])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNext(true)
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext()
      if (e.key === "ArrowLeft") goToPrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNext, goToPrev])

  // Helper to render an individual Polaroid Card with uniform dimensions
  const renderPolaroid = (photo: PhotoMemory, isTop = false) => {
    return (
      <div
        className="relative w-[285px] sm:w-[315px] p-3 pb-3 bg-[#fffdfa] rounded-sm shadow-[0_12px_28px_-6px_rgba(74,59,50,0.18),0_4px_10px_-2px_rgba(74,59,50,0.08)] border border-[#ecdacb] select-none"
      >
        {/* Washi Tape on top */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 w-16 h-6 pointer-events-none drop-shadow-xs">
          <img
            src={ASSETS.washiTape}
            alt=""
            className="w-full h-full object-contain -rotate-1 opacity-95"
            draggable={false}
          />
        </div>

        {/* Uniform Photo Container: identical height and width across all cards */}
        <div className="relative w-full h-[255px] sm:h-[280px] overflow-hidden rounded-xs bg-[#f6ece2] flex items-center justify-center">
          <img
            src={photo.src}
            alt={photo.alt || "Foto Kenangan"}
            className={`w-full h-full object-cover pointer-events-none ${
              photo.aspect === "portrait" ? "object-[center_15%]" : "object-center"
            }`}
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Polaroid Chin with Caption */}
        <div className="pt-3 pb-1 px-2 text-center min-h-[62px] flex items-center justify-center">
          <p className="font-handwriting text-xl sm:text-2xl text-[#523d32] font-semibold leading-snug">
            &ldquo;{photo.caption}&rdquo;
          </p>
        </div>
      </div>
    )
  }

  // Cards to show in the physical stack
  const nextIdx1 = (currentIndex + 1) % photos.length
  const nextIdx2 = (currentIndex + 2) % photos.length

  return (
    <motion.div
      key="scrapbook-scene"
      className="relative flex flex-col items-center justify-center min-h-[85vh] w-full px-3 py-2 select-none"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 140, damping: 16 }}
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Title Header */}
        <motion.div
          className="relative mb-2 sm:mb-3 flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="absolute -top-2.5 -right-3 pointer-events-none">
            <DoodleSparkle className="w-5 h-5 text-[#e27d96]" delay={0.3} />
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl text-[#4a3b32] font-bold">
            Momen Manis Kita 📸
          </h2>
          <DoodleSquiggle className="w-24 h-2 text-[#f4a0b5]/70 -mt-0.5" />
          <p className="font-handwriting text-lg sm:text-xl text-[#8c7365]">
            Setiap senyum dan tawa yang kita lewati...
          </p>
        </motion.div>

        {/* Stacked Deck Viewport Container ("Kartu Numpuk") */}
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] h-[430px] sm:h-[460px] flex items-center justify-center my-1">
          {/* Floating doodle accents on deck sides */}
          <div className="absolute -left-4 sm:-left-6 top-8 pointer-events-none z-30">
            <DoodleHeart className="w-6 h-6 text-[#e27d96]" delay={0.6} />
          </div>
          <div className="absolute -right-4 sm:-right-6 bottom-16 pointer-events-none z-30">
            <DoodleSparkle className="w-5 h-5 text-[#f4a0b5]" delay={0.4} />
          </div>

          {/* Card 3 (Bottom card peeking out tilted to the left) */}
          <motion.div
            key={`under-2-${nextIdx2}`}
            className="absolute pointer-events-none flex items-center justify-center"
            style={{ zIndex: 10 }}
            animate={{
              y: 28,
              scale: 0.90,
              rotate: -4,
              opacity: 0.7,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          >
            {renderPolaroid(photos[nextIdx2])}
          </motion.div>

          {/* Card 2 (Middle card peeking out tilted to the right) */}
          <motion.div
            key={`under-1-${nextIdx1}`}
            className="absolute pointer-events-none flex items-center justify-center"
            style={{ zIndex: 20 }}
            animate={{
              y: 15,
              scale: 0.95,
              rotate: 3.5,
              opacity: 0.9,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          >
            {renderPolaroid(photos[nextIdx1])}
          </motion.div>

          {/* Top Card (Active Card with drag, swipe, tap) */}
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={`top-${currentIndex}`}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir < 0 ? -280 : 0,
                  scale: 0.95,
                  y: dir < 0 ? 0 : 15,
                  rotate: dir < 0 ? -8 : 3.5,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  scale: 1,
                  y: 0,
                  rotate: 0,
                  opacity: 1,
                  zIndex: 30,
                },
                exit: (dir: number) => ({
                  x: dir > 0 ? 320 : -320,
                  rotate: dir > 0 ? 14 : -14,
                  opacity: 0,
                  scale: 0.9,
                  zIndex: 40,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 32,
                mass: 0.8,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
              onClick={goToNext}
              className="absolute cursor-pointer select-none flex items-center justify-center"
              style={{
                willChange: "transform, opacity",
                transform: "translateZ(0)",
              }}
            >
              {renderPolaroid(photos[currentIndex], true)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center justify-between w-full max-w-[320px] sm:max-w-[350px] mt-2 px-2 z-30">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Foto sebelumnya"
            className="w-9 h-9 rounded-full bg-[#fffdfa] border border-[#ecdacb] shadow-xs flex items-center justify-center text-[#6d5345] hover:bg-[#fce7ec] active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots / Indicators */}
          <div className="flex items-center gap-1.5">
            {photos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1)
                  setCurrentIndex(idx)
                  setSeenIndices((s) => new Set(s).add(idx))
                }}
                aria-label={`Buka foto ${idx + 1}`}
                className="p-1 cursor-pointer transition-transform hover:scale-125"
              >
                <span
                  className={`block transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? "w-6 h-2 bg-[#e27d96]"
                      : "w-2 h-2 bg-[#d6c2b3]/60 hover:bg-[#d6c2b3]"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Foto selanjutnya"
            className="w-9 h-9 rounded-full bg-[#fffdfa] border border-[#ecdacb] shadow-xs flex items-center justify-center text-[#6d5345] hover:bg-[#fce7ec] active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Guidance Hint */}
        <p className="font-handwriting text-base sm:text-lg text-[#8c7365] mt-1.5">
          Ketuk kartu untuk geser ({currentIndex + 1}/{photos.length}) ✨
        </p>

        {/* Next Scene Button */}
        <div className="h-16 mt-3 flex items-center justify-center z-30">
          {showNext && <NextButton onClick={onNext} label="Lanjut" />}
        </div>
      </div>
    </motion.div>
  )
}



