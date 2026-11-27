import {mkdir,writeFile} from 'node:fs/promises';
import {launch,root,floors,position,preview,measurements,settle} from './capture.mjs';
const browser=await launch();const results=[];
await mkdir(`${root}/screenshots/states`,{recursive:true});await mkdir(`${root}/proposals/captures`,{recursive:true});
async function run(name,fn){try{results.push({name,result:await fn(),status:'PASS'})}catch(e){results.push({name,status:'FAIL',error:e.message});console.log(`FAIL ${name}: ${e.message.slice(0,160)}`)}}
async function shot(page,name){await settle(page);await page.screenshot({path:`${root}/screenshots/states/${name}.jpg`,type:'jpeg',quality:87});}
for(const [w,h] of (process.argv.includes('--proposals-only')?[]:[[1440,900],[820,1180],[390,844],[844,390]])) {
  const key=`${w}x${h}`;const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const page=await context.newPage();page.setDefaultTimeout(6000);const logs=[];
  page.on('pageerror',e=>logs.push({type:'pageerror',text:e.message}));page.on('console',m=>{if(['warning','error'].includes(m.type()))logs.push({type:m.type(),text:m.text()})});
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await preview(page,'night','rain');
  for(const id of floors){await position(page,id);await shot(page,`${key}-${id}-night-rain`)}
  await preview(page);
  await run(`${key} About tabs and keyboard`,async()=>{
    await position(page,'about');const tabs=page.getByRole('tab');
    const states=[];for(const name of ['Background','Toolkit','Approach']){await page.getByRole('tab',{name,exact:true}).click();await settle(page);states.push({name,visiblePanels:await page.locator('.about__profile-panel:visible').count(),selected:await page.getByRole('tab',{name,exact:true}).getAttribute('aria-selected')});await shot(page,`${key}-about-${name.toLowerCase()}`)}
    await tabs.last().press('Home');const home=await page.evaluate(()=>document.activeElement.textContent.trim());await tabs.first().press('ArrowRight');const arrow=await page.evaluate(()=>({focus:document.activeElement.textContent.trim(),outline:getComputedStyle(document.activeElement).outline}));
    return {states,home,arrow};
  });
  await run(`${key} category filtering and project dialog`,async()=>{
    await position(page,'projects');const phone=await page.locator('#projects').getAttribute('class');const states=[];
    for(const [value,label]of [['professional','Professional Work'],['creative','Creative & Interactive'],['all','All Projects']]){
      if(phone.includes('projects--phone'))await page.getByLabel('Browse projects',{exact:false}).selectOption(value);else await page.getByRole('button',{name:new RegExp(label==='Creative & Interactive'?'Creative & Interactive':label)}).first().click();
      await settle(page);states.push({value,count:await page.locator('.projects-showcase__count').innerText(),cards:await page.locator('[data-project-id]:visible').count()});
    }
    await shot(page,`${key}-projects-filter-all`);
    const more=page.locator('.projects-showcase__more:visible');const expansions=[];
    for(let i=0;i<await more.count();i++){await more.nth(i).click();expansions.push(await more.nth(i).getAttribute('aria-expanded'))}
    const trigger=page.getByRole('button',{name:/Project Details/}).first();await trigger.click();await page.locator('dialog[open]').waitFor();await shot(page,`${key}-project-dialog`);
    await page.keyboard.press('Shift+Tab');const reverse=await page.evaluate(()=>({inside:!!document.activeElement.closest('dialog'),text:document.activeElement.textContent.trim().slice(0,80)}));
    await page.keyboard.press('Escape');await page.waitForTimeout(100);return {states,expansions,reverse,closed:await page.locator('dialog[open]').count()===0,focusReturned:await trigger.evaluate(e=>e===document.activeElement)};
  });
  await run(`${key} career roles and disclosure`,async()=>{
    await position(page,'experience');const buttons=page.locator('.experience-entry__select');const states=[];
    for(let i=0;i<await buttons.count();i++){await buttons.nth(i).click();states.push({name:await buttons.nth(i).getAttribute('aria-label'),expanded:await buttons.nth(i).getAttribute('aria-expanded'),pressed:await buttons.nth(i).getAttribute('aria-pressed')})}
    await buttons.first().click();const summary=page.locator('.experience__focus:visible summary');if(await summary.count())await summary.first().click();await shot(page,`${key}-experience-expanded`);
    await page.locator('.experience__community summary').click();await shot(page,`${key}-experience-community`);return states;
  });
  if(w===390||w===844)await run(`${key} menu and anchor`,async()=>{
    await position(page,'about');const menu=page.locator('.mobile-office-menu');await menu.click();await shot(page,`${key}-menu`);await page.keyboard.press('Escape');const focus=await menu.evaluate(e=>e===document.activeElement);
    await menu.click();await page.getByRole('navigation',{name:'Portfolio sections'}).getByRole('link',{name:'Contact',exact:true}).click();await page.waitForTimeout(1500);return {focusReturned:focus,url:page.url(),headerBottom:await page.locator('.site-header').evaluate(e=>e.getBoundingClientRect().bottom),contactTop:await page.locator('#street').evaluate(e=>e.getBoundingClientRect().top)};
  });
  if(w===390)await run('phone telescope, discoveries and rotation',async()=>{
    await position(page,'office');const summary=page.locator('.mobile-studio-discoveries summary');await summary.click();
    const telescope=page.getByRole('button',{name:'Telescope',exact:true});await telescope.click();await page.locator('.telescope-app').waitFor();await page.locator('.telescope-app__image--detail').evaluate(e=>e.decode().catch(()=>{}));await shot(page,'390x844-telescope');
    const before=await page.locator('.telescope-app__scene').getAttribute('style');await page.getByRole('button',{name:'Zoom in',exact:true}).click();await page.keyboard.press('ArrowRight');const afterArrow=await page.locator('.telescope-app__scene').getAttribute('style');
    const lens=await page.locator('.telescope-app__eyepiece').boundingBox();await page.mouse.move(lens.x+lens.width*.5,lens.y+lens.height*.5);await page.mouse.down();await page.mouse.move(lens.x+lens.width*.7,lens.y+lens.height*.5,{steps:12});await page.mouse.up();await page.waitForTimeout(300);const afterDrag=await page.locator('.telescope-app__scene').getAttribute('style');
    const src=await page.locator('.telescope-app__image--detail').getAttribute('src');await page.setViewportSize({width:844,height:390});await page.waitForTimeout(400);await shot(page,'844x390-telescope-rotated');const retained=src===await page.locator('.telescope-app__image--detail').getAttribute('src');await page.keyboard.press('Escape');
    await page.setViewportSize({width:390,height:844});await position(page,'office');return {before,afterArrow,afterDrag,sourceRetained:retained,focus:await page.evaluate(()=>document.activeElement.textContent.trim()),closed:await page.locator('.telescope-app').count()===0};
  });
  if(w===844)await run('landscape immersive studio',async()=>{
    await position(page,'office');await page.getByRole('button',{name:'Enter immersive studio',exact:true}).click();await shot(page,'844x390-studio-immersive');
    const controls=await page.locator('.mobile-studio-toolbar button').allTextContents();const exit=page.locator('.mobile-studio-return');await exit.click();return {controls,exited:!await page.locator('#office').evaluate(e=>e.classList.contains('hero--immersive'))};
  });
  results.push({name:`${key} logs`,logs});await context.close();
}
// Isolated before/after comparisons mount the real application with a separate CSS import.
for(const [w,h]of [[1440,900],[820,1180],[390,844],[844,390]]){
  const key=`${w}x${h}`;const states=[];
  for(const variant of ['before','after']){
    const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});const page=await context.newPage();
    await page.goto(`http://127.0.0.1:5173/${variant==='after'?'docs/art-production/audits/2026-11-27/proposals/index.html':''}`,{waitUntil:'networkidle'});await preview(page);
    await page.locator('main img').evaluateAll(es=>Promise.all(es.map(e=>{e.loading='eager';return e.decode().catch(()=>{})})));
    for(const id of ['about','projects','experience']){await position(page,id);await page.waitForTimeout(1400);await page.screenshot({path:`${root}/proposals/captures/${key}-${id}-${variant}-entry.jpg`,type:'jpeg',quality:88});await page.locator(`#${id}`).screenshot({path:`${root}/proposals/captures/${key}-${id}-${variant}-floor.jpg`,type:'jpeg',quality:83});}
    states.push({variant,...await measurements(page)});await context.close();
  }
  await writeFile(`${root}/metrics/proposal-${key}.json`,JSON.stringify(states,null,2));console.log(`Proposal ${key} captured`);
}
if(results.length)await writeFile(`${root}/metrics/interactions.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(r=>({name:r.name,status:r.status})),null,2));await browser.close();
