#!/usr/bin/env python3
"""Error404 Mono Bold, derived from Regular (decided 2026-11-26, cell b2 of previews/bold-round1.png).

Every outline grows 25 units per side (stems 87 -> 137), then is condensed back to its original
ink width so letters keep their footprint and the counters tighten (keeps the 540 cell clean).
Usage: python3 make_bold.py Error404Mono-Regular.ttf Error404Mono-Bold.ttf
Needs: pip install skia-pathops
"""
import sys, pathops
from fontTools.ttLib import TTFont
from fontTools.pens.transformPen import TransformPen
from zero_glyphs import to_glyph

GROW = 25   # units added per side

def bolden(src, out, grow=GROW):
    f = TTFont(src); gs = f.getGlyphSet(); glyf = f['glyf']; new = {}
    for n in f.getGlyphOrder():
        if n == '.notdef' or glyf[n].numberOfContours == 0: continue
        p = pathops.Path(); gs[n].draw(p.getPen()); p.simplify()
        x0, y0, x1, y1 = p.bounds
        st = pathops.Path(); p.draw(st.getPen())
        st.stroke(grow*2, pathops.LineCap.BUTT_CAP, pathops.LineJoin.MITER_JOIN, 4)
        q = pathops.op(p, st, pathops.PathOp.UNION)
        if x1-x0 > 40:      # keep the ink width (skip dots and thin marks)
            k = (x1-x0)/(x1-x0+2*grow); cx = (x0+x1)/2
            r = pathops.Path(); q.draw(TransformPen(r.getPen(), (k,0,0,1,cx*(1-k),0))); q = r
        new[n] = to_glyph(q)
    for n, g in new.items():
        g.recalcBounds(glyf); glyf.glyphs[n] = g; f['hmtx'].metrics[n] = (540, g.xMin)
    # family linking: Regular + Bold of "Error404 Mono"
    o = f['OS/2']; o.usWeightClass = 700; o.fsSelection = (o.fsSelection & ~0x0040) | 0x0020
    f['head'].macStyle = 1
    nm = f['name']; ver = nm.getDebugName(5) or 'Version 0.1'
    for pid, eid, lid in [(3,1,0x409),(1,0,0)]:
        nm.setName('Bold', 2, pid, eid, lid)
        nm.setName('Error404 Mono Bold', 4, pid, eid, lid)
        nm.setName('Error404Mono-Bold', 6, pid, eid, lid)
        nm.setName(f"Error404 Mono Bold {ver.replace('Version ','')}", 3, pid, eid, lid)
    f.save(out)

if __name__ == '__main__':
    bolden(sys.argv[1], sys.argv[2])
