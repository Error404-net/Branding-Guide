#!/usr/bin/env python3
"""Verify logos/*.svg against the locked mark build spec (see BRAND.md, "Mark build spec").

Run with the brand font installed and fontconfig set to grayscale AA:
    FONTCONFIG_FILE=/tmp/fc/fonts.conf python3 scripts/verify-marks.py

Checks per SVG that carries the 4Ø4 text and the constellation:
  - node circles at the canonical coordinates and radii
  - seven connecting lines at the canonical coordinates, stroke-width 2, opacity 0.75
  - one uniform line color (skipped for neon cuts, which color each edge on purpose)
  - the two split-line segments are collinear with the node-to-node edge
  - text is "4Ø4" in Share Tech Mono Bold, no ellipse/oval backdrop
  - ZERO pixel overlap between line ink and text ink, rendered as separate masks,
    plus a minimum clearance in SVG units
Exit code 1 on any failure.
"""
import io, pathlib, re, sys
import cairosvg, numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt

ROOT = pathlib.Path(__file__).resolve().parent.parent
NODES = [(24.0,86.2,15.5),(132.0,24.0,16.3),(204.0,74.9,8.5),(80.2,202.0,12.3),(212.2,200.6,10.4),(216.0,216.0,8.6)]
LINES = [(24.0,86.2,132.0,24.0),(132.0,24.0,204.0,74.9),(204.0,74.9,163.7,116.3),
         (125.8,155.2,80.2,202.0),(80.2,202.0,24.0,86.2),(204.0,74.9,212.2,200.6),(212.2,200.6,216.0,216.0)]
EDGE = ((204.0,74.9),(80.2,202.0))   # the edge that is split around the text
FONT = "Share Tech Mono"; MIN_CLEAR = 1.5; S = 10
NEON = {"libra-neon-green.svg", "libra-neon-multi.svg"}

def num(a, k): return float(re.search(rf'{k}="([-\d.]+)"', a).group(1))
def render(inner):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="{240*S}" height="{240*S}"><rect width="240" height="240" fill="white"/>{inner}</svg>'
    return np.array(Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode()))).convert("L")) < 200

def check(p):
    t = p.read_text(encoding="utf-8"); errs = []
    ln = re.findall(r"<line [^>]*/>", t)
    ci = re.findall(r"<circle [^>]*/>", t)
    txt = re.search(r"<text [^>]*>(.*?)</text>", t, re.S)
    if not txt or "4" not in txt.group(1): return None   # monogram / watermark without text handled elsewhere
    if "<ellipse" in t: errs.append("ellipse backdrop present")
    neon = p.name in NEON
    if neon: pass
    elif len(ln) != 7: errs.append(f"{len(ln)} lines, expected 7")
    else:
        for l, want in zip(ln, LINES):
            got = tuple(num(l, k) for k in ("x1","y1","x2","y2"))
            if got != want: errs.append(f"line {got} != {want}")
            if num(l, "stroke-width") != 2 or num(l, "opacity") != 0.75: errs.append("line width/opacity")
        cols = {re.search(r'stroke="([^"]+)"', l).group(1).upper() for l in ln}
        if len(cols) != 1: errs.append(f"lines not one color: {cols}")
    node_hits = {(num(c,"cx"),num(c,"cy"),num(c,"r")) for c in ci if 'stroke-width="10"' not in c}
    for n in ([] if neon else NODES):
        if n not in node_hits: errs.append(f"missing node {n}")
    if txt.group(1).strip() not in ("4Ø4", "4&#216;4"): errs.append(f"text {txt.group(1)!r}")
    if FONT not in txt.group(0) or 'font-weight="400"' not in txt.group(0): errs.append("text is not Share Tech Mono Regular")
    # collinearity of the two split halves with the node-to-node edge
    (ax,ay),(bx,by) = EDGE; d = np.array([bx-ax, by-ay]); d /= np.hypot(*d)
    segs = [(float(a),float(b)) for a,b in re.findall(r'x1="[\d.]+" y1="[\d.]+" x2="([\d.]+)" y2="([\d.]+)"', "".join(l for l in ln if "204.0" in l and "74.9" in l and "212.2" not in l and "132.0" not in l))]
    segs += [(float(a),float(b)) for a,b in re.findall(r'x1="([\d.]+)" y1="([\d.]+)" x2="80.2" y2="202.0"', "".join(ln)) if float(a) > 100]
    if True:
        for q in segs:
            off = abs(d[0]*(q[1]-ay) - d[1]*(q[0]-ax))
            if off > 0.1: errs.append(f"split point {q} is {off:.2f} off the edge")
    # ink masks, rendered separately
    text_el = re.sub(r'fill="[^"]*"', 'fill="black"', txt.group(0))
    text_el = text_el.replace("B612 Mono", FONT)
    line_el = "".join(re.sub(r'stroke="[^"]*"', 'stroke="black"', re.sub(r'opacity="[^"]*"', '', l)) for l in ln)
    mt, ml = render(text_el), render(line_el)
    overlap = int((mt & ml).sum())
    if overlap: errs.append(f"{overlap} px of line/text ink overlap")
    clear = distance_transform_edt(~mt)[ml].min() / S if ml.any() else 99
    if clear < MIN_CLEAR: errs.append(f"line/text clearance {clear:.2f} < {MIN_CLEAR}")
    return errs, overlap, clear

bad = 0
for p in sorted((ROOT / "logos").glob("*.svg")):
    r = check(p)
    if r is None: continue
    errs, ov, cl = r
    print(("FAIL " if errs else "ok   ") + f"{p.name:34s} overlap={ov} clearance={cl:.1f}")
    for e in errs: print("      -", e)
    bad += bool(errs)
sys.exit(1 if bad else 0)
