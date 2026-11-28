<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useEnvironment } from "../../composables/useEnvironment";
import MouseRunner from "./MouseRunner.vue";
import WeatherEffects from "../environment/WeatherEffects.vue";
import { MOUSE_VISIT_MS } from "../../services/mouseMotion";

const { state, previewIntensity } = useEnvironment();
const host = ref<HTMLElement>();
const hatch = ref<HTMLButtonElement>();
const room = ref<HTMLDialogElement>();
const visible = ref(false);
const awake = ref(false);
const running = ref(false);
const open = ref(false);
const imageReady = ref(false);
const imageFailed = ref(false);
const spriteReady = ref(false);
const hidden = ref(document.hidden);
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
const reduced = ref(motion.matches);
const isNight = computed(() => state.value.timePhase === "night");
const eligible = computed(() => isNight.value && visible.value && !hidden.value);
const weatherPaused = computed(() => hidden.value || reduced.value);
let observer: IntersectionObserver | undefined;
let timer: number | undefined;
let previousOverflow = "";
let disposed = false;

function clearTimer() { window.clearTimeout(timer); }
function scheduleVisit(delay = 2200) {
  clearTimer();
  awake.value = false;
  running.value = false;
  if (!eligible.value || open.value || !spriteReady.value) return;
  // Keep the discovery available without a timed chase for reduced motion.
  if (reduced.value) { awake.value = true; return; }
  timer = window.setTimeout(() => {
    awake.value = true;
    running.value = true;
    timer = window.setTimeout(() => {
      running.value = false;
      timer = window.setTimeout(() => {
        scheduleVisit(26000);
      }, 4500);
    }, MOUSE_VISIT_MS);
  }, delay);
}
function enter() {
  if (!isNight.value || open.value || !room.value) return;
  clearTimer();
  open.value = true;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  room.value.showModal();
  void nextTick(() => room.value?.querySelector<HTMLButtonElement>(".mouse-office__close")?.focus());
}
function exit() {
  if (!open.value) return;
  room.value?.close();
  open.value = false;
  document.body.style.overflow = previousOverflow;
  if (!disposed && isNight.value && !hidden.value) {
    scheduleVisit(26000);
    void nextTick(() => hatch.value?.focus({ preventScroll: true }));
  }
}
function visibilityChanged() { hidden.value = document.hidden; }
function motionChanged() { reduced.value = motion.matches; }
watch([eligible, reduced, spriteReady, isNight, hidden], () => {
  // Rotation can move the approach lane outside the viewport behind the modal.
  // Keep that same dialog alive; only night ending or a hidden tab ends a visit.
  if (open.value) {
    if (!isNight.value || hidden.value) exit();
    return;
  }
  scheduleVisit();
});
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => { visible.value = entry.isIntersecting; }, { threshold: .15 });
  if (host.value) observer.observe(host.value);
  document.addEventListener("visibilitychange", visibilityChanged);
  motion.addEventListener("change", motionChanged);
});
onBeforeUnmount(() => {
  disposed = true;
  clearTimer();
  observer?.disconnect();
  document.removeEventListener("visibilitychange", visibilityChanged);
  motion.removeEventListener("change", motionChanged);
  exit();
});
</script>

<template>
  <div ref="host" class="mouse-world" :class="{ 'mouse-world--night': isNight, 'mouse-world--awake': awake && eligible, 'mouse-world--running': running, 'mouse-world--still': reduced }">
    <div class="mouse-world__track" aria-hidden="true">
      <MouseRunner :active="running && !open && eligible && !reduced" @ready="spriteReady = true" />
    </div>
    <button ref="hatch" class="mouse-hatch" type="button" :disabled="!isNight || open" :tabindex="isNight && !open ? 0 : -1" :aria-hidden="!isNight" aria-label="Follow the mouse into its secret office" aria-haspopup="dialog" @click="enter">
      <span class="mouse-hatch__opening" aria-hidden="true"><i /></span>
      <span class="mouse-hatch__hint">Someone’s working late…</span>
    </button>
  </div>
  <Teleport to="body">
    <dialog ref="room" class="mouse-office" aria-labelledby="mouse-office-title" @cancel.prevent="exit" @close="exit" @click="($event.target === room) && exit()">
      <div v-if="open" class="mouse-office__interior">
        <div class="mouse-office__scene">
          <img class="mouse-office__image" :class="{ 'mouse-office__image--ready': imageReady }" src="/contact/mouse/night-office.png" alt="A soft brown house mouse works at glowing computer screens in a miniature version of the Athens rooftop office, with a cheese snack and a bottle-cap mug." @load="imageReady = true; imageFailed = false" @error="imageFailed = true" />
          <div class="mouse-office__weather-window" :data-weather="state.weatherCondition" aria-hidden="true">
            <div class="mouse-office__weather-grade" />
            <WeatherEffects class="mouse-office__weather-effect" :state="state" :intensity="previewIntensity" :paused="weatherPaused" mode="sky" />
            <WeatherEffects class="mouse-office__weather-effect" :state="state" :intensity="previewIntensity" :paused="weatherPaused" mode="atmosphere" />
            <WeatherEffects class="mouse-office__weather-effect" :state="state" :intensity="previewIntensity" :paused="weatherPaused" mode="precipitation" />
          </div>
        </div>
        <p v-if="!imageReady" class="mouse-office__loading" role="status">{{ imageFailed ? 'The tiny office could not load. Please visit again.' : 'A light is on behind the wall…' }}</p>
        <header class="mouse-office__caption"><p>Hidden floor · The night shift</p><h2 id="mouse-office-title">A different kind of mouse work.</h2><span>Same city. Smaller desk. One more night owl.</span></header>
        <button class="mouse-office__close" type="button" autofocus @click="exit">Back to the pavement <span aria-hidden="true">×</span></button>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.mouse-world { position: absolute; inset: 0; z-index: 8; pointer-events: none; --hole-x: 54%; --floor-y: 86%; --floor-depth: clamp(6px, 12cqi, 140px); --mouse-size: clamp(52px, 5.8cqi, 100px); --hatch-yaw: -24deg; --hatch-slope: -3deg; }
.mouse-world__track { position: absolute; z-index: 2; left: 0; top: calc(var(--floor-y) - var(--mouse-size) - 12px); width: calc(var(--hole-x) + 48px); height: calc(var(--mouse-size) + 27px); overflow: hidden; }
.mouse-hatch { position: absolute; left: var(--hole-x); top: var(--floor-y); width: clamp(32px, calc(var(--mouse-size) * .68), 56px); height: clamp(34px, calc(var(--mouse-size) * .76), 64px); transform: translate(-50%, -100%); transform-origin: 50% 100%; border: 0; padding: 4px 4px 0; background: none; opacity: 0; visibility: hidden; pointer-events: none; filter: brightness(.56); transition: opacity .7s, visibility .7s, filter .7s; cursor: pointer; }
.mouse-world--night .mouse-hatch { visibility: visible; opacity: 1; pointer-events: auto; }
.mouse-world--awake .mouse-hatch, .mouse-hatch:hover, .mouse-hatch:focus-visible { filter: brightness(1); }
.mouse-hatch__opening { display: block; position: relative; width: 100%; height: 100%; transform: perspective(220px) rotateY(var(--hatch-yaw)) skewY(var(--hatch-slope)); transform-origin: 50% 100%; border-radius: 50% 50% 3px 3px; border: 3px solid #493e30; background: radial-gradient(ellipse at 50% 105%, #d9974d65, #100c08 58%, #030404 90%); box-shadow: 1px 2px 3px #000, inset 2px 3px 6px #000, 0 5px 12px #eaa64c20; perspective: 150px; }
.mouse-hatch__opening i { position: absolute; inset: 0; transform-origin: left; border-radius: inherit; background: repeating-linear-gradient(90deg, #382f25 0 7px, #211d17 8px 9px); border: 1px solid #645039; transform: rotateY(-78deg); box-shadow: 2px 0 5px #0007; }
.mouse-hatch__hint { position: absolute; left: 50%; bottom: 115%; transform: translateX(-50%); white-space: nowrap; padding: 7px 10px; border: 1px solid #bc966e66; border-radius: 5px; background: #111611ef; color: #efd7ae; font: 11px/1.4 "IBM Plex Mono", monospace; opacity: 0; transition: opacity .2s; }
.mouse-hatch:hover .mouse-hatch__hint, .mouse-hatch:focus-visible .mouse-hatch__hint { opacity: 1; }
.mouse-hatch:focus-visible { outline: 2px solid #edc18c; outline-offset: 4px; border-radius: 50% 50% 4px 4px; }
.mouse-office { position: fixed; inset: 0; margin: auto; padding: 0; width: 100vw; max-width: 100vw; height: 100dvh; max-height: 100dvh; border: 0; color: #efe1c7; background: #060908; overflow: hidden; }
.mouse-office::backdrop { background: #030504; }
.mouse-office[open] { animation: mouse-room-fade .8s ease both; }
.mouse-office__interior { width: 100%; height: 100%; display: grid; place-items: center; }
.mouse-office__scene { position: absolute; inset: 0; margin: auto; width: min(100vw, 150dvh); max-height: 100dvh; aspect-ratio: 3 / 2; overflow: hidden; }
.mouse-office__image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: opacity .8s; }
.mouse-office__image--ready { opacity: 1; }
.mouse-office__weather-window { position: absolute; z-index: 1; left: 18%; top: 16%; width: 60%; height: 31%; overflow: hidden; isolation: isolate; pointer-events: none; mask-image: linear-gradient(90deg, #000 0 28%, transparent 28% 30%, #000 30% 74%, transparent 74% 76%, #000 76%); }
.mouse-office__weather-grade, .mouse-office__weather-effect { position: absolute; inset: 0; }
.mouse-office__weather-grade { z-index: 0; transition: background .5s ease; }
.mouse-office__weather-window[data-weather="partlyCloudy"] .mouse-office__weather-grade { background: linear-gradient(135deg, #92a6b014, #5c708220); }
.mouse-office__weather-window[data-weather="cloudy"] .mouse-office__weather-grade { background: linear-gradient(#34465732, #53647728); }
.mouse-office__weather-window[data-weather="fog"] .mouse-office__weather-grade { background: linear-gradient(#a9b8c03d, #98aab34a); }
.mouse-office__weather-window[data-weather="rain"] .mouse-office__weather-grade { background: linear-gradient(#263d5238, #40566a30); }
.mouse-office__weather-window[data-weather="storm"] .mouse-office__weather-grade { background: linear-gradient(#15263858, #24394d48); }
.mouse-office__weather-window[data-weather="snow"] .mouse-office__weather-grade { background: linear-gradient(#c5d4df25, #9eafbe30); }
.mouse-office__weather-effect { z-index: 1; }
.mouse-office__weather-window :deep(.weather-effects) { z-index: 1; inset: 0; clip-path: none; mask: none; }
.mouse-office__weather-window :deep(.weather-clouds) { opacity: calc(var(--effect-cloud) * .26); }
.mouse-office__weather-window :deep(.weather-clouds--dense) { background: none; }
.mouse-office__weather-window :deep(.weather-cloud-bank) { top: 5%; height: 72%; opacity: .38; }
.mouse-office__weather-window :deep(.weather-fog--far) { top: 5%; height: 80%; }
.mouse-office__weather-window :deep(.weather-fog--near) { top: 38%; height: 60%; }
.mouse-office__weather-window :deep(.weather-rain), .mouse-office__weather-window :deep(.weather-rain--far), .mouse-office__weather-window :deep(.weather-rain--near) { display: none; }
.mouse-office__caption { position: absolute; left: clamp(20px, 4vw, 64px); bottom: clamp(24px, 5vh, 64px); padding: 16px 20px; max-width: calc(100% - 40px); background: #060b0ce0; border-left: 2px solid #c19b5d; box-shadow: 0 8px 40px #0007; }
.mouse-office__caption p { font: 10px/1.6 "IBM Plex Mono", monospace; text-transform: uppercase; letter-spacing: .16em; color: #d4b17b; margin: 0 0 8px; }
.mouse-office__caption h2 { font-size: clamp(19px, 2vw, 29px); line-height: 1.3; margin: 0 0 6px; }
.mouse-office__caption span { font-size: 12px; color: #b9b9ad; }
.mouse-office__close { position: absolute; right: 24px; top: 24px; border: 1px solid #b2936970; background: #0a100fed; color: #ecdcbe; border-radius: 6px; padding: 12px 16px; cursor: pointer; font: 12px/1.4 "IBM Plex Mono", monospace; }
.mouse-office__close span { margin-left: 16px; font-size: 20px; }
.mouse-office__close:focus-visible { outline: 2px solid #edc18c; outline-offset: 4px; }
.mouse-office__loading { position: absolute; inset: 45% 20px auto; text-align: center; color: #d4b17b; }
@keyframes mouse-room-fade { from { opacity: 0; } to { opacity: 1; } }
@media (max-width: 900px) {
  .mouse-world { position: relative; inset: auto; height: 96px; flex-shrink: 0; margin-top: -1.5rem; --hole-x: 50%; --floor-y: 75%; --mouse-size: 64px; background: linear-gradient(#10131322, #10131388), url('/contact/alley-day-extended.webp') 65% 76% / auto 420px; border-bottom: 1px solid #96754e30; }
  .mouse-world--night { background-image: linear-gradient(#10131322, #10131388), url('/contact/alley-night-extended.webp'); }
  .mouse-office__scene { width: 100vw; height: 100dvh; max-height: none; aspect-ratio: auto; }
  .mouse-office__image { object-fit: cover; object-position: 46% center; }
  .mouse-office__caption { bottom: 26px; }
  .mouse-office__close { right: 16px; top: 16px; }
}
@media (max-width: 600px) and (orientation: portrait) {
  .mouse-office__weather-window { left: 0; width: 100%; top: 16%; height: 32%; mask-image: linear-gradient(90deg, #000 0 12.5%, transparent 12.5% 14.5%, #000 14.5%); }
}
@media (min-width: 601px) and (max-width: 900px) and (orientation: portrait) {
  .mouse-office__weather-window { left: 11%; width: 75%; top: 16%; height: 31%; }
}
@media (max-width: 900px) and (orientation: landscape) {
  .mouse-office__weather-window { left: 18%; width: 60%; top: 0; height: 46%; }
}
@media (prefers-reduced-motion: reduce) {
  .mouse-office[open] { animation: none !important; }
  .mouse-hatch, .mouse-office__image { transition: none; }
}
</style>
