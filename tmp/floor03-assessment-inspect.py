import hashlib
import json
import pathlib
import zipfile

import numpy as np
from PIL import Image

root = pathlib.Path('tmp/floor03-assessment-20261125')
root.mkdir(parents=True, exist_ok=False)
archive = zipfile.ZipFile(r'C:\Users\Irinella\Downloads\floor-03-about-review-candidate-v002.zip')
for name in archive.namelist():
    relative = pathlib.PurePosixPath(name)
    assert not relative.is_absolute() and '..' not in relative.parts
    if name.endswith('/'):
        continue
    target = root / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(archive.read(name))
manifest = json.loads(archive.read('manifest.json'))
records = []
budgets = [350, 250, 32, 96, 24, 80]
for item, budget in zip(manifest['assets'], budgets):
    path = root / 'production' / item['filename']
    im = Image.open(path)
    a = np.array(im)
    rec = dict(file=path.name, format=im.format, size=im.size, mode=im.mode,
               bytes=path.stat().st_size, budgetKiB=budget,
               budgetPass=path.stat().st_size <= budget * 1024,
               shaMatches=hashlib.sha256(path.read_bytes()).hexdigest() == item['sha256'])
    if im.mode == 'RGBA':
        alpha = a[:, :, 3]
        weights = alpha.astype(float)
        ys, xs = np.indices(alpha.shape)
        rec.update(alphaMin=int(alpha.min()), alphaMax=int(alpha.max()),
                   nonzero=int((alpha > 0).sum()), opaque=int((alpha == 255).sum()),
                   bbox=im.getchannel('A').getbbox(),
                   centroid=[float((xs * weights).sum() / weights.sum()),
                             float((ys * weights).sum() / weights.sum())])
    records.append(rec)
print(json.dumps(records, indent=2))
(root / 'asset-checks.json').write_text(json.dumps(records, indent=2))
original = pathlib.Path(r'C:\Users\Irinella\Downloads\floor-03-about-reference-v002(1).zip')
local = pathlib.Path('art-production/reference-packages/floor-03-about-reference-v002.zip')
print('REFERENCE ZIP MATCH', hashlib.sha256(original.read_bytes()).digest() == hashlib.sha256(local.read_bytes()).digest())
for profile in ['desktop', 'mobile']:
    base = Image.open(root / 'production' / f'floor-03-about-wall-base-{profile}.webp').convert('RGBA')
    for kind in ['emission', 'spill']:
        layer = Image.open(root / 'production' / f'floor-03-about-light-01-{kind}-{profile}.png')
        base = Image.alpha_composite(base, layer)
    base.convert('RGB').save(root / f'{profile}-normal-alpha-on.jpg', quality=95)
