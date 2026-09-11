// Libra constellation geometry, lifted verbatim from the shipping SVG masters
// (logos/libra-*.svg). Do not "tidy" these coordinates - node positions come
// from real right ascension/declination and node radius is scaled to real
// apparent magnitude, so brighter stars render larger.
//
// This is the locked geometry documented in CLAUDE.md's "Canonical geometry"
// section - keep the two in sync if either changes.

export const VIEWBOX = 240;

export const STARS = [
  { id: 'alpha', cx: 24.0,  cy: 86.2,  r: 15.5, name: 'Zubenelgenubi',  bayer: 'α Lib', mag: 2.75 },
  { id: 'beta',  cx: 132.0, cy: 24.0,  r: 16.3, name: 'Zubeneschamali', bayer: 'β Lib', mag: 2.61 },
  { id: 'gamma', cx: 204.0, cy: 74.9,  r: 8.5,  name: 'Zubenelakrab',   bayer: 'γ Lib', mag: 3.91 },
  { id: 'sigma', cx: 80.2,  cy: 202.0, r: 12.3, name: 'Brachium',       bayer: 'σ Lib', mag: 3.29 },
  { id: 'upsilon', cx: 212.2, cy: 200.6, r: 10.4, name: 'Upsilon Librae', bayer: 'υ Lib', mag: 3.58 },
  { id: 'tau',   cx: 216.0, cy: 216.0, r: 8.6,  name: 'Tau Librae',     bayer: 'τ Lib', mag: 3.66 },
];

// The traditional scales quadrilateral, plus the tail line. Each endpoint is
// either a star id (resolved to that star's node center) or an explicit
// [x, y] point.
//
// The gamma-sigma edge is split into two collinear segments rather than
// drawn as one line: the gap clears the "4Ø4" text, and the gap's angle is
// set to exactly match the rendered diagonal slash inside the "Ø" glyph
// (measured via Canny edge detection + Hough line fit on the isolated
// slash - converged on a 45° / -1.0 slope, not eyeballed; verified with a
// zero-pixel-overlap check between the line art and the text ink). See
// CLAUDE.md's "Canonical geometry" section before touching these two points.
export const EDGES = [
  ['alpha', 'beta'],
  ['beta', 'gamma'],
  ['gamma', [163.0, 114.5]],   // first half of the split line
  [[126.9, 155.3], 'sigma'],   // second half - collinear with the segment above
  ['sigma', 'alpha'],
  ['gamma', 'upsilon'],
  ['upsilon', 'tau'],
];

export const RING = { cx: 120, cy: 120, r: 112, strokeWidth: 10 };

// Text sits directly on the mark - no background plate behind it. A halo/
// oval backdrop was tried (seen in the old neon and ring cuts) and retired
// for good: it read badly against varying backdrops. Do not reintroduce one.
export const LABEL = { x: 145, y: 151, fontSize: 44 };

// Node fills for the multicolor variant, in STARS order.
export const MULTICOLOR = ['#4DE1FF', '#FF5FA2', '#FFE156', '#37F0A6', '#4DE1FF', '#FF5FA2'];

export const COLORWAYS = {
  multicolor: { nodes: MULTICOLOR,  edge: '#37F0A6', ring: '#F4F1FF', text: '#F4F1FF' },
  blue:       { nodes: '#4DE1FF',   edge: '#4DE1FF', ring: '#F4F1FF', text: '#F4F1FF' },
  pink:       { nodes: '#FF5FA2',   edge: '#FF5FA2', ring: '#F4F1FF', text: '#F4F1FF' },
  green:      { nodes: '#37F0A6',   edge: '#37F0A6', ring: '#F4F1FF', text: '#F4F1FF' },
  white:      { nodes: '#F4F1FF',   edge: '#F4F1FF', ring: '#F4F1FF', text: '#F4F1FF' },
  black:      { nodes: '#000000',   edge: '#000000', ring: '#000000', text: '#000000' },
};
