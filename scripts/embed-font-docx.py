#!/usr/bin/env python3
"""Embed a TrueType font into .docx files (OOXML obfuscated font, .odttf).

    python3 scripts/embed-font-docx.py "Share Tech Mono" /path/ShareTechMono-Regular.ttf office-templates/*.docx

Word (Windows/macOS desktop) then renders the font on machines that lack it. Only valid for fonts whose
OS/2 fsType allows embedding; Share Tech Mono (OFL) is fsType 0. Word for the web ignores embedded fonts.
"""
import re, shutil, sys, uuid, zipfile
from fontTools.ttLib import TTFont

name, ttf, *files = sys.argv[1:]
if TTFont(ttf)['OS/2'].fsType not in (0, 8):   # 0 installable, 8 editable
    sys.exit('font does not permit embedding')
raw = open(ttf, 'rb').read()

def obfuscate(data, guid):
    key = bytes.fromhex(guid.strip('{}').replace('-', ''))[::-1]
    b = bytearray(data)
    for i in range(32): b[i] ^= key[i % 16]
    return bytes(b)

for f in files:
    guid = '{' + str(uuid.uuid4()).upper() + '}'
    zi = zipfile.ZipFile(f); out = zipfile.ZipFile('/tmp/_emb.zip', 'w', zipfile.ZIP_DEFLATED); seen = set()
    names = zi.namelist()
    for i in zi.infolist():
        d = zi.read(i.filename); fn = i.filename
        if fn in ('word/fonts/font1.odttf',): continue
        if fn == '[Content_Types].xml' and b'odttf' not in d:
            d = d.replace(b'<Default ', b'<Default Extension="odttf" ContentType="application/vnd.openxmlformats-officedocument.obfuscatedFont"/><Default ', 1)
        if fn == 'word/settings.xml' and b'embedTrueTypeFonts' not in d:
            s = d.decode('utf8')
            s = re.sub(r'(<w:displayBackgroundShape\s*/>)', r'\1<w:embedTrueTypeFonts/>', s, 1) if '<w:displayBackgroundShape' in s else re.sub(r'(<w:zoom [^>]*/>)', r'\1<w:embedTrueTypeFonts/>', s, 1)
            d = s.encode('utf8')
        if fn == 'word/fontTable.xml':
            s = d.decode('utf8'); s = re.sub(r'<w:font w:name="%s">.*?</w:font>' % re.escape(name), '', s, flags=re.S)
            ent = ('<w:font w:name="%s"><w:charset w:val="00"/><w:family w:val="modern"/><w:pitch w:val="fixed"/>'
                   '<w:embedRegular r:id="rIdEmb1" w:fontKey="%s"/></w:font>') % (name, guid)
            d = s.replace('</w:fonts>', ent + '</w:fonts>').encode('utf8')
        if fn == 'word/_rels/fontTable.xml.rels':
            s = d.decode('utf8'); s = re.sub(r'<Relationship [^>]*Id="rIdEmb1"[^>]*/>', '', s)
            d = s.replace('</Relationships>', '<Relationship Id="rIdEmb1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font1.odttf"/></Relationships>').encode('utf8')
        out.writestr(i, d); seen.add(fn)
    if 'word/_rels/fontTable.xml.rels' not in seen:
        out.writestr('word/_rels/fontTable.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdEmb1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font1.odttf"/></Relationships>')
    out.writestr('word/fonts/font1.odttf', obfuscate(raw, guid)); out.close()
    shutil.copy('/tmp/_emb.zip', f); print('embedded', name, 'into', f)
