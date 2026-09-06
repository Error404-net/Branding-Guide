# Error404 MOTD — Logo Variants Guide

All 10 logo variants with descriptions and visual comparison.

## 1. BOLD (Recommended Default)

Maximum visual impact. Large ASCII art, great for prominent display.

```
  ███████████████████████████████████████████████████████
  ███████████████████████████████████████████████████████
  ███████████  ERROR404.NET  ███████████████████████████
  ███████████████████████████████████████████████████████
  ███████████████████████████████████████████████████████
  !ignore → return "404: Message not found"
```

**Use cases:** Default MOTD, prominent branding, visual impact
**Size:** 6 lines, 59 characters wide
**Setting:** `ACTIVE_LOGO="logo_bold"`

---

## 2. SHIELD

Professional shield design, formal appearance, security-oriented.

```
   ╔══════════════════════════════╗
   ║  ERROR404.NET                ║
   ║  !ignore → 404 not found     ║
   ╚══════════════════════════════╝
```

**Use cases:** Security-focused systems, formal environments, embedded systems
**Size:** 4 lines, 33 characters wide
**Setting:** `ACTIVE_LOGO="logo_shield"`

---

## 3. MATRIX

Tech/hacker style, minimal, modern aesthetic.

```
  > ERROR404.NET :: !ignore → 404
```

**Use cases:** Developer environments, tech-forward systems, minimal displays
**Size:** 1 line, 35 characters wide
**Setting:** `ACTIVE_LOGO="logo_matrix"`

---

## 4. COMPACT

Ultra-minimal, fits anywhere, works on restricted displays.

```
  [ERROR404.NET]
```

**Use cases:** Restricted terminals, embedded systems, headless servers
**Size:** 1 line, 17 characters wide
**Setting:** `ACTIVE_LOGO="logo_compact"`

---

## 5. HEX

Geometric hexagon design, visually distinctive, cybersecurity theme.

```
      ╱─────────────────╲
    ╱  ERROR404.NET      ╲
    ╲  !ignore → 404      ╱
      ╲─────────────────╱
```

**Use cases:** Cybersecurity systems, modern infrastructure, aesthetic preference
**Size:** 4 lines, 38 characters wide
**Setting:** `ACTIVE_LOGO="logo_hex"`

---

## 6. BRACKET

Clean bracket style, professional, scalable appearance.

```
  ┌─ ERROR404.NET ─┐
  │ !ignore → 404  │
  └────────────────┘
```

**Use cases:** Professional environments, corporate systems, clean aesthetics
**Size:** 3 lines, 21 characters wide
**Setting:** `ACTIVE_LOGO="logo_bracket"`

---

## 7. PIPELINE

Infrastructure/DevOps themed, flow-oriented, modern operations focus.

```
  ◆─────► ERROR404.NET ─────►◆
  └─── !ignore → 404 Message ───┘
```

**Use cases:** Infrastructure systems, DevOps environments, automation-focused
**Size:** 2 lines, 45 characters wide
**Setting:** `ACTIVE_LOGO="logo_pipeline"`

---

## 8. LINE

Elegant minimal design with horizontal lines, sophisticated.

```
  ═══════════════════════════════
       ERROR404.NET — 404
  ═══════════════════════════════
```

**Use cases:** Elegant presentations, professional systems, minimal preference
**Size:** 3 lines, 35 characters wide
**Setting:** `ACTIVE_LOGO="logo_line"`

---

## 9. DOUBLE

Professional double-line border, formal, corporate aesthetic.

```
  ╔═══════════════════════════╗
  ╠═ ERROR404.NET ═══════════╣
  ╚═══════════════════════════╝
```

**Use cases:** Corporate systems, formal deployments, professional display
**Size:** 3 lines, 31 characters wide
**Setting:** `ACTIVE_LOGO="logo_double"`

---

## 10. MINIMAL

Single-line ultra-compact, absolute minimum space, mobile-friendly.

```
► ERROR404.NET
```

**Use cases:** Restricted displays, minimal terminals, mobile systems
**Size:** 1 line, 15 characters wide
**Setting:** `ACTIVE_LOGO="logo_minimal"`

---

## Selection Guide

| Use Case | Recommended | Alternative |
|----------|------------|------------|
| Default/General | logo_bold | logo_shield |
| Developer/DevOps | logo_matrix | logo_pipeline |
| Corporate/Formal | logo_double | logo_line |
| Security-Focused | logo_shield | logo_hex |
| Minimal/Restricted | logo_compact | logo_minimal |
| Aesthetic/Premium | logo_line | logo_hex |
| Mobile/Embedded | logo_minimal | logo_compact |

## Switching Logos

### Permanent Switch

Edit the MOTD script and change line ~18:

```bash
sudo nano /etc/update-motd.d/10-motd-error404
```

Look for:
```bash
ACTIVE_LOGO="logo_bold"
```

Change to your preferred logo, save, and it takes effect on next login.

### Temporary Test

```bash
# Edit the value in a subshell without saving
ACTIVE_LOGO="logo_hex" bash /etc/update-motd.d/10-motd-error404
```

## Color Customization

All logos use these color variables:

```bash
COLOR_PRIMARY=51      # Cyan (#4DE1FF)
COLOR_ACCENT=201      # Pink (#FF5FA2)
COLOR_STATUS=48       # Green (#37F0A6)
COLOR_EMPHASIS=226    # Yellow (#FFE156)
COLOR_TEXT=255        # White
```

Edit these values (0-255, ANSI 256-color codes) to customize.

---

**Current version:** Error404 MOTD v1.0
**Brand tagline:** `!ignore → return "404: Message not found"`
