import type { Metadata } from "next"
import { Manrope, DM_Mono } from "next/font/google"
import "./globals.css"

// Same font pairing as the app itself (ava-fit-ios/app/_layout.tsx) — the
// mono-label + Manrope-headline combination is the app's own "clinical
// instrument" motif, not a generic marketing typeface pick.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
})

const TITLE = "AVA Fit — Adaptive Volume Adjustment Socket"
const DESCRIPTION =
  "AVA Fit closes the loop between the limb and the socket. A pressure matrix and a 6-axis IMU sense the interface continuously, inference runs on the socket itself, and the result reaches you as a fit score you can see."

// Resolves the absolute base for OG/Twitter image URLs. Vercel sets
// VERCEL_URL automatically on every deployment (preview and production), so
// this self-configures with no manual env var needed. Once a custom domain
// is attached, set NEXT_PUBLIC_SITE_URL in the Vercel project settings to
// pin it there instead of the deployment's own *.vercel.app host.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // app/icon.png, app/apple-icon.png, and app/opengraph-image.png are
  // picked up automatically by Next's file convention — this block just
  // fills in the title/description/type those images get paired with.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "AVA Fit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${manrope.variable} ${dmMono.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  )
}
