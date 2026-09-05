import Image from "next/image"

const NAV = [
  { href: "#physical-ai", label: "Physical AI" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#trust", label: "Trust" },
  { href: "#clinical-team", label: "For clinicians" },
  { href: "#get-app", label: "Get the app" },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden pt-20 pb-12">
      {/* Gradient hairline instead of a hard rule — marks the boundary
          without cutting the page in two. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--foreground)/0.14),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,hsl(var(--primary)/0.06),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-8">
          <div>
            {/* AVA Fit leads as the title; the Quorum mark sits underneath
                it as the maker's mark. */}
            <span className="block text-xl font-bold leading-none tracking-tight text-foreground">
              AVA Fit©
            </span>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                Powered by
              </span>
              <Image
                src="/logo-icon.png"
                alt="Quorum 3D Labs & Prosthetics"
                width={900}
                height={270}
                className="h-5 w-auto"
              />
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Physical AI for prosthetic sockets — sensing, inference, and
              adjustment, on the limb.
            </p>
          </div>

          <div className="md:justify-self-end">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Navigate
            </p>
            <nav className="mt-5 grid grid-cols-2 gap-x-10 gap-y-3">
              {NAV.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="group relative w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border/40 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground/80">
            AVA Fit© is a clinical research tool. It supports — and does not
            replace — professional assessment by your prosthetist or clinician.
          </p>
          <p className="shrink-0 font-mono text-xs text-muted-foreground/60">
            © {year} Quorum Prosthetics
          </p>
        </div>
      </div>
    </footer>
  )
}
