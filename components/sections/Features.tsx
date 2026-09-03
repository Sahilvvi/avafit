"use client"

import { useRef } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { Box, ShieldCheck, Compass, History, Activity, Bluetooth, type LucideIcon } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"

/* ------------------------------------------------------------------ *
 * Cell visuals — each one draws the actual mechanism the copy claims,
 * so the wide cells carry evidence rather than decorative filler.
 * ------------------------------------------------------------------ */

/** The real sensor layout: two 3×3 pads, anterior and posterior, cycling
 *  through plausible pressure levels. */
function SensorMatrix() {
  const PADS = [0, 1]
  // Scale of pressure levels, low → high.
  const SCALE = [
    "hsl(var(--primary) / 0.18)",
    "hsl(var(--primary) / 0.40)",
    "rgba(245, 200, 66, 0.50)",
    "rgba(245, 66, 87, 0.62)",
  ]
  // A resting pattern per pad, hotter toward the centre/distal cells — the
  // kind of distribution the app actually surfaces as a spot to watch.
  const BASE = [
    [0, 1, 0, 1, 2, 1, 1, 2, 1],
    [1, 0, 0, 2, 3, 1, 1, 1, 0],
  ]

  return (
    <div className="flex items-center gap-5" aria-hidden>
      {PADS.map((pad) => (
        <div key={pad} className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 9 }).map((_, i) => {
            const base = BASE[pad][i]
            // Always breathe one step around the resting level, so no cell
            // is ever visually frozen.
            const lo = SCALE[Math.max(0, base - 1)]
            const at = SCALE[base]
            const hi = SCALE[Math.min(SCALE.length - 1, base + 1)]
            return (
              <motion.span
                key={i}
                className="h-4 w-4 rounded-[4px] ring-1 ring-inset ring-foreground/[0.08]"
                animate={{ backgroundColor: [lo, at, hi, at, lo] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: ((i * 7 + pad * 3) % 9) * 0.22,
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

/** Raw signal vs the filtered one — the whole point of the Kalman stage. */
function FilterTrace() {
  const RAW =
    "M0,34 L14,22 L26,40 L38,18 L52,44 L64,20 L78,38 L92,16 L104,42 L118,24 L132,36 L146,20 L160,38 L174,26 L188,34"
  const SMOOTH = "M0,33 C40,28 70,30 100,29 C132,28 160,31 188,30"

  return (
    <svg viewBox="0 0 188 56" className="w-full h-auto max-w-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d={RAW} stroke="hsl(var(--muted-foreground))" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <motion.path
        d={SMOOTH}
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <circle r="2.5" fill="hsl(var(--primary))">
        <animateMotion dur="5s" repeatCount="indefinite" path={SMOOTH} />
      </circle>
    </svg>
  )
}

/** Primary BLE link with the bridge path underneath it as the fallback. */
function LinkViz() {
  return (
    <svg viewBox="0 0 200 64" className="w-full h-auto max-w-[230px]" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* endpoints */}
      <rect x="2" y="18" width="20" height="30" rx="4" stroke="hsl(var(--foreground))" strokeOpacity="0.35" strokeWidth="1.5" />
      <ellipse cx="182" cy="32" rx="14" ry="18" stroke="hsl(var(--foreground))" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* primary BLE path */}
      <line x1="26" y1="26" x2="164" y2="26" stroke="hsl(var(--primary))" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle r="2.5" fill="hsl(var(--primary))">
        <animateMotion dur="2.6s" repeatCount="indefinite" path="M26,26 L164,26" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.9;1" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <text x="30" y="19" fontSize="7" letterSpacing="1" className="fill-primary" fontFamily="var(--font-dm-mono)">
        BLE
      </text>

      {/* bridge fallback */}
      <line x1="26" y1="42" x2="164" y2="42" stroke="hsl(var(--muted-foreground))" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 5" />
      <text x="30" y="54" fontSize="7" letterSpacing="1" className="fill-muted-foreground" fontFamily="var(--font-dm-mono)">
        BRIDGE
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */

type Feature = {
  icon: LucideIcon
  title: string
  body: string
  /** Column span at md+. Wide cells carry a visual. */
  wide?: boolean
  visual?: () => JSX.Element
}

const FEATURES: Feature[] = [
  {
    icon: Box,
    title: "Live 3D pressure map",
    body: "Your own socket scan, rendered in 3D and coloured live by all 18 sensors — drag to rotate, pinch to zoom.",
    wide: true,
    visual: SensorMatrix,
  },
  {
    icon: ShieldCheck,
    title: "Pressure-injury risk screening",
    body: "A transparent heuristic — not a black-box model — that always shows the specific factors behind a risk level.",
  },
  {
    icon: Compass,
    title: "Socket fit suggestions",
    body: "Per-region guidance — RELIEVE, ADD SUPPORT, or MONITOR — so you know not just where, but roughly what to do.",
  },
  {
    icon: Activity,
    title: "Kalman-filtered sensor data",
    body: "A per-cell filter separates genuine pressure change from sensor noise and slow compression drift.",
    wide: true,
    visual: FilterTrace,
  },
  {
    icon: Bluetooth,
    title: "Bluetooth, with a fallback",
    body: "Connects straight to your socket over BLE, with a bridge connection as a reliable second path.",
    wide: true,
    visual: LinkViz,
  },
  {
    icon: History,
    title: "Session & wear tracking",
    body: "Every session logged automatically, with wear time and trends you and your care team can look back on.",
  },
]

function FeatureCell({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)
  const glow = useMotionTemplate`radial-gradient(300px circle at ${mx}px ${my}px, hsl(var(--primary)/0.13), transparent 70%)`

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }

  function onLeave() {
    mx.set(-200)
    my.set(-200)
  }

  const Visual = feature.visual

  return (
    <Reveal delay={(index % 2) * 0.08}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="group relative h-full overflow-hidden rounded-2xl bg-[linear-gradient(160deg,hsl(var(--card)/0.85),hsl(var(--card)/0.3))] ring-1 ring-inset ring-foreground/[0.06] p-7 transition-[box-shadow] duration-300 hover:ring-primary/25 hover:shadow-[0_24px_50px_-30px_hsl(var(--primary)/0.4)]"
      >
        {/* Cursor glow */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        {/* Top edge catch-light, brightest at the hovered corner. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.10] to-transparent"
        />

        <div className={`relative flex h-full gap-6 ${feature.wide ? "flex-col sm:flex-row sm:items-center" : "flex-col"}`}>
          <div className="flex-1">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-inset ring-primary/15 transition-transform duration-300 group-hover:scale-105">
              <feature.icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.6} />
            </span>
            <h3 className="mt-5 text-base font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
          </div>

          {Visual && (
            <div className="shrink-0 sm:pl-2 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
              <Visual />
            </div>
          )}
        </div>
      </motion.div>
    </Reveal>
  )
}

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_45%_at_15%_25%,hsl(var(--primary)/0.05),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="What's actually in the app"
            title="Every feature here is in the product today — nothing on this page is a mockup."
          />
        </Reveal>

        {/* Asymmetric bento: the three features with something to show get the
            wide cells, so the grid has rhythm instead of six identical boxes. */}
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={f.wide ? "md:col-span-2" : "md:col-span-1"}>
              <FeatureCell feature={f} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
