import { Nav } from "@/components/sections/Nav"
import { Hero } from "@/components/sections/Hero"
import { Problem } from "@/components/sections/Problem"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { Features } from "@/components/sections/Features"
import { AppPreview } from "@/components/sections/AppPreview"
import { ClinicalTrust } from "@/components/sections/ClinicalTrust"
import { FAQ } from "@/components/sections/FAQ"
import { CTA } from "@/components/sections/CTA"
import { Footer } from "@/components/sections/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <AppPreview />
      <ClinicalTrust />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
