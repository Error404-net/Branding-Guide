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

# --- Q D C G, built on the O (decided 2026-11-26, cell a1 of previews/QDCG-round1.png) ---
# C and G: radial cuts toward the centre, narrow mouth (±30°). G adds a mid-height bar and a right spur.
# Q: tail crosses the bowl at -45.75° (the brand angle, mirrored to run down-right). D: straight stem + oval bowl.
import math
from zero_glyphs import _bar

MOUTH = 30          # half-angle of the C/G opening, degrees
_U, _D, _I = pathops.PathOp.UNION, pathops.PathOp.DIFFERENCE, pathops.PathOp.INTERSECTION
_CX, _CY, _RX, _RY = 270, 350, O_WIDTH/2, 350+O_OVERSHOOT

def _poly(pts):
    p = pathops.Path(); pen = p.getPen(); pen.moveTo(pts[0]); [pen.lineTo(q) for q in pts[1:]]; pen.closePath(); return p
def _rect(x0, y0, x1, y1): return _poly([(x0,y0),(x1,y0),(x1,y1),(x0,y1)])

def _c(theta=MOUTH):
    t = math.radians(theta); L = 900
    wedge = _poly([(_CX,_CY),(_CX+L*math.cos(t),_CY+L*math.sin(t)),(_CX+L,_CY+L*math.sin(t)),(_CX+L,_CY-L*math.sin(t)),(_CX+L*math.cos(t),_CY-L*math.sin(t))])
    return pathops.op(o_path(), wedge, _D)

def cap_c(): return to_glyph(_c())

def cap_g():
    xr = _CX+_RX
    bar = _rect(_CX+20, _CY-STROKE_Y/2-10, xr, _CY+STROKE_Y/2-10)
    spur = pathops.op(_rect(xr-STROKE_X, 0, xr, _CY+STROKE_Y/2-10), _ellipse(_CX,_CY,_RX,_RY), _I)
    return to_glyph(pathops.op(pathops.op(_c(), bar, _U), spur, _U))

def cap_q():
    tail = _bar(_CX+_RX*0.62, _CY-_RY*0.62, -45.75, 140, STROKE_Y)
    return to_glyph(pathops.op(o_path(), tail, _U))

def cap_d(stem_x=55, cx=280):
    outer = pathops.op(_rect(stem_x,0,cx,700), _ellipse(cx,350,O_WIDTH-cx,350), _U)
    outer = pathops.op(outer, _rect(stem_x,0,600,700), _I)
    inner = pathops.op(_rect(stem_x+STROKE_X,STROKE_Y,cx,700-STROKE_Y), _ellipse(cx,350,O_WIDTH-cx-STROKE_X,350-STROKE_Y), _U)
    inner = pathops.op(inner, _rect(stem_x+STROKE_X,STROKE_Y,600,700-STROKE_Y), _I)
    return to_glyph(pathops.op(outer, inner, _D))
