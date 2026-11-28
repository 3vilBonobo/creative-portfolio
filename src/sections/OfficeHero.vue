<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import MobileStudioPlate from "../components/hero/MobileStudioPlate.vue";
import { usePhoneLayout } from "../composables/usePhoneLayout";
import "../floor04-mobile.css";
import HeroCat from "../components/hero/HeroCat.vue";
import HeroVisual from "../components/hero/HeroVisual.vue";
import TelescopeExperience from "../components/hero/TelescopeExperience.vue";
import DailyPuzzleBook from "../components/hero/DailyPuzzleBook.vue";
import DailyChessPuzzle from "../components/hero/DailyChessPuzzle.vue";
import AquariumExperience from "../components/hero/AquariumExperience.vue";
import RadioLaptop from "../components/hero/RadioLaptop.vue";
import { useRadio } from "../composables/useRadio";
import { FLOOR } from "../config/floors";

const { portrait, landscape, phone } = usePhoneLayout();
const radio = useRadio();
const hero = ref<HTMLElement>();
const orientationDialog = ref<HTMLDialogElement>();
const orientationPromptOpen = ref(false);
const telescope = ref<InstanceType<typeof TelescopeExperience>>();
const aquarium = ref<InstanceType<typeof AquariumExperience>>();
const chess = ref<InstanceType<typeof DailyChessPuzzle>>();
const sudoku = ref<InstanceType<typeof DailyPuzzleBook>>();
const cat = ref<InstanceType<typeof HeroCat>>();
const studioRequested = ref(false);
const studioContained = ref(false);
const portraitExpanded = ref(false);
const immersive = computed(() => studioRequested.value && landscape.value);
const discoveryOpen = computed(() => !!(telescope.value?.open || aquarium.value?.open || chess.value?.open || sudoku.value?.open));
const ORIENTATION_CHOICE_KEY = "portfolio-mobile-orientation-choice";
let enterStudioAfterRotation = false;
let mounted = false;
let returnFocus: HTMLElement | null = null;
let studioScroll = 0;
let previousOverflow = "";
function discover(kind: "telescope" | "aquarium" | "chess" | "sudoku" | "cat", event: Event) {
  if (kind === "cat") cat.value?.pet();
  else {
    returnFocus = event.currentTarget as HTMLElement;
    ({ telescope, aquarium, chess, sudoku })[kind].value?.show();
  }
}
async function enterStudio() {
  if (!landscape.value || discoveryOpen.value) return;
  studioRequested.value = true;
  await nextTick();
  hero.value?.querySelector<HTMLButtonElement>(".mobile-studio-return")?.focus({ preventScroll: true });
}
async function exitStudio() {
  studioRequested.value = false;
  await nextTick();
  hero.value?.querySelector<HTMLButtonElement>(".mobile-studio-enter")?.focus({ preventScroll: true });
}
function closeOrientationPrompt(choice: string) {
  sessionStorage.setItem(ORIENTATION_CHOICE_KEY, choice);
  orientationPromptOpen.value = false;
  orientationDialog.value?.close();
}
function continuePortrait() { closeOrientationPrompt("portrait"); }
function browseFloors() { closeOrientationPrompt("browse"); }
async function chooseImmersive() {
  closeOrientationPrompt("immersive");
  await enterStudio();
}
function chooseLandscape() {
  enterStudioAfterRotation = true;
  closeOrientationPrompt("rotate");
}
async function openOrientationPrompt() {
  if (!phone.value || sessionStorage.getItem(ORIENTATION_CHOICE_KEY) || orientationPromptOpen.value) return;
  orientationPromptOpen.value = true;
  await nextTick();
  if (orientationPromptOpen.value && orientationDialog.value && !orientationDialog.value.open) orientationDialog.value.showModal();
}
watch(phone, available => { if (available && mounted) void openOrientationPrompt(); });
watch(landscape, async available => {
  if (!available) { studioRequested.value = false; return; }
  if (enterStudioAfterRotation) {
    enterStudioAfterRotation = false;
    await enterStudio();
  }
});
watch(immersive, async active => {
  if (active) {
    studioScroll = window.scrollY;
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
  } else {
    document.documentElement.style.overflow = previousOverflow;
    await nextTick();
    // No smooth scrolling or history changes when returning to the portfolio.
    window.scrollTo({ top: studioScroll, behavior: "instant" });
  }
});
watch(discoveryOpen, async open => {
  if (!open) {
    const opener = returnFocus;
    returnFocus = null;
    await nextTick();
    if (phone.value && opener?.isConnected) opener.focus({ preventScroll: true });
  }
});
function keepDialogFocus(event: KeyboardEvent) {
  if (radio.opened.value) return;
  if (!phone.value || (!orientationDialog.value?.open && !discoveryOpen.value && !immersive.value) || event.key !== "Tab") return;
  const dialog = orientationDialog.value?.open ? orientationDialog.value : discoveryOpen.value ? document.querySelector<HTMLElement>('.telescope-app, .aquarium-app, .puzzle-book, dialog[open].chess-dialog') : hero.value;
  const controls = dialog ? [...dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]')].filter(el => el.getClientRects().length && !el.closest('[inert]')) : [];
  const first = controls[0], last = controls[controls.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
}
const showIntroduction = ref(true);
const introductionPanel = ref<HTMLElement | null>(null);
function collapseIntroduction() {
  if (!phone.value && showIntroduction.value) showIntroduction.value = false;
}

let previousScrollY = 0;
let downwardTravel = 0;

function toggleIntroduction() {
  showIntroduction.value = !showIntroduction.value;
  downwardTravel = 0;
  previousScrollY = window.scrollY;
}

function handleScroll() {
  if (phone.value) return;
  const scrollY = Math.max(0, window.scrollY);
  const movement = scrollY - previousScrollY;

  if (movement > 0) downwardTravel += movement;
  else if (movement < 0) downwardTravel = 0;

  // Keep the introduction visible through the first couple of wheel movements.
  // Using travelled distance also keeps this consistent for trackpads, keyboard
  // scrolling, and scrollbar dragging without intercepting native scroll input.
  // Let visitors finish copy that extends below the fold on narrow or short
  // screens before dismissing it as they continue down to the next floor.
  const panelBottom = introductionPanel.value?.getBoundingClientRect().bottom ?? 0;
  const needsReadingScroll = window.matchMedia("(max-width: 760px)").matches
    || panelBottom + scrollY > window.innerHeight;
  if (showIntroduction.value && downwardTravel >= 280 && (!needsReadingScroll || panelBottom <= 0)) {
    collapseIntroduction();
  }

  previousScrollY = scrollY;
}

onMounted(() => {
  mounted = true;
  void openOrientationPrompt();
  document.addEventListener("keydown", keepDialogFocus);
  previousScrollY = window.scrollY;
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("keydown", keepDialogFocus);
  if (immersive.value) document.documentElement.style.overflow = previousOverflow;
});
</script>

<template>
  <section ref="hero" :class="{ 'hero--phone': phone, 'hero--portrait': portrait, 'hero--landscape': landscape, 'hero--immersive': immersive, 'hero--studio-contained': studioContained }" :id="FLOOR.office.id" class="hero hero--wide-scene floor-section" :data-floor-number="FLOOR.office.number" :aria-labelledby="phone ? 'mobile-hero-title' : 'hero-title'" @click="collapseIntroduction">
    <div class="office-studio-stage">
      <div class="office-studio-canvas">
        <MobileStudioPlate v-if="portrait" v-model:expanded="portraitExpanded" />
        <HeroVisual v-else :compact="phone" />
        <HeroCat ref="cat" :artwork="!portrait" />
        <TelescopeExperience ref="telescope" :hotspots="!portrait" />
        <DailyPuzzleBook ref="sudoku" :hotspots="!portrait" />
        <DailyChessPuzzle ref="chess" :hotspots="!portrait" />
        <AquariumExperience ref="aquarium" :hotspots="!portrait" />
        <RadioLaptop v-if="!portrait" />
      </div>
      <button v-if="landscape && !immersive" class="mobile-studio-enter" type="button" @click.stop="enterStudio">Explore studio <span aria-hidden="true">↗</span></button>
    </div>
    <div v-if="phone" class="mobile-office-copy" :inert="immersive || landscape">
      <h1 id="mobile-hero-title"><span>Irinella Boutsika</span>Frontend developer.</h1>
      <p class="mobile-office-lede">Projects, interactive scenes and hidden Easter eggs.</p>
    </div>
    <div v-if="phone" class="mobile-studio-tools">
      <div v-if="immersive" class="mobile-studio-toolbar">
        <button class="mobile-studio-return" type="button" aria-label="Return to portfolio" @click.stop="exitStudio">← Portfolio</button>
        <button class="mobile-studio-fit" type="button" :aria-pressed="studioContained" @click.stop="studioContained = !studioContained">{{ studioContained ? 'Fill the screen' : 'View entire studio' }}</button>
      </div>
      <details v-if="portrait" class="mobile-studio-discoveries" @click.stop>
        <summary>Explore Studio <span aria-hidden="true">+</span></summary>
        <div class="mobile-studio-discoveries__actions">
          <button type="button" @click="discover('telescope', $event)">Telescope <span aria-hidden="true">↗</span></button>
          <button type="button" @click="discover('aquarium', $event)">Aquarium <span aria-hidden="true">↗</span></button>
          <button type="button" @click="discover('chess', $event)">Daily chess <span aria-hidden="true">↗</span></button>
          <button type="button" @click="discover('sudoku', $event)">Sudoku & puzzles <span aria-hidden="true">↗</span></button>
          <button type="button" @click="discover('cat', $event)">Pet Yannos <span aria-hidden="true">♡</span></button>
          <button type="button" aria-haspopup="dialog" @click="radio.show">Athens radio <span aria-hidden="true">↗</span></button>
        </div>
      </details>
    </div>
    <dialog ref="orientationDialog" class="mobile-orientation-dialog" aria-labelledby="mobile-orientation-title" aria-describedby="mobile-orientation-copy" @cancel.prevent="browseFloors">
      <p class="mobile-orientation-dialog__eyebrow">IMMERSIVE PORTFOLIO</p>
      <h2 id="mobile-orientation-title">{{ landscape ? 'Explore the studio' : 'Turn your phone sideways' }}</h2>
      <p id="mobile-orientation-copy">The interactive studio is best experienced sideways or on a desktop. Portrait browsing still works, and you can change orientation any time.</p>
      <div class="mobile-orientation-dialog__actions">
        <button v-if="portrait" type="button" class="mobile-orientation-dialog__primary" autofocus @click="continuePortrait">Continue in portrait</button>
        <button v-else type="button" class="mobile-orientation-dialog__primary" autofocus @click="chooseImmersive">Enter interactive studio</button>
        <button v-if="portrait" type="button" class="mobile-orientation-dialog__secondary" @click="chooseLandscape">I’ll rotate my phone</button>
        <button v-else type="button" class="mobile-orientation-dialog__secondary" @click="browseFloors">Browse the floors</button>
      </div>
    </dialog>
    <div v-show="!phone" class="hero-copy-drawer" :class="{ 'hero-copy-drawer--closed': !showIntroduction }">
      <div
        id="hero-introduction"
        ref="introductionPanel"
        class="hero__content hero__plate"
        data-parallax="-2"
        :aria-hidden="!showIntroduction"
        :inert="!showIntroduction"
        @click.stop>
        <h1 id="hero-title"><span>Irinella Boutsika</span>Frontend developer.</h1>
        <p class="hero__lede">I build clear interfaces and interactive worlds.</p>
        <div class="hero__invitation">
          <h2>Explore five floors of work.</h2>
          <p>An immersive Athens studio that shifts with the local time and weather. Explore projects, playful interactions and hidden Easter eggs.</p>
          <p>Each floor opens into its own illustrated space, with details that reward a closer look as you move through the building.</p>
        </div>
      </div>
      <button
        class="hero-copy-toggle"
        type="button"
        :aria-expanded="showIntroduction"
        aria-controls="hero-introduction"
        @click.stop="toggleIntroduction">
        <span aria-hidden="true">{{ showIntroduction ? "‹" : "›" }}</span
        ><b>{{ showIntroduction ? "Hide intro" : "Show intro" }}</b>
      </button>
    </div>
    <div class="scroll-cue" aria-hidden="true">Scroll to descend <span>↓</span></div>
  </section>
</template>

<style scoped>
.hero-copy-drawer {
  width: clamp(22rem, 36vw, 32rem);
  max-width: calc(100% - 3rem);
  container-type: inline-size;
}

.hero-copy-drawer .hero__plate {
  width: 100%;
  padding: clamp(1.1rem, 4cqi, 1.65rem) clamp(1.25rem, 6cqi, 2rem) clamp(1rem, 3cqi, 1.4rem);
  background: linear-gradient(135deg, #0d1110f5, #11120fee);
  text-shadow: none;
}

.hero-copy-drawer h1 {
  font-size: clamp(2.5rem, 13cqi, 4rem);
  line-height: 0.98;
  overflow-wrap: anywhere;
}

.hero-copy-drawer h1 span {
  font-size: 0.85rem;
  line-height: 1.6;
  letter-spacing: 0.15em;
  margin-bottom: 0.8rem;
}

.hero-copy-drawer p {
  margin: 0.75rem 0 0;
  font-size: clamp(0.95rem, 3.2cqi, 1.08rem);
  line-height: 1.45;
  color: #eee9e0;
  overflow-wrap: anywhere;
}

.hero-copy-drawer .hero__invitation {
  margin-top: 0.9rem;
  padding-top: 0.8rem;
  border-top: 1px solid #e8dfcf38;
}

.hero-copy-drawer .hero__invitation h2 {
  margin: 0;
  font: 500 clamp(1.5rem, 6cqi, 1.9rem)/1.08 "Barlow Condensed", sans-serif;
  letter-spacing: 0.01em;
  text-transform: none;
  color: var(--cyan);
}

.hero-copy-drawer .hero__return {
  margin-top: 1.25rem;
}

.hero__return strong {
  display: block;
  margin-bottom: 0.4rem;
  color: #fff8eb;
  font-weight: 600;
}

.hero-copy-drawer .hero__invitation p { margin-top: 0.55rem; }

.hero-copy-toggle {
  min-height: 8rem;
  background: #0b0e0df5;
}

.hero-copy-toggle b {
  font-size: 0.65rem;
}

@media (max-width: 760px) {
  .hero-copy-drawer {
    width: min(32rem, 100%);
    max-width: 100%;
  }

  .hero-copy-drawer .hero__plate {
    padding-top: 4rem;
  }

  .hero__plate::before {
    left: 1.25rem;
    right: auto;
    top: 1.3rem;
  }

  .hero-copy-toggle {
    left: auto;
    right: 0.5rem;
    top: 0.5rem;
    display: flex;
    gap: 0.5rem;
    width: auto;
    min-height: 2.75rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e8dfcf38;
  }

  .hero-copy-toggle b {
    writing-mode: horizontal-tb;
  }

  .hero-copy-drawer--closed .hero-copy-toggle {
    left: 100%;
    right: auto;
    top: 1rem;
    display: grid;
    width: 3rem;
    min-height: 8rem;
  }

  .hero-copy-drawer--closed .hero-copy-toggle b {
    writing-mode: vertical-rl;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-copy-drawer .hero__plate {
    transition: none;
  }
}
</style>
