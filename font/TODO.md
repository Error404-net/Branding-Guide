# Error404 Mono — to-do

Status: v0.1 built (`Error404Mono-Regular.ttf`). Hybrid: Share Tech Mono caps/digits/punctuation +
JetBrains Mono lowercase/symbols/arrows. Ø on the constellation edge angle (45.75°).

## Blocking the logo re-render
- [ ] Pick the digit zero slash length: 240 / 300 (current) / 360 (see `previews/specimen.png`)
- [ ] Outline the "4Ø4" text in every mark SVG (remove the font dependency from the marks)
- [ ] Update `scripts/verify-marks.py` and BRAND.md "Mark build spec": font name, Ø angle 45.75°, slash role = continuation
- [ ] Re-render all PNG/social/Office/Entra/Discord/YouTube/LinkedIn assets from the outlined SVGs
- [ ] Confirm the Ø clearance check (`check_mark_clearance.py`) passes on the final font

## Font quality
- [ ] True bold (needs outline offsetting; install pathops or a stroker first)
- [ ] Check the Ø and 0 at 16 px and 24 px (MOTD, favicons, OBS overlays)
- [ ] Hinting / ttfautohint pass for screen sizes
- [ ] Kerning and spacing review on lowercase (donor glyphs were rescaled, not hand-spaced)
- [ ] Glyph review: JetBrains lowercase vs Share Tech caps weight and x-height match
- [ ] Box-drawing and block elements (MOTD, terminal art)
- [ ] Extra arrows and math symbols as needed

## Licence and distribution
- [ ] Add full OFL 1.1 text and both upstream copyright files (`font/NOTICE.txt`)
- [ ] Confirm the name "Error404 Mono" does not clash with an existing font name
- [ ] Web font (woff2) for the styleguide and the brand page
- [ ] Brand Center upload package (manual)

## Where the font lands (after v1.0)
- [ ] Replace Share Tech Mono in the Office templates (re-embed the .docx font; PPTX embedding still not done)
- [ ] Replace the Share Tech Mono references in index.html, Hugo CSS, Discord theme, OBS overlays, brand-mcp, Technitium block page
- [ ] Keep Courier New in the paper/Machine-mode docs and email signatures (email clients cannot load web fonts)
