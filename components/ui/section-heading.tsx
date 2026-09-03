import { cn } from "@/lib/utils"

/** Mono uppercase eyebrow + big headline — the one recognizable typographic
 * motif reused across every section (matches tokens.ts's `font.mono` label
 * style in the app itself: 10px, uppercase, letter-spaced). Reused instead
 * of ad hoc heading markup per section, so the rhythm holds across the page. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">{title}</h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-balance">{description}</p>
      )}
    </div>
  )
}
