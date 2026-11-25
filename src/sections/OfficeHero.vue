<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import HeroCat from "../components/HeroCat.vue";
import HeroVisual from "../components/HeroVisual.vue";
import TelescopeExperience from "../components/TelescopeExperience.vue";
import DailyPuzzleBook from "../components/DailyPuzzleBook.vue";
import DailyChessPuzzle from "../components/DailyChessPuzzle.vue";
import AquariumExperience from "../components/AquariumExperience.vue";
import { FLOOR } from "../config/floors";

const showIntroduction = ref(true);
const introductionPanel = ref<HTMLElement | null>(null);
function collapseIntroduction() {
  if (showIntroduction.value) showIntroduction.value = false;
}

let previousScrollY = 0;
let downwardTravel = 0;

function toggleIntroduction() {
  showIntroduction.value = !showIntroduction.value;
  downwardTravel = 0;
  previousScrollY = window.scrollY;
}

function handleScroll() {
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
  previousScrollY = window.scrollY;
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener("scroll", handleScroll));
</script>

<template>
  <section :id="FLOOR.office.id" class="hero hero--wide-scene floor-section" :data-floor-number="FLOOR.office.number" aria-labelledby="hero-title" @click="collapseIntroduction">
    <HeroVisual />
    <HeroCat />
    <TelescopeExperience />
    <DailyPuzzleBook />
    <DailyChessPuzzle />
    <AquariumExperience />
    <div class="hero-copy-drawer" :class="{ 'hero-copy-drawer--closed': !showIntroduction }">
      <div
        id="hero-introduction"
        ref="introductionPanel"
        class="hero__content hero__plate"
        data-parallax="-2"
        :aria-hidden="!showIntroduction"
        :inert="!showIntroduction"
        @click.stop>
        <h1 id="hero-title"><span>Irinella Boutsika</span>Frontend developer.</h1>
        <p class="hero__lede">
          I turn complex problems into interfaces that make sense. My background in law taught me to
          question assumptions. Software engineering gave that curiosity something to build.
        </p>
        <div class="hero__invitation">
          <h2>Explore. There’s more<br />than meets the eye.</h2>
          <p>
            Five floors of my work, set in an interactive Athens. Some objects are more than scenery:
            try them. There are games, hidden details and plenty of Easter eggs to discover.
          </p>
          <p class="hero__return">
            <strong>Come back at a different hour. Or in different weather.</strong>
            This world follows Athens’ real time and weather. Daylight, rain and late nights each
            bring their own atmosphere.
          </p>
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
  padding: 2.5rem clamp(1.25rem, 6cqi, 2rem) 1.75rem;
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
  margin: 1rem 0 0;
  font-size: clamp(1.0625rem, 3.6cqi, 1.1875rem);
  line-height: 1.6;
  color: #eee9e0;
  overflow-wrap: anywhere;
}

.hero-copy-drawer .hero__invitation {
  margin-top: 1.25rem;
  padding-top: 1.1rem;
  border-top: 1px solid #e8dfcf38;
}

.hero-copy-drawer .hero__invitation h2 {
  margin: 0;
  font: 500 clamp(1.6rem, 6.5cqi, 2.1rem)/1.12 "Barlow Condensed", sans-serif;
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
