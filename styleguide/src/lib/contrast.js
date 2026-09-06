// WCAG 2.1 relative luminance and contrast ratio.
// Ratios in this styleguide are COMPUTED, never hardcoded, so that changing a
// token updates the reported ratio instead of quietly disagreeing with it.

function channel(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex) {
  const h = hex.replace('#', '').slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** WCAG rating for normal body text (the strictest case we ship). */
export function rating(ratio) {
  if (ratio >= 7) return { label: 'AAA', ok: true };
  if (ratio >= 4.5) return { label: 'AA', ok: true };
  if (ratio >= 3) return { label: 'AA large only', ok: false };
  return { label: 'FAIL', ok: false };
}
