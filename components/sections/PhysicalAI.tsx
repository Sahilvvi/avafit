"use client"

import { useRef } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { Activity, Cpu, Zap, type LucideIcon } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"

type Column = {
  icon: LucideIcon
  n: string
  title: string
  body: string
  tag: "Shipping" | "In development"
}

const COLUMNS: Column[] = [
  {
    icon: Activity,
    n: "01",
    title: "Sense",
    body: "Two 3×3 pressure pads, anterior and posterior, plus a 6-axis IMU, sampling the socket–limb interface continuously through walking, standing, and rest. Not a bench measurement. The actual load, as it happens.",
    tag: "Shipping",
  },
  {
    icon: Cpu,
    n: "02",
    title: "Reason",
    body: "Inference runs on the socket. Per-cell Kalman filtering separates genuine pressure change from sensor noise and slow compression drift; embedded models classify activity and load state without a cloud round trip. The socket does not need a signal to know what is happening.",
    tag: "Shipping",
  },
  {
    icon: Zap,
    n: "03",
    title: "Act",
    body: "The loop closes onto hardware. A dual-drive with cable-loop tensioning adjusts socket volume in response to what the sensors read — relieving load before the wearer has to notice it.",
    tag: "In development",
  },
]

function ColumnCard({ column, index }: { column: Column; index: number }) {
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

  const isShipping = column.tag === "Shipping"

  return (
    <Reveal delay={index * 0.1} className="h-full">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[linear-gradient(160deg,hsl(var(--card)/0.85),hsl(var(--card)/0.3))] ring-1 ring-inset ring-foreground/[0.06] p-7 md:p-8 transition-[box-shadow] duration-300 hover:ring-primary/25"
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.10] to-transparent"
        />

        <div className="relative flex items-start justify-between">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-inset ring-primary/15 transition-transform duration-300 group-hover:scale-105">
            <column.icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.6} />
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ring-1 ring-inset ${
              isShipping
                ? "bg-primary/10 text-primary ring-primary/20"
                : "bg-foreground/[0.05] text-muted-foreground ring-foreground/10"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isShipping ? "bg-primary" : "bg-muted-foreground/60"}`} />
            {column.tag}
          </span>
        </div>

        <div className="relative mt-6">
          <span className="font-mono text-[11px] text-muted-foreground/40">{column.n}</span>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{column.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{column.body}</p>
        </div>
      </div>
    </Reveal>
  )
}

export function PhysicalAI() {
  return (
    <section id="physical-ai" className="relative py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_0%,hsl(var(--primary)/0.07),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Sense · Reason · Act"
            title="Physical AI is intelligence that touches you back."
            description="Software that only predicts is still a spectator. AVA Fit is built as a control loop that runs on the body: sensors that read the interface under real gait, inference that runs on the socket without a network, and hardware that will act on what it learns."
            align="center"
            className="mx-auto max-w-2xl"
          />
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {COLUMNS.map((c, i) => (
            <ColumnCard key={c.title} column={c} index={i} />
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="mt-14 text-center text-sm md:text-base leading-relaxed text-muted-foreground">
            Phase 1 puts the sensing and the inference on the limb. Phase 2 gives them hands.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
