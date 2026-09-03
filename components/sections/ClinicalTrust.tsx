"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gauge, TimerReset, GitBranch, TrendingDown, type LucideIcon } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"

type Factor = {
  icon: LucideIcon
  title: string
  short: string
  body: string
  basis: string
  /** Where this factor sits on the demo gauge when selected (0–1). */
  level: number
}

const FACTORS: Factor[] = [
  {
    icon: Gauge,
    title: "Pressure-time integral",
    short: "How much, for how long",
    body: "Pressure is accumulated over time rather than sampled at its peak, then weighed against the capillary-closing-pressure reference. Tissue tolerates a brief spike; it does not tolerate a moderate load that never lets up.",
    basis: "~4.3 kPa reference · Landis 1930",
    level: 0.62,
  },
  {
    icon: TimerReset,
    title: "No-relief duration",
    short: "How long since the last break",
    body: "The longest continuous stretch without a meaningful pressure drop, tracked independently of magnitude — because periodic offloading is the single most established prevention measure, and its absence is a risk signal on its own.",
    basis: "Periodic-offloading guidance",
    level: 0.78,
  },
  {
    icon: GitBranch,
    title: "Load concentration",
    short: "Spread out, or all in one spot",
    body: "A Gini coefficient across the sensor array. The same total load reads very differently when it is carried broadly by the socket wall versus driven through a single sharp point of contact.",
    basis: "Distribution across 18 channels",
    level: 0.45,
  },
  {
    icon: TrendingDown,
    title: "Distal-load drift",
    short: "Where the load is migrating",
    body: "A rising pressure trend at the distal end of the limb over a session — the classic signature of volume loss, and of a socket quietly working loose while it is still being worn.",
    basis: "Within-session trend",
    level: 0.55,
  },
]

/** Demo gauge — reflects the selected factor so the section shows the
 *  mechanism working, rather than describing it in four static boxes. */
function RiskGauge({ level, label }: { level: number; label: string }) {
  const R = 78
  const CIRC = Math.PI * R // half-circle arc length

  return (
    <div className="relative">
      <svg viewBox="0 0 200 120" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="55%" stopColor="#F5C842" />
            <stop offset="100%" stopColor="#F54257" />
          </linearGradient>
        </defs>

        <path
          d={`M ${100 - R},100 A ${R},${R} 0 0 1 ${100 + R},100`}
          stroke="hsl(var(--border))"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <motion.path
          d={`M ${100 - R},100 A ${R},${R} 0 0 1 ${100 + R},100`}
          stroke="url(#gaugeGrad)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          animate={{ strokeDashoffset: CIRC * (1 - level) }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />

        {/* Needle */}
        <motion.g
          style={{ originX: "100px", originY: "100px" }}
          animate={{ rotate: -90 + level * 180 }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
        >
          <line x1="100" y1="100" x2="100" y2="34" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="100" r="5" fill="hsl(var(--foreground))" />
        </motion.g>
      </svg>

      <div className="absolute inset-x-0 bottom-0 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
          >
            {label}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function ClinicalTrust() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => setActive((p) => (p + 1) % FACTORS.length), 3400)
    return () => clearInterval(id)
  }, [auto])

  const current = FACTORS[active]

  return (
    <section id="trust" className="relative py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_20%,hsl(var(--primary)/0.06),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Clinical basis"
            title="A risk score you can audit, not one you have to trust blind."
            description="Four literature-grounded factors, combined per anatomical region — and always shown alongside the specific factors that produced the level, never just the level itself."
          />
        </Reveal>

        {/* Interactive factor breakdown: an index on the left, the selected
            factor expanded on the right, driving a live gauge. Reads as one
            instrument rather than four repeated cards. */}
        <div className="mt-16 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-10 lg:gap-16 items-start">
          <Reveal>
            <ul className="space-y-1">
              {FACTORS.map((f, i) => {
                const isActive = i === active
                return (
                  <li key={f.title}>
                    <button
                      onMouseEnter={() => {
                        setAuto(false)
                        setActive(i)
                      }}
                      onFocus={() => {
                        setAuto(false)
                        setActive(i)
                      }}
                      onClick={() => {
                        setAuto(false)
                        setActive(i)
                      }}
                      className="group relative w-full text-left py-5 pl-5 pr-4 rounded-xl transition-colors duration-300"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="trust-active"
                          className="absolute inset-0 rounded-xl bg-foreground/[0.04]"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      {/* Left rule that fills in on the active row. */}
                      <span className="absolute left-0 top-3 bottom-3 w-px bg-border" />
                      <motion.span
                        className="absolute left-0 top-3 w-px bg-primary"
                        animate={{ height: isActive ? "calc(100% - 24px)" : 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />

                      <span className="relative flex items-center gap-4">
                        <span
                          className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            isActive ? "bg-primary/15" : "bg-foreground/[0.04]"
                          }`}
                        >
                          <f.icon
                            className={`h-4 w-4 transition-colors duration-300 ${
                              isActive ? "text-primary" : "text-muted-foreground"
                            }`}
                            strokeWidth={1.5}
                          />
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block text-sm font-medium transition-colors duration-300 ${
                              isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          >
                            {f.title}
                          </span>
                          <span className="block text-xs text-muted-foreground/70 mt-0.5">{f.short}</span>
                        </span>
                        <span className="ml-auto font-mono text-[11px] text-muted-foreground/50 shrink-0">
                          0{i + 1}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative rounded-3xl bg-[linear-gradient(160deg,hsl(var(--card)/0.9),hsl(var(--card)/0.35))] ring-1 ring-inset ring-foreground/[0.07] p-8 md:p-10">
              <div className="max-w-[240px] mx-auto">
                <RiskGauge level={current.level} label={current.short} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8"
                >
                  <h3 className="text-xl font-semibold text-foreground">{current.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{current.body}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="h-px w-6 bg-primary/60" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary/80">
                      {current.basis}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {/* Pull quote — the actual differentiator, given room to land. */}
        <Reveal delay={0.2}>
          <figure className="relative mt-20 mx-auto max-w-4xl text-center">
            <span
              aria-hidden
              className="block font-serif text-[80px] leading-none text-primary/15 select-none"
            >
              &ldquo;
            </span>
            <blockquote className="-mt-6 text-xl md:text-2xl font-medium leading-snug text-foreground/90 text-balance">
              The risk screening is deliberately a transparent heuristic, not a
              trained classifier. There is no clinician-labelled ground truth to
              train one against honestly yet — and a model fitted to an
              unvalidated rule would only reproduce that rule&apos;s mistakes with{" "}
              <span className="text-primary">less</span> visibility, not more accuracy.
            </blockquote>
            <figcaption className="mt-8 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-primary/50" />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Design principle, not a disclaimer
              </span>
              <span className="h-px w-8 bg-primary/50" />
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.28}>
          <p className="mt-10 text-center font-mono text-[11px] leading-relaxed text-muted-foreground/60">
            Landis, E.M. (1930). &ldquo;Micro-injection studies of capillary blood
            pressure in human skin.&rdquo; Heart, 15, 209–228.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
