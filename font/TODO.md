# Error404 Mono — to-do

Status: v0.1 built (`Error404Mono-Regular.ttf`). Hybrid: Share Tech Mono caps/digits/punctuation +
JetBrains Mono lowercase/symbols/arrows. Ø on the constellation edge angle (45.75°).

## Blocking the logo re-render
- [x] Zero design decided 2026-11-26 (`zero_glyphs.py`, `previews/zero-round1..4.png`): 45.75° edge angle, wide bowl (x 52..488),
      thin 60-unit slash, square tips, solid crossing. Digit 0 tip +40 (stays in cell); Ø tip +110 (logo/display).
      Clearance check passes: Ø clears the 4s by 3.9 / 5.9 units, lines-to-text 3.4, zero overlap.
- [ ] Regenerate `previews/specimen.png` and `previews/mark-newfont.png` (still show the old zero)
- [x] O decided: true oval, 535 wide, overshoot 14 (`round_glyphs.py`, b3)
- [x] Q, D, C, G follow the round O (`round_glyphs.py`, a1)
- [x] Constellation icon glyph at U+E404 (`icon_glyph.py`, a1)
- [ ] Outline the "4Ø4" text in every mark SVG (remove the font dependency from the marks)
- [ ] Update `scripts/verify-marks.py` and BRAND.md "Mark build spec": font name, Ø angle 45.75°, slash role = continuation
- [ ] Re-render all PNG/social/Office/Entra/Discord/YouTube/LinkedIn assets from the outlined SVGs
- [ ] Confirm the Ø clearance check (`check_mark_clearance.py`) passes on the final font

## Font quality
- [ ] True bold (needs outline offsetting; install pathops or a stroker first)
- [ ] Check the Ø and 0 at 16 px and 24 px (MOTD, favicons, OBS overlays)
- [ ] Hinting / ttfautohint pass for screen sizes
- [ ] Kerning and spacing review on lowercase (donor glyphs were rescaled, not hand-spaced)
- [x] Lowercase fitted to caps: x-height 490, stems 87 (`lowercase_fit.py`, b1)
- [x] Confusables (1 l I |, 5S, 8B, rn m) checked: already distinct
- [ ] Box-drawing and block elements (MOTD, terminal art)
- [ ] Extra arrows and math symbols as needed
- [ ] Powerline / Nerd Font glyphs for p10k (❯, ±, branch, lock, separators): missing today, show as boxes

## Licence and distribution
- [x] Licence: font OFL 1.1 (`OFL.txt`), scripts MIT. Still verify upstream copyright lines against each donor's OFL.txt
- [ ] Confirm the name "Error404 Mono" does not clash with an existing font name
- [ ] Web font (woff2) for the styleguide and the brand page
- [ ] Brand Center upload package (manual)

## Where the font lands (after v1.0)
- [ ] Replace Share Tech Mono in the Office templates (re-embed the .docx font; PPTX embedding still not done)
- [ ] Replace the Share Tech Mono references in index.html, Hugo CSS, Discord theme, OBS overlays, brand-mcp, Technitium block page
- [ ] Keep Courier New in the paper/Machine-mode docs and email signatures (email clients cannot load web fonts)
