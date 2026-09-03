# AVA Fit — landing page

Patient-centric marketing site for AVA Fit (Next.js 14 + Tailwind + shadcn
scaffolding), built from `spline-scene-app`'s proven hero-video + Spotlight
block. Every claim on the page is traceable to a real, shipped feature in
`ava-fit-ios` / `FEATURES_AND_KNOWLEDGE_TRANSFER.md` — nothing here is a mockup.

```bash
npm install
npm run dev      # http://localhost:3000
```

If the project's `.claude/launch.json` `landing-page` preview entry ever fails
to start (a Windows path-quoting issue with the space in this folder's name,
not a code bug — `npm run dev` from this directory works fine directly), run
it manually as above and point the browser at `http://localhost:3000`.

## Structure

    app/{layout.tsx, page.tsx, globals.css}   — fonts (Manrope + DM Mono, same
                                                 pairing as the app), the navy/
                                                 cyan palette translated from
                                                 ava-fit-ios/src/theme/tokens.ts
    components/sections/                      — one file per page section,
                                                 composed in app/page.tsx
    components/ui/                            — spotlight.tsx + spotlight-
                                                 cursor.tsx (from spline-scene-
                                                 app), button.tsx, section-
                                                 heading.tsx, reveal.tsx (the
                                                 shared scroll-fade wrapper)
    components/diagrams/SocketSensorDiagram.tsx — the "how it works" line-art
                                                 diagram, code-drawn rather
                                                 than stock/AI imagery
    public/quatro-anim.mp4                    — the real product render used
                                                 as the hero visual (client
                                                 chose this over a live Spline
                                                 scene or a from-scratch 3D
                                                 viewer)

## Notes

- Dark-only brand (no light-mode toggle) — the palette lives directly in
  `:root` in `globals.css`, not a `.dark` override block.
- `next` is pinned to `14.2.35` (not the `14.2.18` in the sibling
  `spline-scene-app`) — that version has a fixed, known-critical CVE; 14.2.35
  is the latest patched release on the 14.x line. `npm audit` still shows two
  high-severity issues, both in Next's Server Actions / bundled postcss —
  this site has no forms or server actions, so neither is reachable, and a
  major-version jump wasn't worth it for that.
- The "Get AVA Fit" CTA is a disabled "Coming soon" state, not a fake store
  link or invented contact email — there's no public store listing yet to
  link to honestly.
