"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"
import { StageArt } from "@/components/diagrams/SocketSensorDiagram"
import { SpotlightCursor } from "@/components/ui/spotlight-cursor"

const STEPS: { n: string; kicker: string; title: string; body: string }[] = [
  {
    n: "01",
    kicker: "Measure",
    title: "Eighteen sensors, one socket",
    body: "Two 3×3 pressure pads — anterior and posterior — plus a 6-axis IMU, reading pressure and motion continuously while the socket is worn.",
  },
  {
    n: "02",
    kicker: "See",
    title: "See it, don't guess it",
    body: "A live 3D render of your own socket scan, colour-mapped by real-time pressure. A hot spot becomes something you can see, not something you infer from a number.",
  },
  {
    n: "03",
    kicker: "Screen",
    title: "Screened, not just measured",
    body: "Pressure-time integral, load concentration, and stretches with no relief combine into a risk read — and it always shows its factors, never a black-box score.",
  },
]

export function HowItWorks() {
  const [active, setActive] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const hoverLock = useRef(false)

  // Cycles on its own so the pipeline reads as alive before anyone touches
  // it; a real hover takes over immediately and hands back shortly after.
  useEffect(() => {
    if (!autoPlay) return
    const id = setInterval(() => {
      if (hoverLock.current) return
      setActive((p) => (p + 1) % STEPS.length)
    }, 2600)
    return () => clearInterval(id)
  }, [autoPlay])

  function onEnter(i: number) {
    hoverLock.current = true
    setAutoPlay(false)
    setActive(i)
  }

  function onLeave() {
    hoverLock.current = false
    setTimeout(() => setAutoPlay(true), 700)
  }

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
      {/* Soft vertical wash instead of a bordered panel — a lift in the same
          surface rather than a separate slab. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,hsl(var(--card)/0.5)_18%,hsl(var(--card)/0.5)_82%,transparent)]"
      />
      <SpotlightCursor className="from-primary/20 via-primary/10 to-transparent" size={400} />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="How AVA Fit works"
            title="From raw pressure to a plain answer, in one pipeline."
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <div className="relative mt-16 grid gap-6 md:grid-cols-3 md:gap-5">
          {/* The rail lives behind the stage art and threads between the three
              nodes, so the diagram and the copy are one object rather than a
              floating infographic sitting above a row of cards. */}
          {/* Node discs are 124px tall, so their centre line is at 62px. */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[58px] hidden md:block">
            <svg viewBox="0 0 1000 8" className="h-2 w-full" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="166" y1="4" x2="834" y2="4" stroke="hsl(var(--border))" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
            </svg>
            {/* Pulses travel the rail in real coordinates so they line up with
                the nodes at any width. */}
            <svg viewBox="0 0 1000 8" className="absolute inset-0 h-2 w-full" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle r="3.5" fill="hsl(var(--primary))">
                <animateMotion dur="3.4s" repeatCount="indefinite" path="M166,4 L834,4" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.07;0.88;1" dur="3.4s" repeatCount="indefinite" />
              </circle>
              <circle r="3.5" fill="hsl(var(--primary))" opacity="0.55">
                <animateMotion dur="3.4s" begin="1.7s" repeatCount="indefinite" path="M166,4 L834,4" />
                <animate attributeName="opacity" values="0;0.55;0.55;0" keyTimes="0;0.07;0.88;1" dur="3.4s" begin="1.7s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {STEPS.map((s, i) => {
            const isActive = active === i
            return (
              <Reveal key={s.n} delay={i * 0.1}>
                <motion.div
                  onMouseEnter={() => onEnter(i)}
                  onMouseLeave={onLeave}
                  animate={{ y: isActive ? -6 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="group relative flex h-full flex-col items-center text-center"
                >
                  {/* Stage node — opaque disc so the rail appears to terminate
                      into it rather than run underneath. */}
                  <div className="relative z-10 mb-7">
                    <motion.div
                      animate={{
                        boxShadow: isActive
                          ? "0 0 0 1px hsl(var(--primary)/0.35), 0 18px 45px -18px hsl(var(--primary)/0.55)"
                          : "0 0 0 1px hsl(var(--foreground)/0.07), 0 12px 30px -18px rgba(0,0,0,0.8)",
                      }}
                      transition={{ duration: 0.4 }}
                      className="flex h-[124px] w-[124px] items-center justify-center rounded-full bg-background p-6"
                    >
                      <StageArt stage={i as 0 | 1 | 2} active={isActive} />
                    </motion.div>

                    {/* Halo that blooms only on the active stage. */}
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/20 blur-2xl"
                      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1.25 : 0.9 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Step body — same soft surface language as the Features
                      bento, not a hard-bordered card. */}
                  <motion.div
                    animate={{
                      backgroundColor: isActive ? "hsl(var(--primary) / 0.05)" : "hsl(var(--card) / 0.45)",
                    }}
                    transition={{ duration: 0.4 }}
                    className={`relative w-full flex-1 overflow-hidden rounded-2xl p-7 ring-1 ring-inset transition-[box-shadow] duration-400 ${
                      isActive ? "ring-primary/25" : "ring-foreground/[0.06]"
                    }`}
                  >
                    {/* Progress hairline that fills while this step is active. */}
                    <motion.span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                      animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0.2 }}
                      transition={{ duration: 0.5 }}
                    />

                    <div className="flex items-center justify-center gap-2.5">
                      <span
                        className={`font-mono text-[11px] tracking-[0.18em] transition-colors duration-300 ${
                          isActive ? "text-primary" : "text-muted-foreground/50"
                        }`}
                      >
                        {s.n}
                      </span>
                      <span className="h-3 w-px bg-foreground/15" />
                      <span
                        className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                          isActive ? "text-primary" : "text-muted-foreground/60"
                        }`}
                      >
                        {s.kicker}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </motion.div>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
