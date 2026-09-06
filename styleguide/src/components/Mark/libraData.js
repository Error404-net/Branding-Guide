// Libra constellation geometry, lifted verbatim from the shipping SVG masters
// (logos/libra-*.svg). Do not "tidy" these coordinates - node positions come
// from real right ascension/declination and node radius is scaled to real
// apparent magnitude, so brighter stars render larger.
//
// The halo and text placement are likewise fixed: this is the one arrangement
// confirmed not to intersect the tail edges or nodes.

export const VIEWBOX = 240;

export const STARS = [
  { id: 'alpha', cx: 24.0,  cy: 86.2,  r: 15.5, name: 'Zubenelgenubi',  bayer: 'α Lib', mag: 2.75 },
  { id: 'beta',  cx: 132.0, cy: 24.0,  r: 16.3, name: 'Zubeneschamali', bayer: 'β Lib', mag: 2.61 },
  { id: 'gamma', cx: 204.0, cy: 74.9,  r: 8.5,  name: 'Zubenelakrab',   bayer: 'γ Lib', mag: 3.91 },
  { id: 'sigma', cx: 80.2,  cy: 173.8, r: 12.3, name: 'Brachium',       bayer: 'σ Lib', mag: 3.29 },
  { id: 'upsilon', cx: 212.2, cy: 200.6, r: 10.4, name: 'Upsilon Librae', bayer: 'υ Lib', mag: 3.58 },
  { id: 'tau',   cx: 216.0, cy: 216.0, r: 8.6,  name: 'Tau Librae',     bayer: 'τ Lib', mag: 3.66 },
];

// The traditional scales quadrilateral, plus the tail line.
export const EDGES = [
  ['alpha', 'beta'],
  ['beta', 'gamma'],
  ['gamma', 'sigma'],
  ['sigma', 'alpha'],
  ['gamma', 'upsilon'],
  ['upsilon', 'tau'],
];

export const RING = { cx: 120, cy: 120, r: 112, strokeWidth: 10 };
export const HALO = { cx: 145, cy: 129, rx: 56, ry: 32 };
export const LABEL = { x: 145, y: 143, fontSize: 44 };

// Node fills for the multicolor variant, in STARS order.
export const MULTICOLOR = ['#4DE1FF', '#FF5FA2', '#FFE156', '#37F0A6', '#4DE1FF', '#FF5FA2'];

export const COLORWAYS = {
  multicolor: { nodes: MULTICOLOR,  edge: '#37F0A6', ring: '#F4F1FF', text: '#F4F1FF', halo: '#231451' },
  blue:       { nodes: '#4DE1FF',   edge: '#4DE1FF', ring: '#F4F1FF', text: '#F4F1FF', halo: '#231451' },
  pink:       { nodes: '#FF5FA2',   edge: '#FF5FA2', ring: '#F4F1FF', text: '#F4F1FF', halo: '#231451' },
  green:      { nodes: '#37F0A6',   edge: '#37F0A6', ring: '#F4F1FF', text: '#F4F1FF', halo: '#231451' },
  white:      { nodes: '#F4F1FF',   edge: '#F4F1FF', ring: '#F4F1FF', text: '#F4F1FF', halo: '#231451' },
  black:      { nodes: '#000000',   edge: '#000000', ring: '#000000', text: '#000000', halo: '#FFFFFF' },
};
