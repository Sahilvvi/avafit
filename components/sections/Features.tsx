"use client"

import { useRef } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { Box, ShieldCheck, Compass, History, Activity, Bluetooth, ClipboardList, Cpu, type LucideIcon } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"

/* ------------------------------------------------------------------ *
 * Cell visuals — each one draws the actual mechanism the copy claims,
 * so the wide cells carry evidence rather than decorative filler.
 * ------------------------------------------------------------------ */

/** Raw signal vs the filtered one — the whole point of the filtering stage. */
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
  visual?: () => JSX.Element
}

const FEATURES: Feature[] = [
  {
    icon: Box,
    title: "Live 3D pressure map",
    body: "Your own socket scan, rendered in 3D and colored live by the pressure matrix — drag to rotate, pinch to zoom.",
  },
  {
    icon: ShieldCheck,
    title: "Pressure-injury risk indicators",
    body: "A transparent heuristic that always shows the specific factors behind a risk level.",
  },
  {
    icon: Compass,
    title: "Socket fit suggestions",
    body: "Per-region guidance — RELIEVE, ADD SUPPORT, and MONITOR — are observations for your prosthetist, not adjustment instructions.",
  },
  {
    icon: Activity,
    title: "Filtered sensor data",
    body: "A per-cell filter separates genuine pressure change from sensor noise and slow compression drift.",
    visual: FilterTrace,
  },
  {
    icon: Bluetooth,
    title: "Bluetooth, with a fallback",
    body: "Connects straight to your socket over BLE, with a bridge connection as a reliable second path.",
    visual: LinkViz,
  },
  {
    icon: History,
    title: "Session & wear tracking",
    body: "Every session logged automatically, with wear time and trends you and your care team can look back on.",
  },
  {
    icon: ClipboardList,
    title: "Care-team session export",
    body: "Wear time, per-region load, and event history in a form your prosthetist can review at the next fitting.",
  },
  {
    icon: Cpu,
    title: "Edge-resident inference",
    body: "Filtering and classification run on the socket. No connectivity required for the system to keep working.",
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

        <div className="relative flex h-full flex-col gap-5">
          <div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-inset ring-primary/15 transition-transform duration-300 group-hover:scale-105">
              <feature.icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.6} />
            </span>
            <h3 className="mt-5 text-base font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
          </div>

          {Visual && (
            <div className="mt-auto flex items-center justify-center pt-1 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
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
            title="What's in the build today."
          />
        </Reveal>

        {/* Uniform grid — every card the same size, so the visuals sit
            inside the card rather than dictating its footprint. */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCell key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
