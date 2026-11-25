import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
const sharp = createRequire(import.meta.url)(process.argv[2]);
const root = 'tmp/interfloor-audit-20261125/screenshots';
const profiles = JSON.parse(await readFile(`${root}/final-metrics.json`, 'utf8'));
const summaries=[];
for (const profile of profiles) {
  const width=profile.viewport[0];
  const filename=`${root}/sequence-${width}.jpg`;
  const metadata=await sharp(filename).metadata();
  const scale=metadata.height/profile.document.height;
  const rows=[];
  let top=0;
  for(const connector of profile.transitions) {
    const y=Math.max(0,Math.round((connector.top-65)*scale));
    const height=Math.min(metadata.height-y,Math.ceil((connector.height+130)*scale));
    const clip=await sharp(filename).extract({left:0,top:y,width:metadata.width,height}).jpeg({quality:90}).toBuffer();
    await writeFile(`${root}/${connector.id}-final-${width}.jpg`,clip);
    rows.push({input:clip,left:0,top});
    top+=height+18;
  }
  await sharp({create:{width:metadata.width,height:top,channels:3,background:'#0b1112'}})
    .composite(rows).jpeg({quality:90}).toFile(`${root}/all-seams-${width}.jpg`);
  summaries.push({width,pixels:[metadata.width,metadata.height],document:profile.document,scale});
}
console.log(JSON.stringify(summaries,null,2));
