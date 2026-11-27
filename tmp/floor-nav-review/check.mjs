import {mkdir,writeFile} from 'node:fs/promises';
import {launch,position,preview} from '../../docs/art-production/audits/2026-11-27/scripts/capture.mjs';
await mkdir('tmp/floor-nav-review',{recursive:true});const browser=await launch(),results=[],logs=[];
for(const [width,height] of [[1440,900],[820,1180],[390,844]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();
 page.on('pageerror',e=>logs.push(e.message));await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await preview(page);
 for(const id of ['office','about','projects','experience','street']){
  await position(page,id);const nav=page.locator('.floor-nav');
  const measure=()=>nav.evaluate(e=>({width:e.getBoundingClientRect().width,display:getComputedStyle(e).display,labels:[...e.querySelectorAll('b')].map(b=>getComputedStyle(b).display),active:e.querySelector('[aria-current]')?.getAttribute('href')}));
  const initial=await measure();if(initial.display!=='none'){await nav.hover();const hover=await measure();await nav.locator('a').first().press('Tab');const focus=await measure();if(initial.width!==hover.width||initial.width!==focus.width||focus.labels.some(x=>x!=='none'))throw new Error(`Expanded at ${width} ${id}`);results.push({viewport:[width,height],id,initial,hover,focus});if(width===1440)await nav.screenshot({path:`tmp/floor-nav-review/${id}-compact.png`});}else results.push({viewport:[width,height],id,initial});
 }
 await position(page,'about');await page.screenshot({path:`tmp/floor-nav-review/about-${width}.jpg`,type:'jpeg',quality:85});await context.close();
}
await browser.close();await writeFile('tmp/floor-nav-review/results.json',JSON.stringify({results,logs},null,2));console.log(JSON.stringify({checks:results.length,desktopWidths:results.filter(r=>r.viewport[0]===1440).map(r=>r.initial.width),pageerrors:logs},null,2));
