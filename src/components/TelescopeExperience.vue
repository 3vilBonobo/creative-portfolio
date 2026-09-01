<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useEnvironment } from "../composables/useEnvironment";

type DiscoveryKind = "city" | "sky";
type LightMode = "day" | "night";
interface Discovery { id: string; kind: DiscoveryKind; day: string; night: string }
interface SavedDiscovery { expiresAt: number; ids: Record<`${LightMode}-${DiscoveryKind}`, string> }

const DISCOVERY_TTL = 2 * 60 * 1000;
const STORAGE_KEY = "telescope-discovery-v3";
const MIN_ZOOM = 1.08;
const MAX_ZOOM = 3.4;
const discoveries: Discovery[] = [
  { id: "acropolis", kind: "city", day: "/hero/telescope/discoveries/acropolis-day.webp", night: "/hero/telescope/discoveries/acropolis-night.webp" },
  { id: "balconies", kind: "city", day: "/hero/telescope/discoveries/balconies-day.webp", night: "/hero/telescope/discoveries/balconies-night.webp" },
  { id: "backgammon", kind: "city", day: "/hero/telescope/discoveries/backgammon-day.webp", night: "/hero/telescope/discoveries/backgammon-night.webp" },
  { id: "glass-towers", kind: "city", day: "/hero/telescope/discoveries/glass-towers-day.webp", night: "/hero/telescope/discoveries/glass-towers-night.webp" },
  { id: "clouds", kind: "sky", day: "/hero/telescope/discoveries/clouds-day.webp", night: "/hero/telescope/discoveries/clouds-night.webp" },
  { id: "moon", kind: "sky", day: "/hero/telescope/discoveries/moon-day.webp", night: "/hero/telescope/discoveries/moon-night.webp" },
];

const { state } = useEnvironment();
const open = ref(false);
const kind = ref<DiscoveryKind>("city");
const selection = ref<Record<`${LightMode}-${DiscoveryKind}`, string>>({ "day-city": "acropolis", "night-city": "acropolis", "day-sky": "clouds", "night-sky": "clouds" });
const zoom = ref(1.22);
const panX = ref(0); const panY = ref(0);
const renderedX = ref(0); const renderedY = ref(0);
const isDragging = ref(false);
const closeButton = ref<HTMLButtonElement>();
const pointers = new Map<number, { x: number; y: number }>();
let animationFrame = 0; let dragOrigin: { x: number; y: number; panX: number; panY: number } | null = null;
let pinchDistance = 0; let pinchZoom = 1;

const lightMode = computed<LightMode>(() => state.value.timePhase === "night" || state.value.timePhase === "dusk" ? "night" : "day");
const selectionKey = computed<`${LightMode}-${DiscoveryKind}`>(() => `${lightMode.value}-${kind.value}`);
const currentDiscovery = computed(() => discoveries.find(({ id }) => id === selection.value[selectionKey.value]) ?? discoveries[0]);
const currentSource = computed(() => currentDiscovery.value[lightMode.value]);
const imageStyle = computed(() => ({ transform: `translate3d(${renderedX.value}px,${renderedY.value}px,0) scale(${zoom.value})` }));

function randomFor(discoveryKind: DiscoveryKind, previous?: string) {
  const pool = discoveries.filter((item) => item.kind === discoveryKind && item.id !== previous);
  return pool[Math.floor(Math.random() * pool.length)]?.id ?? discoveries.find((item) => item.kind === discoveryKind)!.id;
}
function refreshDiscoveries() {
  let saved: SavedDiscovery | null = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as SavedDiscovery | null; } catch { /* use a fresh set */ }
  if (saved?.expiresAt && saved.expiresAt > Date.now() && saved.ids) { selection.value = saved.ids; return; }
  const previous = saved?.ids;
  const city = randomFor("city", previous?.["day-city"]);
  const sky = randomFor("sky", previous?.["day-sky"]);
  const ids: SavedDiscovery["ids"] = {
    "day-city": city, "night-city": city,
    "day-sky": sky, "night-sky": sky,
  };
  selection.value = ids;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ expiresAt: Date.now() + DISCOVERY_TTL, ids } satisfies SavedDiscovery));
}
function resetLens() { zoom.value = 1.22; panX.value = 0; panY.value = 0; renderedX.value = 0; renderedY.value = 0; }
function showTelescope() { refreshDiscoveries(); kind.value = "city"; resetLens(); open.value = true; }
function hideTelescope() { open.value = false; }
function chooseKind(next: DiscoveryKind) { kind.value = next; resetLens(); }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function changeZoom(delta: number) { zoom.value = clamp(zoom.value + delta, MIN_ZOOM, MAX_ZOOM); }
function panLimit(element: HTMLElement) {
  const bounds = element.getBoundingClientRect();
  const overflowRatio = Math.max(0, 1.14 * zoom.value - 1);
  return { x: Math.min(520, bounds.width * overflowRatio / 2), y: Math.min(420, bounds.height * overflowRatio / 2) };
}
function onWheel(event: WheelEvent) {
  const strength = Math.min(.3, Math.max(.14, Math.abs(event.deltaY) / 600));
  changeZoom(event.deltaY < 0 ? strength : -strength);
}
function onPointerDown(event: PointerEvent) {
  event.preventDefault();
  const element = event.currentTarget as HTMLElement; element.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  isDragging.value = true;
  if (pointers.size === 1) dragOrigin = { x: event.clientX, y: event.clientY, panX: renderedX.value, panY: renderedY.value };
  if (pointers.size === 2) { const [a,b] = [...pointers.values()]; pinchDistance = Math.hypot(a.x-b.x,a.y-b.y); pinchZoom = zoom.value; }
}
function onPointerMove(event: PointerEvent) {
  const lens = event.currentTarget as HTMLElement;
  if (pointers.has(event.pointerId)) pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 2) {
    const [a,b] = [...pointers.values()]; const distance = Math.hypot(a.x-b.x,a.y-b.y);
    zoom.value = clamp(pinchZoom * distance / Math.max(1,pinchDistance), MIN_ZOOM, MAX_ZOOM); return;
  }
  if (pointers.size === 1 && dragOrigin) {
    const limit = panLimit(lens);
    panX.value = clamp(dragOrigin.panX + event.clientX-dragOrigin.x, -limit.x, limit.x);
    panY.value = clamp(dragOrigin.panY + event.clientY-dragOrigin.y, -limit.y, limit.y); return;
  }
}
function onPointerUp(event: PointerEvent) {
  const element = event.currentTarget as HTMLElement;
  if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
  pointers.delete(event.pointerId); pinchDistance = 0;
  if (pointers.size === 0) { dragOrigin = null; isDragging.value = false; }
  else { const remaining = [...pointers.values()][0]; dragOrigin = { x: remaining.x, y: remaining.y, panX: renderedX.value, panY: renderedY.value }; }
}
function animatePan() {
  const easing = isDragging.value ? .18 : .075;
  renderedX.value += (panX.value-renderedX.value) * easing;
  renderedY.value += (panY.value-renderedY.value) * easing;
  animationFrame = requestAnimationFrame(animatePan);
}
function onKeydown(event: KeyboardEvent) { if (event.key === "Escape" && open.value) hideTelescope(); }

watch(open, async (isOpen) => {
  document.body.classList.toggle("telescope-is-open", isOpen);
  if (isOpen) { await nextTick(); closeButton.value?.focus(); }
});
window.addEventListener("keydown", onKeydown); animationFrame = requestAnimationFrame(animatePan);
onBeforeUnmount(() => { window.removeEventListener("keydown", onKeydown); cancelAnimationFrame(animationFrame); document.body.classList.remove("telescope-is-open"); });
</script>

<template>
  <svg v-if="!open" class="telescope-hotspot-map" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet" aria-hidden="false">
    <defs>
      <radialGradient id="telescope-outer-halo">
        <stop offset="0%" stop-color="#efad3f" stop-opacity="0" />
        <stop offset="79%" stop-color="#efad3f" stop-opacity="0" />
        <stop offset="86%" stop-color="#efad3f" stop-opacity=".34" />
        <stop offset="100%" stop-color="#efad3f" stop-opacity="0" />
      </radialGradient>
    </defs>
    <g class="telescope-hotspot-target" role="button" tabindex="0" aria-label="Look through the telescope" @click.stop="showTelescope" @keydown.enter.prevent.stop="showTelescope" @keydown.space.prevent.stop="showTelescope">
      <title>Look through the telescope</title>
      <circle class="telescope-hotspot-target__halo" cx="374" cy="520" r="80" />
      <circle class="telescope-hotspot-target__shape" cx="374" cy="520" r="64" />
      <g class="telescope-hotspot-target__label">
        <rect x="314" y="594" width="120" height="28" />
        <text x="374" y="612" text-anchor="middle">Open telescope</text>
      </g>
    </g>
  </svg>
  <Teleport to="body">
    <Transition name="telescope-reveal">
      <div v-if="open" class="telescope-app" role="dialog" aria-modal="true" aria-label="Telescope view" :data-time-phase="state.timePhase">
      <div class="telescope-app__eyepiece" :class="{ 'is-dragging': isDragging }" role="application" aria-label="Telescope lens. Click and drag to look around; use the wheel or pinch to zoom." @wheel.prevent.stop="onWheel" @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerUp">
        <Transition name="telescope-source" mode="out-in"><img :key="currentSource" :src="currentSource" alt="A randomly selected near-future Athens telescope discovery" draggable="false" :style="imageStyle" @dragstart.prevent></Transition>
        <div class="telescope-app__reticle" aria-hidden="true"><i /><i /></div>
        <div class="telescope-app__zoom" aria-label="Zoom controls">
          <button type="button" aria-label="Zoom out" :disabled="zoom <= MIN_ZOOM" @click.stop="changeZoom(-.25)">−</button>
          <output :aria-label="`Zoom ${Math.round(zoom * 100)} percent`">{{ zoom.toFixed(1) }}×</output>
          <button type="button" aria-label="Zoom in" :disabled="zoom >= MAX_ZOOM" @click.stop="changeZoom(.25)">+</button>
        </div>
      </div>
      <header class="telescope-app__header">
        <p><span>Optical observation</span><b>{{ kind === 'city' ? 'City signal' : 'Sky signal' }}</b><small>{{ state.timePhase }} mode · signal locked</small></p>
        <button ref="closeButton" class="telescope-app__exit" type="button" @click="hideTelescope">Exit telescope <span aria-hidden="true">→</span></button>
      </header>
      <nav class="telescope-app__coordinates" aria-label="Choose where to look">
        <button type="button" :class="{ 'is-active': kind === 'city' }" :aria-pressed="kind === 'city'" @click="chooseKind('city')"><span>Look at the city</span><small>Find a hidden moment</small></button>
        <button type="button" :class="{ 'is-active': kind === 'sky' }" :aria-pressed="kind === 'sky'" @click="chooseKind('sky')"><span>Look at the sky</span><small>Search the atmosphere</small></button>
      </nav>
      <p class="telescope-app__hint">Click and drag to scan · wheel or pinch to zoom · scenes shift every few minutes</p>
      </div>
    </Transition>
  </Teleport>
</template>
