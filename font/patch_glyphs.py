#!/usr/bin/env python3
"""Swap the house-drawn glyphs into an already-built Error404 Mono TTF:
0 and Ø (zero_glyphs.py), O Q D C G (round_glyphs.py), and the constellation icon U+E404 (icon_glyph.py).
Use when the donor fonts are not at hand. build_font.py does the same on a full build.
Usage: python3 patch_glyphs.py IN.ttf OUT.ttf"""
import sys
from fontTools.ttLib import TTFont
import zero_glyphs as Z, round_glyphs as R, icon_glyph as I
f = TTFont(sys.argv[1]); glyf = f['glyf']; cm = f.getBestCmap()
def put(name, cp, g):
    g.recalcBounds(glyf)
    if name not in glyf.glyphs: f.setGlyphOrder(f.getGlyphOrder()+[name])
    glyf.glyphs[name] = g; f['hmtx'].metrics[name] = (540, g.xMin)
    for t in f['cmap'].tables:
        if t.isUnicode(): t.cmap[cp] = name
put(cm[0x30], 0x30, Z.digit_zero()); put(cm[0xD8], 0xD8, Z.oslash()); put(cm[0x4F], 0x4F, R.cap_o())
for ch, fn in (('Q', R.cap_q), ('D', R.cap_d), ('C', R.cap_c), ('G', R.cap_g)): put(cm[ord(ch)], ord(ch), fn())
put(I.GLYPH_NAME, I.CODEPOINT, I.icon())
f['maxp'].numGlyphs = len(f.getGlyphOrder())
f.save(sys.argv[2])
