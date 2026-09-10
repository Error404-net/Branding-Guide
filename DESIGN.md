---
brand: ./BRAND.md
name: Error404 Design System
version: 1
language: en
---

# Error404 — DESIGN.md

Implementation tokens for AI coding agents and for anyone building an Error404
surface. This design system expresses the [Error404 brand](./BRAND.md).

**Division of responsibility.** `BRAND.md` owns durable identity: purpose,
voice, vocabulary, approved colors *and their meaning*, approved typefaces,
logo invariants. This file owns the surface layer: the full palette with
semantic roles and states, the type scale, spacing, layout, and components.
The test — if it should survive a complete visual redesign, it belongs in
`BRAND.md`, not here.

`BRAND.md` names colors by meaning ("Accent — Blue"). This file names them by
role ("`--accent-primary`"). The mapping table below makes that duplication
auditable.

---

## 1. Color tokens

### 1.1 Brand → role mapping

| BRAND.md name | Role token | Value |
|---|---|---|
| Background | `--surface` | `#231451` |
| Deep background | `--surface-deep` | `#170C38` |
| — (derived) | `--surface-raised` | `#1C1044` |
| Foreground | `--text-strong` | `#F4F1FF` |
| Accent — Blue | `--accent-primary` | `#4DE1FF` |
| Accent — Pink | `--accent-secondary` | `#FF5FA2` |
| Accent — Yellow | `--accent-emphasis` | `#FFE156` |
| Accent — Mint | `--accent-status` | `#37F0A6` |

### 1.2 Neutral text ramp

The implementation uses four foreground tones, not one. `BRAND.md` documents
only `#F4F1FF` because that is the identity color; the rest are surface-layer
derivations and live here.

| Token | Value | Use |
|---|---|---|
| `--text-strong` | `#F4F1FF` | Headings, reversed marks |
| `--text-body` | `#E8E4FF` | Default body text |
| `--text-muted` | `#C9C3EF` | Paragraph and table copy |
| `--text-subtle` | `#8A83B8` | Captions, secondary notes |

### 1.3 Border ramp

Borders are the primary accent at fixed alphas. Do not introduce new alphas.

| Token | Value | Use |
|---|---|---|
| `--border-strong` | `#4DE1FF44` | Callout boxes, panel edges |
| `--border` | `#4DE1FF33` | Table cells, image frames |
| `--border-subtle` | `#4DE1FF22` | Footer rule, hairlines |
| `--border-dashed` | `#4DE1FF55` | Dashed section dividers |

### 1.4 Contrast — measured

Computed WCAG 2.1 ratios against all three surfaces. These are measured, not
estimated.

| Token | on `#231451` | on `#170C38` | on `#1C1044` | Normal text |
|---|---|---|---|---|
| `--text-strong` | 14.63:1 | 16.47:1 | 15.64:1 | AAA |
| `--text-body` | 13.15:1 | 14.81:1 | 14.06:1 | AAA |
| `--text-muted` | 9.72:1 | 10.94:1 | 10.39:1 | AAA |
| `--text-subtle` | 4.66:1 | 5.25:1 | 4.99:1 | AA |
| `--accent-primary` | 10.49:1 | 11.80:1 | 11.21:1 | AAA |
| `--accent-secondary` | 5.74:1 | 6.47:1 | 6.14:1 | AA |
| `--accent-emphasis` | 12.52:1 | 14.10:1 | 13.39:1 | AAA |
| `--accent-status` | 10.99:1 | 12.37:1 | 11.75:1 | AAA |

Print/Corporate mode is black on white: 21.00:1.

> **Resolved (2026-09-07).** A stray `#655E93` — not a real token, and not
> `--text-subtle` — measured **2.77:1** on `#231451`: below the 4.5:1
> normal-text minimum and even the 3:1 large-text floor, the only color in the
> system that failed. It no longer appears anywhere in the codebase; the sole
> live occurrence (the title line in `email-templates/Error404-M365-Signature-
> Standard.html`) has been swapped to `--text-subtle` (`#8A83B8`, 4.66:1 — AA).
> That instance sat on white in practice, so it was never actually failing —
> the swap is a token-hygiene fix (no undocumented hex outside the locked
> ramp), not a contrast rescue.
>
> The "PDF page footer" this was originally reported against isn't part of
> the current PDF pipeline (`index.html` prints straight through Chromium with
> no separate running-footer template — see `generate-pdf.js`), so it couldn't
> be reproduced there. If a running footer is ever added back, give it
> `--text-subtle`, not a new hex.

### 1.5 Usage rules

- One surface, one text tone, and at most **two** accents per surface.
- `--surface` and `--surface-deep` are a background *pair*. `--surface-deep` is
  never an accent.
- Each accent keeps its `BRAND.md` meaning. Do not reassign one to suit a layout.
- Accessibility overrides brand. Where a combination fails contrast, change the
  implementation and note the change. Never ship the failing combination.
- Print/Corporate mode uses **none** of these tokens. Pure black on white.

```css
:root {
  --surface: #231451;
  --surface-deep: #170C38;
  --surface-raised: #1C1044;

  --text-strong: #F4F1FF;
  --text-body: #E8E4FF;
  --text-muted: #C9C3EF;
  --text-subtle: #8A83B8;

  --accent-primary: #4DE1FF;
  --accent-secondary: #FF5FA2;
  --accent-emphasis: #FFE156;
  --accent-status: #37F0A6;

  --border-strong: #4DE1FF44;
  --border: #4DE1FF33;
  --border-subtle: #4DE1FF22;
  --border-dashed: #4DE1FF55;
}
```

---

## 2. Typography

### 2.1 Families

Mirrors the approved faces in `BRAND.md`; the scale below is derived here.

| Token | Stack | Use |
|---|---|---|
| `--font-display` | `'Press Start 2P', monospace` | Hero only, ≥24px |
| `--font-terminal` | `'VT323', monospace` | Headings, NFO tables |
| `--font-body` | `'JetBrains Mono', monospace` | Body, UI, code |

**Always declare the generic fallback.** A family named alone falls back to the
browser default *serif*, not to monospace. This has shipped as a real defect:
the guidelines PDF rendered its own type specimens in Times for several
revisions because three inline `font-family` declarations omitted it.

Fonts must be self-hosted or vendored. Build environments here have no access to
`fonts.googleapis.com`, and a CDN link fails silently into a fallback face.

### 2.2 Scale

Measured from the shipping guidelines document.

| Token | Size | Line height | Family | Color | Element |
|---|---|---|---|---|---|
| `--type-h1` | 34px | 1.2 | terminal | `--text-strong` | Page title |
| `--type-h2` | 24px | 1.2 | terminal | `--accent-secondary` | Section |
| `--type-h3` | 18px | 1.3 | terminal | `--accent-status` | Subsection |
| `--type-body` | 12.5px | 1.6 | body | `--text-muted` | Paragraph, list, cell |
| `--type-table` | 11.5px | 1.5 | body | `--text-muted` | Dense table |
| `--type-th` | 14px | 1.4 | terminal | `--text-strong` | Table header |
| `--type-caption` | 11px | 1.5 | body | `--text-subtle` | Caption, note |
| `--type-foot` | 10px | 1.4 | body | `--text-subtle` | Running footer |

Headings carry `letter-spacing: 1px`. Never exceed two mono families on a
single surface — display plus one is the practical limit.

---

## 3. Spacing and layout

Spacing is a 2px-based scale. Use tokens, not raw values.

| Token | Value |
|---|---|
| `--space-1` | 2px |
| `--space-2` | 6px |
| `--space-3` | 8px |
| `--space-4` | 14px |
| `--space-5` | 18px |
| `--space-6` | 26px |
| `--space-7` | 30px |
| `--space-8` | 56px |

**Document page geometry** (US Letter at 96dpi):

| Token | Value |
|---|---|
| `--page-width` | 816px |
| `--page-height` | 1056px |
| `--page-pad-y` | 56px |
| `--page-pad-x` | 60px |

`--page-height` is a hard ceiling. Content that exceeds it is clipped, not
reflowed. Any build that emits paged output must fail on overflow rather than
ship a truncated page.

**Radius.** `--radius-sm: 2px`, `--radius-md: 6px`, `--radius-pill: 50%`
(circular avatars and marks only). Nothing larger. Soft rounded cards are on the
`BRAND.md` avoid list.

---

## 4. Components

### 4.1 Surface / page

```css
background: radial-gradient(ellipse at 50% 0%, #241A5C 0%, var(--surface-deep) 60%);
```

The gradient inner stop `#241A5C` is a component-level value, not a palette
token. Do not use it as a fill anywhere else.

### 4.2 Callout box

Border `--border-strong`, background `--surface-raised`, padding
`var(--space-4) var(--space-5)`, margin `var(--space-4) 0`. Contains an `h3` and
body copy. Used for rules, warnings, and locked-value notes.

### 4.3 Table

Full width, `border-collapse: collapse`. Cells: `1px solid var(--border)`,
padding `var(--space-2) 10px`, left-aligned, `--type-table`. Header row:
`--surface-raised` background, `--type-th`.

### 4.4 Status pill

Inline-block, `1px solid var(--accent-emphasis)`, text `--accent-emphasis`,
padding `4px 12px`, 11px, `letter-spacing: 1px`. Reserved for locked-state
declarations. Never use it as a generic tag or a button.

### 4.5 Swatch

120px wide. 70px chip with `--radius-sm` and a `rgba(255,255,255,0.15)` border,
label in `--type-caption`, hex in `--type-caption` at `--text-subtle`. The hex
value is always shown — a swatch without its value is not usable.

### 4.6 Running footer

Absolute, `bottom: var(--space-6)`, inset by `--page-pad-x`, flexed
space-between, `--type-foot`, `border-top: 1px solid var(--border-subtle)`.
Left: `ERROR404.NET`. Right: `page N`.

**Page numbers are always generated from position, never hand-written.** They
had silently drifted out of sync in an earlier revision. For the same reason,
cross-references between pages cite the page *title*, never its number.

### 4.7 Interaction states

The shipping surfaces are paged documents and have no interaction states. For
interactive surfaces, derive states rather than inventing colors:

| State | Rule |
|---|---|
| Default | `--accent-primary` |
| Hover | Same hue, +8% lightness |
| Active | Same hue, −8% lightness |
| Focus | 2px `--accent-primary` outline, 2px offset. **Never** remove the outline |
| Disabled | `--text-subtle`, 50% opacity, `cursor: not-allowed` |

Focus must stay visible for keyboard users. This overrides any brand concern.

---

## 5. Modes

Every surface resolves to exactly one mode. There is no third.

| | Digital | Print/Corporate |
|---|---|---|
| Trigger | Screen you control | Print, PDF, Word, email, a client's inbox |
| Surface | `--surface` / `--surface-deep` | `#FFFFFF` |
| Text | Neutral ramp | `#000000` |
| Accents | Up to two | None |
| Mark | Full lockup with offset layers | Flat monochrome |
| Identity carrier | Neon geometry, scanlines, glow | ASCII rules, boxed fields, `>` `::` `~/` |
| Type | Display + body | One face throughout |

PowerPoint is the single documented exception: an export that stays Digital,
because slides are a screen medium.

---

## 6. Marks & logo

### 6.1 Canonical default

**No-ring multicolor variant** (constellation lines and nodes only, no halo).

Used for clean mark placement where the constellation geometry alone carries the identity. Works on both dark and light backgrounds. File: `libra-no-ring-multicolor.svg`.

**Alternative for single-color contexts:** `4Ø4` in neon green (`#39FF14`), file `libra-ham-multicolor.svg` (dark backgrounds only).

### 6.2 Mark variants

All no-ring variants ship without the halo ellipse.

| Context | Variant | File |
|---|---|---|
| Canonical default | No-ring multicolor | `libra-no-ring-multicolor.svg` |
| Dark background, neon | `4Ø4` neon green | `libra-ham-multicolor.svg` |
| Light background | `4Ø4` white | `libra-ham-white.svg` |
| Light background alternative | No-ring black | `libra-no-ring-black.svg` |
| Dark background, secondary | No-ring any color | `libra-no-ring-[color].svg` |
| Icon-only, dark surface | Monogram — Night (white) | `monogram-night.svg` |
| Icon-only, light surface | Monogram — Daylight (black) | `monogram-daylight.svg` |
| Printer watermark / Word Picture Watermark | Watermark — single mark, 10% opacity, black | `logos/watermark.svg`, `assets/watermark-1800.png` |
| Icon + wordmark lockup, general use | Icon-only mark + "ERROR404.NET", black, no tagline | `assets/netmesh-lockup.png` |
| Microsoft Entra / M365 banner logo | Same lockup, 280×60, light/dark/color | `entra-m365/banner-logo-{light,dark,color}-280x60.png` |

**Minimum size:** 24px for icon/Monogram variants; 128px and up for full
textured mark. The Monogram is already reduced to nodes-and-lines only (no
rings, no numerals), so it is the correct choice at icon sizes rather than a
further-reduced glyph-only cut.

**Construction note.** Every no-ring/ring/ham variant's connecting lines are
one uniform color (the cut's own color; multicolor keeps Mint `#37F0A6` for
all lines, multicolor nodes). The line through the `4Ø4` numerals is two
collinear segments split at the exact angle of the `Ø` glyph's own diagonal
slash — see `BRAND.md` for the full rule. Do not regenerate any mark asset
without preserving both of these.

All exports are transparent except neon variants, which bake in a near-black
backdrop (`#231451` @ 90% opacity).

---

## 7. Agent checklist

Before emitting an Error404 surface, verify:

1. Correct mode selected. Printed or outbound → Print/Corporate.
2. Colors come from tokens. No raw hex outside `:root`.
3. At most two accents on the surface.
4. Every `font-family` ends in a generic fallback.
5. Fonts self-hosted or vendored, never a CDN link.
6. Contrast checked against §1.4. Accessibility wins over brand.
7. Focus outlines present and visible.
8. Terminology matches the `BRAND.md` table: **mark**, **wordmark**, **lockup**,
   **variant**, **Digital mode**, **Print/Corporate mode**.
9. Instructional copy follows the STE rules in `BRAND.md`.
10. No real contact details. Placeholder tokens only.
11. Logo/mark: use canonical default (no-ring multicolor) for mark placement
    with the `4Ø4` numerals; `4Ø4` neon green for single-color digital
    contexts on dark backgrounds only; the Monogram (night/daylight) for any
    icon-only slot — never a further-cropped or hand-reduced mark.
