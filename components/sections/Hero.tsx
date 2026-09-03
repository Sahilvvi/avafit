"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Spotlight } from "@/components/ui/spotlight"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Button } from "@/components/ui/button"

const LINE_1 = "Know your fit,".split(" ")
const LINE_2 = "before it's a problem.".split(" ")

const wordVariants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] })
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 40])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15])

  return (
    <section id="top" ref={sectionRef} className="relative overflow-hidden bg-background pt-32 pb-20 md:pt-40 md:pb-28">
      <AuroraBackground />
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-[1fr_1fr] gap-10 md:gap-6 items-center">
          {/* Copy */}
          <motion.div style={{ opacity: copyOpacity }} className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary mb-6"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              18-sensor pressure matrix · live 3D
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground text-balance">
              <motion.span
                initial="hidden"
                animate="show"
                transition={{ staggerChildren: 0.06, delayChildren: 0.1 }}
                className="block"
              >
                {LINE_1.map((w, i) => (
                  <motion.span key={i} variants={wordVariants} transition={{ duration: 0.5, ease: "easeOut" }} className="inline-block mr-[0.22em]">
                    {w}
                  </motion.span>
                ))}
              </motion.span>
              <motion.span
                initial="hidden"
                animate="show"
                transition={{ staggerChildren: 0.06, delayChildren: 0.42 }}
                className="block"
              >
                {LINE_2.map((w, i) => (
                  <motion.span key={i} variants={wordVariants} transition={{ duration: 0.5, ease: "easeOut" }} className="inline-block mr-[0.22em]">
                    {w}
                  </motion.span>
                ))}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed"
            >
              AVA Fit reads live pressure from eighteen sensors built into your
              socket and turns it into a fit score you can actually see —
              rendered in 3D on your own scan, screened for pressure-injury
              risk, right on your phone.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button href="#get-app" size="lg">
                Get AVA Fit
              </Button>
              <Button href="#how-it-works" variant="outline" size="lg">
                See how it works
              </Button>
            </motion.div>
          </motion.div>

          {/* Product render — confined to this column and to the hero's own
              height (no negative margins spilling into the next section);
              a radial mask fades the video's own rectangle into nothing so
              it reads as a floating object, not a boxed thumbnail. */}
          <motion.div
            style={{ y: videoY }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[300px] sm:h-[380px] md:h-[460px] pointer-events-none"
          >
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_62%_62%_at_center,black_45%,transparent_92%)]">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/quatro-anim.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label="AVA Fit socket render, pressure-mapped in real time"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
