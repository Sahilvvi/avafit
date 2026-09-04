"use client"

import { useRef } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"

const POINTS: { stat: string; unit: string; label: string }[] = [
  {
    stat: "Hours",
    unit: "the window fit changes in",
    label:
      "Limb volume shifts across a single day of wear. A socket dialed in at 8am can be working loose by noon, and nothing about that is visible from the outside.",
  },
  {
    stat: "Silent",
    unit: "how the damage arrives",
    label:
      "Pressure injuries build gradually, under a liner, out of sight. They are often noticed only once the skin has broken down and the socket has to come off entirely.",
  },
  {
    stat: "Weeks",
    unit: "between real measurements",
    label:
      "Fittings are episodic; wear is continuous. What happens inside the socket in between has gone unmeasured.",
  },
]

/**
 * "Fit drifting over a day" — illustrating the concept, not plotting real
 * numbers. Labels sit in reserved margin above and below the plot so they can
 * never collide with the curve, and the stroke grades cyan → red as the day
 * runs out.
 */
function DriftChart() {
  const CURVE =
    "M40,58 C110,55 150,64 200,80 C250,96 286,94 340,118 C380,135 402,141 420,147"

  return (
    <svg
      viewBox="0 0 440 200"
      className="w-full h-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration: socket fit drifting from dialed in at 8am to working loose by 6pm"
    >
      {/* plot gridlines */}
      {[58, 102, 147].map((y) => (
        <line key={y} x1="40" y1={y} x2="420" y2={y} stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 7" />
      ))}

      {/* area fill under the curve */}
      <motion.path
        d={`${CURVE} V180 H40 Z`}
        fill="url(#driftFade)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
      />

      {/* the curve itself */}
      <motion.path
        d={CURVE}
        stroke="url(#driftStroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* endpoints */}
      <motion.circle
        cx="40"
        cy="58"
        r="4"
        fill="hsl(var(--primary))"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25 }}
      />
      <motion.g
        initial={{ opacity: 0, scale: 0.4 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.75, type: "spring", stiffness: 220 }}
        style={{ originX: "420px", originY: "147px" }}
      >
        <circle cx="420" cy="147" r="10" fill="#F54257" fillOpacity="0.16">
          <animate attributeName="r" values="10;15;10" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.16;0;0.16" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="420" cy="147" r="4.5" fill="#F54257" />
      </motion.g>

      {/* Labels live in the reserved margins — above the plot and below it —
          so they never sit on top of the curve at any width. */}
      {/* Sized generously in viewBox units — the whole SVG scales down on
          narrow screens, so 10px here lands under 7px on a phone. */}
      <text x="40" y="26" fontSize="13" letterSpacing="1.4" className="fill-muted-foreground" fontFamily="var(--font-dm-mono)">
        8AM · DIALED IN
      </text>
      <text x="420" y="193" textAnchor="end" fontSize="13" letterSpacing="1.4" className="fill-[#F54257]" fontFamily="var(--font-dm-mono)">
        6PM · WORKING LOOSE
      </text>

      <defs>
        <linearGradient id="driftFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="driftStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="62%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="#F54257" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function StatCell({ point, index }: { point: (typeof POINTS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)
  const glow = useMotionTemplate`radial-gradient(300px circle at ${mx}px ${my}px, hsl(var(--primary)/0.10), transparent 70%)`

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  function onLeave() {
    mx.set(-200)
    my.set(-200)
  }

  return (
    // h-full on the Reveal wrapper matters: it is the grid item, so without
    // it the cell stops short of the row and the divider rules run ragged.
    <Reveal delay={index * 0.1} className="h-full">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative flex h-full flex-col overflow-hidden px-7 py-9 md:px-9 md:py-11"
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />

        {/* Rule that draws itself across the top of this cell on reveal. */}
        <motion.span
          aria-hidden
          className="absolute left-0 top-0 h-px bg-gradient-to-r from-primary via-primary/40 to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.25 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="relative">
          <span className="font-mono text-[11px] text-muted-foreground/40">0{index + 1}</span>

          <p className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight text-foreground transition-[text-shadow] duration-500 group-hover:[text-shadow:0_0_28px_hsl(var(--primary)/0.35)]">
            {point.stat}
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-primary/70">
            {point.unit}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{point.label}</p>
        </div>
      </div>
    </Reveal>
  )
}

export function Problem() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Why fit drifts"
              title="Every prosthetic socket today is an open loop."
              description="A socket is shaped once, fitted once, and then asked to hold a body that changes hourly. Nothing in that system measures what it is doing, and nothing in it responds. The gap between when a problem starts and when it is finally felt is where pressure injuries take hold."
            />
          </Reveal>

          {/* The chart sits on the same soft ring surface the rest of the page
              uses, and stays inside the container instead of bleeding out. */}
          <Reveal delay={0.15}>
            <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(160deg,hsl(var(--card)/0.8),hsl(var(--card)/0.25))] p-6 ring-1 ring-inset ring-foreground/[0.06] md:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.10] to-transparent"
              />
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Fit over one day of wear
                </span>
              </div>

              <div className="mt-4">
                <DriftChart />
              </div>
            </div>
          </Reveal>
        </div>

        {/* One continuous panel divided by hairlines — the three beats of a
            single argument, not three detached cards. */}
        <div className="mt-20 overflow-hidden rounded-2xl bg-[linear-gradient(160deg,hsl(var(--card)/0.7),hsl(var(--card)/0.22))] ring-1 ring-inset ring-foreground/[0.06]">
          <div className="grid divide-y divide-foreground/[0.06] md:grid-cols-3 md:divide-x md:divide-y-0">
            {POINTS.map((p, i) => (
              <StatCell key={p.stat} point={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
