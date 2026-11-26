import math, io, cairosvg, cv2, numpy as np, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from PIL import Image
FONT=sys.argv[1] if len(sys.argv)>1 else '/tmp/fp/font/E404-z300.ttf'
F=TTFont(FONT); GS=F.getGlyphSet(); CM=F.getBestCmap(); S=0.044; ADV=540; BASE=151; CX=145.0
def gp(cp,ox):  # glyph path; ox = x of glyph origin
    sp=SVGPathPen(GS); GS[CM[cp]].draw(TransformPen(sp,(S,0,0,-S,ox,BASE))); return sp.getCommands()
def origins(t):
    c=CX-270*S; return c-ADV*S-t, c, c+ADV*S+t
NODES=[(24.0,86.2,15.5,"#4DE1FF"),(132.0,24.0,16.3,"#FF5FA2"),(204.0,74.9,8.5,"#FFE156"),(80.2,202.0,12.3,"#37F0A6"),(212.2,200.6,10.4,"#4DE1FF"),(216.0,216.0,8.6,"#FF5FA2")]
SEGS=[((24.0,86.2),(132.0,24.0)),((132.0,24.0),(204.0,74.9)),((204.0,74.9),(163.7,116.3)),((125.8,155.2),(80.2,202.0)),((80.2,202.0),(24.0,86.2)),((204.0,74.9),(212.2,200.6)),((212.2,200.6),(216.0,216.0))]
def svg(t,only=None,bg=True,fill='#F4F1FF',vb="0 0 240 240",px=240):
    a,b,c=origins(t); parts=[]
    L=''.join(f'<line x1="{p[0]}" y1="{p[1]}" x2="{q[0]}" y2="{q[1]}" stroke="#37F0A6" stroke-width="2" opacity="0.75"/>' for p,q in SEGS)
    N=''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{col}"/>' for x,y,r,col in NODES)
    T={'l':f'<path d="{gp(0x34,a)}" fill="{fill}"/>','o':f'<path d="{gp(0xD8,b)}" fill="{fill}"/>','r':f'<path d="{gp(0x34,c)}" fill="{fill}"/>'}
    if only=='lines': body=L.replace('opacity="0.75"','opacity="1"')
    elif only in T: body=T[only]
    else: body=L+N+''.join(T.values())
    back='<rect width="240" height="240" fill="#231451"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{px}" height="{px if vb.startswith("0 0 240") else int(px*56/90)}">{back}{body}</svg>'
def mask(t,only):
    s=svg(t,only,bg=False,fill='#000',px=1920)
    im=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=s.encode()))).convert('RGBA')
    return np.array(im)[:,:,3]>10
def clearances(t):
    m={k:mask(t,k) for k in ['l','o','r','lines']}
    def dist(a,b):
        dt=cv2.distanceTransform((~b).astype(np.uint8),cv2.DIST_L2,5); return dt[a].min()/8.0 if a.any() else 99
    ov=int((m['lines']&(m['l']|m['o']|m['r'])).sum())
    return {'o-l':dist(m['o'],m['l']),'o-r':dist(m['o'],m['r']),'lines-text':min(dist(m['lines'],m['l']),dist(m['lines'],m['o']),dist(m['lines'],m['r'])),'overlap_px':ov,'ink_o_l':int((m['o']&m['l']).sum()),'ink_o_r':int((m['o']&m['r']).sum())}
if __name__=='__main__':
    for t in [0,2,4,6,8]:
        c=clearances(t); print(t,{k:(round(v,2) if isinstance(v,float) else v) for k,v in c.items()})
