<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import HeroVisual from "../components/HeroVisual.vue";
import TelescopeExperience from "../components/TelescopeExperience.vue";
import DailyPuzzleBook from "../components/DailyPuzzleBook.vue";
import { useEnvironment } from "../composables/useEnvironment";

const { state } = useEnvironment();
const showIntroduction = ref(true);
const weatherLabel = computed(() => state.value.weatherCondition.replace(/([A-Z])/g, " $1").toLowerCase());
const sourceLabel = computed(() => ({ live: "Live", cache: "Cached", staleCache: "Cached", fallback: "Unavailable", preview: "Preview" }[state.value.source]));
function collapseIntroduction() { if (showIntroduction.value) showIntroduction.value = false; }

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
  if (showIntroduction.value && downwardTravel >= 280) collapseIntroduction();

  previousScrollY = scrollY;
}

onMounted(() => {
  previousScrollY = window.scrollY;
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener("scroll", handleScroll));
</script>

<template>
  <section id="office" class="hero floor-section" aria-labelledby="hero-title" @click="collapseIntroduction">
    <HeroVisual />
    <TelescopeExperience />
    <DailyPuzzleBook />
    <div class="hero-copy-drawer" :class="{ 'hero-copy-drawer--closed': !showIntroduction }">
      <div id="hero-introduction" class="hero__content hero__plate" data-parallax="-2" :aria-hidden="!showIntroduction" :inert="!showIntroduction">
        <p class="eyebrow">Level 05 · Rooftop office · Athens</p>
        <h1 id="hero-title"><span>Irene Boutsika</span>Frontend developer.</h1>
        <p class="hero__lede">I build clear, dependable interfaces for complex workflows—combining thoughtful frontend engineering with an evidence-led, human-centred approach.</p>
        <div class="hero__status" aria-label="Current Athens time and weather">
          <span><b>Athens</b><time :datetime="state.lastUpdated.toISOString()">{{ state.localTime }}</time></span>
          <span><b>Weather · {{ sourceLabel }}</b>{{ Math.round(state.temperature) }}°C · {{ weatherLabel }}</span>
        </div>
        <div class="actions"><a class="button button--primary" href="#projects">View selected work <span>↓</span></a><a class="button button--ghost" href="#about">About the developer</a></div>
      </div>
      <button class="hero-copy-toggle" type="button" :aria-expanded="showIntroduction" aria-controls="hero-introduction" @click.stop="toggleIntroduction">
        <span aria-hidden="true">{{ showIntroduction ? '‹' : '›' }}</span><b>{{ showIntroduction ? 'Hide intro' : 'Show intro' }}</b>
      </button>
    </div>
    <div class="scroll-cue" aria-hidden="true">Scroll to descend <span>↓</span></div>
    <div class="hero-threshold" data-parallax="-7" aria-hidden="true">
      <i class="hero-threshold__pipe" /><i class="hero-threshold__conduit" />
      <span><b>04</b> About · Floor below</span>
    </div>
  </section>
</template>
