<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useEnvironment } from "../composables/useEnvironment";

type DiscoveryKind = "city" | "sky";
type LightMode = "day" | "night";
type SelectionKey = `${LightMode}-${DiscoveryKind}`;

interface Clue {
  id: string;
  x: number;
  y: number;
  text: string;
  nightText?: string;
}

interface Discovery {
  id: string;
  kind: DiscoveryKind;
  day: string;
  night: string;
  clues: Clue[];
}

interface SavedDiscovery {
  expiresAt: number;
  ids: Record<SelectionKey, string>;
}

const DISCOVERY_TTL = 2 * 60 * 1000;
const STORAGE_KEY = "telescope-discovery-v4";
const MIN_ZOOM = 1.12;
const MAX_ZOOM = 6;
const IMAGE_OVERSCAN_X = 1.8;
const IMAGE_OVERSCAN_Y = 1.2;
const ASSET_ROOT = "/hero/telescope";

const discoveries: Discovery[] = [
  {
    id: "acropolis",
    kind: "city",
    day: `${ASSET_ROOT}/discoveries-v2/acropolis-day.webp`,
    night: `${ASSET_ROOT}/discoveries-v2/acropolis-night.webp`,
    clues: [
      { id: "tortoise", x: 81, y: 88, text: "Unit T-04 has been polishing the same pebble since Tuesday." },
      { id: "cat", x: 91, y: 84, text: "The Acropolis cat has rejected another mandatory firmware update." },
      { id: "drone-break", x: 33, y: 13, text: "Drone union break. Estimated return: eventually." },
      { id: "picnic", x: 76, y: 32, text: "Unauthorized picnic detected. Sandwich appears to be in charge." },
    ],
  },
  {
    id: "balconies",
    kind: "city",
    day: `${ASSET_ROOT}/discoveries-v2/balconies-day.webp`,
    night: `${ASSET_ROOT}/discoveries-v2/balconies-night.webp`,
    clues: [
      { id: "sock", x: 29, y: 57, text: "Laundry bot has declared one sock structurally unsound." },
      { id: "coffee", x: 60, y: 29, text: "Coffee delivery delayed by a territorial pigeon." },
      { id: "cat-temple", x: 63, y: 80, text: "Miniature cat temple accepts offerings in tuna only." },
      { id: "antenna", x: 84, y: 57, text: "Balcony lights are broadcasting weather reports from 1987." },
    ],
  },
  {
    id: "backgammon",
    kind: "city",
    day: `${ASSET_ROOT}/discoveries-v2/backgammon-day.webp`,
    night: `${ASSET_ROOT}/discoveries-v2/backgammon-night.webp`,
    clues: [
      { id: "tavli", x: 59, y: 59, text: "The board predicts every move except the uncle's cheating." },
      { id: "owl", x: 27, y: 46, text: "Bubble #47 contains a legally distinct holographic owl." },
      { id: "score", x: 66, y: 42, text: "Companion drone is keeping score. Nobody asked it to." },
      { id: "pigeons", x: 55, y: 19, text: "Pigeon council is voting on whether humans may keep the roof." },
    ],
  },
  {
    id: "glass-towers",
    kind: "city",
    day: `${ASSET_ROOT}/discoveries-v2/glass-towers-day.webp`,
    night: `${ASSET_ROOT}/discoveries-v2/glass-towers-night.webp`,
    clues: [
      { id: "astronaut", x: 80, y: 15, text: "Astronaut watering one plant. Mission day 4,821." },
      { id: "sock-drone", x: 49, y: 27, text: "Window drone has stolen a sock and is refusing negotiations." },
      { id: "flamingo", x: 80, y: 64, text: "The flamingo lamp has recently been promoted to middle management." },
      { id: "meeting", x: 43, y: 57, text: "Meeting room empty. Holographic meeting still arguing." },
    ],
  },
  {
    id: "clouds",
    kind: "sky",
    day: `${ASSET_ROOT}/discoveries-v2/clouds-day.webp`,
    night: `${ASSET_ROOT}/discoveries-v2/clouds-night.webp`,
    clues: [
      {
        id: "flying-fish",
        x: 92,
        y: 51,
        text: "Flying-fish weather drone migration has begun three weeks early.",
        nightText: "Star registry has classified this empty patch as deeply suspicious.",
      },
      {
        id: "birds",
        x: 56,
        y: 78,
        text: "Bird formation is requesting a password reset.",
        nightText: "A low-priority star has submitted an overtime claim.",
      },
      {
        id: "glider",
        x: 84,
        y: 15,
        text: "Pilot reports excellent visibility and one suspicious cloud.",
        nightText: "Three stars are pretending not to form a face.",
      },
      {
        id: "tiny-moon",
        x: 55,
        y: 24,
        text: "Unscheduled glider is pretending to be a very thin moon.",
        nightText: "Unscheduled constellation strongly resembles a tax form.",
      },
    ],
  },
  {
    id: "moon",
    kind: "sky",
    day: `${ASSET_ROOT}/discoveries-v2/moon-day.webp`,
    night: `${ASSET_ROOT}/discoveries-v2/moon-night.webp`,
    clues: [
      { id: "lunar-bot", x: 51, y: 68, text: "Lunar maintenance bot waving at exactly nobody." },
      { id: "satellite", x: 20, y: 31, text: "Satellite status: emotionally unavailable." },
      { id: "owl-orbit", x: 70, y: 31, text: "One crater has been promoted to orbital owl." },
      { id: "planet", x: 84, y: 68, text: "A very distant planet is pretending not to notice us." },
    ],
  },
];

const opticalSpecks = [
  { x: 18, y: 31, delay: "0s" },
  { x: 81, y: 24, delay: "1.7s" },
  { x: 73, y: 76, delay: "3.1s" },
  { x: 36, y: 82, delay: "4.4s" },
  { x: 56, y: 17, delay: "5.2s" },
];

const { state } = useEnvironment();
const open = ref(false);
const kind = ref<DiscoveryKind>("city");
const selection = ref<Record<SelectionKey, string>>({
  "day-city": "acropolis",
  "night-city": "acropolis",
  "day-sky": "clouds",
  "night-sky": "clouds",
});
const zoom = ref(1.22);
const panX = ref(0);
const panY = ref(0);
const renderedX = ref(0);
const renderedY = ref(0);
const isDragging = ref(false);
const imageReady = ref(false);
const previewFailed = ref(false);
const detailFailed = ref(false);
const activeClue = ref<Clue | null>(null);
const foundClueIds = ref<string[]>([]);
const dialog = ref<HTMLElement>();
const closeButton = ref<HTMLButtonElement>();
const eyepiece = ref<HTMLElement>();
const trigger = ref<SVGGElement>();
const pointers = new Map<number, { x: number; y: number }>();
let animationFrame = 0;
let dragOrigin: { x: number; y: number; panX: number; panY: number } | null = null;
let pinchDistance = 0;
let pinchZoom = 1;

const lightMode = computed<LightMode>(() =>
  state.value.timePhase === "night" || state.value.timePhase === "dusk" ? "night" : "day",
);
const selectionKey = computed<SelectionKey>(() => `${lightMode.value}-${kind.value}`);
const currentDiscovery = computed(
  () => discoveries.find(({ id }) => id === selection.value[selectionKey.value]) ?? discoveries[0],
);
const currentSource = computed(() => currentDiscovery.value[lightMode.value]);
const currentPreview = computed(() => currentSource.value.replace("/discoveries-v2/", "/discoveries/"));
const currentCluePrefix = computed(() => `${currentDiscovery.value.id}:`);
const currentFoundCount = computed(
  () => foundClueIds.value.filter((id) => id.startsWith(currentCluePrefix.value)).length,
);
const activeClueText = computed(() =>
  lightMode.value === "night" && activeClue.value?.nightText
    ? activeClue.value.nightText
    : activeClue.value?.text,
);
const imageStatusText = computed(() => {
  if (!previewFailed.value || imageReady.value) return "";
  return detailFailed.value
    ? "Signal interrupted · Try the next signal"
    : "Preview unavailable · Resolving full signal";
});
const imageStyle = computed(() => ({
  "--inverse-zoom": String(1 / zoom.value),
  transform: `translate3d(${renderedX.value}px,${renderedY.value}px,0) scale(${zoom.value})`,
}));

function randomFor(discoveryKind: DiscoveryKind, previous?: string) {
  const pool = discoveries.filter((item) => item.kind === discoveryKind && item.id !== previous);
  return (
    pool[Math.floor(Math.random() * pool.length)]?.id ??
    discoveries.find((item) => item.kind === discoveryKind)!.id
  );
}

function saveSelection(ids: SavedDiscovery["ids"]) {
  selection.value = ids;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ expiresAt: Date.now() + DISCOVERY_TTL, ids } satisfies SavedDiscovery),
  );
}

function refreshDiscoveries() {
  let saved: SavedDiscovery | null = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as SavedDiscovery | null;
  } catch {
    // A malformed previous session should never block the telescope.
  }
  if (saved?.expiresAt && saved.expiresAt > Date.now() && saved.ids) {
    selection.value = saved.ids;
    return;
  }
  const city = randomFor("city", saved?.ids?.["day-city"]);
  const sky = randomFor("sky", saved?.ids?.["day-sky"]);
  saveSelection({
    "day-city": city,
    "night-city": city,
    "day-sky": sky,
    "night-sky": sky,
  });
}

function resetLens() {
  zoom.value = 1.22;
  panX.value = 0;
  panY.value = 0;
  renderedX.value = 0;
  renderedY.value = 0;
  activeClue.value = null;
}

function showTelescope() {
  refreshDiscoveries();
  kind.value = "city";
  resetLens();
  open.value = true;
}

function hideTelescope() {
  open.value = false;
}

function chooseKind(next: DiscoveryKind) {
  if (kind.value === next) return;
  kind.value = next;
  resetLens();
}

function nextSignal() {
  const nextId = randomFor(kind.value, currentDiscovery.value.id);
  const ids = { ...selection.value };
  ids[`day-${kind.value}`] = nextId;
  ids[`night-${kind.value}`] = nextId;
  saveSelection(ids);
  resetLens();
}

function revealClue(clue: Clue) {
  const clueId = `${currentDiscovery.value.id}:${clue.id}`;
  if (!foundClueIds.value.includes(clueId)) foundClueIds.value = [...foundClueIds.value, clueId];
  activeClue.value = clue;
}

function clueIsFound(clue: Clue) {
  return foundClueIds.value.includes(`${currentDiscovery.value.id}:${clue.id}`);
}

function imageEventMatches(event: Event, source: string) {
  return (event.currentTarget as HTMLImageElement | null)?.getAttribute("src") === source;
}

function onPreviewImageLoad(event: Event) {
  if (imageEventMatches(event, currentPreview.value)) previewFailed.value = false;
}

function onPreviewImageError(event: Event) {
  if (imageEventMatches(event, currentPreview.value)) previewFailed.value = true;
}

function onDetailImageLoad(event: Event) {
  if (!imageEventMatches(event, currentSource.value)) return;
  detailFailed.value = false;
  imageReady.value = true;
}

function onDetailImageError(event: Event) {
  if (!imageEventMatches(event, currentSource.value)) return;
  detailFailed.value = true;
  imageReady.value = false;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function panLimit(element: HTMLElement, nextZoom = zoom.value) {
  const bounds = element.getBoundingClientRect();
  const overflowX = Math.max(0, IMAGE_OVERSCAN_X * nextZoom - 1);
  const overflowY = Math.max(0, IMAGE_OVERSCAN_Y * nextZoom - 1);
  return {
    x: bounds.width * overflowX * 0.48,
    y: bounds.height * overflowY * 0.48,
  };
}

function clampPan(nextZoom = zoom.value) {
  if (!eyepiece.value) return;
  const limit = panLimit(eyepiece.value, nextZoom);
  panX.value = clamp(panX.value, -limit.x, limit.x);
  panY.value = clamp(panY.value, -limit.y, limit.y);
  renderedX.value = clamp(renderedX.value, -limit.x, limit.x);
  renderedY.value = clamp(renderedY.value, -limit.y, limit.y);
}

function setZoom(nextZoom: number, anchor?: { x: number; y: number }) {
  const previousZoom = zoom.value;
  const clampedZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
  if (clampedZoom === previousZoom) return;

  if (anchor) {
    const ratio = clampedZoom / previousZoom;
    panX.value = anchor.x - (anchor.x - panX.value) * ratio;
    panY.value = anchor.y - (anchor.y - panY.value) * ratio;
  }

  zoom.value = clampedZoom;
  clampPan(clampedZoom);
}

function changeZoom(delta: number) {
  setZoom(zoom.value + delta);
}

function onWheel(event: WheelEvent) {
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const anchor = {
    x: event.clientX - bounds.left - bounds.width / 2,
    y: event.clientY - bounds.top - bounds.height / 2,
  };
  const strength = Math.min(0.52, Math.max(0.2, Math.abs(event.deltaY) / 450));
  setZoom(zoom.value + (event.deltaY < 0 ? strength : -strength), anchor);
}

function onPointerDown(event: PointerEvent) {
  event.preventDefault();
  const element = event.currentTarget as HTMLElement;
  element.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  isDragging.value = true;
  if (pointers.size === 1) {
    dragOrigin = {
      x: event.clientX,
      y: event.clientY,
      panX: renderedX.value,
      panY: renderedY.value,
    };
  }
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
    pinchZoom = zoom.value;
  }
}

function onPointerMove(event: PointerEvent) {
  const lens = event.currentTarget as HTMLElement;
  if (pointers.has(event.pointerId)) {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  }
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    setZoom(pinchZoom * (distance / Math.max(1, pinchDistance)));
    return;
  }
  if (pointers.size === 1 && dragOrigin) {
    const limit = panLimit(lens);
    panX.value = clamp(dragOrigin.panX + event.clientX - dragOrigin.x, -limit.x, limit.x);
    panY.value = clamp(dragOrigin.panY + event.clientY - dragOrigin.y, -limit.y, limit.y);
  }
}

function onPointerUp(event: PointerEvent) {
  const element = event.currentTarget as HTMLElement;
  if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
  pointers.delete(event.pointerId);
  pinchDistance = 0;
  if (pointers.size === 0) {
    dragOrigin = null;
    isDragging.value = false;
  } else {
    const remaining = [...pointers.values()][0];
    dragOrigin = {
      x: remaining.x,
      y: remaining.y,
      panX: renderedX.value,
      panY: renderedY.value,
    };
  }
}

function animatePan() {
  const easing = isDragging.value ? 0.16 : 0.08;
  renderedX.value += (panX.value - renderedX.value) * easing;
  renderedY.value += (panY.value - renderedY.value) * easing;
  animationFrame = requestAnimationFrame(animatePan);
}

function getFocusableElements() {
  if (!dialog.value) return [];
  return Array.from(
    dialog.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(
    (element) =>
      !element.hidden &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.getClientRects().length > 0,
  );
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value) return;

  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    hideTelescope();
    return;
  }

  if (event.key !== "Tab" || !dialog.value) return;

  const focusableElements = getFocusableElements();
  if (focusableElements.length === 0) {
    event.preventDefault();
    dialog.value.focus();
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;
  const focusIsInside = activeElement instanceof Node && dialog.value.contains(activeElement);

  if (event.shiftKey && (activeElement === first || !focusIsInside)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (activeElement === last || !focusIsInside)) {
    event.preventDefault();
    first.focus();
  }
}

function onFocusin(event: FocusEvent) {
  if (!open.value || !dialog.value) return;
  if (event.target instanceof Node && dialog.value.contains(event.target)) return;
  (closeButton.value ?? getFocusableElements()[0] ?? dialog.value).focus();
}

watch(currentSource, () => {
  imageReady.value = false;
  previewFailed.value = false;
  detailFailed.value = false;
  activeClue.value = null;
});

watch(open, async (isOpen) => {
  document.body.classList.toggle("telescope-is-open", isOpen);
  await nextTick();
  if (isOpen) {
    closeButton.value?.focus();
  } else {
    trigger.value?.focus();
  }
});

window.addEventListener("keydown", onKeydown, true);
document.addEventListener("focusin", onFocusin);
animationFrame = requestAnimationFrame(animatePan);

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown, true);
  document.removeEventListener("focusin", onFocusin);
  cancelAnimationFrame(animationFrame);
  document.body.classList.remove("telescope-is-open");
});
</script>

<template>
  <svg
    v-if="!open"
    class="telescope-hotspot-map"
    viewBox="0 0 1672 941"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="false"
  >
    <defs>
      <radialGradient id="telescope-outer-halo">
        <stop offset="0%" stop-color="#efad3f" stop-opacity="0" />
        <stop offset="79%" stop-color="#efad3f" stop-opacity="0" />
        <stop offset="86%" stop-color="#efad3f" stop-opacity=".34" />
        <stop offset="100%" stop-color="#efad3f" stop-opacity="0" />
      </radialGradient>
    </defs>
    <g
      ref="trigger"
      class="telescope-hotspot-target"
      transform="translate(81 -46)"
      role="button"
      tabindex="0"
      aria-label="Look through the telescope"
      @click.stop="showTelescope"
      @keydown.enter.prevent.stop="showTelescope"
      @keydown.space.prevent.stop="showTelescope"
    >
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
      <div
        v-if="open"
        ref="dialog"
        class="telescope-app"
        role="dialog"
        aria-modal="true"
        aria-label="Telescope view"
        tabindex="-1"
        :data-time-phase="state.timePhase"
      >
        <div
          ref="eyepiece"
          class="telescope-app__eyepiece"
          :class="{ 'is-dragging': isDragging, 'is-searching': zoom >= 1.55 }"
          role="application"
          aria-label="Telescope lens. Click and drag to look around; use the wheel or pinch to zoom."
          @wheel.prevent.stop="onWheel"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <Transition name="telescope-source" mode="out-in">
            <div :key="currentSource" class="telescope-app__scene" :style="imageStyle">
              <img
                class="telescope-app__image telescope-app__image--preview"
                :src="currentPreview"
                alt=""
                draggable="false"
                @load="onPreviewImageLoad"
                @error="onPreviewImageError"
                @dragstart.prevent
              />
              <img
                class="telescope-app__image telescope-app__image--detail"
                :class="{ 'is-ready': imageReady }"
                :src="currentSource"
                alt="A randomly selected near-future Athens telescope discovery"
                draggable="false"
                @load="onDetailImageLoad"
                @error="onDetailImageError"
                @dragstart.prevent
              />
              <template v-if="!imageStatusText">
                <button
                  v-for="clue in currentDiscovery.clues"
                  :key="clue.id"
                  class="telescope-app__clue"
                  :class="{ 'is-found': clueIsFound(clue) }"
                  :style="{ left: `${clue.x}%`, top: `${clue.y}%` }"
                  type="button"
                  aria-label="Inspect a faint signal"
                  @pointerdown.stop
                  @click.stop="revealClue(clue)"
                >
                  <span aria-hidden="true" />
                </button>
              </template>
            </div>
          </Transition>

          <p v-if="imageStatusText" class="telescope-app__signal-status" role="status">
            {{ imageStatusText }}
          </p>

          <div class="telescope-app__scan" aria-hidden="true" />
          <div class="telescope-app__specks" aria-hidden="true">
            <i
              v-for="(speck, index) in opticalSpecks"
              :key="index"
              :style="{ left: `${speck.x}%`, top: `${speck.y}%`, animationDelay: speck.delay }"
            />
          </div>
          <div class="telescope-app__reticle" aria-hidden="true"><i /><i /></div>

          <Transition name="telescope-clue">
            <aside v-if="activeClue" class="telescope-app__clue-card" aria-live="polite">
              <small>Anomaly logged</small>
              <p>{{ activeClueText }}</p>
              <button type="button" aria-label="Close anomaly message" @pointerdown.stop @click.stop="activeClue = null">×</button>
            </aside>
          </Transition>

          <div class="telescope-app__zoom" aria-label="Zoom controls" @pointerdown.stop>
            <button
              type="button"
              aria-label="Zoom out"
              :disabled="zoom <= MIN_ZOOM"
              @click.stop="changeZoom(-0.4)"
            >
              −
            </button>
            <output :aria-label="`Zoom ${Math.round(zoom * 100)} percent`">{{ zoom.toFixed(1) }}×</output>
            <button
              type="button"
              aria-label="Zoom in"
              :disabled="zoom >= MAX_ZOOM"
              @click.stop="changeZoom(0.4)"
            >
              +
            </button>
          </div>
        </div>

        <header class="telescope-app__header">
          <p>
            <span>Optical observation</span>
            <b>{{ kind === "city" ? "City signal" : "Sky signal" }}</b>
            <small>
              {{ state.timePhase }} mode · {{ currentFoundCount }}/{{ currentDiscovery.clues.length }} anomalies logged
            </small>
          </p>
          <button ref="closeButton" class="telescope-app__exit" type="button" @click="hideTelescope">
            Exit telescope <span aria-hidden="true">→</span>
          </button>
        </header>

        <nav class="telescope-app__coordinates" aria-label="Choose where to look">
          <button
            type="button"
            :class="{ 'is-active': kind === 'city' }"
            :aria-pressed="kind === 'city'"
            @click="chooseKind('city')"
          >
            <span>Look at the city</span>
            <small>Find a hidden moment</small>
          </button>
          <button
            type="button"
            :class="{ 'is-active': kind === 'sky' }"
            :aria-pressed="kind === 'sky'"
            @click="chooseKind('sky')"
          >
            <span>Look at the sky</span>
            <small>Search the atmosphere</small>
          </button>
          <button class="telescope-app__next" type="button" @click="nextSignal">
            <span>Next signal</span>
            <small>Find another view</small>
          </button>
        </nav>

        <p class="telescope-app__hint">
          Drag to scan · wheel or pinch up to 6× · inspect the faint blinking anomalies
        </p>
      </div>
    </Transition>
  </Teleport>
</template>
