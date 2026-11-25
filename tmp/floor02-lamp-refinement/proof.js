// Disposable browser instrumentation. The normal application does not import this file.
import '../../src/style.css';
import '../../src/environment.css';
const jobs=new Map();let id=0,now=0,reduced=false,hidden=false,app;
const nativeTimeout=window.setTimeout.bind(window),nativeClear=window.clearTimeout.bind(window);
window.setTimeout=(callback,delay,...args)=>{
  if(new Error().stack?.includes('ProjectsEnvironment.vue')){
    const handle=--id;jobs.set(handle,{callback,at:now+delay,delay});queueMicrotask(status);return handle;
  }
  return nativeTimeout(callback,delay,...args);
};
window.clearTimeout=handle=>{if(handle<0)jobs.delete(handle);else nativeClear(handle);};
const nativeMatch=window.matchMedia.bind(window),motion=nativeMatch('(prefers-reduced-motion: reduce)');
Object.defineProperty(motion,'matches',{get:()=>reduced});
window.matchMedia=query=>query==='(prefers-reduced-motion: reduce)'?motion:nativeMatch(query);
Object.defineProperty(document,'hidden',{get:()=>hidden,configurable:true});
const {createApp,nextTick}=await import('vue');const {default:App}=await import('../../src/App.vue');
function mount(){const original=Math.random;let cursor=0;const sequence=[0,0.9,0.5,0.5,0.5,0];Math.random=()=>sequence[cursor++%sequence.length];app=createApp(App);app.mount('#app');Math.random=original;}
function status(){const scene=document.querySelector('.projects-environment'),plate=document.querySelector('.projects-environment__plate'),r=plate?.getBoundingClientRect();document.querySelector('#status').textContent=JSON.stringify({now,reduced,hidden,mounted:!!app,pending:[...jobs.values()].map(j=>({at:j.at,delay:j.delay})),intensity:scene?.style.getPropertyValue('--projects-lamp-intensity'),opacities:plate?[...plate.children].map(e=>getComputedStyle(e).opacity):[],registered:plate?[...plate.children].every(e=>{const b=e.getBoundingClientRect();return b.x===r.x&&b.y===r.y&&b.width===r.width&&b.height===r.height}):null},null,2);}
document.querySelector('#step').onclick=async()=>{const next=[...jobs].sort((a,b)=>a[1].at-b[1].at)[0];if(next){const [key,job]=next;now=job.at;jobs.delete(key);job.callback();}await nextTick();status();};
document.querySelector('#motion').onclick=async()=>{reduced=!reduced;motion.dispatchEvent(new Event('change'));await nextTick();status();};
document.querySelector('#hidden').onclick=async()=>{hidden=!hidden;document.dispatchEvent(new Event('visibilitychange'));await nextTick();status();};
document.querySelector('#mount').onclick=async()=>{if(app){app.unmount();app=undefined;}else{mount();}document.querySelector('#mount').textContent=app?'Unmount portfolio':'Mount portfolio';await nextTick();status();};
mount();status();
