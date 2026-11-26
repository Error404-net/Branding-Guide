ERROR404.NET — Libra Constellation Mark — Full Logoset
========================================================

The primary mark: a node-link graph built from the real Libra constellation
(actual RA/Dec star positions and magnitudes for Zubenelgenubi, Zubeneschamali,
Zubenelakrab, Brachium, Upsilon and Tau), with "4Ø4" set in the open space of
the "scales" shape. "4Ø4" is universal — every cut below carries it, there is
no plain "404" cut. See CLAUDE.md's "Canonical geometry" section for the
locked node/line/text coordinates if you're touching any of these files.

FOLDERS
-------
png/<variant>/<size>.png  <- raster exports for the ring and no-ring
                             variants at 16/32/48/64/128/180/192/240/
                             512/1024 px. No raster exports yet for
                             monogram-*.svg or watermark.svg — those ship as
                             SVG only, plus the pre-rendered
                             assets/watermark-1800.png in the root assets/
                             folder.

CURRENT VARIANTS (root .svg files + matching png/ subfolder)
--------------------------------------------------------------
libra-ring-{black,white,pink,green,multicolor}.svg           Full mark inside the ring, five colorways. The constellation
                                                   is scaled to 76.7% (a <g transform>) so every node sits inside
                                                   the ring. Node coordinates are unchanged.
libra-no-ring-{black,white,blue,green,multicolor}.svg        Mark alone, no ring, five colorways (no-ring-pink not built) — the
                                                               canonical Primary mark (see DESIGN.md/
                                                               CLAUDE.md's naming taxonomy)
libra-neon-{green,multi}.svg                      Neon-tube glow treatment, opaque near-black backdrop
                                                  (neon-blue and neon-pink not built)
monogram-{night,daylight}.svg                     Icon-only mark, no text. night = white mark for dark
                                                   surfaces, daylight = black mark for light surfaces.
                                                   The canonical icon-only cut. It replaced every older
                                                   icon-only cut, all since deleted.
watermark.svg                                     Single mark, black, 10% opacity. Utility export for
                                                   printer watermark settings / Word's Picture Watermark
                                                   feature — not a brand-facing identity cut.
favicon-white.svg / favicon-dark.svg              Duplicates of monogram-night / monogram-daylight
                                                   respectively, named for their use as the site's
                                                   favicon href targets (see root index.html).

REMOVED (2026-11-26)
--------------------
libra-ham-*, libra-site-icon-*-mode and glyph-only/ were duplicates of libra-no-ring-* or
superseded by monogram-*. They are deleted. Variants that were promised but never built
(no-ring-pink, ring-blue, neon-blue, neon-pink) are dropped from the plan.

USAGE NOTES
-----------
- multicolor = the four brand accents (blue #4DE1FF, pink #FF5FA2, yellow #FFE156,
  mint #37F0A6) cycled across the six stars, on the dark indigo brand background.
- black / white = flat single-tone versions for print, stamps, watermarks, or
  any single-color reproduction context.
- blue / pink / green = single-accent versions for cases needing one brand color,
  not the full mix. Green accent is the fluorescent green #39FF14 (a distinct
  color from the mint #37F0A6 used in the multicolor mix).
- neon-{blue,pink,green,multi} = the "neon tube" display treatment: the same
  real node-link geometry rendered as a glowing tube (layered blur + bright
  core) on a near-black backdrop (#0B0810). Colors: blue=cyan #00F0FF,
  pink=magenta #FF16E0, green=fluorescent green #39FF14, multi=all four brand
  accents cycled. This is a display/marketing treatment, not a usage mark —
  the backdrop is baked in (not transparent) because the glow only reads
  correctly against dark.
- monogram-{night,daylight} = the minimal favicon/app-icon cut: no ring, no
  color, no text — pure mark, transparent background, meant to sit directly
  on the page's own light or dark surface color.
- Ring/no-ring/monogram SVGs are transparent-background vector masters
  (240x240 viewBox) — safe to recolor, rescale, or re-export at any size.
  Neon SVGs carry their backdrop baked in for the same reason.
- Never put a background oval/ellipse behind the "4Ø4" text on any variant —
  that treatment was tried and retired for good (see CLAUDE.md).
- All PNG exports are optimized (pngquant + optipng) to keep file size down
  without visible quality loss.
