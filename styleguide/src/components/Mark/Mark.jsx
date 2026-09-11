import React from 'react';
import { VIEWBOX, STARS, EDGES, RING, LABEL, COLORWAYS } from './libraData';

const byId = Object.fromEntries(STARS.map((s) => [s.id, s]));

// EDGES endpoints are either a star id or an explicit [x, y] point (used by
// the split line's two extra points, which aren't star positions).
const point = (ref) => (Array.isArray(ref) ? { x: ref[0], y: ref[1] } : { x: byId[ref].cx, y: byId[ref].cy });

/**
 * The Libra constellation mark - the Error404 primary mark.
 *
 * Rendered from the same geometry as the shipping SVG masters, so this is the
 * mark itself rather than a picture of it. The "4Ø4" text is universal across
 * every cut - there is no plain "404" variant.
 */
export function Mark({
  colorway = 'multicolor',
  ring = true,
  glyphOnly = false,
  size = 240,
  showStarNames = false,
  title,
}) {
  const c = COLORWAYS[colorway] ?? COLORWAYS.multicolor;
  const nodeFill = (i) => (Array.isArray(c.nodes) ? c.nodes[i % c.nodes.length] : c.nodes);
  const accessibleTitle = title ?? `Error404 Libra mark, ${colorway}${ring ? ', ring' : ', no ring'}`;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      width={size}
      height={size}
      role="img"
      aria-label={accessibleTitle}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <title>{accessibleTitle}</title>

      {ring && (
        <circle
          cx={RING.cx} cy={RING.cy} r={RING.r}
          fill="none" stroke={c.ring} strokeWidth={RING.strokeWidth}
        />
      )}

      <g>
        {EDGES.map(([a, b], i) => {
          const p1 = point(a);
          const p2 = point(b);
          return (
            <line
              key={`edge-${i}`}
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke={c.edge} strokeWidth={2} opacity={0.75}
            />
          );
        })}
      </g>

      <g>
        {STARS.map((s, i) => (
          <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill={nodeFill(i)} />
        ))}
      </g>

      {/* Labels radiate outward from the mark's center so they clear their own
          node and each other - the tail pair sits close enough that a fixed
          upward offset overlaps both. */}
      {showStarNames &&
        STARS.map((s) => {
          const dx = s.cx - VIEWBOX / 2;
          const dy = s.cy - VIEWBOX / 2;
          const len = Math.hypot(dx, dy) || 1;
          // Sit clear of the node, and - when the ring is drawn - clear of the
          // ring stroke too, which otherwise sits on top of an inner label.
          const ringClear = ring ? RING.r + RING.strokeWidth / 2 + 10 : 0;
          const dist = Math.max(len + s.r + 12, ringClear);
          const lx = VIEWBOX / 2 + (dx / len) * dist;
          const ly = VIEWBOX / 2 + (dy / len) * dist;
          return (
            <text
              key={`lbl-${s.id}`}
              x={lx} y={ly}
              textAnchor={dx > 8 ? 'start' : dx < -8 ? 'end' : 'middle'}
              dominantBaseline="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize={11}
              fill="#C9C3EF"
            >
              {s.bayer}
            </text>
          );
        })}

      {/* The numerals sit directly on the mark - never a background oval or a
          glow. The glyph-only cut drops them for favicon sizes, where they
          are unreadable. */}
      {!glyphOnly && (
        <text
          x={LABEL.x} y={LABEL.y}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontWeight={700}
          fontSize={LABEL.fontSize}
          fill={c.text}
        >
          4Ø4
        </text>
      )}
    </svg>
  );
}

export default Mark;
