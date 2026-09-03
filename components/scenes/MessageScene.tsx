"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ASSETS } from "@/lib/assets"
import { content } from "@/lib/content"
import NextButton from "@/components/ui/NextButton"
import { DoodleSparkle, DoodleHeart } from "@/components/ui/Doodles"

interface MessageSceneProps {
  onNext: () => void
}

export default function MessageScene({ onNext }: MessageSceneProps) {
  const [showNext, setShowNext] = useState(false)

  useEffect(() => {
    const totalDelay = content.appreciationParagraphs.length * 0.55 + 1.2
    const timer = setTimeout(() => {
      setShowNext(true)
    }, totalDelay * 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      key="message-scene"
      className="relative flex flex-col items-center justify-center min-h-[90vh] w-full px-4 py-8 select-none"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <div className="relative w-full max-w-sm flex flex-col items-center">
        <motion.div
          className="relative w-full p-5 sm:p-7 bg-[#fffaf5] rounded-sm shadow-xl border border-[#eedfd0]/70 overflow-hidden drop-shadow-scrapbook"
          initial={{ y: -200, opacity: 0, rotate: -1 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 14 }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply">
            <img
              src={ASSETS.paperCrumpled}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-16 h-6 pointer-events-none">
            <img
              src={ASSETS.washiTape}
              alt="Washi Tape"
              className="w-full h-full object-contain -rotate-2"
              draggable={false}
            />
          </div>

          {/* Decorative Doodles on Letter Corners */}
          <div className="absolute top-4 right-4 pointer-events-none z-10 opacity-75">
            <DoodleSparkle className="w-5 h-5 text-[#e27d96]" delay={0.4} />
          </div>
          <div className="absolute bottom-4 left-4 pointer-events-none z-10 opacity-60">
            <DoodleHeart className="w-5 h-5 text-[#f4a0b5]" delay={0.8} />
          </div>

          <div className="relative z-10 flex flex-col gap-3 sm:gap-3.5 text-[#4a3b32]">
            {content.appreciationParagraphs.map((paragraph, index) => {
              const isSignoff = index === content.appreciationParagraphs.length - 1
              const isSpecialGreeting = index === 0

              return (
                <motion.p
                  key={index}
                  className={`font-handwriting whitespace-pre-line leading-relaxed ${
                    isSpecialGreeting
                      ? "text-2xl sm:text-3xl font-bold text-[#e27d96]"
                      : isSignoff
                      ? "text-xl sm:text-2xl font-bold text-[#8c7365] text-right mt-2"
                      : "text-lg sm:text-xl font-medium"
                  }`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.55,
                    ease: "easeOut",
                  }}
                >
                  {paragraph}
                </motion.p>
              )
            })}

            <motion.div
              className="flex justify-end pr-2 -mt-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.4 + content.appreciationParagraphs.length * 0.55,
                type: "spring",
                stiffness: 250,
                damping: 14,
              }}
            >
              <img
                src={ASSETS.heartRed}
                alt="Love"
                className="w-8 h-8 object-contain drop-shadow-xs"
                draggable={false}
              />
            </motion.div>
          </div>
        </motion.div>

        <div className="h-14 mt-4 flex items-center justify-center z-20">
          {showNext && (
            <NextButton onClick={onNext} label="Buket Terakhir" />
          )}
        </div>
      </div>
    </motion.div>
  )
}
