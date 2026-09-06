// WCAG 2.1 contrast. Kept dependency-free and identical in behaviour to
// styleguide/src/lib/contrast.js.

function channel(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function normalizeHex(input) {
  let h = String(input).trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.split('').map((c) => c + c).join('');
  if (/^[0-9a-fA-F]{8}$/.test(h)) h = h.slice(0, 6); // drop alpha
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return '#' + h.toUpperCase();
}

export function luminance(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

export function verdict(ratio) {
  return {
    ratio: Math.round(ratio * 100) / 100,
    normalText: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL',
    largeText: ratio >= 4.5 ? 'AAA' : ratio >= 3 ? 'AA' : 'FAIL',
    uiComponent: ratio >= 3 ? 'PASS' : 'FAIL',
  };
}
