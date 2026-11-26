"""Error404 constellation icon as a font glyph, U+E404 (Private Use Area; not used by Nerd Fonts).

Picked as cell a1 of previews/icon-round1.png: fits one 540-unit cell, true to the logo
(thin 30-unit lines, star sizes in the logo's own proportions). Same node and edge geometry as
logos/monogram-*.svg (the Icon: full yellow->mint edge, no split, no 4Ø4).
Type it in zsh / p10k as $'\\uE404'.
Needs: pip install skia-pathops
"""
import math, pathops
from zero_glyphs import to_glyph, _bar

CODEPOINT, GLYPH_NAME = 0xE404, 'uniE404'
NODES = [(24.0,86.2,15.5),(132.0,24.0,16.3),(204.0,74.9,8.5),(80.2,202.0,12.3),(212.2,200.6,10.4),(216.0,216.0,8.6)]
EDGES = [(0,1),(1,2),(2,3),(3,0),(2,4),(4,5)]
SIZE, LINE, CX, CY = 540, 30, 270, 310

def _circle(cx, cy, r):
    p = pathops.Path(); pen = p.getPen(); k = 0.5523*r
    pen.moveTo((cx+r,cy)); pen.curveTo((cx+r,cy+k),(cx+k,cy+r),(cx,cy+r)); pen.curveTo((cx-k,cy+r),(cx-r,cy+k),(cx-r,cy))
    pen.curveTo((cx-r,cy-k),(cx-k,cy-r),(cx,cy-r)); pen.curveTo((cx+k,cy-r),(cx+r,cy-k),(cx+r,cy)); pen.closePath()
    return p

def icon_path(size=SIZE, line=LINE, cx=CX, cy=CY):
    xs = [x-r for x,y,r in NODES]+[x+r for x,y,r in NODES]; ys = [y-r for x,y,r in NODES]+[y+r for x,y,r in NODES]
    bx0, bx1, by0, by1 = min(xs), max(xs), min(ys), max(ys); s = size/(bx1-bx0)
    T = lambda x, y: (cx+(x-(bx0+bx1)/2)*s, cy-(y-(by0+by1)/2)*s)   # SVG y-down -> font y-up
    acc = pathops.Path()
    for a, b in EDGES:
        (x1,y1), (x2,y2) = T(*NODES[a][:2]), T(*NODES[b][:2])
        acc = pathops.op(acc, _bar((x1+x2)/2,(y1+y2)/2, math.degrees(math.atan2(y2-y1,x2-x1)), math.hypot(x2-x1,y2-y1)/2, line), pathops.PathOp.UNION)
    for x, y, r in NODES:
        acc = pathops.op(acc, _circle(*T(x,y), r*s), pathops.PathOp.UNION)
    return acc

def icon(): return to_glyph(icon_path())
