export const SCENE_ORDER = [
  "envelope",
  "cassette",
  "flower-game",
  "scrapbook",
  "video",
  "message",
  "final-bloom",
] as const

export type Scene = (typeof SCENE_ORDER)[number]
