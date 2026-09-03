"use client"

import Image from "next/image"
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform, type MotionValue } from "framer-motion"

/** Native size of the captures these frames hold (2x of a 390x844 viewport). */
const SHOT_W = 780
const SHOT_H = 1688

export interface PhoneMockupProps {
  src: string
  alt: string
  /** Resting yaw, in degrees. Positive turns the device's right edge away. */
  baseRotateY?: number
  /** Vertical offset used to stagger a pair of devices. */
  offsetY?: number
  /** Idle float cycle length; staggered so a pair never bobs in lockstep. */
  floatDuration?: number
  floatDelay?: number
  priority?: boolean
  className?: string
}

/**
 * A hardware-accurate device shell rather than a bordered card: titanium-style
 * rail, real corner geometry, dynamic island, side buttons, and a screen that
 * catches a moving specular highlight. The whole shell lives in 3D and tracks
 * the cursor, so the depth is genuine perspective, not a drawn shadow.
 */
export function PhoneMockup({
  src,
  alt,
  baseRotateY = 0,
  offsetY = 0,
  floatDuration = 7,
  floatDelay = 0,
  priority = false,
  className = "",
}: PhoneMockupProps) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const spring = { stiffness: 150, damping: 20, mass: 0.6 }
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), spring)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [baseRotateY - 11, baseRotateY + 11]), spring)

  const glareX = useTransform(mx, [-0.5, 0.5], [78, 22])
  const glareY = useTransform(my, [-0.5, 0.5], [78, 22])
  const glare = useMotionTemplate`radial-gradient(circle 420px at ${glareX}% ${glareY}%, rgba(255,255,255,0.13), rgba(255,255,255,0.03) 42%, transparent 68%)`

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <div className={`[perspective:1800px] ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div
        initial={{ opacity: 0, y: 56, rotateX: 16 }}
        whileInView={{ opacity: 1, y: offsetY, rotateX: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: floatDelay * 0.12 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Idle float, kept on its own layer so it composes with the tilt
            rather than fighting the pointer spring. */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* Ground shadow, pushed back in Z so perspective spreads it as the
              device turns. */}
          <div
            aria-hidden
            className="absolute inset-x-4 -bottom-8 h-24 rounded-[50%] bg-black/70 blur-3xl"
            style={{ transform: "translateZ(-90px)" }}
          />
          {/* Brand bloom. */}
          <div
            aria-hidden
            className="absolute -inset-12 rounded-[999px] bg-primary/[0.10] blur-[70px]"
            style={{ transform: "translateZ(-120px)" }}
          />

          {/* Side buttons — thin rails behind the body, so they read as part of
              the device edge when it yaws. */}
          <div
            aria-hidden
            className="absolute -left-[3px] top-[22%] h-[5%] w-[3px] rounded-l-sm bg-gradient-to-b from-[#4a5160] to-[#232833]"
            style={{ transform: "translateZ(-6px)" }}
          />
          <div
            aria-hidden
            className="absolute -left-[3px] top-[31%] h-[8%] w-[3px] rounded-l-sm bg-gradient-to-b from-[#4a5160] to-[#232833]"
            style={{ transform: "translateZ(-6px)" }}
          />
          <div
            aria-hidden
            className="absolute -right-[3px] top-[26%] h-[11%] w-[3px] rounded-r-sm bg-gradient-to-b from-[#4a5160] to-[#232833]"
            style={{ transform: "translateZ(-6px)" }}
          />

          {/* Titanium rail */}
          <div className="relative rounded-[13.5%/6.2%] bg-[linear-gradient(145deg,#5b6270_0%,#2b303b_18%,#171b24_50%,#2b303b_82%,#5b6270_100%)] p-[2.5%] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.95)]">
            {/* Inner bezel */}
            <div className="relative rounded-[11.5%/5.2%] bg-black p-[1.6%]">
              {/* Screen */}
              <div className="relative overflow-hidden rounded-[10%/4.4%] bg-background">
                <Image
                  src={src}
                  alt={alt}
                  width={SHOT_W}
                  height={SHOT_H}
                  priority={priority}
                  className="block h-auto w-full"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw"
                />

                {/* Dynamic island */}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-[1.4%] h-[2.6%] w-[30%] -translate-x-1/2 rounded-full bg-black"
                />

                {/* Moving specular highlight across the glass. */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-screen"
                  style={{ background: glare }}
                />
                {/* Fixed diagonal sheen so the glass reads as glass even at rest. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.10)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.045)_100%)]"
                />
              </div>
            </div>

            {/* Rail top highlight — the single detail that sells metal. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[13.5%/6.2%] ring-1 ring-inset ring-white/[0.14]"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
