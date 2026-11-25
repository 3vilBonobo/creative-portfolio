from pathlib import Path
import hashlib
import json
from PIL import Image, ImageDraw

root = Path.cwd()
staging = root / 'art-production/staging/floor-03-about/v004'
baseline = json.loads((staging / 'repository-baseline.json').read_text())
changed = [name for name, digest in baseline.items()
           if not (root / name).exists() or hashlib.sha256((root / name).read_bytes()).hexdigest() != digest]
assert set(changed) == {r'src\style.css', r'src\sections\AboutSection.vue', r'docs\about-artwork.md'}, changed
runtime = root / 'public/environments/floor-03-about'
manifest = json.loads((runtime / 'manifest.json').read_text())
for asset in manifest['assets']:
    assert hashlib.sha256((runtime / asset['path']).read_bytes()).hexdigest() == asset['sha256']

browser = staging / 'browser'
desktop = Image.open(browser / 'desktop-1440x900-right-on.jpg')
mobile = Image.open(browser / 'mobile-native-final.jpg')
sheet = Image.new('RGB', (1025, 930), '#151a19')
draw = ImageDraw.Draw(sheet)
draw.text((12, 12), 'Desktop 1440x900: right-side browser crop', fill='#f2e6d3')
draw.text((646, 12), 'Mobile 390x844: native application', fill='#f2e6d3')
sheet.paste(desktop, (10, 36))
sheet.paste(mobile, (640, 36))
draw.text((12, 916), 'Original captures retained alongside this comparison; browser capture surfaces can be smaller than CSS viewports.', fill='#aaa398')
sheet.save(browser / 'review-contact-sheet.jpg', quality=95)
screenshots = {p.name: list(Image.open(p).size) for p in browser.glob('*.jpg')}
summary = dict(changedExistingFiles=changed, runtimeAssetHashes='10/10 PASS',
               preservedExistingFiles=len(baseline)-len(changed), browserScreenshots=screenshots)
(staging / 'integration-checks.json').write_text(json.dumps(summary, indent=2))
print(json.dumps({k:v for k,v in summary.items() if k != 'browserScreenshots'}, indent=2))
print('Screenshots and comparison:', len(screenshots))
