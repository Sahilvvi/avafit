"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"

const QA: { q: string; a: string }[] = [
  {
    q: "Will this tell me my socket is failing before my skin does?",
    a: "That is the whole point of it. Pressure injuries build under the liner, out of sight, and by the time you feel them the tissue damage has usually already started. AVA Fit watches the pressure continuously and flags the pattern — sustained load, no relief, a hot spot concentrating — while it is still just a pattern.",
  },
  {
    q: "How does my prosthetist use this?",
    a: "You bring in the session history from between visits — wear time, per-region load, and event history — referenced to socket anatomy rather than raw sensor indices. That turns a fitting into a review of what actually happened, instead of a conversation built entirely on what you remember.",
  },
  {
    q: "Is AVA Fit a medical device?",
    a: "No. It is a clinical research tool. It surfaces pressure data clearly and shows its reasoning openly, but it does not diagnose anything and it does not replace your prosthetist's assessment. Think of it as instrumentation between appointments, not a verdict.",
  },
  {
    q: "Does the socket adjust itself?",
    a: "Not yet. Phase 1 — what ships today — senses the interface and informs you and your prosthetist. Phase 2 closes the loop onto hardware, adjusting socket volume in response to what the sensors read. The two phases are kept clearly labeled so the claim never gets ahead of what's actually running.",
  },
  {
    q: "Do I need a specific socket for it to work?",
    a: "No. AVA Fit is built around a pressure matrix — two 3×3 pads, anterior and posterior — fitted into your socket, and it renders whatever 3D scan of that socket you load. It maps to your socket rather than requiring you to have a particular one.",
  },
  {
    q: "Why isn't the risk level just a simple pass or fail?",
    a: "Because pressure-injury risk is not binary, and a single number you cannot interrogate is worse than no number at all. AVA Fit always shows the four factors behind a level — pressure-time integral, no-relief duration, load concentration, distal-load drift — so you and your prosthetist can see which one moved and why.",
  },
  {
    q: "What if the Bluetooth connection drops mid-session?",
    a: "The app keeps the session and reconnects when the link comes back, and it tells you plainly what went wrong instead of silently falling back — Bluetooth off, no device found, or connected and then dropped are all reported differently. There is also a bridge connection as a second path when Bluetooth alone is not cooperating.",
  },
  {
    q: "Who can see my session data?",
    a: "You, by default. Sessions are logged so you can look back at wear time and trends over weeks rather than guessing from memory. Sharing a session with your prosthetist is an action you take deliberately — it does not happen in the background.",
  },
  {
    q: "How much of my day do I have to spend on this?",
    a: "Close to none. It runs while you wear the socket and only asks for your attention when something in the data warrants it — open it when you want the detail.",
  },
]

function Item({ item, index }: { item: (typeof QA)[number]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <Reveal delay={Math.min(index * 0.05, 0.3)}>
      <div
        className={`group relative border-b transition-colors duration-300 ${
          open ? "border-primary/30" : "border-border/50"
        }`}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-start gap-5 py-6 text-left"
        >
          <span
            className={`shrink-0 pt-1 font-mono text-[11px] tabular-nums transition-colors duration-300 ${
              open ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <span
            className={`flex-1 text-base md:text-lg font-medium leading-snug transition-colors duration-300 ${
              open ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
            }`}
          >
            {item.q}
          </span>

          {/* Plus that rotates into a minus — one stroke rotates, the other
              stays, so it reads as a single mechanism rather than a swap. */}
          <span className="relative shrink-0 mt-1.5 h-4 w-4">
            <span
              className={`absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 transition-colors duration-300 ${
                open ? "bg-primary" : "bg-muted-foreground group-hover:bg-foreground"
              }`}
            />
            <motion.span
              animate={{ rotate: open ? 0 : 90, opacity: open ? 0 : 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 transition-colors duration-300 ${
                open ? "bg-primary" : "bg-muted-foreground group-hover:bg-foreground"
              }`}
            />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="pb-7 pl-10 pr-10 text-sm md:text-[15px] leading-relaxed text-muted-foreground max-w-3xl">
                {item.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
}

export function FAQ() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Questions"
            title="Common questions"
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <div className="mt-14">
          {QA.map((item, i) => (
            <Item key={item.q} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
