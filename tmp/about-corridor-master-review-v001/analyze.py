from pathlib import Path
import json, re, hashlib, math
import numpy as np
from PIL import Image

root = Path(__file__).parent
plate = np.asarray(Image.open(root/'package/candidate/floor-03-about-corridor-desktop-clean-preview.webp').convert('RGB'), dtype=float)/255
linear = np.where(plate <= .04045, plate/12.92, ((plate+.055)/1.055)**2.4)
luminance = linear @ np.array([.2126,.7152,.0722])
records = json.loads((root/'screenshots/master-metrics.json').read_text())
checks=[]
for record in records:
    if not record['mode'].startswith('review-fit'): continue
    scene=record['scene']; results=[]
    for text in record['texts']:
        # Only direct wall copy: panel backgrounds require their own compositing calculation.
        if not ('frontend developer focused' in text['text'] or text['text'].strip().startswith(('My path into software','That perspective now'))): continue
        rect=text['rect'];x0=max(0,math.floor((rect['left']-scene['left'])/scene['width']*1920));x1=min(1920,math.ceil((rect['right']-scene['left'])/scene['width']*1920))
        y0=max(0,math.floor((rect['top']-scene['top'])/scene['height']*1080));y1=min(1080,math.ceil((rect['bottom']-scene['top'])/scene['height']*1080))
        if x1<=x0 or y1<=y0: continue
        rgb=np.array([float(x) for x in re.findall(r'[\d.]+',text['color'])[:3]])/255
        fg=float(np.where(rgb<=.04045,rgb/12.92,((rgb+.055)/1.055)**2.4) @ np.array([.2126,.7152,.0722]))
        bg=luminance[y0:y1,x0:x1]
        ratios=(np.maximum(fg,bg)+.05)/(np.minimum(fg,bg)+.05)
        results.append(dict(text=text['text'][:50],foreground=text['color'],nativeBox=[x0,y0,x1,y1],
                            minimum=float(ratios.min()),percentile1=float(np.percentile(ratios,1)),
                            percentBelow4point5=float((ratios<4.5).mean()*100)))
    checks.append(dict(viewport=record['viewport'],mode=record['mode'],tab=record['tab'],wallText=results))
(root/'contrast-checks.json').write_text(json.dumps(checks,indent=2))
print('Conservative source-pixel wall contrast (ignores text shadows; box pixels are not glyph pixels):')
for item in checks:
    print(item['viewport'],item['mode'],item['tab'],[(round(t['minimum'],2),round(t['percentile1'],2),round(t['percentBelow4point5'],2)) for t in item['wallText']])
geometry=json.loads((root/'package/geometry.json').read_text())
diffs=[]
for normalized,pixel in zip(geometry['portrait_aperture']['normalized'],geometry['portrait_aperture']['export_pixels']):
    diffs.append([pixel[0]-normalized[0]*1920,pixel[1]-normalized[1]*1080])
print('Normalized vs export corner differences in pixels:',diffs)
baseline=json.loads((root/'tracked-baseline.json').read_text());workspace=Path.cwd()
changed=[name for name,digest in baseline.items() if not (workspace/name).exists() or hashlib.sha256((workspace/name).read_bytes()).hexdigest()!=digest]
print('Changed pre-existing tracked files:',changed)
(root/'preservation-check.json').write_text(json.dumps(dict(trackedCount=len(baseline),changed=changed),indent=2))
