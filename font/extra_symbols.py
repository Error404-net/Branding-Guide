"""Prompt symbols p10k and common shells use that are plain Unicode, not Nerd Font icons.

± (U+00B1) and … (U+2026): JetBrains Mono, scaled like the rest of the donor glyphs.
✔ (U+2714), ✘ (U+2718): JetBrains Mono ✓ / ✗ thickened (JetBrains has no heavy forms).
⇡ (U+21E1), ⇣ (U+21E3): our own ↑ / ↓ with two gaps cut in the shaft (dashed arrows, git ahead/behind).
Needs: pip install skia-pathops
"""
import pathops
from fontTools.ttLib import TTFont
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import DecomposingRecordingPen
from zero_glyphs import to_glyph

SX, SY = 540/600, 700/730      # same JetBrains -> house scaling as build_font.py
HEAVY = 22                      # units added per side for ✔ ✘

def _donor_path(jb, cp):
    gs = jb.getGlyphSet(); rp = DecomposingRecordingPen(gs); gs[jb.getBestCmap()[cp]].draw(rp)
    p = pathops.Path(); rp.replay(TransformPen(p.getPen(), (SX,0,0,SY,0,0))); p.simplify(); return p

def _thicken(p, grow):
    st = pathops.Path(); p.draw(st.getPen())
    st.stroke(grow*2, pathops.LineCap.BUTT_CAP, pathops.LineJoin.MITER_JOIN, 4)
    return pathops.op(p, st, pathops.PathOp.UNION)

def _rect(x0, y0, x1, y1):
    p = pathops.Path(); pen = p.getPen(); pen.moveTo((x0,y0)); pen.lineTo((x1,y0)); pen.lineTo((x1,y1)); pen.lineTo((x0,y1)); pen.closePath(); return p

def _dashed(font, cp, up):
    p = pathops.Path(); font.getGlyphSet()[font.getBestCmap()[cp]].draw(p.getPen()); p.simplify()
    x0, y0, x1, y1 = p.bounds; h = y1-y0; gap = 0.14*h
    # shaft is the 55% of the height away from the head
    marks = [0.18, 0.40] if up else [0.60, 0.82]
    for m in marks:
        y = y0 + m*h
        p = pathops.op(p, _rect(-100, y-gap/2, 700, y+gap/2), pathops.PathOp.DIFFERENCE)
    return p

def add(font, jb_path):
    jb = TTFont(jb_path)
    glyphs = {
        0x00B1: _donor_path(jb, 0x00B1),
        0x2026: _donor_path(jb, 0x2026),
        0x2714: _thicken(_donor_path(jb, 0x2713), HEAVY),
        0x2718: _thicken(_donor_path(jb, 0x2717), HEAVY),
        0x21E1: _dashed(font, 0x2191, True),
        0x21E3: _dashed(font, 0x2193, False),
    }
    glyf = font['glyf']; cm = font.getBestCmap()
    for cp, p in glyphs.items():
        name = cm.get(cp) or f'uni{cp:04X}'
        g = to_glyph(p); g.recalcBounds(glyf)
        if name not in glyf.glyphs: font.setGlyphOrder(font.getGlyphOrder()+[name])
        glyf.glyphs[name] = g; font['hmtx'].metrics[name] = (540, g.xMin)
        for t in font['cmap'].tables:
            if t.isUnicode(): t.cmap[cp] = name
    font['maxp'].numGlyphs = len(font.getGlyphOrder())
