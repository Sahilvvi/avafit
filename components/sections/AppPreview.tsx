"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"

const DEVICES = [
  {
    src: "/phone-mockup.png",
    alt: "AVA Fit Fit screen on iPhone — live 3D pressure map on your own socket scan",
    label: "On your phone",
    caption:
      "A score to identify pressure points, with next steps — quantitative and qualitative feedback.",
    floatDuration: 7,
    /** Both source canvases are 1200x1200 squares, but the device art fills
        very different fractions of that square: the phone's opaque bbox is
        545x1079 (≈45%x90%), the laptop's is 1096x743 (≈91%x62%). Sizing both
        containers the same way makes the phone look tiny next to a huge
        laptop — these widths are picked so the two devices land at roughly
        the same rendered *height* instead, which reads as a balanced pair. */
    maxWidth: "max-w-[230px] sm:max-w-[300px] md:max-w-[340px]",
  },
  {
    src: "/laptop-mockup.png",
    alt: "AVA Fit desktop software on a laptop — live 3D pressure point cloud with fit and pressure controls",
    label: "On your desktop",
    caption: "Access real-time pressure data and fit insights through AI analytical software.",
    floatDuration: 8.5,
    maxWidth: "max-w-[330px] sm:max-w-[430px] md:max-w-[490px]",
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
            description="A real session on the current build: the fit score, the live 3D pressure viewer, and the risk breakdown exactly as they appear on your phone and your desktop."
            align="center"
            className="mx-auto"
          />
        </Reveal>

        {/* A flex row, not a grid — a grid's tracks each centre their own
            item independently, which at wide viewports left a huge,
            lopsided gap between two very differently-sized devices. Flex
            keeps them as one snug, centred group regardless of their size
            difference. */}
        <div className="mt-20 flex flex-wrap items-end justify-center gap-x-12 gap-y-16 sm:gap-x-16 lg:gap-x-20">
          {DEVICES.map((device, i) => (
            <div key={device.src} className="flex flex-col items-center">
              <div className={`relative w-full ${device.maxWidth}`}>
                {/* Brand bloom, sat behind the device. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-8 -z-10 rounded-[999px] bg-primary/[0.12] blur-[70px]"
                />
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: device.floatDuration,
                      delay: i * 0.9,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={device.src}
                      alt={device.alt}
                      width={1200}
                      height={1200}
                      priority={i === 0}
                      className="h-auto w-full"
                      sizes="(min-width: 1024px) 40vw, (min-width: 640px) 45vw, 80vw"
                    />
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.35 + i * 0.1 }}
                className="mt-8 w-full max-w-sm text-center"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                    {device.label}
                  </span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{device.caption}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
