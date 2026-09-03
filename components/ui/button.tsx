import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Variant = "primary" | "outline" | "ghost"
type Size = "sm" | "default" | "lg"

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-mono text-xs uppercase tracking-[0.12em] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)]",
  outline: "border border-border text-foreground hover:bg-accent",
  ghost: "text-muted-foreground hover:text-foreground",
}

const sizes: Record<Size, string> = {
  sm: "h-9 px-5 text-[11px]",
  default: "h-11 px-6",
  lg: "h-14 px-8 text-sm",
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  href?: string
}

export function Button({ className, variant = "primary", size = "default", href, children, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
