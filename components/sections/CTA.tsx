"use client"

import { motion } from "framer-motion"
import { ArrowUp, Apple } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/reveal"

/** A slow pressure trace that draws itself and keeps pulsing — the section's
 *  "your socket is already talking" line, said visually. */
function SignalTrace() {
  return (
    <svg
      viewBox="0 0 900 120"
      className="w-full h-full"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ctaTrace" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          <stop offset="18%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
          <stop offset="82%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0,60 H150 L175,60 L190,34 L205,86 L220,52 L235,60 H330 L350,60 L365,44 L380,74 L395,60 H520 L545,60 L560,26 L575,92 L590,48 L605,60 H720 L740,60 L753,46 L766,72 L780,60 H900"
        stroke="url(#ctaTrace)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <circle r="3" fill="hsl(var(--primary))">
        <animateMotion
          dur="7s"
          repeatCount="indefinite"
          path="M0,60 H150 L175,60 L190,34 L205,86 L220,52 L235,60 H330 L350,60 L365,44 L380,74 L395,60 H520 L545,60 L560,26 L575,92 L590,48 L605,60 H720 L740,60 L753,46 L766,72 L780,60 H900"
        />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.92;1" dur="7s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export function CTA() {
  return (
    <section id="get-app" className="relative py-32 md:py-44 overflow-hidden">
      {/* Layered ambient light rather than a bordered panel, so this closes
          the page as a swell instead of another boxed-off slab. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_55%,hsl(var(--primary)/0.13),transparent_72%)]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[110px]"
        animate={{ opacity: [0.55, 1, 0.55], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-16 h-24 opacity-70">
        <SignalTrace />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary mb-8">
            Get AVA Fit
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground text-balance leading-[1.06]">
            Your socket is already
            <br />
            telling you something.
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/50 bg-clip-text text-transparent">
              Start listening.
            </span>
          </h2>
          <p className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            AVA Fit is in active testing now. The App Store link goes live at
            launch — check back soon, or share this page with your care team.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button variant="outline" size="lg" disabled className="opacity-70">
              <Apple className="h-4 w-4" />
              Coming soon to the App Store
            </Button>
            <Button href="#top" variant="ghost" size="lg" className="group">
              Back to top
              <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
