"""Fit the JetBrains lowercase to the Share Tech capitals (decided 2026-11-26, cell b1 of
previews/LC-round1.png): x-height 527 -> 490 (70% of the 700 cap height), full width,
then embolden so the stems stay at the capitals' 87 units.

Apply ONCE to freshly imported donor lowercase (build_font.py does this). It is not idempotent:
running it on an already-fitted font shrinks the lowercase again.
Needs: pip install skia-pathops
"""
import pathops
from fontTools.pens.transformPen import TransformPen
from zero_glyphs import to_glyph

DONOR_XH, XH, WIDTH = 527, 490, 1.00
CAP_STEM, DONOR_STEM = 87, 81

def fit(font):
    gs = font.getGlyphSet(); glyf = font['glyf']; cm = font.getBestCmap()
    sy = XH/DONOR_XH; sx = WIDTH
    grow = (CAP_STEM - DONOR_STEM*min(sx, sy))/2
    new = {}
    for cp in range(0x61, 0x7B):
        n = cm[cp]; p = pathops.Path()
        gs[n].draw(TransformPen(p.getPen(), (sx,0,0,sy,270*(1-sx),0)))
        p.simplify()
        if grow > 0.5:
            st = pathops.Path(); p.draw(st.getPen())
            st.stroke(grow*2, pathops.LineCap.BUTT_CAP, pathops.LineJoin.MITER_JOIN, 4)
            p = pathops.op(p, st, pathops.PathOp.UNION)
        new[n] = to_glyph(p)
    for n, g in new.items():
        g.recalcBounds(glyf); glyf.glyphs[n] = g; font['hmtx'].metrics[n] = (540, g.xMin)
    font['OS/2'].sxHeight = XH
