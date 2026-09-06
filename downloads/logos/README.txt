ERROR404.NET — Libra Constellation Mark — Full Logoset
========================================================

The primary mark: a node-link graph built from the real Libra constellation
(actual RA/Dec star positions and magnitudes for Zubenelgenubi, Zubeneschamali,
Zubenelakrab, Brachium, Upsilon and Tau), with "404" set in the open space of
the "scales" shape.

FOLDERS
-------
svg/                      <- not used, see root: all vector masters are in this
                             top-level folder (libra-*.svg)
png/<variant>/<size>.png  <- raster exports for every variant at 16/32/48/64/
                             128/180/192/240/512/1024 px

VARIANTS (root .svg files + matching png/ subfolder)
-----------------------------------------------------
libra-ring-{black,white,blue,pink,green,multicolor}.svg      Full mark inside the ring, six colorways
libra-no-ring-{black,white,blue,pink,green,multicolor}.svg   Mark alone, no ring, six colorways
libra-ham-{black,white,multicolor}.svg            "4Ø4" ham-radio slashed-zero variant (no ring)
libra-neon-{blue,pink,green,multi}.svg            Neon-tube glow treatment, opaque near-black backdrop
libra-site-icon-light-mode.svg / png/             Flat single-tone icon (dark mark, transparent bg)
                                                   for use on LIGHT page backgrounds
libra-site-icon-dark-mode.svg / png/              Flat single-tone icon (white mark, transparent bg)
                                                   for use on DARK page backgrounds
                                                   -> includes favicon.ico (16/32/48) in
                                                      png/site-icon-light-mode/

USAGE NOTES
-----------
- multicolor = the four brand accents (blue #4DE1FF, pink #FF5FA2, yellow #FFE156,
  mint #37F0A6) cycled across the six stars, on the dark indigo brand background.
- black / white = flat single-tone versions for print, stamps, watermarks, or
  any single-color reproduction context.
- blue / pink / green = single-accent versions for cases needing one brand color,
  not the full mix. Green accent is the fluorescent green #39FF14 (a distinct
  color from the mint #37F0A6 used in the multicolor mix).
- ham = swaps "404" for "4Ø4" (slashed zero), the amateur-radio convention for
  distinguishing zero from the letter O.
- neon-{blue,pink,green,multi} = the "neon tube" display treatment: the same
  real node-link geometry rendered as a glowing tube (layered blur + bright
  core) on a near-black backdrop (#0B0810). Colors: blue=cyan #00F0FF,
  pink=magenta #FF16E0, green=fluorescent green #38FF16, multi=all four brand
  accents cycled. This is a display/marketing treatment, not a usage mark —
  the backdrop is baked in (not transparent) because the glow only reads
  correctly against dark.
- site-icon-* = the minimal favicon/app-icon cut: no halo, no ring, no color —
  pure mark, transparent background, meant to sit directly on the page's own
  light or dark surface color.
- Ring/no-ring/ham/site-icon SVGs are transparent-background vector masters
  (240x240 viewBox) — safe to recolor, rescale, or re-export at any size.
  Neon SVGs carry their backdrop baked in for the same reason.
- All PNG exports are optimized (pngquant + optipng) to keep file size down
  without visible quality loss.
