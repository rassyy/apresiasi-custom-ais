type StateChangeListener = (isPlaying: boolean, isMuted: boolean) => void

export class AudioController {
  private audio: HTMLAudioElement | null = null
  private fadeInterval: ReturnType<typeof setInterval> | null = null
  private maxVolume: number = 0.8
  private _isPlaying: boolean = false
  private _isMuted: boolean = false
  private wasPlayingBeforeHidden: boolean = false
  private listeners: Set<StateChangeListener> = new Set()

  constructor(src: string, volume: number = 0.8) {
    if (typeof window === "undefined") return

    this.maxVolume = volume
    this.audio = new Audio(src)
    this.audio.loop = true
    this.audio.volume = volume
    this.audio.preload = "metadata"

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
    document.addEventListener("visibilitychange", this.handleVisibilityChange)

    this.audio.addEventListener("play", () => {
      this._isPlaying = true
      this.notify()
    })
    this.audio.addEventListener("pause", () => {
      this._isPlaying = false
      this.notify()
    })
    this.audio.addEventListener("volumechange", () => {
      if (this.audio) {
        this._isMuted = this.audio.muted
        this.notify()
      }
    })
  }

  private handleVisibilityChange() {
    if (!this.audio) return

    if (document.hidden) {
      this.wasPlayingBeforeHidden = this._isPlaying
      if (this._isPlaying) {
        this.pause()
      }
    } else {
      if (this.wasPlayingBeforeHidden) {
        this.play()
        this.wasPlayingBeforeHidden = false
      }
    }
  }

  public subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener)
    listener(this._isPlaying, this._isMuted)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this._isPlaying, this._isMuted))
  }

  public async play(): Promise<void> {
    if (!this.audio) return

    try {
      this.audio.muted = false
      this._isMuted = false
      if (this.audio.volume === 0) {
        this.audio.volume = this.maxVolume
      }

      if (this.audio.paused) {
        await this.audio.play()
      }
      this._isPlaying = true
      this.notify()
    } catch {
      this._isPlaying = false
      this.notify()
    }
  }

  public pause(): void {
    if (!this.audio) return
    this.audio.pause()
    this._isPlaying = false
    this.notify()
  }

  public togglePlay(): boolean {
    if (!this.audio) return false
    if (this._isPlaying) {
      this.pause()
    } else {
      this.play()
    }
    return this._isPlaying
  }

  public toggleMute(): boolean {
    if (!this.audio) return false
    this._isMuted = !this._isMuted
    this.audio.muted = this._isMuted
    this.notify()
    return this._isMuted
  }

  public setMuted(muted: boolean): void {
    if (!this.audio) return
    this._isMuted = muted
    this.audio.muted = muted
    this.notify()
  }

  public isPlaying(): boolean {
    return this._isPlaying
  }

  public isMuted(): boolean {
    return this._isMuted
  }

  public fadeIn(durationMs: number = 1000): void {
    if (!this.audio) return
    if (this.fadeInterval) clearInterval(this.fadeInterval)

    this.audio.muted = false
    this._isMuted = false
    this._isPlaying = true
    this.notify()

    this.audio.volume = 0.05
    if (this.audio.paused) {
      this.audio.play().catch(() => {
        this._isPlaying = false
        this.notify()
      })
    }

    const stepMs = 50
    const stepIncrement = this.maxVolume / (durationMs / stepMs)

    this.fadeInterval = setInterval(() => {
      if (!this.audio) {
        if (this.fadeInterval) clearInterval(this.fadeInterval)
        return
      }

      const nextVol = Math.min(this.maxVolume, this.audio.volume + stepIncrement)
      this.audio.volume = nextVol

      if (nextVol >= this.maxVolume) {
        if (this.fadeInterval) clearInterval(this.fadeInterval)
      }
    }, stepMs)
  }

  public fadeOut(durationMs: number = 800): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audio) {
        resolve()
        return
      }
      if (this.fadeInterval) clearInterval(this.fadeInterval)

      const stepMs = 50
      const stepDecrement = this.audio.volume / (durationMs / stepMs)

      this.fadeInterval = setInterval(() => {
        if (!this.audio) {
          if (this.fadeInterval) clearInterval(this.fadeInterval)
          resolve()
          return
        }

        const nextVol = Math.max(0, this.audio.volume - stepDecrement)
        this.audio.volume = nextVol

        if (nextVol <= 0) {
          if (this.fadeInterval) clearInterval(this.fadeInterval)
          this.pause()
          this.audio.volume = this.maxVolume
          resolve()
        }
      }, stepMs)
    })
  }

  public dispose(): void {
    if (this.fadeInterval) clearInterval(this.fadeInterval)
    document.removeEventListener("visibilitychange", this.handleVisibilityChange)
    if (this.audio) {
      this.audio.pause()
      this.audio.src = ""
      this.audio = null
    }
    this.listeners.clear()
  }
}
