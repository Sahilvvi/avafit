"use client"

import Image from "next/image"
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion"

export interface LaptopMockupProps {
  src: string
  alt: string
  /** Native size of the flat screen capture this frame holds — the frame
   *  takes this exact aspect ratio, so the plate always sits without
   *  cropping or letterboxing regardless of what ratio the capture is. */
  screenWidth: number
  screenHeight: number
  priority?: boolean
  className?: string
}

/**
 * A drawn laptop lid — aluminum rail, camera dot, a screen that catches a
 * moving specular highlight — same device-shell language as PhoneMockup:
 * mouse-tracked 3D tilt, an idle float, a ground shadow pushed back in Z.
 */
export function LaptopMockup({
  src,
  alt,
  screenWidth,
  screenHeight,
  priority = false,
  className = "",
}: LaptopMockupProps) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const spring = { stiffness: 150, damping: 20, mass: 0.6 }
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), spring)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), spring)

  const glareX = useTransform(mx, [-0.5, 0.5], [78, 22])
  const glareY = useTransform(my, [-0.5, 0.5], [78, 22])
  const glare = useMotionTemplate`radial-gradient(circle 460px at ${glareX}% ${glareY}%, rgba(255,255,255,0.12), rgba(255,255,255,0.03) 42%, transparent 68%)`

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
    <div className={`[perspective:1600px] ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div
        initial={{ opacity: 0, y: 56, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* Ground shadow, pushed back in Z so perspective spreads it. */}
          <div
            aria-hidden
            className="absolute inset-x-[6%] -bottom-5 h-14 rounded-[50%] bg-black/70 blur-2xl"
            style={{ transform: "translateZ(-90px)" }}
          />
          {/* Brand bloom. */}
          <div
            aria-hidden
            className="absolute -inset-10 rounded-[40px] bg-primary/[0.10] blur-[70px]"
            style={{ transform: "translateZ(-120px)" }}
          />

          {/* Lid — aluminum rail wrapping the screen, closed off with a
              stand foot instead of an open keyboard deck. */}
          <div className="relative rounded-[2.5%] bg-[linear-gradient(145deg,#5b6270_0%,#2b303b_10%,#171b24_50%,#2b303b_90%,#5b6270_100%)] p-[1.6%] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)]">
            {/* Camera dot */}
            <div
              aria-hidden
              className="absolute left-1/2 top-[0.6%] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-black/80 ring-1 ring-white/10"
            />

            {/* Screen — a real, crisply-rendered title bar on top (the
                source photo's own title text was too low-res to upscale
                legibly), with the capture sized to its own aspect ratio
                below it so nothing gets cropped or letterboxed. */}
            <div className="relative flex w-full flex-col overflow-hidden rounded-[4px] bg-[#0a0e14]">
              <div className="flex shrink-0 items-center gap-2 px-[3%] py-[1.6%]">
                <span className="font-mono text-[9px] font-bold tracking-[0.04em] text-cyan-300 sm:text-[11px] md:text-[13px]">
                  AVA FIT
                </span>
                <span className="rounded-[3px] bg-emerald-500 px-[5px] py-[1px] font-mono text-[6px] font-semibold uppercase tracking-wider text-black sm:text-[7px] md:text-[8px]">
                  Socket loaded
                </span>
                <span className="font-mono text-[6px] text-white/40 sm:text-[7px] md:text-[8px]">
                  18 sensors on surface
                </span>
              </div>

              <div
                className="relative w-full"
                style={{ aspectRatio: `${screenWidth} / ${screenHeight}` }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  priority={priority}
                  quality={95}
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 660px, (min-width: 640px) 70vw, 92vw"
                />
              </div>

              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-screen"
                style={{ background: glare }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.09)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.03)_100%)]"
              />
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[2.5%] ring-1 ring-inset ring-white/[0.14]"
            />
          </div>

          {/* Base foot — a thin closed lip, not an open keyboard deck. */}
          <div
            aria-hidden
            className="relative mx-auto h-[3.5%] w-[86%] rounded-b-[10px] bg-[linear-gradient(180deg,#dcdfe4_0%,#b9bdc4_45%,#82868e_100%)] shadow-[0_30px_50px_-25px_rgba(0,0,0,0.8)]"
            style={{ clipPath: "polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)" }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
