"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { SCENE_ORDER, Scene } from "@/lib/scenes"
import { AudioController } from "@/lib/audio"
import { content } from "@/lib/content"
import AmbientLayer from "@/components/ui/AmbientLayer"
import MusicToggle from "@/components/ui/MusicToggle"
import BloomReveal from "@/components/ui/BloomReveal"
import EnvelopeScene from "@/components/scenes/EnvelopeScene"
import CassetteScene from "@/components/scenes/CassetteScene"
import FlowerGameScene, { CaughtFlower } from "@/components/scenes/FlowerGameScene"
import ScrapbookScene from "@/components/scenes/ScrapbookScene"
import VideoScene from "@/components/scenes/VideoScene"
import MessageScene from "@/components/scenes/MessageScene"
import FinalBloomScene from "@/components/scenes/FinalBloomScene"

export default function Home() {
  const [currentScene, setCurrentScene] = useState<Scene>("envelope")
  const [showBloom, setShowBloom] = useState(false)
  const [caughtFlowers, setCaughtFlowers] = useState<CaughtFlower[]>([])
  const audioRef = useRef<AudioController | null>(null)
  const [audioController, setAudioController] = useState<AudioController | null>(null)

  useEffect(() => {
    const controller = new AudioController(content.music)
    audioRef.current = controller
    setAudioController(controller)

    return () => {
      controller.dispose()
    }
  }, [])

  const advance = useCallback(() => {
    setCurrentScene((prev) => {
      const idx = SCENE_ORDER.indexOf(prev)
      if (idx >= 0 && idx < SCENE_ORDER.length - 1) {
        return SCENE_ORDER[idx + 1]
      }
      return prev
    })
  }, [])

  const restart = useCallback(() => {
    setShowBloom(false)
    setCaughtFlowers([])
    setCurrentScene("envelope")
  }, [])

  const handleEnvelopeOpen = () => {
    setShowBloom(true)
  }

  const handleBloomComplete = useCallback(() => {
    advance()
    setTimeout(() => {
      setShowBloom(false)
    }, 4600)
  }, [advance])

  const handleFlowerGameComplete = useCallback(
    (flowers: CaughtFlower[]) => {
      setCaughtFlowers(flowers)
      advance()
    },
    [advance]
  )

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden overflow-y-auto bg-[var(--color-bg)] flex flex-col justify-center">
      <AmbientLayer />

      {showBloom && <BloomReveal onComplete={handleBloomComplete} />}

      <main className="relative z-10 flex min-h-dvh w-full items-center justify-center py-4 px-3 sm:px-4">
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {currentScene === "envelope" && (
              <EnvelopeScene key="envelope" onOpen={handleEnvelopeOpen} />
            )}
            {currentScene === "cassette" && (
              <CassetteScene
                key="cassette"
                onNext={advance}
                audioRef={audioRef}
              />
            )}
            {currentScene === "flower-game" && (
              <FlowerGameScene
                key="flower-game"
                onComplete={handleFlowerGameComplete}
              />
            )}
            {currentScene === "scrapbook" && (
              <ScrapbookScene key="scrapbook" onNext={advance} />
            )}
            {currentScene === "video" && (
              <VideoScene
                key="video"
                onNext={advance}
                audioRef={audioRef}
              />
            )}
            {currentScene === "message" && (
              <MessageScene key="message" onNext={advance} />
            )}
            {currentScene === "final-bloom" && (
              <FinalBloomScene
                key="final-bloom"
                caughtFlowers={caughtFlowers}
                onRestart={restart}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <MusicToggle
        audioRef={audioRef}
        controller={audioController}
        visible={currentScene !== "envelope"}
      />
    </div>
  )
}
