#!/usr/bin/env python3
"""Error404 Mono (Regular) — hybrid: Share Tech Mono caps/digits/punct + JetBrains Mono lowercase/symbols/arrows.
Zero (U+0030) and Ø (U+00D8) come from zero_glyphs.py: slash on the constellation edge angle."""
import math, sys
from fontTools.ttLib import TTFont, newTable
from fontTools import subset
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib.tables import ttProgram

SHARE='/tmp/fonts/ShareTechMono-Regular.ttf'; JB='/tmp/fonts/JetBrainsMono-Regular.ttf'
ADV=540
# constellation edge: (204.0,74.9) -> (80.2,202.0)
EDGE=math.degrees(math.atan2(202.0-74.9,204.0-80.2))
SX=ADV/600; SY=700/730            # JetBrains -> 540 advance, 700 cap height
DONOR_SYMS=set(map(ord,'{}[]()<>/\\|~_-=+*&%$#@^`;'))   # symbols taken from JetBrains
ARROWS=[0x2190,0x2191,0x2192,0x2193,0x2194,0x2195,0x21D0,0x21D2,0x21D4]

def build(out, ver='0.1'):
    ascii_=list(range(0x20,0x7F))+[0xA0,0xD8]
    f=TTFont(SHARE)
    opt=subset.Options(); opt.layout_features=[]; opt.hinting=False; opt.glyph_names=True; opt.notdef_outline=True
    opt.name_IDs=['*']; opt.legacy_kern=False; opt.drop_tables+=['DSIG','GDEF','GPOS','GSUB','kern','LTSH','hdmx','VDMX','meta']
    s=subset.Subsetter(opt); s.populate(unicodes=ascii_); s.subset(f)
    for t in ['fpgm','prep','cvt ','gasp']:
        if t in f: del f[t]
    jb=TTFont(JB); jgs=jb.getGlyphSet(); jcmap=jb.getBestCmap()
    glyf=f['glyf']; cmap_main=f.getBestCmap(); order=list(f.getGlyphOrder())
    def put(name,cp,glyph):
        glyph.recalcBounds(glyf)
        if name not in glyf.glyphs: order.append(name)
        glyf.glyphs[name]=glyph
        f['hmtx'].metrics[name]=(ADV,getattr(glyph,'xMin',0))
        for t in f['cmap'].tables:
            if t.isUnicode(): t.cmap[cp]=name
    def donor(cp):
        rp=DecomposingRecordingPen(jgs); jgs[jcmap[cp]].draw(rp)
        pen=TTGlyphPen(None); rp.replay(TransformPen(pen,(SX,0,0,SY,0,0))); return pen.glyph()
    # lowercase + symbols + arrows from JetBrains
    for cp in list(range(0x61,0x7B))+sorted(DONOR_SYMS)+ARROWS:
        name=cmap_main.get(cp) or f'uni{cp:04X}'
        put(name,cp,donor(cp))
    # strip instructions on the Share Tech glyphs that remain
    for n,g in glyf.glyphs.items():
        if not g.isComposite():
            g.program=ttProgram.Program(); g.program.fromBytecode(b'')
    # --- slashed zero and Ø: see zero_glyphs.py (45.75° edge angle, wide bowl, thin square-tip slash)
    import zero_glyphs as Z
    put(cmap_main[0x30],0x30,Z.digit_zero()); put(cmap_main[0xD8],0xD8,Z.oslash())
    # --- round O and the constellation icon (U+E404): see round_glyphs.py / icon_glyph.py
    import round_glyphs as R, icon_glyph as I
    put(cmap_main[0x4F],0x4F,R.cap_o())
    for ch,fn in (('Q',R.cap_q),('D',R.cap_d),('C',R.cap_c),('G',R.cap_g)): put(cmap_main[ord(ch)],ord(ch),fn())
    put(I.GLYPH_NAME,I.CODEPOINT,I.icon())
    # --- fit the donor lowercase to the caps (x-height 490, stems 87): lowercase_fit.py, once only
    f.setGlyphOrder(order)
    import lowercase_fit; lowercase_fit.fit(f)
    f.setGlyphOrder(order)
    # --- tables
    g=newTable('gasp'); g.version=1; g.gaspRange={65535:0x000F}; f['gasp']=g
    f['post'].formatType=3.0; f['post'].isFixedPitch=1; f['post'].extraNames=[]; f['post'].mapping={}
    hh=f['hhea']; hh.ascent=900; hh.descent=-260; hh.lineGap=0
    o=f['OS/2']; o.sTypoAscender=900; o.sTypoDescender=-260; o.sTypoLineGap=0; o.usWinAscent=1000; o.usWinDescent=320
    o.sCapHeight=700; o.sxHeight=490; o.xAvgCharWidth=ADV; o.panose.bProportion=9; o.fsType=0
    f['head'].fontRevision=float(ver); f['head'].macStyle=0
    nm=f['name']; nm.names=[]
    full='Error404 Mono'
    for pid,eid,lid in [(3,1,0x409),(1,0,0)]:
        for i,v in {0:'Copyright 2026 Error404. Derived from Share Tech Mono (Ralph du Carrois) and JetBrains Mono (The JetBrains Mono Project Authors), both under the SIL Open Font License 1.1.',
                    1:full,2:'Regular',3:f'Error404 Mono {ver}',4:f'{full} Regular',5:f'Version {ver}',6:'Error404Mono-Regular',
                    13:'This Font Software is licensed under the SIL Open Font License, Version 1.1. https://openfontlicense.org',14:'https://openfontlicense.org'}.items():
            nm.setName(v,i,pid,eid,lid)
    f.save(out)

if __name__=='__main__':
    build(sys.argv[1])
