import {writeFile,mkdir} from 'node:fs/promises';
import {launch,root,position,preview,measurements,sharp} from './capture.mjs';
const browser=await launch();const results=[];await mkdir(`${root}/screenshots/accessibility`,{recursive:true});
for(const [width,height]of [[1440,900],[390,844]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.__audit={shifts:[],longtasks:[],lcp:[]};for(const [type,key]of [['layout-shift','shifts'],['longtask','longtasks'],['largest-contentful-paint','lcp']]){try{new PerformanceObserver(list=>window.__audit[key].push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration,value:e.value,recent:e.hadRecentInput,size:e.size,url:e.url})))).observe({type,buffered:true})}catch{}}});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await page.waitForTimeout(1500);
  await page.screenshot({path:`${root}/screenshots/accessibility/${width}-production-initial.jpg`,type:'jpeg',quality:88});
  const initial=await measurements(page);const timing=await page.evaluate(()=>({observers:window.__audit,navigation:performance.getEntriesByType('navigation')[0].toJSON(),preview:!!document.querySelector('.environment-preview-toggle')}));
  const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');const a=await cdp.send('Performance.getMetrics');await page.waitForTimeout(2000);const b=await cdp.send('Performance.getMetrics');const delta={};for(const key of ['TaskDuration','ScriptDuration','LayoutDuration','RecalcStyleDuration'])delta[key]=b.metrics.find(m=>m.name===key).value-a.metrics.find(m=>m.name===key).value;
  const anchors=[];for(const id of ['about','projects','experience','street']){if(width===390){await page.locator('.mobile-office-menu').click();await page.getByRole('navigation',{name:'Portfolio sections'}).locator(`a[href="#${id}"]`).click()}else await page.getByRole('navigation',{name:'Portfolio sections'}).locator(`a[href="#${id}"]`).click();await page.waitForTimeout(1600);anchors.push({id,...await page.locator(`#${id}`).evaluate(e=>({top:e.getBoundingClientRect().top,active:document.querySelector('.app-shell').dataset.activeFloor,header:document.querySelector('.site-header').getBoundingClientRect().bottom}))})}
  const complete=await measurements(page);
  await page.keyboard.press('Home');await position(page,'about');await page.emulateMedia({reducedMotion:'reduce'});const reduced=await page.evaluate(()=>({matches:matchMedia('(prefers-reduced-motion: reduce)').matches,lamps:[...document.querySelectorAll('.projects-environment,.experience-environment')].map(e=>({class:e.className,style:e.getAttribute('style')}))}));
  await page.addStyleTag({content:'html {font-size:32px !important}'});const zoom=[];
  for(const id of ['about','projects','experience','street']){await position(page,id);await page.screenshot({path:`${root}/screenshots/accessibility/${width}-${id}-text200.jpg`,type:'jpeg',quality:85});zoom.push({id,...await page.locator(`#${id}`).evaluate(e=>({width:e.getBoundingClientRect().width,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,pageOverflow:document.documentElement.scrollWidth-innerWidth}))})}
  results.push({width,height,initial,timing,idleTwoSecondCpu:delta,anchors,complete,reduced,text200:zoom,pageerrors:errors});await context.close();
}
await writeFile(`${root}/metrics/production-diagnostics.json`,JSON.stringify(results,null,2));
// Quantitative screenshot background samples; not a conformance certificate.
const contrast=[];
const lin=x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4};const lum=rgb=>.2126*lin(rgb[0])+.7152*lin(rgb[1])+.0722*lin(rgb[2]);
for(const [width,height]of [[1440,900],[390,844]])for(const phase of ['day','night']){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await context.newPage();await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await preview(page,phase);
 for(const [id,selector]of [['about','.about__statement'],['about','.about__introduction p'],['projects','.projects-showcase__intro'],['experience','.experience-entry__date'],['street','.contact-email']]){
  await position(page,id);const target=page.locator(selector).filter({visible:true}).first();await target.scrollIntoViewIfNeeded();await page.waitForTimeout(1400);
  const style=await target.evaluate(e=>{const s=getComputedStyle(e);return{color:s.color,size:s.fontSize,weight:s.fontWeight,text:e.textContent}});
  const old=await target.getAttribute('style');await target.evaluate(e=>{e.style.setProperty('color','transparent','important');e.style.setProperty('text-shadow','none','important')});
  const buffer=await target.screenshot({type:'png'});if(old===null)await target.evaluate(e=>e.removeAttribute('style'));else await target.evaluate((e,s)=>e.setAttribute('style',s),old);
  const {data,info}=await sharp(buffer).removeAlpha().raw().toBuffer({resolveWithObject:true});const fg=style.color.match(/[\d.]+/g).slice(0,3).map(Number);const ratios=[];
  for(let y=2;y<info.height-2;y+=Math.max(1,Math.floor(info.height/12)))for(let x=2;x<info.width-2;x+=Math.max(1,Math.floor(info.width/24))){const n=(y*info.width+x)*info.channels;const l1=lum(fg),l2=lum([...data.subarray(n,n+3)]);ratios.push((Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05))}
  contrast.push({width,phase,selector,...style,minSampleRatio:Math.min(...ratios),medianSampleRatio:ratios.sort((a,b)=>a-b)[Math.floor(ratios.length/2)],method:'Computed foreground against grid-sampled screenshot after making only target text transparent; inspect minimum outliers manually.'});
 }
 await context.close();
}
await writeFile(`${root}/metrics/contrast-samples.json`,JSON.stringify(contrast,null,2));await browser.close();console.log('Production diagnostics and sampled contrast complete');
