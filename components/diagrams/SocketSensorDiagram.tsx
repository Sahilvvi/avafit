"use client"

import { motion } from "framer-motion"

/**
 * Per-stage line art for "How AVA Fit works" — sensors → live 3D view → risk
 * screening. Drawn in code, in the app's own bespoke-SVG idiom rather than a
 * stock icon set, per the "no stock/AI-generated imagery" rule.
 *
 * Each stage renders as its own square so it can sit directly above the step
 * it describes, with the connecting rail drawn between them by the section.
 * That keeps the diagram and the copy as one object instead of a floating
 * infographic with dead space under it.
 */
export function StageArt({ stage, active }: { stage: 0 | 1 | 2; active: boolean }) {
  const stroke = active ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"
  const strokeOp = active ? 0.75 : 0.4

  return (
    <motion.svg
      viewBox="0 0 120 120"
      className="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ scale: active ? 1.06 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      aria-hidden
    >
      {stage === 0 && (
        <g>
          {/* socket shell */}
          <path
            d="M34 16 L26 74 Q26 106 60 106 Q94 106 94 74 L86 16"
            stroke={stroke}
            strokeOpacity={strokeOp}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* the 3x3 grid of pressure cells, with the hot one alive */}
          {[
            [42, 34], [60, 30], [78, 34],
            [40, 58], [60, 56], [80, 58],
            [44, 82], [60, 84], [76, 82],
          ].map(([cx, cy], i) => {
            const hot = i === 4
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={hot ? 5 : 3.5}
                fill={hot ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
                fillOpacity={hot ? 1 : active ? 0.5 : 0.28}
              >
                {hot && <animate attributeName="r" values="5;6.8;5" dur="1.8s" repeatCount="indefinite" />}
              </circle>
            )
          })}
          <circle cx="60" cy="56" r="11" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeOpacity="0.5">
            <animate attributeName="r" values="11;18;11" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {stage === 1 && (
        <g>
          {/* wireframe volume with a live heat bloom at its core */}
          <path d="M60 10 L108 38 V82 L60 110 L12 82 V38 Z" stroke={stroke} strokeOpacity={strokeOp * 0.8} strokeWidth="2" strokeLinejoin="round" />
          <path d="M60 10 V60 M12 38 L60 60 L108 38 M60 60 V110" stroke={stroke} strokeOpacity={strokeOp * 0.5} strokeWidth="1.4" />
          <circle cx="60" cy="60" r="22" fill="url(#heatGrad)" opacity={active ? 0.95 : 0.6}>
            <animate attributeName="r" values="19;25;19" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {stage === 2 && (
        <g>
          <path
            d="M60 8 L102 24 V64 C102 92 83 108 60 114 C37 108 18 92 18 64 V24 Z"
            stroke={stroke}
            strokeOpacity={strokeOp}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* factor bars — the "always shows its factors" idea, drawn */}
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x="36"
              y={44 + i * 12}
              height="4"
              rx="2"
              fill="hsl(var(--primary))"
              fillOpacity={active ? 0.75 - i * 0.18 : 0.35 - i * 0.08}
            >
              <animate
                attributeName="width"
                values={`0;${44 - i * 11};${44 - i * 11}`}
                keyTimes="0;0.45;1"
                dur="3.2s"
                repeatCount="indefinite"
              />
            </rect>
          ))}
          <path
            d="M40 88 L54 100 L82 72"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            strokeDasharray="1"
          >
            <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes="0;0.4;1" dur="3.2s" repeatCount="indefinite" />
          </path>
        </g>
      )}

      <defs>
        <radialGradient id="heatGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F54257" />
          <stop offset="45%" stopColor="#F5C842" />
          <stop offset="100%" stopColor="#00D4F5" stopOpacity="0.25" />
        </radialGradient>
      </defs>
    </motion.svg>
  )
}
