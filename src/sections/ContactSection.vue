<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AlleyFooter from "../components/contact/AlleyFooter.vue";
import MouseEasterEgg from "../components/contact/MouseEasterEgg.vue";
import WeatherEffects from "../components/environment/WeatherEffects.vue";
import { useEnvironment } from "../composables/useEnvironment";
import { usePhoneLayout } from "../composables/usePhoneLayout";
import { FLOOR } from "../config/floors";
import { contactTopProjection } from "../services/contactScreenProjection";

const { state, previewIntensity } = useEnvironment();
const { phone, portrait, landscape } = usePhoneLayout();
const phonePlate = computed(() => landscape.value ? "ultrawide" : "desktop-16x9");
const section = ref<HTMLElement>();
const panel = ref<HTMLElement>();
const topWarp = ref("matrix(1, 0, 0, 1, 0, 0)");
const inView = ref(false);
const hidden = ref(document.hidden);
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
const reduced = ref(motion.matches);
const root = "/environments/floor-00-contact/";
// Dawn/day/golden hour retain daylight; dusk/night use the night artwork.
const lighting = computed(() => ["dusk", "night"].includes(state.value.timePhase) ? "night" : "day");
const paused = computed(() => hidden.value || !inView.value || reduced.value);
let observer: IntersectionObserver | undefined;
let panelObserver: ResizeObserver | undefined;
function alignScreenTop() {
  if (!panel.value) return;
  const style = getComputedStyle(panel.value);
  const wide = window.matchMedia("(min-width: 1800px) and (min-aspect-ratio: 2/1)").matches;
  const matrix = contactTopProjection(Number.parseFloat(style.width), Number.parseFloat(style.height), wide ? .13 : .1, wide ? .02 : .015);
  topWarp.value = `matrix3d(${matrix.join(",")})`;
}
function visibilityChanged() { hidden.value = document.hidden; }
function motionChanged() { reduced.value = motion.matches; }
onMounted(() => {
  document.addEventListener("visibilitychange", visibilityChanged);
  motion.addEventListener("change", motionChanged);
  observer = new IntersectionObserver(([entry]) => { inView.value = entry?.isIntersecting ?? false; }, { rootMargin: "35% 0px" });
  if (section.value) observer.observe(section.value);
  panelObserver = new ResizeObserver(alignScreenTop);
  if (panel.value) panelObserver.observe(panel.value);
});
onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", visibilityChanged);
  motion.removeEventListener("change", motionChanged);
  observer?.disconnect();
  panelObserver?.disconnect();
});
</script>

<template>
  <section ref="section" :id="FLOOR.street.id" class="floor-section contact-scene contact-scene--athens" :class="{ 'contact-scene--phone': phone, 'contact-scene--portrait': portrait, 'contact-scene--landscape': landscape }" :data-floor-number="FLOOR.street.number" :data-phase="state.timePhase" :data-weather="state.weatherCondition" aria-labelledby="contact-title">
    <div class="contact-scene__stage">
      <div class="contact-scene__art" aria-hidden="true">
        <picture>
          <source v-if="!phone" media="(max-width: 600px)" :srcset="`${root}floor00-mobile-${lighting}.webp`" width="941" height="1672">
          <source v-if="!phone" media="(max-width: 1100px)" :srcset="`${root}floor00-tablet-${lighting}.webp`" width="1448" height="1086">
          <source v-if="!phone" media="(min-aspect-ratio: 2/1) and (min-width: 1800px)" :srcset="`${root}floor00-ultrawide-${lighting}.webp`" width="1916" height="821">
          <img class="contact-scene__plate" :src="`${root}floor00-${phone ? phonePlate : 'desktop-16x9'}-${lighting}.webp`" :width="landscape ? 1916 : 1448" :height="landscape ? 821 : 814" alt="" loading="lazy" decoding="async">
        </picture>
        <div class="contact-sky"><WeatherEffects mode="sky" :state="state" :intensity="previewIntensity" :paused="paused" /></div>
        <div class="contact-practical" />
        <div class="contact-night-veil" />
      </div>
      <WeatherEffects class="contact-scene__precipitation" mode="precipitation" :state="state" :intensity="previewIntensity" :paused="paused" />
      <div class="contact-scene__layout">
        <p class="contact-level">Level {{ FLOOR.street.number }} · Athens · Street level</p>
        <div ref="panel" class="contact-panel" :style="{ '--contact-top-warp': topWarp }">
          <span v-for="corner in ['tl', 'tr', 'bl', 'br']" :key="corner" class="contact-panel__bolt" :class="`contact-panel__bolt--${corner}`" aria-hidden="true" />
          <div class="contact-screen">
            <svg class="contact-screen__grit" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <filter id="contact-glass-grit"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
              <rect width="400" height="600" filter="url(#contact-glass-grit)" />
            </svg>
            <div class="contact-screen__header">
              <p class="contact-screen__eyebrow">Contact / 00</p>
              <span class="contact-screen__station" aria-hidden="true">ATH—GR</span>
            </div>
            <h2 id="contact-title" class="contact-screen__title"><span class="sr-only">Contact. </span>Good ideas start<br>with a <em>hello.</em></h2>
            <p class="contact-screen__copy">{{ phone ? 'Building something interesting? Tell me what you’re working on.' : 'A product that needs clarity. An interface with a stubborn problem. Or something a little unusual. Tell me what you’re working on.' }}</p>
            <a class="contact-email" href="mailto:3vilbonobo@gmail.com"><span>Start a conversation</span><span aria-hidden="true">↗</span><small>3vilbonobo@gmail.com</small></a>
            <nav id="contact-socials" class="contact-socials" aria-label="Irinella's social profiles">
              <a href="https://x.com/Irinella_b" target="_blank" rel="noopener noreferrer" aria-label="Visit Irinella on X"><span>X</span><span aria-hidden="true">↗</span></a>
              <a href="https://www.instagram.com/irinella_b/" target="_blank" rel="noopener noreferrer" aria-label="Visit Irinella on Instagram"><span>Instagram</span><span aria-hidden="true">↗</span></a>
              <a href="https://www.linkedin.com/in/irinella-boutsika/" target="_blank" rel="noopener noreferrer" aria-label="Visit Irinella on LinkedIn"><span>LinkedIn</span><span aria-hidden="true">↗</span></a>
            </nav>
            <p class="contact-screen__signature"><span aria-hidden="true">✦</span> Irinella Boutsika <span>Frontend / Creative web</span></p>
          </div>
          <div class="contact-panel__label" aria-hidden="true"><i /> DIRECT LINE <span>ATHENS · FLOOR 00</span></div>
        </div>
        <div v-if="portrait" class="mobile-office-rotation contact-rotation">
          <img src="/hero/loft-mobile-v1/rotate-phone.svg" alt="" aria-hidden="true" width="32" height="32">
          <p><strong>Explore the full street</strong><span>Rotate your phone sideways for the immersive experience.</span></p>
        </div>
        <a v-if="phone" class="contact-rooftop" :href="`#${FLOOR.office.id}`">Back to the rooftop</a>
        <a class="exit-door" :href="`#${FLOOR.office.id}`" aria-label="Enter the building and return to the rooftop"><span class="sr-only">Return to rooftop</span></a>
        <MouseEasterEgg />
      </div>
    </div>
    <AlleyFooter />
  </section>
</template>

<style scoped>
.contact-scene--athens { color: #e0eeee; background: #0a1011; }
.contact-scene__stage { width: 100%; aspect-ratio: 1448/814; min-height: 0; }
@media (min-width: 1101px) {
  .contact-scene:not(.contact-scene--phone) .contact-scene__stage {
    width: min(100%, calc((100svh - 4.25rem) * 1448 / 814));
  }
}
@media (min-width: 1800px) and (min-aspect-ratio: 2/1) {
  .contact-scene:not(.contact-scene--phone) .contact-scene__stage {
    width: min(100%, calc((100svh - 4.25rem) * 1916 / 821));
  }
}
.contact-scene__art { inset: 0; }
.contact-scene__plate { width: 100%; height: 100%; object-fit: cover; object-position: center; transition: none; }
.contact-sky, .contact-night-veil { position: absolute; inset: 0; pointer-events: none; }
.contact-sky { mask: url('/environments/floor-00-contact/floor00-desktop-16x9-sky-mask.svg') center / 100% 100% no-repeat; }
.contact-sky :deep(.weather-effects) { position: absolute; inset: 0; --cloud-tint: .8; }
.contact-sky :deep(.weather-clouds) { inset: 0; opacity: calc(var(--effect-cloud) * .5); background: none; }
.contact-sky :deep(.weather-cloud-bank) { top: 14%; height: 40%; background-size: 50% 100%; }
.contact-sky :deep(.weather-storm-light), .contact-sky :deep(.weather-lightning) { display: none; }
.contact-scene[data-phase="night"] .contact-sky :deep(.weather-clouds), .contact-scene[data-phase="dusk"] .contact-sky :deep(.weather-clouds) { filter: brightness(.3) saturate(.5); }
.contact-night-veil { background: #000; opacity: 0; transition: opacity .6s ease; }
.contact-scene[data-phase="dusk"] .contact-night-veil { opacity: .1; }
.contact-scene[data-phase="night"] .contact-night-veil { opacity: .25; }
/* Attenuate the existing emitter and spill rather than drawing a new light. */
.contact-practical { position: absolute; left: 28%; top: 14%; width: 17%; height: 15%; background: radial-gradient(ellipse, #000b, #0005 35%, transparent 70%); opacity: .04; pointer-events: none; }
.contact-scene[data-phase="night"] .contact-practical { animation: contact-lamp 19s ease-in-out infinite; animation-play-state: v-bind('paused ? "paused" : "running"'); }
@keyframes contact-lamp { 0%, 76%, 84%, 100% { opacity: .04; } 78%, 81% { opacity: .65; } 79.5%, 82% { opacity: .15; } }
.contact-scene__layout { position: absolute; inset: 0; display: block; padding: 0; min-height: 0; }
.contact-level { position: absolute; left: 4%; top: 3%; display: block; width: auto; min-height: 0; margin: 0; padding: .4rem .65rem; background: #081113d9; color: #d0dcdb; font: 400 clamp(10px, .75cqi, 14px)/1.5 "IBM Plex Mono", monospace; letter-spacing: .08em; text-transform: uppercase; }
.exit-door { left: 10%; top: 28%; width: 14%; height: 58%; padding: 0; border: 0; background: transparent; box-shadow: none; cursor: pointer; }
.exit-door:hover { background: transparent; box-shadow: none; }
:deep(.mouse-world) { position: absolute; inset: 0; height: auto; margin: 0; background: none; border: 0; --hole-x: 41%; --floor-y: 94%; }
/* Mirror the whole approach lane, keeping the gait and turn pointed toward its doorway. */
:deep(.mouse-world__track) { left: calc(var(--hole-x) - 48px); width: calc(100% - var(--hole-x) + 48px); transform: scaleX(-1); }
@keyframes contact-signal { 0%, 94%, 97%, 100% { opacity: 1; } 95%, 98% { opacity: .65; } }
@media (min-width: 1800px) and (min-aspect-ratio: 2/1) {
  .contact-scene__stage { aspect-ratio: 1916/821; }
  .contact-sky { mask-image: url('/environments/floor-00-contact/floor00-ultrawide-sky-mask.svg'); }
  .contact-practical { left: 27%; top: 8%; width: 13%; height: 17%; }
  .exit-door { left: 10%; top: 25%; width: 13%; height: 65%; }
}
@media (min-width: 601px) and (max-width: 1100px) {
  .contact-scene__stage { aspect-ratio: 1448/1086; }
  .contact-sky { mask-image: url('/environments/floor-00-contact/floor00-tablet-sky-mask.svg'); }
  .contact-practical { left: 27%; top: 18%; width: 15%; height: 13%; }
  .exit-door { left: 10%; top: 32%; width: 14%; height: 48%; }
}
@media (max-width: 900px) {
  .contact-scene__stage { aspect-ratio: auto; }
  .contact-scene__art { bottom: auto; height: auto; aspect-ratio: 1448/1086; }
  .contact-scene__layout { position: relative; inset: auto; height: auto; display: flex; flex-direction: column; padding: calc(1086 / 1448 * 100% + 16px) 20px 28px; }
  .exit-door { position: absolute; left: 10%; top: 0; margin-top: 24%; width: 14%; height: 36cqi; }
  :deep(.mouse-world) { position: relative; inset: auto; width: 100%; height: 90px; margin: 0; background: none; border: 0; --hole-x: 50%; --floor-y: 82%; --mouse-size: 52px; }
  :deep(.mouse-world) { background: linear-gradient(#0a101155, #0a101122), url('/environments/floor-00-contact/floor00-tablet-day.webp') center bottom / 100% auto; }
  .contact-scene[data-phase="night"] :deep(.mouse-world), .contact-scene[data-phase="dusk"] :deep(.mouse-world) { background-image: linear-gradient(#0a101155, #0a101122), url('/environments/floor-00-contact/floor00-tablet-night.webp'); }
  .contact-scene__precipitation { max-height: 75cqi; }
}
@media (max-width: 600px) {
  .contact-scene__stage { aspect-ratio: auto; }
  .contact-scene__art { bottom: auto; height: auto; aspect-ratio: 941/1672; }
  .contact-sky { mask-image: url('/environments/floor-00-contact/floor00-mobile-sky-mask.svg'); }
  .contact-sky :deep(.weather-cloud-bank) { top: 18%; height: 20%; }
  .contact-practical { left: 35%; top: 27%; width: 19%; height: 7%; }
  .contact-scene[data-phase="night"] .contact-practical { left: 35%; top: 27%; }
  .contact-scene__layout { position: relative; inset: auto; height: auto; display: flex; flex-direction: column; padding: calc(1672 / 941 * 100% + 16px) 20px 28px; }
  .contact-level { top: 16px; left: 20px; font-size: 10px; }
  .exit-door { position: absolute; left: 9%; top: 0; margin-top: 103%; width: 17%; height: 33cqi; }
  :deep(.mouse-world) { position: relative; inset: auto; width: 100%; height: 90px; margin: 0; background: none; border: 0; --hole-x: 50%; --floor-y: 82%; --mouse-size: 52px; }
  :deep(.mouse-world) { background: linear-gradient(#0a101155, #0a101122), url('/environments/floor-00-contact/floor00-mobile-day.webp') center bottom / 100% auto; }
  .contact-scene[data-phase="night"] :deep(.mouse-world), .contact-scene[data-phase="dusk"] :deep(.mouse-world) { background-image: linear-gradient(#0a101155, #0a101122), url('/environments/floor-00-contact/floor00-mobile-night.webp'); }
  .contact-scene__precipitation { max-height: 177.68cqi; }
}
@media (prefers-reduced-motion: reduce) {
  .contact-practical { animation: none !important; }
  .contact-sky :deep(*) { animation: none !important; }
  .contact-night-veil { transition: none; }
}

/* Smoked glass and a weathered rim share the wall's artwork coordinate space. */
.contact-panel {
  --rim-side: .7cqi;
  --rim-top: .7cqi;
  --rim-bottom: 1.8cqi;
  position: absolute;
  left: 26.8%; top: 26.5%; width: 26.7%; height: 50.7%;
  min-width: 0; max-height: none; margin: 0;
  display: flex; flex-direction: column;
  padding: .75cqi .75cqi .45cqi;
  overflow: visible;
  border: 1px solid #313c40;
  border-right-color: #151c20;
  border-bottom-color: #13191c;
  border-radius: .2cqi;
  background:
    linear-gradient(90deg, #121519 0 var(--rim-side), transparent var(--rim-side) calc(100% - var(--rim-side)), #090b10 calc(100% - var(--rim-side))),
    linear-gradient(0deg, #0b0c10 0 var(--rim-bottom), transparent var(--rim-bottom) calc(100% - var(--rim-top)), #181e22 calc(100% - var(--rim-top)));
  box-shadow: inset 1px 1px 0 #61e5ed40, inset -2px -2px 0 #020507,
    1px 2px 0 #030708, 4px 5px 0 #050809, 6px 8px 4px #000d,
    10px 13px 15px #0009, -1px -1px 4px #75cfce18;
  transform: perspective(70cqi) rotateY(18deg) skewY(5deg) var(--contact-top-warp);
  transform-origin: top left;
  color: #e1f0ed; text-shadow: none;
}
.contact-panel::before {
  content: ""; position: absolute; inset: -.25cqi;
  z-index: -1; border-radius: inherit;
  background: transparent;
  box-shadow: 0 0 0 3px #02050566, 3px 4px 5px #0009, -3px -2px 8px #02070666;
  pointer-events: none;
}
.contact-panel::after {
  content: ""; position: absolute; inset: 0; padding: .6cqi;
  border-radius: inherit; pointer-events: none;
  background: radial-gradient(ellipse at 0 100%, #ad714b66, transparent 24%),
    radial-gradient(ellipse at 95% 5%, #a65b4840, transparent 20%),
    repeating-linear-gradient(163deg, transparent 0 17px, #c1a08738 18px, transparent 19px 41px);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
}
.contact-panel__bolt { position: absolute; z-index: 3; width: 4px; height: 4px; border-radius: 50%; background: linear-gradient(135deg, #89958c, #222c26 45%, #070c09 55%, #627166); box-shadow: 0 1px 1px #000; }
.contact-panel__bolt--tl { left: .25cqi; top: .25cqi; }
.contact-panel__bolt--tr { right: .25cqi; top: .25cqi; }
.contact-panel__bolt--bl { left: .25cqi; bottom: .25cqi; }
.contact-panel__bolt--br { right: .25cqi; bottom: .25cqi; }
.contact-screen {
  position: relative; isolation: isolate; flex: 1; min-height: 0;
  display: flex; flex-direction: column; justify-content: space-between;
  gap: .65cqi; padding: 1.05cqi;
  border: 1px solid #31464f; border-top-color: #61e5f2a6; border-right-color: #b74a814d;
  border-radius: .16cqi;
  background: radial-gradient(ellipse at 100% 70%, #6b163b26, transparent 58%), linear-gradient(125deg, #050b11e8, #03060bf2 60%, #100711e6);
  -webkit-backdrop-filter: blur(2px) saturate(.6);
  backdrop-filter: blur(2px) saturate(.6);
  box-shadow: inset 0 0 0 2px #010608, inset 2px 4px 12px #000b,
    inset -1px -1px 1px #a32b7138, 0 -1px 9px #42dfee38, 2px 0 7px #c33d7f14;
}
.contact-screen__grit { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; opacity: .075; mix-blend-mode: screen; pointer-events: none; }
.contact-screen::before {
  content: ""; position: absolute; inset: 0; z-index: 2; pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(ellipse at 18% -8%, #48cdda1c, transparent 48%),
    linear-gradient(112deg, transparent 0 13%, #b5dff504 14% 24%, transparent 25% 76%, #eaa8d906 77%, transparent 78%),
    radial-gradient(ellipse at 110% 58%, #ec3e9621, transparent 48%);
  box-shadow: inset 0 1px 0 #cbf3f659, inset 1px 0 0 #caedf324;
}
.contact-screen::after {
  content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: repeating-linear-gradient(0deg, #b5deec04 0 1px, transparent 1px 4px),
    radial-gradient(ellipse at 0 95%, #b5a28c12, transparent 23%),
    linear-gradient(177deg, transparent 0 87%, #b6dce509 87.1%, transparent 87.4%);
}
.contact-screen > * { flex-shrink: 0; }
.contact-screen__header { display: flex; align-items: center; justify-content: space-between; gap: .5rem; padding-bottom: .5cqi; border-bottom: 1px solid #7ec6ba30; }
.contact-screen__eyebrow, .contact-screen__station { margin: 0; font: 400 clamp(9px, .65cqi, 14px)/1.3 "IBM Plex Mono", monospace; letter-spacing: .12em; text-transform: uppercase; }
.contact-screen__eyebrow { color: #65e3ed; text-shadow: 0 0 8px #4bdeef52; }
.contact-screen__station { color: #819f97; }
.contact-screen__title { margin: 0; color: #abf5ff; font: 500 clamp(28px, 2.6cqi, 68px)/.98 "Barlow Condensed", sans-serif; text-transform: uppercase; letter-spacing: .015em; text-shadow: 0 0 2px #c8f3fb88, 0 0 8px #2fbedf66, 0 0 20px #22a9d02e, 0 1px 1px #000; }
.contact-screen__title em { color: #ff8ec8; font-style: normal; text-shadow: 0 0 3px #ffd6e866, 0 0 10px #ee358d66, 0 0 22px #dd318a33; }
.contact-screen__copy { margin: 0; max-width: none; color: #c5d8d1; font-size: clamp(12px, .85cqi, 18px); line-height: 1.5; }
.contact-email { display: grid; grid-template-columns: 1fr auto; gap: .2rem .5rem; padding: .65cqi .75cqi; min-height: 48px; border: 1px solid #84d3e035; border-bottom-color: #8cdeed99; background: linear-gradient(100deg, #3160752b, #14223242); color: #d6f6ff; text-decoration: none; font-size: clamp(13px, .95cqi, 20px); box-shadow: inset 0 -1px 5px #79d3ec0f, 0 3px 9px #72cfe30d; transition: background .2s, box-shadow .2s; }
.contact-email small { grid-column: 1/-1; color: #a5cdbd; overflow-wrap: anywhere; font: 400 clamp(10px, .7cqi, 15px)/1.4 "IBM Plex Mono", monospace; }
.contact-email:hover { background: #26455780; box-shadow: 0 2px 12px #73d4ea29; }
.contact-socials { display: flex; flex-wrap: wrap; gap: .35cqi; }
.contact-socials a { position: static; display: flex; align-items: center; justify-content: space-between; gap: .35rem; flex: 1; min-width: 44px; width: auto; height: auto; min-height: 50px; padding: .3rem .45rem; border: 1px solid transparent; border-bottom-color: #8eabb43d; border-radius: 0; background: #060b1533; color: #b8dcd0; box-shadow: none; text-shadow: none; text-decoration: none; font: 400 clamp(10px, .7cqi, 15px)/1.4 "IBM Plex Mono", monospace; transition: border-color .2s, background .2s; }
.contact-socials a > span { position: static; width: auto; height: auto; overflow: visible; clip: auto; }
.contact-socials a:nth-child(2) { color: #ebbad1; }
.contact-socials a:nth-child(3) { color: #accfe8; }
.contact-socials a:hover { transform: none; box-shadow: 0 2px 7px #79c4df13; border-color: #83cbd63f; background: #25415155; }
.contact-socials a:focus-visible, .contact-email:focus-visible, .exit-door:focus-visible { outline: 2px solid #d8ffec; outline-offset: 3px; }
.contact-screen__signature { display: flex; align-items: center; flex-wrap: wrap; gap: .35rem; margin: 0; color: #87afa1; font: 400 clamp(8px, .54cqi, 12px)/1.4 "IBM Plex Mono", monospace; }
.contact-screen__signature > span:first-child { color: #ecaac7; }
.contact-screen__signature > span:last-child { margin-left: auto; color: #7c9c90; }
.contact-panel__label { display: flex; align-items: center; gap: .35cqi; padding-top: .4cqi; color: #a1afa1; font: 400 clamp(7px, .48cqi, 10px)/1.4 "IBM Plex Mono", monospace; letter-spacing: .07em; }
.contact-panel__label > span { margin-left: auto; color: #7e8e80; }
.contact-panel__label i { width: 3px; height: 3px; border-radius: 50%; background: #78c8ab; box-shadow: 0 0 4px #85cfa580; }
@media (min-width: 1800px) and (min-aspect-ratio: 2/1) {
  .contact-panel { left: 25%; top: 21.5%; width: 26.2%; height: 50.7%; transform: perspective(70cqi) rotateY(15deg) skewY(5deg) var(--contact-top-warp); }
  .contact-screen { gap: .3cqi; padding: .7cqi; }
  .contact-screen__title { font-size: clamp(30px, 1.8cqi, 60px); }
  .contact-screen__copy { font-size: clamp(12px, .64cqi, 16px); }
  .contact-screen__eyebrow, .contact-screen__station { font-size: clamp(9px, .5cqi, 12px); }
  .contact-email { font-size: clamp(14px, .7cqi, 18px); padding: .45cqi .6cqi; }
  .contact-email small { font-size: clamp(10px, .55cqi, 13px); }
}
@media (min-width: 901px) and (max-width: 1100px) {
  .contact-panel { left: 27%; top: 31%; width: 29.2%; height: 49%; padding: 8px 8px 5px; }
  .contact-screen { padding: 11px; gap: 8px; }
  .contact-screen__title { font-size: 29px; }
  .contact-screen__copy { font-size: 12px; line-height: 1.4; }
  .contact-screen__signature > span:last-child { display: none; }
  .contact-email { padding: 8px; }
  .contact-socials { gap: 4px; }
  .contact-socials a { font-size: 9px; padding-inline: 4px; }
}
@media (max-width: 900px) {
  .contact-panel { --rim-side: 10px; --rim-top: 10px; --rim-bottom: 27px; position: relative; inset: auto; width: 100%; height: auto; max-width: 600px; align-self: center; margin: 0; padding: 10px 10px 7px; transform: none; border-radius: 5px; }
  .contact-screen { padding: clamp(16px, 4vw, 30px); gap: 18px; border-radius: 2px; }
  .contact-screen__header { padding-bottom: 10px; }
  .contact-screen__eyebrow, .contact-screen__station { font-size: 11px; }
  .contact-screen__title { font-size: clamp(34px, 7vw, 52px); }
  .contact-screen__copy { font-size: 14px; }
  .contact-email { font-size: 15px; padding: 12px; }
  .contact-email small { font-size: 11px; }
  .contact-socials { gap: 6px; }
  .contact-socials a { font-size: 10px; }
  .contact-screen__signature { font-size: 9px; }
  .contact-screen__signature > span:last-child { display: none; }
  .contact-panel__label { padding-top: 7px; gap: 6px; font-size: 8px; }
}
@media (prefers-reduced-motion: reduce) { .contact-email, .contact-socials a { transition: none; } }

/* The native desktop plate is already uncropped. Keep its camera and shared
   coordinates; uncover a little more mounting wall without shrinking type. */
@media (min-width: 1101px) {
  .contact-panel { width: 25%; }
  .contact-screen { gap: .45cqi; }
}

/* One interactive tree survives rotation. The complete establishing plate,
   sky mask, lamp, doorway and precipitation share the same art rectangle. */
.contact-scene--phone {
  --street-art-height: calc(100cqi * 814 / 1448);
  min-height: 0;
  scroll-margin-top: 3.5rem;
  background: #171c1d;
}
.contact-scene--phone .contact-scene__stage {
  aspect-ratio: auto;
  background:
    linear-gradient(90deg, #060a0c80, transparent 8% 92%, #060a0c80),
    repeating-linear-gradient(0deg, transparent 0 95px, #05080855 96px, #65716d22 97px, transparent 98px),
    linear-gradient(110deg, #28302f, #171c1e 55%, #272b2c);
}
.contact-scene--phone[data-phase="night"] .contact-scene__stage,
.contact-scene--phone[data-phase="dusk"] .contact-scene__stage {
  background:
    radial-gradient(ellipse at 15% 25%, #1e718028, transparent 55%),
    radial-gradient(ellipse at 100% 50%, #8428551c, transparent 50%),
    repeating-linear-gradient(0deg, transparent 0 95px, #05080888 96px, #65716d12 97px, transparent 98px),
    linear-gradient(110deg, #151e21, #101519 55%, #1d171e);
}
.contact-scene--phone .contact-scene__art {
  height: var(--street-art-height); aspect-ratio: auto;
  bottom: auto; border: 0; box-shadow: 0 2px #050a0b;
}
.contact-scene--phone .contact-scene__plate { object-fit: contain; }
.contact-scene--phone .contact-sky { mask-image: url('/environments/floor-00-contact/floor00-desktop-16x9-sky-mask.svg'); }
.contact-scene--phone .contact-sky :deep(.weather-cloud-bank) { top: 14%; height: 40%; }
.contact-scene--phone .contact-practical,
.contact-scene--phone[data-phase="night"] .contact-practical { left: 28%; top: 14%; width: 17%; height: 15%; }
.contact-scene--phone .contact-scene__precipitation { height: var(--street-art-height); max-height: none; }
.contact-scene--phone .contact-scene__layout {
  position: relative; display: flex; flex-direction: column; gap: 0;
  padding: calc(var(--street-art-height) + 12px) max(16px, env(safe-area-inset-right)) 0 max(16px, env(safe-area-inset-left));
}
.contact-scene--phone .contact-level { top: 10px; left: 16px; font-size: 10px; }
.contact-scene--phone .contact-panel {
  --rim-side: 7px; --rim-top: 7px; --rim-bottom: 23px;
  position: relative; inset: auto; transform: none; width: 100%; max-width: 600px;
  height: auto; margin: 0; padding: 7px 7px 5px; border-radius: 3px;
  box-shadow: inset 1px 1px #61e5ed40, 2px 3px #020507, 4px 5px 4px #000c, 7px 9px 12px #0007;
}
.contact-scene--phone .contact-screen { padding: 14px; gap: 12px; }
.contact-scene--phone .contact-screen__header { padding-bottom: 6px; }
.contact-scene--phone .contact-screen__title { font-size: clamp(32px, 8.7vw, 40px); }
.contact-scene--phone .contact-screen__copy { font-size: 16px; line-height: 1.4; }
.contact-scene--phone .contact-screen__eyebrow,
.contact-scene--phone .contact-screen__station { font-size: 11px; }
.contact-scene--phone .contact-email { padding: 10px; min-height: 60px; font-size: 16px; }
.contact-scene--phone .contact-email small { font-size: 12px; }
.contact-scene--phone .contact-socials { gap: 4px; }
.contact-scene--phone .contact-socials a { min-height: 44px; font-size: 12px; padding: 4px; }
.contact-scene--phone .contact-screen__signature { font-size: 10px; }
.contact-scene--phone .contact-panel__label { padding-top: 5px; font-size: 8px; }
.contact-scene--phone .exit-door { left: 10%; top: 0; margin-top: calc(var(--street-art-height) * .28); width: 14%; height: calc(var(--street-art-height) * .58); }
.contact-rotation { max-width: 600px; width: 100%; align-self: center; margin: 14px 0 0; padding-block: 10px; }
.contact-rooftop { display: flex; align-items: center; align-self: center; min-height: 44px; padding: 8px 12px; color: #bce8e8; font: 14px/1.5 "IBM Plex Mono", monospace; text-underline-offset: 4px; }
.contact-rooftop:focus-visible { outline: 2px solid #d8ffec; outline-offset: 3px; }
/* A local wall threshold replaces the duplicated photograph of the pavement.
   The original mouse and accessible hatch retain their lifecycle and dialog. */
.contact-scene--phone :deep(.mouse-world) {
  position: relative; inset: auto; flex: 0 0 44px; width: 100%; height: 44px;
  margin: 0; border: 0; background: none !important;
  --hole-x: 82%; --floor-y: 88%; --mouse-size: 48px;
}
.contact-scene--phone :deep(.mouse-world:not(.mouse-world--night)) { display: none; }
.contact-scene--phone :deep(.mouse-hatch__hint) { opacity: 1; left: auto; right: 100%; bottom: 0; transform: none; font-size: 11px; }
.contact-scene--phone :deep(.alley-footer) {
  min-height: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 20px;
  padding: 14px max(16px, env(safe-area-inset-right)) max(18px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  font-size: 10px; line-height: 1.5;
}
.contact-scene--phone :deep(.alley-footer p:last-child) { display: none; }
.contact-scene--phone :deep(.alley-footer__environment) { display: block; }
:global(.app-shell:has(.contact-scene--phone)[data-active-floor="street"] > .floor-nav) { display: none; }
:global(.app-shell:has(.contact-scene--phone)[data-active-floor="street"] > .environment-preview-toggle) { top: 3.75rem; bottom: auto; right: 8px; font-size: 9px; padding: 7px 9px; }

.contact-scene--landscape { --street-art-height: calc(100cqi * 821 / 1916); }
.contact-scene--landscape .contact-sky { mask-image: url('/environments/floor-00-contact/floor00-ultrawide-sky-mask.svg'); }
.contact-scene--landscape .contact-practical,
.contact-scene--landscape[data-phase="night"] .contact-practical { left: 27%; top: 8%; width: 13%; height: 17%; }
.contact-scene--landscape .exit-door { margin-top: calc(var(--street-art-height) * .25); width: 13%; height: calc(var(--street-art-height) * .65); }
.contact-scene--landscape .contact-panel { max-width: none; }
.contact-scene--landscape .contact-screen { display: grid; grid-template-columns: 1fr 1fr; align-items: start; gap: 10px 24px; }
.contact-scene--landscape .contact-screen__header { grid-column: 1 / -1; }
.contact-scene--landscape .contact-screen__title { grid-column: 1; grid-row: 2; font-size: 34px; }
.contact-scene--landscape .contact-screen__copy { grid-column: 1; grid-row: 3 / 5; }
.contact-scene--landscape .contact-email { grid-column: 2; grid-row: 2; }
.contact-scene--landscape .contact-socials { grid-column: 2; grid-row: 3; }
.contact-scene--landscape .contact-screen__signature { grid-column: 2; grid-row: 4; }

</style>
