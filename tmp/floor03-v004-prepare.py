import hashlib
import json
from pathlib import Path, PurePosixPath
import zipfile
from PIL import Image
import io

root = Path.cwd()
staging = root / 'art-production/staging/floor-03-about/v004'
staging.mkdir(parents=True, exist_ok=False)
# Capture existing source/assets before this integration, including the owner's work.
paths = [p for folder in ['src', 'public', 'docs'] for p in (root / folder).rglob('*') if p.is_file()]
baseline = {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}
(staging / 'repository-baseline.json').write_text(json.dumps(baseline, indent=2))
archive = zipfile.ZipFile(r'C:\Users\Irinella\Downloads\floor-03-about-production-v004.zip')
for entry in archive.infolist():
    name = PurePosixPath(entry.filename)
    assert not name.is_absolute() and '..' not in name.parts
    if entry.is_dir():
        continue
    target = staging / name
    target.parent.mkdir(parents=True, exist_ok=True)
    assert not target.exists()
    target.write_bytes(archive.read(entry))
manifest = json.loads(archive.read('manifest.json'))
results = []
for asset in manifest['assets']:
    data = archive.read(asset['path'])
    image = Image.open(io.BytesIO(data))
    assert hashlib.sha256(data).hexdigest() == asset['sha256']
    assert len(data) == asset['bytes']
    assert image.size == (asset['width'], asset['height'])
    assert image.format == asset['format']
    assert ('A' in image.getbands()) == asset['alpha']
    if 'max_bytes' in asset:
        assert len(data) <= asset['max_bytes']
    results.append(dict(file=asset['filename'], dimensions=image.size, mode=image.mode, bytes=len(data), alphaRange=image.getchannel('A').getextrema() if asset['alpha'] else None))
(staging / 'asset-validation.json').write_text(json.dumps(results, indent=2))
print(json.dumps(results, indent=2))
