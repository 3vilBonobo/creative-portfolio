import { createApp } from 'vue';
import App from '../../src/App.vue';
import { projects } from '../../src/data/projects';
import '../../src/style.css';
import '../../src/environment.css';
import './proof.css';

const params = new URLSearchParams(location.search);
const count = Number(params.get('count') || 6);
const original = projects.slice();
if (count === 1) projects.splice(1);
if (count === 12) projects.push(...original.map(p => ({...p, id: `${p.id}-proof-copy`}))); // Memory-only fixtures.
document.documentElement.dataset.proofLight = params.get('light') || 'on';
document.documentElement.dataset.proofFade = params.get('fade') || 'raw';
document.documentElement.dataset.proofText = params.get('text') || '100';
createApp(App).mount('#app');
if (params.get('text') === '200') {
  document.fonts.ready.then(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>('#projects *')].filter(el =>
      [...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()));
    const sizes = nodes.map(el => [el, parseFloat(getComputedStyle(el).fontSize)] as const);
    sizes.forEach(([el, size]) => el.style.setProperty('font-size', `${size * 2}px`, 'important'));
  });
}
