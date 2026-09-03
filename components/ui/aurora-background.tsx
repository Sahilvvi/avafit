"use client"

import { motion } from "framer-motion"

/** Slow-drifting soft-light gradient blobs behind the hero — the ambient
 * "alive" background used by most premium dark SaaS sites (Linear, Vercel).
 * Pure CSS blur + framer-motion looped transforms, no images. */
export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-40 -left-20 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[120px]"
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#2EE89E]/10 blur-[120px]"
        animate={{ x: [0, -30, 20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-primary/10 blur-[100px]"
        animate={{ x: [0, 20, -30, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}
