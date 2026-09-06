# CLAUDE.md — Error404 branding repo status

Tracking doc for AI-agent sessions working on this repo. Human-facing brand rules live in
`BRAND.md` / `DESIGN.md` (read live by `brand-mcp`) and `AGENTS.md` (generic agent behavior
rules). This file exists so a session picking this repo back up doesn't have to rediscover
what's finished, what's approved, and what's still open.

## Status: logo geometry — FINAL, APPROVED (2026-09-06)

The Libra-constellation mark spec below is locked. Do not redesign it; only propagate it to
any file that still shows an older cut.

### Canonical geometry (all marks share these node/line coordinates, viewBox 0 0 240 240)

Nodes (star, radius, canonical fill in the multicolor mark):
- `(24.0, 86.2)` r=15.5 `#4DE1FF` (blue)
- `(132.0, 24.0)` r=16.3 `#FF5FA2` (pink)
- `(204.0, 74.9)` r=8.5 `#FFE156` (yellow)
- `(80.2, 202.0)` r=12.3 `#37F0A6` (mint) — **note: y=202.0, not the old 173.8**
- `(212.2, 200.6)` r=10.4 `#4DE1FF` (blue)
- `(216.0, 216.0)` r=8.6 `#FF5FA2` (pink)

Lines — **all one uniform color** (mint `#37F0A6` on the multicolor mark; the mark's own
single color on black/white/monogram cuts), `stroke-width="2"`, `opacity="0.75"`:
- `(24.0,86.2)` → `(132.0,24.0)`
- `(132.0,24.0)` → `(204.0,74.9)`
- `(204.0,74.9)` → `(163.0,114.5)` **[half of the split line]**
- `(126.9,155.3)` → `(80.2,202.0)` **[other half — collinear with the segment above]**
- `(80.2,202.0)` → `(24.0,86.2)`
- `(204.0,74.9)` → `(212.2,200.6)`
- `(212.2,200.6)` → `(216.0,216.0)`

The two split-line segments are **collinear** (same slope) — they are not an arbitrary bend.
The gap between them exists only to clear the "4Ø4" text, and the gap's angle is set to
exactly match the rendered diagonal slash inside the "Ø" glyph (measured via OpenCV
Canny + Hough line detection on the actual rendered glyph — converged on slope -1.0 / 45°,
not eyeballed). If you ever need to re-derive this: render the text alone and the line alone
to separate boolean ink masks and confirm zero pixel overlap before calling a fix correct —
we broke this three times by trusting a visual check alone.

Text: `<text font-family="JetBrains Mono, monospace" font-weight="700" font-size="44" fill="..."
x="145" y="151" text-anchor="middle">4&#216;4</text>` (or font-size 40 / y=151 on the older
neon-glow variants, which use a smaller base size — keep their existing font-size, just fix
the position/geometry/text content).

**Never** put a background oval/ellipse behind the "4Ø4" text. That treatment (seen in
`libra-neon-multi.svg`, `libra-neon-blue.svg`, and the old ring variant) is retired — it read
badly against varying backdrops. Removed for good.

### Locked palette (Arcade New Wave)

`#231451` bg · `#F4F1FF` fg · `#4DE1FF` blue · `#FF5FA2` pink · `#FFE156` yellow ·
`#37F0A6` mint · `#111111` black (for black-cut marks)

### Naming taxonomy (final)

- **Primary mark** — has "4Ø4" text. Three variants: `libra-no-ring-multicolor.svg` (canonical
  default), `libra-no-ring-black.svg` (for light backgrounds), `libra-no-ring-white.svg` (for
  dark backgrounds).
- **Monogram** — icon-only, no text. Exactly two variants, both transparent:
  `monogram-night.svg` (white mark, for dark surfaces) and `monogram-daylight.svg` (black
  mark, for light surfaces). **These replace every old icon-only/glyph-only cut** — do not
  reintroduce a third icon-only variant without updating this doc.
- **Ring variant** — `libra-ring-multicolor.svg` — same geometry as the primary mark, plus a
  decorative outer ring circle. A deliberate distinct treatment (used by OBS), not the flat
  default — keep the ring, don't remove it, but it does get the same line/text/oval fixes.
- **Neon variants** — `libra-neon-multi.svg`, `libra-neon-blue.svg` — glow-filter treatment
  with per-edge coloring (their own aesthetic, not the uniform-mint rule). Fixed for line
  geometry, "4Ø4" text, and oval removal; per-edge multicolor kept intentionally.

## What's done (this pass)

Pushed directly to this repo via the device bridge on 2026-09-06:

- `index.html` — badge text updated to "Final — approved"; lead paragraph expanded with the
  rebuild/verification methodology; fixed backwards captions on the black/white primary-mark
  cards; replaced the old "WEBSITE ICON — LIGHT/DARK MODE" raster section with a vector
  "MONOGRAM — NIGHT / DAYLIGHT MODE" section referencing `logos/monogram-{night,daylight}.svg`
  directly (no more flattened screenshot to go stale).
- `logos/libra-no-ring-{multicolor,black,white}.svg` — final geometry.
- `logos/libra-ring-multicolor.svg` — final geometry, ring kept, old flat oval backdrop
  removed, "404" → "4Ø4".
- `logos/libra-neon-multi.svg`, `logos/libra-neon-blue.svg` — line split fixed, oval backdrop
  removed, "404" → "4Ø4". Per-edge glow coloring left as-is (that's this variant's identity).
- `logos/monogram-{night,daylight}.svg` — new files, the canonical icon-only pair.
- `logos/favicon-white.svg` → now contains the `monogram-night` artwork (path/href in
  `index.html` unchanged: `<link rel="icon" href="logos/favicon-white.svg">`).
- `logos/favicon-dark.svg` → now contains the `monogram-daylight` artwork (currently unused by
  `index.html` but kept in sync in case a light-mode favicon switch is added later).
- `assets/entra-square-transparent-{black,white,color}.png` — regenerated transparent 240×240
  cuts from the final `libra-no-ring-{black,white,multicolor}.svg`.
- `assets/icon.png`, `assets/favicon.png` — regenerated (ring-multicolor mark on `#231451`).
- `assets/netmesh-lockup.png` — regenerated (black no-ring mark + "404.NET" wordmark + tagline).
- `assets/netmesh-ring-color.png`, `assets/netmesh-neon-multi.png`,
  `assets/netmesh-neon-blue.png` — regenerated from the fixed SVGs above.
- `obs/assets/logos/{icon,favicon,netmesh-ring-color,netmesh-neon-multi,netmesh-neon-blue}.png`
  — mirrored (this directory duplicates `assets/` byte-for-byte for the files OBS's
  `obs/scenes/Error404.json` loads directly: `Icon 404` ← `icon.png`, `Netmesh Neon Multi` ←
  `netmesh-neon-multi.png`, `Netmesh Neon Blue` ← `netmesh-neon-blue.png`, `Netmesh Ring` ←
  `netmesh-ring-color.png`. `main-lockup.png`/`Wordmark Lockup` was left alone — it's a
  glitch-text title card with no constellation mark in it, out of scope for this fix).
- `entra-m365/*.png`, `entra-m365/favicon.ico` — regenerated Microsoft Entra ID / M365
  app-registration assets (banner logos, square logos both themes, transparent cuts, favicon).
- `email-templates/hosted-images/mark-{black-72,color-{20,28,44,56}}.png` — regenerated to
  match the exact existing filename set (no `mark-white-*`, no `mark-color-72` — don't add
  those unless a template actually starts using them).
- `Error404-Brand-Guidelines.pdf` — regenerated, 14 pages.
- `assets/site-icon-modes.png` — orphaned (no longer referenced by `index.html` — replaced by
  the vector Monogram section). Moved to `_to_delete/site-icon-modes.png` rather than deleted
  outright — this sandbox can't delete files in the mounted repo without you approving a
  one-time permission grant. **You can delete that folder yourself**, or approve the delete
  permission prompt next time an agent asks and it'll clean it up directly.

## What's NOT done — pending decisions / remaining scope

- **`BRAND.md` / `DESIGN.md` not yet updated.** These are the actual source of truth
  `brand-mcp` reads live (see `brand-mcp/src/spec.js`) — arguably more important than this
  file for anything that consumes the MCP server. They still describe the pre-fix geometry/
  naming. Needs a pass to bring the logo-system section in line with the spec above.
- **~15 legacy accent-color SVGs untouched**: `libra-ham-*`, `libra-neon-{green,pink}`,
  `libra-ring-{blue,pink,green,white,black,mono}`, `libra-no-ring-{pink,blue,green}`,
  `libra-site-icon-{light,dark}-mode`, anything under `logos/glyph-only/` or `logos/png/` if
  those exist. Not yet decided whether these get brought current to the final geometry or are
  formally deprecated now that Primary mark (3 colors) + Monogram (2 colors) is the canonical
  set. Ask before doing a lot of work here.
- **`office-templates/`** — not inspected at all yet: `Error404-Word-Template-Digital-Color.docx`,
  `Error404-Envelope-Template.docx`, `Error404-Word-Template-Corporate-BW.docx`,
  `error404-arcade-new-wave.thmx`, `Error404-PowerPoint-Template.pptx`,
  `Error404-Word-Template-Report.docx`, `Error404-Cover-Page-Template.docx`,
  `Error404-Letterhead-Template.docx`. If any embed the old logo mark as an image, they need
  the same swap.
- **`social/`, `discord/`, `MOTD/`** — not inspected. `MOTD/` may overlap with a separate
  prior ASCII-logo project; check before assuming it needs the same PNG-based fix.
- **`assets/print-mode.png`, `assets/signature-mockup-public.png`** — these show a tiny
  monogram-style glyph in a letterhead/signature mockup screenshot. At their rendered size the
  old line-geometry defect isn't visible, so they were left alone this pass. Worth
  regenerating for correctness whenever someone's doing a full mockup refresh anyway.
- **`main-lockup.png` (`assets/` and `obs/assets/logos/`, "Wordmark Lockup" in OBS)** — pure
  ANSI/glitch text title card, no constellation mark present. Confirmed out of scope for a
  logo-geometry fix; don't touch it for that reason. If it ever gets redesigned, that's a
  separate task.
- **`_to_delete/site-icon-modes.png`** — see above, needs you (or a future agent with granted
  delete permission) to actually remove it.

## Working notes for future agents

- This repo lives at `/Users/Jesse/GitHub/Branding-Guide` on Jesse's Mac, reachable only via
  the device bridge — there is no local SVG rendering toolchain there (no `cairosvg`,
  `rsvg-convert`, or `inkscape`), so render SVG→PNG in the cloud sandbox and push the result
  with the device-commit tool. Don't try to install a renderer on the Mac side for this.
- `obs/assets/logos/` mirrors `assets/` byte-for-byte for the specific files OBS loads (see
  `obs/scenes/Error404.json`) — when you fix a logo asset that OBS also uses, push to both
  locations, not just one.
- Uncommitted `git status` changes were already present in this repo when this pass started
  (partial earlier work) — check `git status` / `git diff` before assuming a clean tree, and
  don't assume everything currently modified-but-uncommitted is already correct; verify
  against the geometry spec above.
