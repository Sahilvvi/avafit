"use client"

import { useRef } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { CalendarClock, MapPinned, LineChart, type LucideIcon } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"

type Point = {
  icon: LucideIcon
  n: string
  title: string
  body: string
}

const POINTS: Point[] = [
  {
    icon: CalendarClock,
    n: "01",
    title: "Session history",
    body: "Session history the patient brings to the appointment.",
  },
  {
    icon: MapPinned,
    n: "02",
    title: "Per-region load",
    body: "Per-region load referenced to socket anatomy, not raw sensor indices.",
  },
  {
    icon: LineChart,
    n: "03",
    title: "Adjustment outcomes",
    body: "Adjustment outcomes tracked across weeks, so a change can be evaluated instead of assumed.",
  },
]

function PointCard({ point, index }: { point: Point; index: number }) {
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

  return (
    <Reveal delay={index * 0.1} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="group relative h-full overflow-hidden rounded-2xl bg-[linear-gradient(160deg,hsl(var(--card)/0.85),hsl(var(--card)/0.3))] ring-1 ring-inset ring-foreground/[0.06] p-7 transition-[box-shadow] duration-300 hover:ring-primary/25 hover:shadow-[0_24px_50px_-30px_hsl(var(--primary)/0.4)]"
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        {/* Rule that draws itself across the top of this card on reveal. */}
        <motion.span
          aria-hidden
          className="absolute left-0 top-0 h-px bg-gradient-to-r from-primary via-primary/40 to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.25 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="relative flex items-start justify-between">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-inset ring-primary/15 transition-transform duration-300 group-hover:scale-105">
            <point.icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.6} />
          </span>
          <span className="font-mono text-[11px] text-muted-foreground/40">{point.n}</span>
        </div>

        <h3 className="relative mt-5 text-base font-semibold text-foreground">{point.title}</h3>
        <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{point.body}</p>
      </motion.div>
    </Reveal>
  )
}

export function ClinicalTeam() {
  return (
    <section id="clinical-team" className="relative py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_0%,hsl(var(--primary)/0.06),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="For the clinical team"
            title="What the socket saw between visits."
            description="Between fittings, you are working from what the patient remembers. AVA Fit© gives you the record."
            align="center"
            className="mx-auto max-w-2xl"
          />
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {POINTS.map((p, i) => (
            <PointCard key={p.title} point={p} index={i} />
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-16 flex flex-col items-center justify-center gap-4">
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.14em] text-primary/80">
              Designed and developed by Quorum Prosthetics
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-primary/50" />
              <p className="text-center font-mono text-[11px] uppercase tracking-[0.14em] leading-relaxed text-muted-foreground/70 max-w-2xl">
                AVA Fit&copy; is the intelligent, adaptive evolution of Quorum&apos;s QUATRO socket platform —
                built on QUATRO&apos;s proven adjustability and mechanical design, with embedded sensing and
                adaptive control added to keep fit optimal through daily volume changes.
              </p>
              <span className="h-px w-8 bg-primary/50" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
