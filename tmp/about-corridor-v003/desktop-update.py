from pathlib import Path
from PIL import Image
import hashlib,json,shutil
src=Path('C:/Users/Irinella/AppData/Local/Temp/codex-clipboard-1d50d781-d230-40d9-81df-9c2ee27a218c.png')
im=Image.open(src)
im.crop((1020,230,1250,610)).resize((460,760)).save('tmp/about-corridor-v003/frame-diagnostic.png')
print(im.size)
dest=Path('public/environments/floor-03-about-corridor/v004');dest.mkdir(exist_ok=True)
# Preserve the newly supplied source; WebP is only a lossless runtime encoding.
shutil.copy2(src,dest/'desktop-source.png')
im.save(dest/'floor-03-about-corridor-base-desktop.webp',lossless=True,method=6)
quad=[[1065,269],[1222.5,296],[1221.5,557],[1065,574]]
profile={'filename':'floor-03-about-corridor-base-desktop.webp','export_size':list(im.size),'portrait_opening_px_clockwise_TL_TR_BR_BL':quad}
(dest/'geometry.json').write_text(json.dumps(profile,indent=2),encoding='utf-8')
points=' '.join(f'{x},{y}' for x,y in quad)
(dest/'floor-03-about-corridor-portrait-aperture-desktop.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="1672" height="941" viewBox="0 0 1672 941"><polygon points="{points}" fill="white"/></svg>',encoding='utf-8')
manifest={'source':'Owner-supplied desktop image, 25 November 2026; supersedes desktop only.','aperture':'Measured from this image with approximately 2px inner-frame inset; browser visual acceptance pending.','encoding':'Lossless WebP; unchanged source retained.','assets':[]}
for p in sorted(dest.iterdir()):
 if p.name=='manifest.json':continue
 data=p.read_bytes();manifest['assets'].append({'path':p.name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
(dest/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
assert Image.open(dest/'floor-03-about-corridor-base-desktop.webp').convert('RGB').tobytes()==im.convert('RGB').tobytes()
print('New desktop lossless encoding, geometry and mask prepared; source pixels verified identical.')
