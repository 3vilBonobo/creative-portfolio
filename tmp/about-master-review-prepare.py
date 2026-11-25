from pathlib import Path, PurePosixPath
import zipfile, hashlib, json, subprocess
from PIL import Image

root = Path.cwd()
review = root / 'tmp/about-corridor-master-review-v001'
review.mkdir(parents=True, exist_ok=False)
tracked = subprocess.check_output(['git', 'ls-files', '-z']).decode().split('\0')
baseline = {name: hashlib.sha256((root / name).read_bytes()).hexdigest()
            for name in tracked if name and (root / name).is_file()}
(review / 'tracked-baseline.json').write_text(json.dumps(baseline, indent=2))
with zipfile.ZipFile(r'C:\Users\Irinella\Downloads\floor-03-about-corridor-desktop-master-approval-v001.zip') as archive:
    for item in archive.infolist():
        path = PurePosixPath(item.filename)
        assert not path.is_absolute() and '..' not in path.parts
        if item.is_dir(): continue
        target = review / 'package' / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(archive.read(item))
(review / 'screenshots').mkdir()
results = []
for p in (review / 'package').rglob('*'):
    if p.suffix.lower() not in ['.webp', '.jpg', '.png']: continue
    im = Image.open(p)
    results.append(dict(path=str(p.relative_to(review)), dimensions=im.size, format=im.format,
                        mode=im.mode, bytes=p.stat().st_size, sha256=hashlib.sha256(p.read_bytes()).hexdigest()))
portrait = review / 'package/references/actual-site-portrait.webp'
candidate = review / 'package/candidate/floor-03-about-corridor-desktop-clean-preview.webp'
checks = dict(portraitMatchesRuntime=portrait.read_bytes() == (root/'public/about/irene-portrait.webp').read_bytes(),
              downloadMatchesCandidate=Path(r'C:\Users\Irinella\Downloads\download.webp').read_bytes() == candidate.read_bytes(),
              images=results)
(review / 'package-checks.json').write_text(json.dumps(checks, indent=2))
print(json.dumps(checks, indent=2))
