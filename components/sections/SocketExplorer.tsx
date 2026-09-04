"use client"

import { RotateCw } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"

export function SocketExplorer() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_20%,hsl(var(--primary)/0.07),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="The socket itself"
            title="One socket, seen from every side."
            description="A real product render — the exterior shell turning open to the interior cavity, in one continuous shot."
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mt-14 flex flex-col items-center">
            {/* The render's own background is pure black, so a radial mask
                fades its square edge into nothing instead of showing a
                boxed video frame — it reads as a floating object. */}
            <div className="relative h-[380px] w-[380px] max-w-full sm:h-[460px] sm:w-[460px]">
              <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_center,black_50%,transparent_80%)]">
                <video
                  className="absolute inset-0 h-full w-full object-contain"
                  src="/socket-reveal.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-label="AVA Fit socket, exterior shell turning open to the interior cavity"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <RotateCw className="h-3.5 w-3.5 text-primary/70" strokeWidth={1.8} />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Full reveal, on loop
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
