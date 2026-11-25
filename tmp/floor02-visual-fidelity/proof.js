// Disposable QA fixture, not imported by the application or production build.
import '../../src/style.css';
import '../../src/environment.css';
import { createApp } from 'vue';
import App from '../../src/App.vue';
createApp(App).mount('#app');
document.querySelector('#scale').onclick=()=>{
  const samples=[...document.querySelectorAll('#app *')].map(element=>[element,parseFloat(getComputedStyle(element).fontSize)]);
  for(const [element,size] of samples) element.style.setProperty('font-size',`${size*2}px`,'important');
  document.querySelector('#scale').disabled=true;
};
document.querySelector('#hide').onclick=()=>document.querySelector('#hide').parentElement.remove();
