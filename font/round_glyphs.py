"""Error404 Mono round capitals (decided with Jesse, 2026-11-26).

O (U+004F): true oval, 535 wide (fills the 540 cell), overshoot 14 above the cap line and below
the baseline, stroke 87 on the sides / 76 top and bottom (same contrast as the 0 bowl).
Picked as cell b3 of previews/O-round2.png, after "more circular" ruled out previews/O-round1.png.
Needs: pip install skia-pathops
"""
import pathops
from zero_glyphs import to_glyph

O_WIDTH, O_OVERSHOOT, STROKE_X, STROKE_Y = 535, 14, 87, 76

def _ellipse(cx, cy, rx, ry):
    p = pathops.Path(); pen = p.getPen(); kx, ky = 0.5523*rx, 0.5523*ry
    pen.moveTo((cx+rx,cy)); pen.curveTo((cx+rx,cy+ky),(cx+kx,cy+ry),(cx,cy+ry)); pen.curveTo((cx-kx,cy+ry),(cx-rx,cy+ky),(cx-rx,cy))
    pen.curveTo((cx-rx,cy-ky),(cx-kx,cy-ry),(cx,cy-ry)); pen.curveTo((cx+kx,cy-ry),(cx+rx,cy-ky),(cx+rx,cy)); pen.closePath()
    return p

def o_path(width=O_WIDTH, over=O_OVERSHOOT, sx=STROKE_X, sy=STROKE_Y):
    rx, ry = width/2, 350+over
    return pathops.op(_ellipse(270,350,rx,ry), _ellipse(270,350,rx-sx,ry-sy), pathops.PathOp.DIFFERENCE)

def cap_o(): return to_glyph(o_path())
