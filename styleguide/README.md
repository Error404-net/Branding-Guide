# Error404 styleguide

The interactive half of the Error404 brand system. Storybook, deployed to
GitHub Pages at `branding.error404.net/styleguide/`.

The PDF guidelines are the designed, printable record. This is the surface you
poke at: switch a mark variant and watch it redraw, read contrast ratios that
are computed rather than transcribed.

## Run it

    npm install
    npm run dev      # http://localhost:6006
    npm run build    # -> storybook-static/

## What's in here

| Path | What |
|---|---|
| `src/tokens.css` | The implementation of `DESIGN.md`. Import this to consume the system |
| `src/components/Mark/` | The Libra mark as a real component, plus its star data |
| `src/components/Color/` | Swatches and the live contrast table |
| `src/components/Type/` | Type specimens and scale |
| `src/docs/` | MDX doc pages |
| `src/fonts/` | The three brand faces, self-hosted |
| `.storybook/theme.js` | Storybook's own UI, themed with the brand tokens |

## Rules this codebase follows

**Fonts are self-hosted.** Never a `fonts.googleapis.com` link. Build
environments here cannot reach it, and the failure is silent: text falls back to
a generic face and still looks plausible. That defect shipped in the guidelines
PDF for several revisions.

**Every `font-family` ends in a generic fallback.** A family named alone falls
back to the browser default *serif*, not to monospace. See the
`Typography → The fallback trap` story.

**Contrast ratios are computed, never hardcoded.** `src/lib/contrast.js`
calculates them from the token values, so editing a token updates the reported
number instead of leaving a stale one behind.

**The mark is drawn from the shipping geometry.** `libraData.js` holds the same
coordinates as `logos/libra-*.svg`. Node positions are real right ascension and
declination; node radius is scaled to real apparent magnitude. Do not "tidy"
those numbers.

## Source of truth

`DESIGN.md` is the specification and `tokens.css` is the implementation. If they
disagree, the CSS is the bug. If `BRAND.md` disagrees with anything, `BRAND.md`
wins.

## Deployment

`.github/workflows/styleguide.yml` builds this and publishes the whole site as
one Pages artifact: the existing hand-maintained `index.html` stays at the root,
and this mounts at `/styleguide/`.

**This requires the repository's Pages source to be set to "GitHub Actions"**
(Settings → Pages → Build and deployment → Source). While it is set to "Deploy
from a branch", the workflow builds but never publishes.
