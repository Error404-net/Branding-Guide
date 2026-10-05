#!/usr/bin/env python3
"""Inline the repo's fonts + the canonical mark into block-page.template.html -> index.html (fully self-contained,
because a DNS block page cannot depend on CDNs/Google Fonts that the client may not be able to reach)."""
import base64, pathlib, re
H = pathlib.Path(__file__).resolve().parent; R = H.parent
b64 = lambda p: base64.b64encode((R/'styleguide/src/fonts'/p).read_bytes()).decode()
svg = re.sub(r'<metadata>.*?</metadata>', '', (R/'logos/libra-no-ring-multicolor.svg').read_text(encoding='utf-8'), flags=re.S)
mark = '<svg class="mark" viewBox="0 0 240 240" role="img" aria-label="ERROR404.NET mark">' + re.search(r'<svg[^>]*>(.*)</svg>', svg, re.S).group(1) + '</svg>'
t = (H/'block-page.template.html').read_text(encoding='utf-8')
for k, v in {'@PS2P@': b64('press-start-2p-400.woff2'), '@JB400@': b64('jetbrains-mono-400.woff2'), '@JB700@': b64('jetbrains-mono-700.woff2'), '@MARK@': mark}.items():
    t = t.replace(k, v)
(H/'index.html').write_text(t, encoding='utf-8'); print('wrote index.html', len(t)//1024, 'KB')
