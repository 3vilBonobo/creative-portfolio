import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const modules = 'C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1123-915-0_26.1123.915.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/';
const { chromium } = require(`${modules}playwright`);
export const sharp = require(`${modules}sharp`);
export const root = fileURLToPath(new URL('../', import.meta.url));
export const launch = () => chromium.launch({headless:true, executablePath:'C:/Users/Irinella/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
export const floors = ['office','about','projects','experience','street'];
export async function settle(page) { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(180); }
export async function position(page, id) {
  await page.evaluate(id => {const e=document.getElementById(id); window.scrollTo({top:e.getBoundingClientRect().top+scrollY-60,behavior:'instant'});},id);
  await page.waitForTimeout(id==='about'?1800:250);
}
export async function preview(page, phase='day', weather='clear') {
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
  const toggle=page.locator('.environment-preview-toggle');
  await toggle.click();
  const viewport=page.viewportSize();
  if(viewport.width<=1000&&viewport.height<=500) await page.getByLabel('Phone touch layout (Floors 04–00)',{exact:true}).check();
  await page.locator('.environment-preview label').filter({hasText:/^Time/}).locator('select').selectOption(phase);
  await page.locator('.environment-preview label').filter({hasText:/^Weather/}).locator('select').selectOption(weather);
  await page.getByLabel('Freeze parallax',{exact:true}).check();
  await toggle.click();
  await settle(page);
}
export async function measurements(page) {
  return page.evaluate(() => {
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height}};
    const visible=e=>!!e.getClientRects().length && getComputedStyle(e).visibility!=='hidden';
    return {viewport:[innerWidth,innerHeight],coarse:matchMedia('(any-pointer: coarse)').matches,document:{w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight}, phase:document.querySelector('.app-shell').dataset.timePhase,
      floors:[...document.querySelectorAll('main > section')].map(e=>({id:e.id,classes:e.className,...rect(e),words:e.innerText.trim().split(/\s+/).length})),
      transitions:[...document.querySelectorAll('.floor-transition')].map(e=>({id:e.id,...rect(e)})),
      typography:[...document.querySelectorAll('h1,h2,.about__bio p,.project-preview__summary,.experience-detail p,.contact-email')].filter(visible).slice(0,45).map(e=>{const s=getComputedStyle(e);return {tag:e.tagName,class:e.className,text:e.textContent.trim().slice(0,75),size:s.fontSize,line:s.lineHeight,color:s.color,family:s.fontFamily,width:e.getBoundingClientRect().width}}),
      smallTargets:[...document.querySelectorAll('a,button,summary,select,[role="button"]')].filter(visible).filter(e=>!e.closest('[inert]')).map(e=>({text:(e.getAttribute('aria-label')||e.textContent).trim().slice(0,70),tag:e.tagName,...rect(e)})).filter(r=>r.w<24||r.h<24),
      images:[...document.images].filter(visible).map(e=>({src:e.currentSrc.replace(location.origin,''),loaded:e.complete&&e.naturalWidth>0,native:[e.naturalWidth,e.naturalHeight],...rect(e)})),
      scrollAreas:[...document.querySelectorAll('main *')].filter(visible).filter(e=>['auto','scroll'].includes(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+2).map(e=>({class:e.className,client:e.clientHeight,scroll:e.scrollHeight})),
      resources:performance.getEntriesByType('resource').map(e=>({name:e.name.replace(location.origin,''),transfer:e.transferSize,encoded:e.encodedBodySize,duration:e.duration,initiator:e.initiatorType}))};
  });
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  await mkdir(`${root}/screenshots`,{recursive:true});await mkdir(`${root}/metrics`,{recursive:true});
  const browser=await launch();
  const profiles=[[1366,768],[1440,900],[1920,1080],[2560,1440],[768,1024],[1024,768],[820,1180],[320,568],[360,800],[390,844],[430,932],[667,375],[844,390],[932,430]];
  const results=[];
  for(const [w,h] of profiles) {
    const name=`${w}x${h}`;const phone=w<=600||(h<=500&&w<=1000);
    const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:phone});
    const page=await context.newPage();const logs=[];
    page.on('pageerror',e=>logs.push({type:'pageerror',message:e.message}));
    page.on('console',m=>{if(['warning','error'].includes(m.type()))logs.push({type:m.type(),message:m.text()})});
    await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await preview(page);
    for(const id of floors){await position(page,id);await page.locator(`#${id} img`).evaluateAll(es=>es.forEach(e=>{if(e.loading==='lazy')e.loading='eager'}));await settle(page);await page.screenshot({path:`${root}/screenshots/${name}-${id}-entry.jpg`,type:'jpeg',quality:85});await page.locator(`#${id}`).screenshot({path:`${root}/screenshots/${name}-${id}-floor.jpg`,type:'jpeg',quality:82,timeout:20000});}
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await settle(page);
    await page.screenshot({path:`${root}/screenshots/${name}-full.jpg`,fullPage:true,type:'jpeg',quality:78,timeout:30000});
    const metrics=await measurements(page);results.push({name,...metrics,logs});
    await writeFile(`${root}/metrics/${name}.json`,JSON.stringify(results.at(-1),null,2));
    console.log(`${name}: ${metrics.document.h}px, overflow ${metrics.document.w-w}px, ${logs.length} log entries`);
    await context.close();
  }
  await writeFile(`${root}/metrics/profiles.json`,JSON.stringify(results,null,2));await browser.close();
}
