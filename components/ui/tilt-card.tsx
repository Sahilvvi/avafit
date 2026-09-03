"use client"

import { useRef } from "react"
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

/** Cursor-driven 3D tilt + a light sheen that tracks the pointer — the
 * "physical object you can pick up" feel Apple product pages use on their
 * hero shots. Disabled on touch (no hover) so it never fights a mobile drag. */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const spring = { stiffness: 150, damping: 20, mass: 0.5 }
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), spring)
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), spring)
  const sheenX = useTransform(mx, [0, 1], ["0%", "100%"])
  const sheenY = useTransform(my, [0, 1], ["0%", "100%"])
  const sheenBg = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.14), transparent 45%)`

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }

  function onLeave() {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={cn("relative [transform-style:preserve-3d]", className)}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ background: sheenBg }}
      />
    </motion.div>
  )
}
