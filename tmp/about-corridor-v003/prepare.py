from pathlib import Path
import hashlib,json,subprocess,shutil
from PIL import Image
root=Path.cwd(); work=root/'tmp/about-corridor-v003'; pkg=work/'package'
files=subprocess.check_output(['git','ls-files','-z']).decode().split('\0')
baseline={p:hashlib.sha256((root/p).read_bytes()).hexdigest() if (root/p).is_file() else None for p in files if p}
(work/'baseline.json').write_text(json.dumps(baseline))
checks=[]
for a in json.loads((pkg/'manifest.json').read_text())['assets']:
 p=pkg/a['path']; data=p.read_bytes()
 assert len(data)==a['bytes'] and hashlib.sha256(data).hexdigest()==a['sha256'],p
 if p.suffix=='.webp':
  im=Image.open(p); assert list(im.size)==[a['width'],a['height']]; checks.append({'path':a['path'],'size':im.size,'mode':im.mode,'bytes':len(data)})
assert (pkg/'reference/actual-site-portrait-DO-NOT-REGENERATE.webp').read_bytes()==(root/'public/about/irene-portrait.webp').read_bytes()
dest=root/'public/environments/floor-03-about-corridor/v003'; dest.mkdir(parents=True,exist_ok=False)
for p in (pkg/'production').iterdir(): shutil.copy2(p,dest/p.name)
for n in ['manifest.json','geometry.json','README.md','CODEX-HANDOFF.md']: shutil.copy2(pkg/n,dest/n)
(work/'asset-checks.json').write_text(json.dumps({'assets':checks,'manifestHashes':'all nine PASS','portraitIdentical':True},indent=2))
print('Verified and copied nine supplied assets without re-encoding; portrait identical.')
