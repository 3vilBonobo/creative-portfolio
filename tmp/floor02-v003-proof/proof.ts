import { createApp } from 'vue';
import App from '../../src/App.vue';
import { projects } from '../../src/data/projects';
import '../../src/style.css';
import '../../src/environment.css';
import './proof.css';

const params = new URLSearchParams(location.search);
// Explicit test emulation, confined to this disposable document; does not change OS preference.
if (params.get('reduced') === '1') {
  const nativeMatchMedia = window.matchMedia.bind(window);
  window.matchMedia = (query: string) => {
    const result = nativeMatchMedia(query);
    if (query.includes('prefers-reduced-motion')) Object.defineProperty(result, 'matches', {value: !query.includes('no-preference')});
    return result;
  };
}
const count = Number(params.get('count') || 6);
const original = projects.slice();
if (count === 1) projects.splice(1);
if (count === 12) projects.push(...original.map(p => ({...p, id: `${p.id}-proof-copy`}))); // Memory-only fixtures.
document.documentElement.dataset.proofLight = params.get('light') || 'on';
document.documentElement.dataset.proofFade = params.get('fade') || 'raw';
document.documentElement.dataset.proofText = params.get('text') || '100';
createApp(App).mount('#app');
const section = document.querySelector<HTMLElement>('#projects')!;
function syncPlate() {
  section.style.setProperty('--plate-height', `${section.clientWidth * (innerWidth <= 620 ? 2048 / 768 : 1148 / 1370)}px`);
}
new ResizeObserver(syncPlate).observe(section);
syncPlate();
if (params.get('text') === '200') {
  const scaled = new WeakSet<Element>();
  function scaleText() {
    const nodes = [...document.querySelectorAll<HTMLElement>('#projects *')].filter(el =>
      !scaled.has(el) && [...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()));
    const sizes = nodes.map(el => [el, parseFloat(getComputedStyle(el).fontSize)] as const);
    sizes.forEach(([el, size]) => { scaled.add(el); el.style.setProperty('font-size', `${size * 2}px`, 'important'); });
  }
  document.fonts.ready.then(() => {
    scaleText();
    new MutationObserver(scaleText).observe(section, {childList: true, subtree: true});
  });
}
if (params.get('reduced') === '1') {
  document.fonts.ready.then(() => {
    const declarations: string[] = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSMediaRule && rule.conditionText.includes('prefers-reduced-motion: reduce')) {
            declarations.push([...rule.cssRules].map(r => r.cssText).join('\n'));
          }
        }
      } catch { /* Cross-origin font sheet has no application motion rules. */ }
    }
    const style = document.createElement('style');
    style.textContent = declarations.join('\n');
    document.head.append(style);
  });
}
