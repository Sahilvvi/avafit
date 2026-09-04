"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"
import { PhoneMockup } from "@/components/ui/phone-mockup"
import { LaptopMockup } from "@/components/ui/laptop-mockup"

const SHOTS = [
  {
    src: "/screenshot-today.png",
    alt: "AVA Fit Today screen — fit score, connection state, and the spot to watch",
    label: "Today",
    caption:
      "A score to identify pressure points, with next steps — quantitative and qualitative feedback.",
    rotate: 8,
    offsetY: 0,
  },
  {
    src: "/screenshot-fit.png",
    alt: "AVA Fit Fit screen — live 3D pressure map on your own socket scan",
    label: "Fit",
    caption:
      "Your own scan, pressure-mapped live in 3D, with the risk factors that produced the reading shown openly.",
    rotate: -8,
    offsetY: 40,
  },
]

export function AppPreview() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* A wash that rises out of the page and fades back into it — no panel,
          no rules, so this section flows from the one above it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_42%,hsl(var(--primary)/0.08),transparent_72%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Inside the app"
            title="Screens captured from the current build, at device size."
            description="A real session on the current build: the fit score, the live 3D pressure viewer, and the risk breakdown exactly as they appear in your hand."
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <div className="mt-20 grid gap-16 sm:grid-cols-2 sm:gap-8 md:gap-14 lg:gap-20">
          {SHOTS.map((shot, i) => (
            <div key={shot.src} className="flex flex-col items-center">
              <PhoneMockup
                src={shot.src}
                alt={shot.alt}
                baseRotateY={shot.rotate}
                offsetY={shot.offsetY}
                floatDuration={7 + i * 1.4}
                floatDelay={i * 0.9}
                priority={i === 0}
                className="w-full max-w-[260px] sm:max-w-[240px] md:max-w-[270px]"
              />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.35 + i * 0.1 }}
                className="mt-12 w-full max-w-sm text-center"
                style={{ marginTop: `calc(3rem + ${shot.offsetY}px)` }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                    {shot.label}
                  </span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {shot.caption}
                </p>
              </motion.div>
            </div>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-20 flex flex-col items-center md:mt-28">
            <LaptopMockup
              src="/screenshot-laptop-screen.png"
              alt="AVA Fit desktop software — live 3D pressure point cloud with fit and pressure controls"
              screenWidth={1370}
              screenHeight={850}
              className="w-full max-w-md sm:max-w-lg"
            />

            <div className="mt-10 w-full max-w-sm text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Smart fit monitoring
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Access real-time pressure data and fit insights through AI analytical software.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
