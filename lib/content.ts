export interface PhotoMemory {
  src: string
  caption: string
  alt?: string
  aspect?: "landscape" | "portrait"
}

export interface AppreciationContent {
  sender: string
  recipient: string
  appreciationParagraphs: string[]
  closingText: string
  music: string
  musicTitle?: string
  musicArtist?: string
  cassetteNote?: string
  photoMemories?: PhotoMemory[]
  videoCaption?: string
}

export const content: AppreciationContent = {
  sender: "Ais",
  recipient: "Adel",
  appreciationParagraphs: [
    "Halo Adel,",
    "Selamat ya, KKN-nya udah kelar!",
    "Aku cuma mau bilang...\nMakasih udah jaga hati buat aku selama ini.",
    "Di tengah semua kesibukan, kamu tetep jadi tempat yang paling nyaman buat pulang.",
    "Makasih udah sabar, udah ngerti, udah selalu ada meskipun aku nggak selalu bisa ada di sana.",
    "Walaupun aku sering cemburuan dan kadang bikin kamu kesel, tapi percaya deh... itu karena aku takut banget kehilangan kamu. Makasih ya udah selalu sabar ngadepin aku.",
    "Kamu tuh lebih dari cukup.\nDan aku bersyukur banget punya kamu.",
    "Dengan sayang,\nAis",
  ],
  closingText: "Makasih udah jadi penjaga hatiku.",
  music: "/audio/penjaga-hati.m4a",
  musicTitle: "Penjaga Hati",
  musicArtist: "Nadhif Basalamah",
  cassetteNote: "masih inget lagu ini nggak? dulu kamu pernah minta aku cover lagu ini",
  videoCaption: "seneng banget waktu itu kita bisa main ke pantai bareng, seru dan bikin rindu 🌊✨",
  photoMemories: [
    {
      src: "/photos/memory-5.webp",
      caption: "masyaAllah paling seneng kalo di pap, cantik banget!",
      alt: "Foto 5 - Pap cantik",
      aspect: "landscape",
    },
    {
      src: "/photos/memory-4.webp",
      caption: "moment first time kita berdua main ke caffe, seru!",
      alt: "Foto 4 - First time cafe",
      aspect: "landscape",
    },
    {
      src: "/photos/memory-3.webp",
      caption: "akhirnya kesampaian bisa foto studio bareng kamu",
      alt: "Foto 3 - Foto studio berdua",
      aspect: "portrait",
    },
    {
      src: "/photos/memory-2.webp",
      caption: "inget banget waktu itu bingung mau pose apa hehe",
      alt: "Foto 2 - Pose foto studio",
      aspect: "portrait",
    },
    {
      src: "/photos/memory-1.webp",
      caption: "intinya aku sayang banget sama kamu",
      alt: "Foto 1 - Romantis berdua",
      aspect: "portrait",
    },
  ],
}


