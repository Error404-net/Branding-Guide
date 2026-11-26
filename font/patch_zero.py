#!/usr/bin/env python3
"""Replace 0 and Ø in an already-built Error404 Mono TTF with the zero_glyphs.py design.
Use when the donor fonts are not at hand. build_font.py does the same thing on a full build.
Usage: python3 patch_zero.py IN.ttf OUT.ttf"""
import sys
from fontTools.ttLib import TTFont
import zero_glyphs as Z
f = TTFont(sys.argv[1]); glyf = f['glyf']; cm = f.getBestCmap()
for cp, g in ((0x30, Z.digit_zero()), (0xD8, Z.oslash())):
    g.recalcBounds(glyf); n = cm[cp]; glyf.glyphs[n] = g; f['hmtx'].metrics[n] = (540, g.xMin)
f.save(sys.argv[2])
