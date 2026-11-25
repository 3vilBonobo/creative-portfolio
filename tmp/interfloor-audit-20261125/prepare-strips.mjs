import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require(process.argv[2]);
const sourceRoot = 'tmp/interfloor-audit-20261125/Athens_Cyberpunk_Interfloor_Handoff/references/preferred';
const outputRoot = 'public/environments/transitions';
const entries = [
  ['04-to-03', 'REF_01_shallow_baseline.png', 272],
  ['03-to-02', 'REF_02_complex_distribution.png', 282],
  ['02-to-01', 'REF_05_dense_cooling_and_wiring.png', 300],
  ['01-to-00', 'REF_03_low_light.png', 282],
];
await mkdir(outputRoot, { recursive: true });
const manifest = [];
const panels = [];
for (const [index, [id, source, top]] of entries.entries()) {
  const filename = `transition-${id}-universal.webp`;
  const sourcePath = path.join(sourceRoot, source);
  const crop = id === '04-to-03'
    ? { left: 186, top: 270, width: 1800, height: 180 }
    : { left: 6, top, width: 2160, height: 216 };
  await sharp(sourcePath).extract(crop).resize(2160, 216).webp({ quality: 86, effort: 6 }).toFile(path.join(outputRoot, filename));
  const bytes = await readFile(path.join(outputRoot, filename));
  manifest.push({ id, source, crop, filename, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  // Offline crop studies, not browser screenshots. Edge bars approximate the CSS slabs.
  for (const [width, height, left, offset] of [[1440, 125, 0, 26], [390, 69, 0, 177]]) {
    const image = await sharp(bytes).resize(width, height, { fit: 'cover', position: 'centre' }).png().toBuffer();
    panels.push({ input: image, left, top: index * 255 + offset });
    for (const y of [0, height - 6]) panels.push({ input: { create: { width, height: 6, channels: 4, background: '#30332d' } }, left, top: index * 255 + offset + y });
  }
  const label = `<svg width="1440" height="24"><text x="10" y="17" fill="#ddd7ca" font-family="sans-serif" font-size="14">${id} — offline crop study: desktop 1440×125 above, mobile 390×69 below (not browser evidence)</text></svg>`;
  panels.push({ input: Buffer.from(label), left: 0, top: index * 255 });
}
await writeFile('tmp/interfloor-audit-20261125/crop-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
// Shared concrete construction, sampled from the preferred baseline rather than generated.
for (const [name, top] of [['upper', 176], ['lower', 462]]) {
  await sharp(path.join(sourceRoot, 'REF_01_shallow_baseline.png'))
    .extract({ left: 6, top, width: 2160, height: 84 })
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(outputRoot, `concrete-${name}.webp`));
}
await sharp({ create: { width: 1440, height: 1020, channels: 3, background: '#111719' } }).composite(panels).png().toFile('tmp/interfloor-audit-20261125/crop-studies.png');
console.log(JSON.stringify(manifest, null, 2));
