from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np

root = Path(__file__).parent
sheet = Image.new('RGB', (1200, 840), '#202322')
draw = ImageDraw.Draw(sheet)
for row, (profile, crop) in enumerate([
    ('desktop', (1460, 90, 1660, 230)),
    ('mobile', (640, 185, 840, 325)),
]):
    base = Image.open(root/'production'/f'floor-03-about-wall-base-{profile}.webp').convert('RGBA')
    emission = Image.open(root/'production'/f'floor-03-about-light-01-emission-{profile}.png')
    spill = Image.open(root/'production'/f'floor-03-about-light-01-spill-{profile}.png')
    on = Image.alpha_composite(Image.alpha_composite(base, emission), spill)
    for col, (label, im) in enumerate([('base: lamp off', base), ('normal alpha: lamp on', on)]):
        sheet.paste(im.crop(crop).convert('RGB').resize((600, 390)), (col*600, row*420+30))
        draw.text((col*600+10,row*420+10), profile+' / '+label, fill='white')
    alpha = np.array(emission)[:,:,3]
    masked = np.where(alpha>0)
    ys, xs = np.where(alpha == alpha.max())
    print(profile, 'maximum-alpha center', [float(xs.mean()),float(ys.mean())])
    print(profile, 'spill top-edge maximum alpha', max(spill.getchannel('A').crop((0,0,spill.width,1)).getdata()))
sheet.save(root/'lamp-registration-diagnostic.jpg', quality=95)
