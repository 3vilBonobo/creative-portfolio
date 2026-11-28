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
import AthensArcade from "../components/hero/AthensArcade.vue";
import { useRadio } from "../composables/useRadio";
import { useEnvironment } from "../composables/useEnvironment";
import { FLOOR } from "../config/floors";

const { portrait, landscape, phone } = usePhoneLayout();
const radio = useRadio();
const { state } = useEnvironment();
const hero = ref<HTMLElement>();
const orientationDialog = ref<HTMLDialogElement>();
const orientationPromptOpen = ref(false);
const telescope = ref<InstanceType<typeof TelescopeExperience>>();
const aquarium = ref<InstanceType<typeof AquariumExperience>>();
const chess = ref<InstanceType<typeof DailyChessPuzzle>>();
const sudoku = ref<InstanceType<typeof DailyPuzzleBook>>();
const arcade = ref<InstanceType<typeof AthensArcade>>();
const cat = ref<InstanceType<typeof HeroCat>>();
const studioRequested = ref(false);
const studioContained = ref(false);
const portraitExpanded = ref(false);
const immersive = computed(() => studioRequested.value && landscape.value);
const discoveryOpen = computed(() => !!(telescope.value?.open || aquarium.value?.open || chess.value?.open || sudoku.value?.open || arcade.value?.open));
const ORIENTATION_CHOICE_KEY = "portfolio-mobile-orientation-choice";
let enterStudioAfterRotation = false;
let mounted = false;
let returnFocus: HTMLElement | null = null;
let studioScroll = 0;
let previousOverflow = "";
function discover(kind: "telescope" | "aquarium" | "chess" | "sudoku" | "arcade" | "cat", event: Event) {
  if (kind === "cat") cat.value?.pet();
  else {
    returnFocus = event.currentTarget as HTMLElement;
    ({ telescope, aquarium, chess, sudoku, arcade })[kind].value?.show();
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
  const dialog = orientationDialog.value?.open ? orientationDialog.value : discoveryOpen.value ? document.querySelector<HTMLElement>('.telescope-app, .aquarium-app, .puzzle-book, dialog[open].chess-dialog, dialog[open].athens-arcade') : hero.value;
  const controls = dialog ? [...dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]')].filter(el => el.getClientRects().length && !el.closest('[inert]')) : [];
  const first = controls[0], last = controls[controls.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
}
const showIntroduction = ref(true);
let heroVisibilityObserver: IntersectionObserver | undefined;
let heroHasBeenVisible = false;
function collapseIntroduction() {
  if (!phone.value && showIntroduction.value) showIntroduction.value = false;
}

function toggleIntroduction() {
  showIntroduction.value = !showIntroduction.value;
}

onMounted(() => {
  mounted = true;
  void openOrientationPrompt();
  document.addEventListener("keydown", keepDialogFocus);
  if (hero.value && !phone.value && "IntersectionObserver" in window) {
    heroVisibilityObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.intersectionRatio >= 0.5) heroHasBeenVisible = true;
      else if (heroHasBeenVisible) collapseIntroduction();
    }, { threshold: [0.5] });
    heroVisibilityObserver.observe(hero.value);
  }
});

onBeforeUnmount(() => {
  heroVisibilityObserver?.disconnect();
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
        <AthensArcade ref="arcade" :hotspots="!portrait" />
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
          <button type="button" aria-haspopup="dialog" @click="discover('arcade', $event)">Athens arcade <span aria-hidden="true">↗</span></button>
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
    <div v-show="!phone" class="hero-copy-drawer" :class="{ 'hero-copy-drawer--closed': !showIntroduction }" :data-phase="state.timePhase">
      <div
        id="hero-introduction"
        class="hero__content hero__plate"
        data-parallax="-2"
        :aria-hidden="!showIntroduction"
        :inert="!showIntroduction"
        @click.stop>
        <header class="hero__opening">
          <div class="hero__identity">
            <p class="hero__identity-name">Irinella Boutsika</p>
            <p class="hero__identity-location">Athens, GR</p>
            <p class="hero__identity-role">Software engineer <span aria-hidden="true">/</span> Creative technologist</p>
          </div>
          <h1 id="hero-title" class="hero__headline">This could have been a normal portfolio.</h1>
          <p class="hero__punchline">Clearly, things got out of hand.</p>
        </header>
        <section class="hero__personal-section" aria-labelledby="hero-personal-title">
            <h2 id="hero-personal-title">Former lawyer. Current developer. Chronically curious.</h2>
            <p>I'm fascinated by how things work, why people behave the way they do, and what happens when <strong>technology meets imagination</strong>. Somewhere along the way, <strong>code became my favourite medium</strong> for exploring all of the above.</p>
            <p>I build interfaces, solve problems and occasionally turn perfectly reasonable ideas into <strong>unnecessarily elaborate experiments</strong>.</p>
        </section>
        <section class="hero__world" aria-labelledby="hero-world-title">
            <h2 id="hero-world-title">Welcome to my little corner of the future.</h2>
            <p>A cyberpunk interpretation of Athens, shaped by real time, local weather and an unhealthy appreciation for science fiction.</p>
            <p>Five floors. Projects, experiments, hidden details and a few surprises. Curiosity is encouraged.</p>
        </section>
        <aside class="hero__exploration" aria-label="Explore the portfolio">
          <ul class="hero__exploration-cues" aria-label="How to explore">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5.5" y="2.5" width="13" height="19" rx="6.5" /><path d="M12 5v4m0 0-2-2m2 2 2-2" /></svg>
              <span>Scroll to explore.</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 20h16M4 4h16m-8 1v5m0-5L9 8m3-3 3 3m-3 11v-5m0 5-3-3m3 3 3-3" /></svg>
              <span>Take the elevator.</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 3 13 12-5.5.5L15 21l-2.5 1-2.7-5.2L5 20V3Z" /></svg>
              <span>Poke around. See what happens.</span>
            </li>
          </ul>
        </aside>
        <p class="hero__cat-note">The cat is not part of the support team.</p>
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
  --intro-panel: #101614f5;
  --intro-frame: #d8c79d48;
  --intro-edge: #d8a452;
  --intro-name: #f2b65f;
  --intro-location: #c2c9c2;
  --intro-cyan: #91d8d2;
  --intro-heading: #f4eee2;
  --intro-body: #d5d8d1;
  --intro-strong: #f4eee2;
  --intro-warm: #f0b45c;
  --intro-cue-bg: #141e1d;
  --intro-cue-text: #edf0e9;
  --intro-note: #aeb9b1;
  --intro-toggle-bg: #111918ee;
  --intro-toggle-text: #e8e1d4;
  width: clamp(32rem, 50vw, 50rem);
  max-width: calc(100% - 3rem);
  container: hero-intro / inline-size;
  transition: color .5s ease;
}

.hero-copy-drawer[data-phase="goldenHour"] {
  --intro-name: #ffc06d;
  --intro-edge: #e7a950;
  --intro-warm: #f2b057;
}

.hero-copy-drawer[data-phase="dusk"] {
  --intro-panel: #13131bf5;
  --intro-frame: #d7b7da55;
  --intro-edge: #e3a85d;
  --intro-name: #ffc16d;
  --intro-location: #d3cbd2;
  --intro-cyan: #a2dcd9;
  --intro-heading: #f5eee9;
  --intro-body: #d7d2d7;
  --intro-strong: #f5eee9;
  --intro-warm: #f0b35f;
  --intro-cue-bg: #191720;
  --intro-cue-text: #eee9ef;
  --intro-note: #bcb4c0;
  --intro-toggle-bg: #15141dee;
  --intro-toggle-text: #eee9ef;
}

.hero-copy-drawer[data-phase="night"] {
  --intro-panel: #100d1bf5;
  --intro-frame: #a77acb61;
  --intro-edge: #ed5dc6;
  --intro-name: #ff7bd5;
  --intro-location: #c8bfd6;
  --intro-cyan: #79edf4;
  --intro-heading: #f5effb;
  --intro-body: #d8d1e2;
  --intro-strong: #f8f3ff;
  --intro-warm: #ff79d5;
  --intro-cue-bg: #171322;
  --intro-cue-text: #efe8f6;
  --intro-note: #b5aabd;
  --intro-toggle-bg: #151020f2;
  --intro-toggle-text: #eee7f5;
}

.hero-copy-drawer .hero__plate {
  display: grid;
  gap: clamp(.65rem, 1vw, .9rem);
  width: 100%;
  padding: clamp(1.1rem, 1.8vw, 1.55rem);
  border: 1px solid var(--intro-frame);
  border-left: 2px solid var(--intro-edge);
  background: linear-gradient(145deg, var(--intro-panel), color-mix(in srgb, var(--intro-panel) 94%, #253431) 72%, var(--intro-panel));
  box-shadow: 0 1.5rem 4rem #0008, inset 0 1px #ffffff10, inset 0 -1px #0005;
  backdrop-filter: blur(13px);
  text-shadow: none;
  transition: color .5s ease, border-color .5s ease, background .5s ease;
}

.hero-copy-drawer .hero__plate::before { display: none; }
.hero__opening { min-width: 0; }
.hero__identity { display: grid; grid-template-columns: 1fr auto; align-items: baseline; gap: .15rem .8rem; }
.hero__identity p { margin: 0; }
.hero__identity-name { color: var(--intro-name); font: 600 .78rem/1.45 "IBM Plex Mono", monospace; letter-spacing: .08em; text-transform: uppercase; }
.hero__identity-location { color: var(--intro-location); font: .67rem/1.45 "IBM Plex Mono", monospace; letter-spacing: .08em; text-transform: uppercase; }
.hero__identity-role { grid-column: 1 / -1; color: var(--intro-cyan); font: 500 .7rem/1.55 "IBM Plex Mono", monospace; letter-spacing: .045em; text-transform: uppercase; }
.hero__identity-role span { padding-inline: .2rem; color: var(--intro-warm); }
.hero-copy-drawer .hero__headline {
  max-width: 22ch;
  margin: .55rem 0 0;
  color: var(--intro-heading);
  font: 750 clamp(2rem, 4.55cqi, 2.7rem)/1.08 Manrope, sans-serif;
  letter-spacing: -.055em;
  text-transform: none;
  overflow-wrap: normal;
}
.hero__punchline { margin: .4rem 0 0; color: var(--intro-cyan); font: 600 clamp(1rem, 2.7cqi, 1.18rem)/1.35 Manrope, sans-serif; }
.hero__personal-section, .hero__world { min-width: 0; padding-top: .75rem; border-top: 1px solid var(--intro-frame); }
.hero__personal-section h2, .hero__world h2 { margin: 0 0 .45rem; color: var(--intro-heading); font: 700 clamp(.98rem, 2.65cqi, 1.12rem)/1.35 Manrope, sans-serif; letter-spacing: -.025em; text-transform: none; }
.hero__personal-section p, .hero__world p { margin: .45rem 0 0; color: var(--intro-body); font: 400 clamp(.9rem, 2.1cqi, 1rem)/1.52 Manrope, sans-serif; }
.hero__personal-section strong { color: var(--intro-strong); font-weight: 700; }
.hero__world h2 { color: var(--intro-warm); }
.hero__exploration { min-width: 0; padding: .35rem .8rem; background: var(--intro-cue-bg); transition: background-color .5s ease; }
.hero__exploration-cues { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; }
.hero__exploration-cues li { display: flex; align-items: center; gap: .6rem; min-width: 0; padding: .42rem 0; color: var(--intro-cue-text); font: 500 clamp(.84rem, 2.1cqi, .94rem)/1.4 Manrope, sans-serif; }
.hero__exploration-cues svg { flex: 0 0 1.05rem; width: 1.05rem; height: 1.05rem; fill: none; stroke: var(--intro-cyan); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.hero__exploration-cues li > span { min-width: 0; }
.hero-copy-drawer .hero__cat-note { margin: .05rem 0 0; color: var(--intro-note); font: italic .68rem/1.4 Manrope, sans-serif; }

@media (max-height: 800px) and (min-width: 761px) {
  .hero-copy-drawer { width: clamp(34rem, 54vw, 50rem); }
  .hero-copy-drawer .hero__plate { gap: .55rem; padding: .9rem 1rem .8rem; }
  .hero-copy-drawer .hero__headline { margin-top: .25rem; font-size: clamp(2rem, 4.9cqi, 2.55rem); }
  .hero__punchline { margin-top: .2rem; font-size: clamp(.94rem, 2.5cqi, 1.05rem); }
  .hero__personal-section, .hero__world { padding-top: .5rem; }
  .hero__personal-section h2, .hero__world h2 { margin-bottom: .3rem; font-size: clamp(.94rem, 2.5cqi, 1.02rem); }
  .hero__personal-section p, .hero__world p { margin-top: .3rem; font-size: clamp(.84rem, 1.9cqi, .9rem); line-height: 1.4; }
  .hero__exploration { padding: .55rem .7rem; }
  .hero__exploration-cues { gap: .4rem; }
  .hero__exploration-cues li { gap: .45rem; font-size: clamp(.78rem, 1.9cqi, .84rem); }
  .hero-copy-drawer .hero__cat-note { font-size: .62rem; }
}

@media (max-height: 640px) and (min-width: 761px) {
  .hero-copy-drawer .hero__plate { gap: .5rem; padding: .7rem .85rem .65rem; }
  .hero-copy-drawer .hero__headline { margin-top: .2rem; font-size: clamp(2rem, 5.8cqi, 2.55rem); }
  .hero__punchline { margin-top: .1rem; font-size: .92rem; }
  .hero__personal-section, .hero__world { padding-top: .35rem; }
  .hero__personal-section h2, .hero__world h2 { margin-bottom: .15rem; font-size: .92rem; line-height: 1.2; }
  .hero__personal-section p, .hero__world p { margin-top: .2rem; font-size: .78rem; line-height: 1.3; }
  .hero__exploration { padding: .4rem .55rem; }
  .hero__exploration-cues { gap: .3rem; }
  .hero__exploration-cues li { gap: .3rem; }
  .hero__exploration-cues svg { flex-basis: .9rem; width: .9rem; height: .9rem; }
  .hero-copy-drawer .hero__cat-note { font-size: .58rem; }
}

.hero-copy-toggle {
  top: .8rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: .4rem;
  width: auto;
  min-height: 2.55rem;
  padding: .45rem .7rem;
  border: 1px solid var(--intro-frame);
  border-left: 0;
  background: var(--intro-toggle-bg);
  color: var(--intro-toggle-text);
  transition: border-color .18s ease, background-color .18s ease, color .18s ease;
}

.hero-copy-toggle:hover {
  border-color: var(--intro-cyan);
  background: color-mix(in srgb, var(--intro-toggle-bg), var(--intro-cyan) 12%);
  color: var(--intro-cyan);
}

.hero-copy-toggle:focus-visible {
  outline: 2px solid var(--intro-cyan);
  outline-offset: 3px;
}

.hero-copy-toggle b {
  font: 500 .58rem/1.2 "IBM Plex Mono", monospace;
  letter-spacing: .08em;
  text-transform: uppercase;
  writing-mode: horizontal-tb;
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
  .hero-copy-toggle { transition: none; }
}
</style>
