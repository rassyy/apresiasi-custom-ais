import type { Metadata, Viewport } from "next"
import { Caveat, Dancing_Script, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const fontHandwriting = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-handwriting",
  display: "swap",
})

const fontSerifTitle = Dancing_Script({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-serif-title",
  display: "swap",
})

const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "A Special Message For You | Adel & Ais",
  description: "Makasih udah jaga hati buat aku selama ini... Sebuah surat dan kenangan manis untukmu.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "A Special Message For You | Adel & Ais",
    description: "Makasih udah jaga hati buat aku selama ini... Sebuah surat dan kenangan manis untukmu.",
    siteName: "A Special Message For You",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "A Special Message For You - Adel & Ais",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A Special Message For You | Adel & Ais",
    description: "Makasih udah jaga hati buat aku selama ini...",
    images: ["/og-image.jpg"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${fontHandwriting.variable} ${fontSerifTitle.variable} ${fontBody.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" as="image" href="/assets/envelope-closed.webp" />
      </head>
      <body
        className="min-h-dvh w-full overflow-hidden bg-[var(--color-bg)] text-[var(--color-text-main)] antialiased select-none"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
