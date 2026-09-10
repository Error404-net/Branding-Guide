# Error404 — brandkit

One-screen quick reference. For the full system see [`BRAND.md`](./BRAND.md)
(identity) and [`DESIGN.md`](./DESIGN.md) (implementation tokens).

**Tagline (locked)** — `!ignore → return "404: Message not found"`
Not used in the email signature — see [`BRAND.md`](./BRAND.md) § Tagline & Slogans.

**Direction** — 90s warez-scene ASCII, phreaking, arcade, new-wave hacker.
Maximalist, textured, arcade-bright. The texture is the brand.

---

## Color — Arcade New Wave (locked)

| Swatch | Hex | Job |
|---|---|---|
| Background | `#231451` | Primary surface |
| Deep background | `#170C38` | Page shell, load fallback |
| Foreground | `#F4F1FF` | Text, reversed marks |
| Blue | `#4DE1FF` | Links, primary actions |
| Pink | `#FF5FA2` | Highlights, second glitch layer |
| Yellow | `#FFE156` | Taglines, callouts, CTAs |
| Mint | `#37F0A6` | Rules, dividers, status |

Each accent keeps one fixed job everywhere. Max two accents per surface.

---

## Type

| Role | Face | Fallback |
|---|---|---|
| Display | Press Start 2P | `monospace` — hero only, ≥24px |
| Terminal | VT323 | `monospace` — headings, NFO tables |
| Body / UI | JetBrains Mono | `monospace` — everything else |

Never more than two mono families on one surface. Always write the generic
fallback — a bare family name falls back to *serif*, not monospace.

---

## Mark

The Libra constellation mark: a node-link graph plotted from real Libra star
positions and magnitudes, with `4Ø4` centered in the scales' quadrilateral —
every variant, not just one cut. No halo or oval backdrop behind the text;
that treatment was tried and retired for good.

- Clear space: the height of one `4` glyph, all sides.
- Minimum: 24px flat, 128px full texture.
- Never stretch, skew, recolor off-palette, or place on a busy background
  without a scrim.

---

## Two modes, no third

| Digital | Print/Corporate |
|---|---|
| Screens you control | Print, PDF, Word, email, client inboxes |
| Full palette, glow, glitch lockup | Pure black on white, flat mono mark |

If it's printed, exported, or read in someone else's inbox → Print/Corporate.
PowerPoint is the one exception and stays Digital.

---

## Avoid

Corporate SaaS gradients · soft rounded-corner cards · Inter or Roboto ·
emoji as icons · any "clean flat design" pass that sands off the texture.

---

## Writing

Plain language for anything instructional — one idea per sentence, short
sentences, active voice, one term per concept. Flavor lives in the tagline and
the texture, not the documentation.

Say **mark** (the graphic), **wordmark** (the lettering), **lockup** (both),
**variant** (a version). Not colorway, cut, or pull.

Published copy is impersonal. Never use real contact details in a template or
mockup — placeholder tokens only.
