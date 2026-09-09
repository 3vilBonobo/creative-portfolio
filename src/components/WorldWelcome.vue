<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useEnvironment } from "../composables/useEnvironment";

const { state } = useEnvironment();
const card = ref<HTMLDialogElement | null>(null);
let revealTimer: ReturnType<typeof setTimeout> | undefined;
let previousOverflow: string | undefined;

function restoreScroll() {
  if (previousOverflow !== undefined) {
    document.documentElement.style.overflow = previousOverflow;
    previousOverflow = undefined;
  }
}

function dismiss() {
  card.value?.close();
  restoreScroll();
}

function handleBackdropClick(event: MouseEvent) {
  if (!card.value || event.target !== card.value) return;
  const bounds = card.value.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dismiss();
}

function reveal() {
  revealTimer = setTimeout(() => {
    card.value?.showModal();
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
  }, 650);
}

onMounted(() => {
  if (document.readyState === "complete") reveal();
  else window.addEventListener("load", reveal, { once: true });
});

onBeforeUnmount(() => {
  clearTimeout(revealTimer);
  window.removeEventListener("load", reveal);
  dismiss();
});
</script>

<template>
  <Teleport to="body">
    <dialog ref="card" class="world-welcome" :data-phase="state.timePhase" aria-labelledby="world-welcome-title" aria-describedby="world-welcome-intro world-welcome-details" @click="handleBackdropClick" @close="restoreScroll" @cancel.prevent="dismiss">
      <div class="world-welcome__skyline" aria-hidden="true">
        <svg viewBox="0 0 440 90" fill="none"><path d="M0 78h35V53h22v25h20V35h25v43h19V60h28v18h18V46h10V32h7v14h10v32h21V55h14v-9h62v9h14v23h20V28h25v50h16V44h26v34h19V60h29"/><path d="M229 46l31-14 31 14m-55 9v23m12-23v23m12-23v23m12-23v23m12-23v23M215 82h90M89 35V18m248 10V8"/><circle cx="365" cy="19" r="10"/></svg>
      </div>
      <button class="world-welcome__close" type="button" aria-label="Dismiss welcome" @click="dismiss">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>
      </button>
      <p class="world-welcome__eyebrow"><span class="world-welcome__signal" aria-hidden="true" /> A little world, alive</p>
      <h2 id="world-welcome-title">Welcome to my corner<br>of <em>futuristic Athens.</em></h2>
      <div class="world-welcome__coordinates" aria-hidden="true"><span>37.98° N / 23.73° E</span><span>ATHENS · {{ state.localTime }}</span></div>
      <p id="world-welcome-intro" class="world-welcome__copy">I’m Irinella. Make yourself at home — there are little things to play with and quiet details to discover.</p>
      <p id="world-welcome-details" class="world-welcome__copy">Stay curious, and come back after sunset. This world follows Athens through daylight, weather and night. Each visit has a different mood.</p>
      <p class="world-welcome__mobile">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>
        <span>A small screen is a lovely start. For the full experience, explore on desktop.</span>
      </p>
      <button class="world-welcome__enter" type="button" autofocus @click="dismiss">Step inside <span aria-hidden="true">↗</span></button>
      <span class="world-welcome__hint">Or click outside / press Esc</span>
    </dialog>
  </Teleport>
</template>

<style scoped>
.world-welcome {
  --welcome-accent: #91e7dc;
  --welcome-secondary: #c2b4ed;
  --welcome-surface: #101e28;
  --welcome-ink: #edf4ef;
  --welcome-copy: #c1ced2;
  position: fixed;
  inset: 0;
  margin: auto;
  width: min(460px, calc(100vw - 2rem));
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  padding: 94px 36px 25px;
  border: 1px solid color-mix(in srgb, var(--welcome-accent) 38%, transparent);
  border-radius: 24px 6px 24px 6px;
  background: radial-gradient(ellipse at 100% 0%, color-mix(in srgb, var(--welcome-accent) 15%, transparent), transparent 58%), var(--welcome-surface);
  box-shadow: 0 30px 120px #0008, 0 0 65px color-mix(in srgb, var(--welcome-accent) 9%, transparent), inset 0 1px 0 #ffffff17;
  color: var(--welcome-ink);
}
.world-welcome[data-phase="day"], .world-welcome[data-phase="goldenHour"] {
  --welcome-accent: #ffd097;
  --welcome-secondary: #a7e0d4;
  --welcome-surface: #292b27;
  --welcome-ink: #fff5e5;
  --welcome-copy: #dbd5c7;
}
.world-welcome[data-phase="dawn"], .world-welcome[data-phase="dusk"] {
  --welcome-accent: #f0b7b0;
  --welcome-secondary: #bfb8ed;
  --welcome-surface: #28232f;
  --welcome-copy: #d8ccd9;
}
.world-welcome::backdrop { background: #070e1670; backdrop-filter: blur(5px); }
.world-welcome[open] { animation: welcome-arrive 380ms cubic-bezier(.2,.8,.2,1) both; }
.world-welcome[open]::backdrop { animation: welcome-backdrop 380ms ease both; }
.world-welcome__skyline { position: absolute; inset: 0 0 auto; height: 90px; overflow: hidden; pointer-events: none; opacity: .45; }
.world-welcome__skyline svg { width: 100%; height: 100%; stroke: var(--welcome-accent); stroke-width: .8; }
.world-welcome__close { position: absolute; top: 10px; right: 10px; display: grid; place-items: center; width: 44px; height: 44px; border: 0; border-radius: 50%; color: var(--welcome-ink); background: var(--welcome-surface); cursor: pointer; }
.world-welcome__close:hover { background: color-mix(in srgb, var(--welcome-accent) 15%, var(--welcome-surface)); }
.world-welcome__close svg { width: 19px; stroke: currentColor; stroke-width: 1.5; }
.world-welcome__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 17px; color: var(--welcome-accent); font: 400 10px/1.5 "IBM Plex Mono", monospace; letter-spacing: .15em; text-transform: uppercase; }
.world-welcome__signal { width: 6px; height: 6px; border-radius: 50%; background: var(--welcome-accent); box-shadow: 0 0 12px var(--welcome-accent); }
.world-welcome h2 { margin: 0 0 19px; font: 500 clamp(25px, 5vw, 31px)/1.3 Manrope, sans-serif; letter-spacing: -.045em; }
.world-welcome h2 em { font-style: normal; color: var(--welcome-accent); }
.world-welcome__coordinates { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 21px; padding-bottom: 14px; border-bottom: 1px solid color-mix(in srgb, var(--welcome-accent) 20%, transparent); color: var(--welcome-secondary); font: 400 9px/1.5 "IBM Plex Mono", monospace; letter-spacing: .04em; }
.world-welcome__copy { margin: 0 0 13px; color: var(--welcome-copy); font-size: 13px; line-height: 1.85; }
.world-welcome__mobile { display: none; }
.world-welcome__enter { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 23px; padding: 13px 17px; min-height: 46px; border: 1px solid color-mix(in srgb, var(--welcome-accent) 50%, transparent); border-radius: 8px 2px 8px 2px; background: color-mix(in srgb, var(--welcome-accent) 9%, transparent); color: var(--welcome-accent); font: 500 12px/1.5 "IBM Plex Mono", monospace; cursor: pointer; transition: background 180ms ease; }
.world-welcome__enter:hover { background: color-mix(in srgb, var(--welcome-accent) 20%, transparent); }
.world-welcome__enter span { font-size: 19px; line-height: 1; }
.world-welcome button:focus-visible { outline: 2px solid var(--welcome-accent); outline-offset: 3px; }
.world-welcome__hint { display: block; margin-top: 13px; text-align: center; color: var(--welcome-copy); opacity: .8; font: 400 9px/1.5 "IBM Plex Mono", monospace; }
@keyframes welcome-arrive { from { opacity: 0; transform: translateY(12px) scale(.97); } to { opacity: 1; transform: none; } }
@keyframes welcome-backdrop { from { opacity: 0; } to { opacity: 1; } }
@media (max-width: 767px) {
  .world-welcome { padding: 76px 24px 21px; }
  .world-welcome__skyline { height: 70px; }
  .world-welcome__mobile { display: flex; gap: 10px; margin: 16px 0 0; padding-top: 14px; border-top: 1px solid color-mix(in srgb, var(--welcome-accent) 20%, transparent); color: var(--welcome-secondary); font-size: 12px; line-height: 1.65; }
  .world-welcome__mobile svg { flex: 0 0 20px; width: 20px; height: 20px; margin-top: 2px; stroke: currentColor; stroke-width: 1.4; }
}
@media (prefers-reduced-motion: reduce) {
  .world-welcome[open], .world-welcome[open]::backdrop { animation: none; }
  .world-welcome__enter { transition: none; }
}
</style>
