import { Nav } from "@/components/sections/Nav"
import { Hero } from "@/components/sections/Hero"
import { Problem } from "@/components/sections/Problem"
import { PhysicalAI } from "@/components/sections/PhysicalAI"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { AppPreview } from "@/components/sections/AppPreview"
import { Features } from "@/components/sections/Features"
import { SocketExplorer } from "@/components/sections/SocketExplorer"
import { ClinicalTrust } from "@/components/sections/ClinicalTrust"
import { ClinicalTeam } from "@/components/sections/ClinicalTeam"
import { FAQ } from "@/components/sections/FAQ"
import { CTA } from "@/components/sections/CTA"
import { Footer } from "@/components/sections/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Problem />
      <PhysicalAI />
      <HowItWorks />
      <AppPreview />
      <Features />
      <SocketExplorer />
      <ClinicalTrust />
      <ClinicalTeam />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
