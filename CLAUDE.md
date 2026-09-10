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
- **Watermark** — `logos/watermark.svg` / `assets/watermark-1800.png` — single mark, black,
  whole thing at 10% opacity. Not a brand-facing identity cut; a utility export for printer
  watermark settings and Word's Picture Watermark feature (added round 4, see below).

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
- **`logos/libra-no-ring-{blue,green,pink}.svg`** — same line-split fix, text unified to "4Ø4".
- **All other legacy accent SVGs also swept and fixed in place** (edited directly on-device,
  not regenerated from scratch, so each variant's own accent color / treatment was preserved):
  `libra-ham-{black,white,multicolor}.svg`, `libra-neon-{green,pink}.svg`,
  `libra-ring-{black,white,blue,green,pink}.svg`, `libra-site-icon-{light,dark}-mode.svg`,
  `logos/glyph-only/libra-glyph-{light,dark}-mode.svg`. Each got: the collinear line-split
  fix, node4 moved to y=202.0, any oval/ellipse text-backdrop stripped, and (where the variant
  has text at all — the glyph-only files never did) "404"/old "4Ø4" position normalized to
  "4&#216;4" at y=151. Verified via `grep` across `logos/` that no file still contains the old
  bent-stub coordinates, the old unsplit single-line coordinates, an `<ellipse>` backdrop, or
  plain "404" text — that sweep came back empty. **Every SVG under `logos/` is now current.**

## What's done — round 2 (BRAND.md/DESIGN.md, office-templates, social, discord)

- **`BRAND.md` / `DESIGN.md`** — updated. `BRAND.md` now documents the uniform-line-color rule
  and the slash-aligned split-line construction under the primary-mark bullets, adds the
  Monogram (night/daylight) spec to the "Default mark" section, and corrects the PDF page
  count (14, not 20). `DESIGN.md`'s §6.2 variant table swapped the stale
  `libra-site-icon-dark-mode.svg` icon reference for the two Monogram files, and the agent
  checklist item 11 now mentions the Monogram explicitly.
- **`office-templates/`** — inspected and fixed. All 6 `.docx` files and the `.pptx` embed a
  flattened PNG of the ring mark (5 of the docx files share one B&W crop; Digital-Color has its
  own color crop; the pptx has 3 identical copies). Replaced each embedded PNG in place inside
  the Office zip containers (validated after with `python-docx` / `python-pptx` — all still
  open cleanly, entry counts unchanged) with a render from the fixed `libra-ring-black.svg` /
  `libra-ring-multicolor.svg`. One judgment call: the multicolor ring mark's `4Ø4` text is
  `#F4F1FF` (near-white), designed for a dark backdrop — the old oval backdrop was the only
  thing making it legible on the Word docs' white page, and removing the oval per your
  instruction would have made it unreadable there. Recolored just that one flattened text
  render to `#231451` (still a locked brand color) instead of reintroducing an oval. The source
  SVG itself is untouched — this is only in the one-off Office-embedded raster.
  `error404-arcade-new-wave.thmx` has no embedded logo (palette/font tokens only) — nothing to
  fix there.
- **`social/avatars/`** — all 7 files regenerated from the fixed SVGs (multicolor/white/black
  no-ring, ring-black, ring-white, ham-multicolor, each on its correct transparent or solid-navy
  or solid-lavender background, matched against the originals).
- **`discord/discord-server-icon-512.png`** — regenerated from `libra-ring-multicolor.svg` on
  solid navy.
- **`social/stickers/sticker-circle-{mono,ham}-900.png`** — regenerated: reconstructed the
  circular die-cut treatment (colored fill, thin outline ring) around the fixed mark, matching
  the originals' measured proportions.

## What's done — round 3 (green/yellow text-fringe bug, 2026-09-06/07)

Jesse spotted "a green glow effect on the 4Ø4" on the Entra square-logo icon. Root cause was
**not** the mint connecting-line color (first hypothesis, corrected by Jesse) — it was a
rendering bug in this sandbox's SVG→PNG pipeline:

- The cloud container had no `JetBrains Mono` font installed, so `cairosvg` was silently
  substituting a fallback font for the "4Ø4" text in every PNG rendered this session.
- Independently, the container's fontconfig defaults to LCD-subpixel antialiasing
  (`rgba`/`lcdfilter` tuned for a physical screen). That bakes real per-channel color fringes
  (verified pixel-level: fully-opaque yellow/cyan pixels like `(213,241,2)` right at glyph
  edges) into any text rendered onto a transparent background — invisible on an opaque card,
  glaring once composited elsewhere. This is what read as a "green glow."

Fix: installed `fonts-jetbrains-mono` via apt, and force grayscale antialiasing at render time
with a local fontconfig override (`rgba=none`, `lcdfilter=none`, `hintstyle=hintslight`) — see
the working notes below for the exact snippet. Confirmed via a pixel-level scan (looking for
opaque edge pixels where G is 80+ higher than both R and B) that this drops the fringe from
hundreds of pixels to near-zero (the only residual is the mint line's own legitimate
anti-aliasing where it runs next to the text, not a bug).

Re-rendered and pushed every asset the scan flagged, plus everything else rendered this
session with the broken pipeline (so the font-substitution issue is also fixed even where the
color fringe wasn't visible enough to flag): `entra-m365/square-logo-transparent-color-240x240.png`,
`assets/entra-square-transparent-{color,white}.png`, `email-templates/hosted-images/mark-color-{20,28,44,56}.png`,
all 7 `social/avatars/*.png`, `discord/discord-server-icon-512.png`, both
`social/stickers/sticker-circle-{mono,ham}-900.png`, and the full `logos/png/{libra-ring-multicolor,
libra-no-ring-multicolor,libra-ham-multicolor}/{16,32,48,64,128,180,192,240,512,1024}.png` sets
(30 files — these turned out to already exist as a pre-built export tree, now current again).
Also re-did the embedded logo PNGs inside all 6 Office templates (5 docx share one black-ring
crop, Digital-Color has its own dark-text-on-white crop, the pptx has 3 copies of the
transparent multicolor ring) using the fixed pipeline, validated afterward with
`python-docx`/`python-pptx`. Committed as `e31405e`.

A full-repo scan for this fringe pattern turned up nothing else — the only files affected were
ones rendered by this session's own (buggy) pipeline. Files already correct before this session
(e.g. `entra-m365/square-logo-transparent-black-240x240.png`, the light/dark-theme Entra PNGs,
both Entra banners, the favicon) were confirmed clean and left untouched.

## What's done — round 4 (Watermark variant, 2026-09-07)

New naming-taxonomy entry — see "Naming taxonomy (final)" above, now amended with a fourth
category:

- **Watermark** — `logos/watermark.svg` (240×240 vector source) and `assets/watermark-1800.png`
  (1800×1800 transparent PNG render). Single centered mark, black `#111111`, whole mark wrapped
  in `opacity="0.10"` (lines keep their own `opacity="0.75"` on top of that, matching every
  other black cut — so lines render slightly lighter than the nodes/text, same relative
  relationship as the full-opacity marks). Same locked geometry as `libra-no-ring-black.svg`,
  metadata stripped (no C2PA block — that's Anthropic's own content-provenance marker on the
  source file, not something to propagate into derived assets).
- **Intended use** (confirmed with Jesse, not M365 Dynamic Watermarking — see below): the
  office printer's built-in watermark feature, and/or manual insertion via Word's own
  **Insert → Watermark → Custom Watermark → Picture watermark** in a new Word template variant.
  Both consume a static image, which is what this asset is.
- **Why not Microsoft 365 Dynamic Watermarking (Purview sensitivity labels):** confirmed via
  Microsoft's own documentation
  (`learn.microsoft.com/en-us/purview/sensitivity-labels-office-apps`) that dynamic watermarks
  are **text-only** — the only supported variable is the viewing user's email address, with
  **no logo/image support and no font/color/orientation customization** at all. If dynamic,
  identity-bearing watermarking is wanted later, it can only ever show text, never this mark.
- **Rendered with the round-3 font/antialiasing fix** (`fonts-jetbrains-mono` installed +
  `FONTCONFIG_FILE` pointed at the grayscale-forcing fontconfig override — see "Working notes
  for future agents" below) — spot-checked the rendered PNG's "4Ø4" text and confirmed every
  non-transparent pixel is neutral gray (R=G=B), i.e. the same green/yellow text-fringe bug
  from round 3 does not reappear at low opacity.
- Added to `DESIGN.md` §6.2's mark-variant table. Not added to `BRAND.md`'s primary-mark
  bullets, since it's a utility export (printer/Word insertion) rather than a brand-facing
  identity variant like the Primary mark, Monogram, Ring, or Neon cuts.

## What's done — round 5 (wordmark typo, tagline-in-signature, banner lockup, favicon padding, 2026-09-10)

Jesse caught three real problems by inspecting rendered output rather than source, plus asked
for a redesigned Entra banner asset:

- **Wordmark typo fixed: "404.NET" → "ERROR404.NET".** `assets/netmesh-lockup.png` baked in the
  wrong domain — `BRAND.md` has always documented `ERROR404.NET` as the wordmark (see the
  terminology table), never the bare "404.NET". Rebuilt the asset from scratch in a new, lighter
  lockup style Jesse pointed at directly (small icon-only mark — same geometry as the Monogram,
  no ring, no "4Ø4" numeral text — plus "ERROR404.NET" in uniform-weight JetBrains Mono, no
  bold/dim split, no tagline underneath). `index.html`'s caption updated to match.
  `obs/assets/logos/netmesh-lockup.png` — a second, independent copy with the *same* typo plus
  the old pre-round-1 ring treatment and plain "404" — turned out to be unreferenced by any OBS
  scene file, so it's a stale orphan (like `site-icon-modes.png` in round 3), not a mirror worth
  keeping in sync. Moved to `_to_delete/` rather than fixed in place.
- **Tagline removed from the actual/example email signature.** The locked tagline
  (`!ignore → return "404: Message not found"`) was baked into `index.html`'s signature-format
  example (`<pre class="sig">`, styled `.inject`) and into `assets/signature-mockup-public.png`.
  Per BRAND.md the tagline deliberately "winks at prompt-injection and AI-scanner culture" — but
  that wink stops being funny on real outbound mail, where an AI-based mail security scanner at
  the recipient's org could read "!ignore →" as an actual injection attempt on every message
  sent. Confirmed with Jesse: **the tagline stays locked and valid everywhere else** (site hero,
  PDF, BRAND.md, marketing) — it is specifically carved out of the signature. `BRAND.md`'s
  Tagline & Slogans section now documents this exception explicitly. Regenerated
  `signature-mockup-public.png` without the tagline line; removed the `<span class="inject">`
  line from `index.html` and the now-orphaned `pre.sig .inject` CSS rule.
- **New Entra/M365 banner lockup, replacing bare-icon-in-dead-space.** The old
  `entra-m365/banner-logo-{light,dark}-280x60.png` were just the bare icon crammed into the left
  of a 280×60 canvas with the rest empty — not using the wordmark at all. Replaced both with the
  icon+"ERROR404.NET" lockup (same construction as the fixed `netmesh-lockup.png`, scaled to
  280×60, no tagline — too tight at this size and the same signature-scanner concern applies to
  anything embedded in a Microsoft-hosted portal). Added a third file,
  `entra-m365/banner-logo-color-280x60.png` — the requested "color option": full canonical
  multicolor icon (same node-color assignments as the primary multicolor mark) with black text.
  **Only use the color variant on light/white backgrounds** — the node colors are pastel enough
  that black text and colored nodes both wash out on the dark purple surface. All three
  optimized with `optipng -o7`, well under Microsoft's 10KB banner-logo limit (3.3–4.8KB each).
- **Entra favicon padding fixed.** `entra-m365/favicon-32x32.png` rendered the Monogram
  edge-to-edge (bounding box 1–2px from every side of the 32px canvas) — reads as clipped at
  actual browser-tab size. Re-rendered with ~14% margin on all sides. Note: the same tightness
  exists across the *entire* `favicons/` set (16/32/48/180/192/512, both night and daylight) and
  `logos/favicon-white.svg` as used by the public site — not touched this round since only the
  Entra one was reported, but it's the identical underlying issue and worth a pass if it's ever
  raised. The fix is export-time padding only; the Monogram's own locked geometry/viewBox is
  unchanged (it does have ~3.5% built-in margin, which reads fine at large sizes — the problem is
  purely that 3.5% of 32px rounds to nothing after anti-aliasing).

## What's done — round 6 (propagate round 5 into brand-mcp and the markdown docs, 2026-09-10)

Round 5 fixed the assets and `index.html`/`BRAND.md` but left the query-time tooling and a couple
of quick-reference docs still describing the old, wrong state. Swept those:

- **`brand-mcp/src/lint.js`** — new terminology rule catches the bare `404.NET` typo going
  forward (excludes `ERROR404.NET` and the `error404.net` domain/email via a negative
  lookbehind on "error"). New `tagline-placement` rule fires when the locked tagline co-occurs
  with signature-shaped content (`~/ ... ::`, an `@error404.net`/`<you@...>` placeholder) — the
  tagline alone is still fine anywhere, this only catches it being used as an actual sign-off.
- **`brand-mcp/src/index.js`** — `brand_context` now returns a `tagline_exception` field stating
  the signature carve-out plainly, and `terminology.wordmark` calls out the bare-"404.NET" typo
  by name.
- **`brand-mcp/test/smoke.js`** — 6 new assertions (29 total, was 23): the exception field is
  present, the typo is caught, `ERROR404.NET` and `you@error404.net` are *not* false-flagged,
  the tagline alone isn't flagged, and the tagline-as-signature case is. `npm test` run clean,
  29/29.
- **`brand-mcp/README.md`** — test count updated to 29; "What `review_copy` catches" and "On
  false positives" now mention both new checks.
- **`README.md`** (repo root) — the "tagline origin" line used to say the tagline *is* "the real
  email-signature easter egg this brand is built around," which is now backwards. Reworded to
  state the origin as history while pointing at the current carve-out. Also fixed the "wordmark
  lockup" line, which still said "secondary/legacy lockup" — that description was written when
  the ANSI/glitch `main-lockup.png` was the primary lockup and this was the backup; that section
  was removed from `index.html` in the SharePoint-branch work (see `1eb6a73`), so this lockup is
  now the only one and isn't "secondary" to anything.
- **`brandkit.md`** — found to be stale independent of anything from round 5: it still described
  plain `404` (not `4Ø4`) as the default and a "flat opaque halo" behind the text — both retired
  in round 1, months before this doc was last touched. Fixed to match the locked spec, and added
  the same tagline/signature note as `BRAND.md`.
- **`DESIGN.md` §6.2** — added rows for the general-use icon+wordmark lockup and the three Entra
  banner-logo files, which round 4/5 shipped but hadn't made it into the variant table.
- **`AGENTS.md`** — checked for tagline/signature/wordmark content; it's a generic
  fetch-from-branding.error404.net meta-doc with none, no change needed.

## What's NOT done — pending decisions / remaining scope

- **`logos/png/` — partially inspected.** The three *-multicolor variants (`libra-ring-multicolor`,
  `libra-no-ring-multicolor`, `libra-ham-multicolor`, 10 sizes each) are now current — see round 3
  above. The remaining subfolders (`libra-*-{black,white,blue,green,pink}`, `libra-neon-*`,
  `site-icon-{light,dark}-mode`) have **no corresponding SVG in `logos/`** for some of the
  single-accent-color variants (blue/green/pink) — these look like legacy exports that predate
  the current locked variant taxonomy. Don't regenerate them by guessing; ask Jesse whether
  they're still in scope before touching them.
- **`social/stickers/sticker-circle-neon-multi-900.png`** — uses a bespoke neon palette (green/
  magenta/cyan/gold with white node cores) that doesn't match any current SVG source — it's a
  one-off illustration, not a simple mark crop. Still has the old bent line and oval backdrop.
  Needs a from-scratch redraw, not a swap-in.
- **`social/stickers/sticker-diecut-shape-multicolor-1024.png`** — a shape-following (not
  circular) die-cut with a soft white outline glow around each node/line, plus the old oval.
  Needs the same kind of bespoke outline reconstruction as the neon sticker above.
- **`social/stickers/sticker-sheet-proof.png`, `social/youtube/*` (banner, watermark, thumbnail
  template), `social/linkedin/linkedin-cover-banner-1584x396.png`,
  `discord/discord-invite-splash-1920x1080.png`, `discord/discord-server-banner-960x540.png`**
  — full composite layouts (multiple mark instances, text, decorative elements), not inspected.
  Likely still show the old mark somewhere in the composition. Each needs its own layout pass,
  not a mechanical asset swap — flagging rather than guessing at their layouts.
- **`MOTD/`** — not touched. This is ASCII-art (shell escape sequences), a fundamentally
  different medium from the SVG/PNG marks above, and per memory overlaps with a separate prior
  "error404-motd-ascii-logos" project — don't assume it needs the same fix without checking
  that project's own status first.
- **`assets/print-mode.png`, `assets/signature-mockup-public.png`** — these show a tiny
  monogram-style glyph in a letterhead/signature mockup screenshot. At their rendered size the
  old line-geometry defect isn't visible, so they were left alone this pass. Worth
  regenerating for correctness whenever someone's doing a full mockup refresh anyway.
- **`main-lockup.png` (`assets/` and `obs/assets/logos/`, "Wordmark Lockup" in OBS)** — pure
  ANSI/glitch text title card, no constellation mark present. Confirmed out of scope for a
  logo-geometry fix; don't touch it for that reason. If it ever gets redesigned, that's a
  separate task.
- **`_to_delete/*.stale*` and `_to_delete/site-icon-modes.png`** — this sandbox can write and
  rename files in the mounted repo but cannot delete them (`rm`/`unlink` are blocked at the
  mount), so every stale git lock file this session had to clear got moved into `_to_delete/`
  instead of removed. Safe to delete that whole folder yourself, or grant the delete-permission
  prompt next time an agent asks and it'll clean things up directly.

## Working notes for future agents

- This repo lives at `/Users/Jesse/GitHub/Branding-Guide` on Jesse's Mac, reachable only via
  the device bridge — there is no local SVG rendering toolchain there (no `cairosvg`,
  `rsvg-convert`, or `inkscape`), so render SVG→PNG in the cloud sandbox and push the result
  with the device-commit tool. Don't try to install a renderer on the Mac side for this.
- **Cloud-sandbox render pipeline requires two fixes or every "4Ø4" text render comes out
  wrong** (see round 3 above): (1) `sudo apt-get install -y fonts-jetbrains-mono` — the
  container doesn't have it by default and `cairosvg` silently substitutes another font;
  (2) force grayscale antialiasing, or text edges get a real color fringe when composited on
  transparent backgrounds. Use a fontconfig override:
  ```
  cat > /tmp/fc/fonts.conf <<'EOF'
  <?xml version="1.0"?>
  <!DOCTYPE fontconfig SYSTEM "fonts.dtd">
  <fontconfig>
    <dir>/usr/share/fonts</dir>
    <cachedir>/tmp/fc/cache</cachedir>
    <match target="font">
      <edit name="antialias" mode="assign"><bool>true</bool></edit>
      <edit name="rgba" mode="assign"><const>none</const></edit>
      <edit name="hinting" mode="assign"><bool>true</bool></edit>
      <edit name="hintstyle" mode="assign"><const>hintslight</const></edit>
      <edit name="lcdfilter" mode="assign"><const>lcdnone</const></edit>
    </match>
  </fontconfig>
  EOF
  FONTCONFIG_FILE=/tmp/fc/fonts.conf python3 your_render_script.py
  ```
  Verify any new render with a pixel scan (partial-alpha pixels where G is 80+ above both R and
  B) before calling it done — don't trust a quick visual check on a solid background, the bug
  only shows up once composited onto something else.
- `obs/assets/logos/` mirrors `assets/` byte-for-byte for the specific files OBS loads (see
  `obs/scenes/Error404.json`) — when you fix a logo asset that OBS also uses, push to both
  locations, not just one.
- Uncommitted `git status` changes were already present in this repo when this pass started
  (partial earlier work) — check `git status` / `git diff` before assuming a clean tree, and
  don't assume everything currently modified-but-uncommitted is already correct; verify
  against the geometry spec above.
