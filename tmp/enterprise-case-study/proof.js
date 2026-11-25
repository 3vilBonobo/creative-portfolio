// Disposable proof only; not imported by the production app.
import '../../src/style.css';
import '../../src/environment.css';
import { createApp, nextTick } from 'vue';
import App from '../../src/App.vue';
createApp(App).mount('#app');
document.querySelector('#enlarge').onclick=async()=>{
 document.querySelector('.work-panel--enterprise-traceability button').click();
 await nextTick();
 const sizes=[...document.querySelectorAll('#app *')].map(e=>[e,getComputedStyle(e).fontSize]);
 for (const [element,size] of sizes) element.style.setProperty('font-size',`${parseFloat(size)*2}px`,'important');
 document.querySelector('#enlarge').remove();
};
