"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const LINKS = [
  { href: "#physical-ai", id: "physical-ai", label: "Physical AI" },
  { href: "#how-it-works", id: "how-it-works", label: "How it works" },
  { href: "#features", id: "features", label: "Features" },
  { href: "#trust", id: "trust", label: "Trust" },
]

// The whole nav is one spring. At the top of the page it sits as a wide,
// weightless bar flush to the edges; once you scroll it contracts inward —
// narrower, shorter, detached from the top edge, rounded into a glass pill.
// Both states are keyframes of the same spring, so the transition overshoots
// slightly and settles, rather than linearly interpolating.
const SPRING = { type: "spring" as const, stiffness: 260, damping: 30, mass: 0.9 }

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string>("")
  const [menuOpen, setMenuOpen] = useState(false)
  const menuOpenRef = useRef(menuOpen)
  menuOpenRef.current = menuOpen

  useEffect(() => {
    // Hysteresis: contract past 60px, expand back below 20px. Without the
    // dead band the pill flickers when a scroll lands right on the threshold.
    const onScroll = () => {
      const y = window.scrollY
      setScrolled((prev) => (prev ? y > 20 : y > 60))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Scroll-spy: highlight whichever section is crossing the vertical center
  // of the viewport, so the nav pill tracks reading position instead of
  // sitting static.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => !!el
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    )
    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  // Close the mobile menu on escape or on resize past the mobile breakpoint.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpenRef.current) setMenuOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 768 && menuOpenRef.current) setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <motion.div
        animate={{
          marginTop: scrolled ? 14 : 0,
          width: scrolled ? "min(880px, calc(100% - 32px))" : "100%",
          borderRadius: scrolled ? 999 : 0,
        }}
        transition={SPRING}
        className={`mx-auto relative overflow-hidden transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled
            ? "bg-background/60 backdrop-blur-2xl shadow-[0_18px_50px_-18px_rgba(0,0,0,0.85),inset_0_1px_0_0_hsl(var(--foreground)/0.07)]"
            : "bg-transparent shadow-none"
        }`}
      >
        {/* Glass edge — a 1px inner ring that only materialises once the bar
            has contracted, so the expanded state stays completely borderless
            and the page reads as one continuous surface. */}
        <motion.div
          aria-hidden
          animate={{ opacity: scrolled ? 1 : 0, borderRadius: scrolled ? 999 : 0 }}
          transition={SPRING}
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/[0.08]"
          style={{ borderRadius: 999 }}
        />

        <motion.div
          animate={{
            height: scrolled ? 58 : 76,
            paddingLeft: scrolled ? 22 : 24,
            paddingRight: scrolled ? 10 : 24,
          }}
          transition={SPRING}
          className={`relative flex items-center justify-between ${
            scrolled ? "" : "mx-auto max-w-6xl"
          }`}
        >
          <motion.a
            href="#top"
            className="flex items-center relative z-10 shrink-0"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            {/* Height is driven by a CSS transition rather than a motion
                wrapper — an animated flex parent collapses the intrinsic
                width that `w-auto` depends on, which blanks the image. */}
            <Image
              src="/logo-wordmark.png"
              alt="AVA Fit"
              width={798}
              height={256}
              className={`w-auto transition-[height] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
                scrolled ? "h-[30px]" : "h-[38px]"
              }`}
              priority
            />
          </motion.a>

          <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {LINKS.map((l) => {
              const isActive = activeId === l.id
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`relative px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="relative z-10">{l.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-foreground/[0.06] ring-1 ring-inset ring-foreground/10"
                      transition={{ type: "spring", stiffness: 480, damping: 34 }}
                    />
                  )}
                </a>
              )
            })}
          </nav>

          <div className="hidden md:block shrink-0">
            <Button href="#get-app" size={scrolled ? "sm" : "default"} className="group">
              Get AVA Fit
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-foreground/90 hover:bg-foreground/[0.06] transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mx-4 mt-2 overflow-hidden rounded-3xl bg-background/85 backdrop-blur-2xl ring-1 ring-inset ring-foreground/10 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
          >
            <nav className="px-6 py-5 flex flex-col gap-1">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                  className={`flex items-center justify-between py-3.5 font-mono text-sm uppercase tracking-[0.12em] transition-colors ${
                    activeId === l.id ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                  <ArrowRight className="h-4 w-4 opacity-40" />
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + LINKS.length * 0.05, duration: 0.3 }}
                className="pt-4"
              >
                <Button href="#get-app" size="lg" className="w-full" onClick={() => setMenuOpen(false)}>
                  Get AVA Fit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
