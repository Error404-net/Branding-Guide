"""Error404 Mono slashed zero and Ø (decided with Jesse, 2026-11-26).

Spec:
  angle     45.75° — the constellation edge yellow (204.0,74.9) -> mint (80.2,202.0)
  bowl      wide squared oval, x 52..488 of the 540 cell (Share Tech construction, +80 wider)
  slash     thin, 60 units, square tips, solid crossing (no stencil gap)
  digit 0   tip pokes 40 units past the rim, so the ink stays inside the cell (x 9..531)
  Ø U+00D8  tip pokes 110 units past the rim (long tip, logo and display), overshoots the cell
Needs: pip install skia-pathops
"""
import math, pathops
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.cu2quPen import Cu2QuPen

EDGE = math.degrees(math.atan2(202.0-74.9, 204.0-80.2))   # 45.7535°
BOWL_X0, BOWL_X1, BOWL_STROKE = 52, 488, 85
SLASH = 60
DIGIT_OVER, OSLASH_OVER = 40, 110

def _bowl(x0, x1, inset):
    w = x1-x0; cx = (x0+x1)/2
    o = pathops.Path(); p = o.getPen()
    r = 170*(w/356)
    p.moveTo((cx+10,0)); p.lineTo((cx-10,0)); p.qCurveTo((x0+91*w/356,0),(x0,87),(x0,r)); p.lineTo((x0,700-r))
    p.qCurveTo((x0,614),(x0+90*w/356,700),(cx-10,700)); p.lineTo((cx+10,700)); p.qCurveTo((x1-90*w/356,700),(x1,614),(x1,700-r))
    p.lineTo((x1,r)); p.qCurveTo((x1,87),(x1-91*w/356,0),(cx+10,0)); p.closePath()
    ix0, ix1 = x0+inset, x1-inset; iw = ix1-ix0
    c = pathops.Path(); q = c.getPen()
    q.moveTo((cx+10,625)); q.lineTo((cx-10,625)); q.qCurveTo((ix0+36*iw/186,625),(ix0,580),(ix0,549)); q.lineTo((ix0,151))
    q.qCurveTo((ix0,120),(ix0+36*iw/186,75),(cx-10,75)); q.lineTo((cx+10,75)); q.qCurveTo((ix1-36*iw/186,75),(ix1,120),(ix1,151))
    q.lineTo((ix1,549)); q.qCurveTo((ix1,580),(ix1-36*iw/186,625),(cx+10,625)); q.closePath()
    return o, c

def _bar(cx, cy, ang, L, t):
    ux, uy = math.cos(math.radians(ang)), math.sin(math.radians(ang)); px, py = -uy, ux; h = t/2
    P = [(cx-L*ux+h*px,cy-L*uy+h*py),(cx+L*ux+h*px,cy+L*uy+h*py),(cx+L*ux-h*px,cy+L*uy-h*py),(cx-L*ux-h*px,cy-L*uy-h*py)]
    b = pathops.Path(); pen = b.getPen(); pen.moveTo(P[0]); [pen.lineTo(q) for q in P[1:]]; pen.closePath(); return b

def zero_path(over, ang=EDGE, t=SLASH, x0=BOWL_X0, x1=BOWL_X1, inset=BOWL_STROKE):
    outer, counter = _bowl(x0, x1, inset)
    ring = pathops.op(outer, counter, pathops.PathOp.DIFFERENCE)
    cx, cy = (x0+x1)/2, 350
    hit = pathops.op(_bar(cx,cy,ang,2000,1), outer, pathops.PathOp.INTERSECTION)
    a, b, c, d = hit.bounds
    rim = math.hypot(c-a, d-b)/2
    return pathops.op(ring, _bar(cx, cy, ang, rim+over, t), pathops.PathOp.UNION)

def to_glyph(path):
    rp = RecordingPen(); path.draw(rp); pen = TTGlyphPen(None)
    rp.replay(Cu2QuPen(pen, 1.0, reverse_direction=False)); return pen.glyph()

def digit_zero(): return to_glyph(zero_path(DIGIT_OVER))
def oslash():     return to_glyph(zero_path(OSLASH_OVER))
