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
  <section :id="FLOOR.office.id" class="hero floor-section" :data-floor-number="FLOOR.office.number" aria-labelledby="hero-title" @click="collapseIntroduction">
    <HeroVisual />
    <HeroCat />
    <TelescopeExperience />
    <DailyPuzzleBook />
    <DailyChessPuzzle />
    <AquariumExperience />
    <div class="hero-copy-drawer" :class="{ 'hero-copy-drawer--closed': !showIntroduction }">
      <div
        id="hero-introduction"
        class="hero__content hero__plate"
        data-parallax="-2"
        :aria-hidden="!showIntroduction"
        :inert="!showIntroduction">
        <h1 id="hero-title"><span>Irinella Boutsika</span>Frontend developer.</h1>
        <p class="hero__lede">
          I build thoughtful, dependable interfaces — and this is my playful corner of futuristic Athens.
          Explore, interact, and discover little details along the way. This world follows Athens through
          daylight, weather, and night. Come back after sunset; you might find a different mood.
        </p>
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
    <div class="hero-threshold" data-parallax="-7" aria-hidden="true">
      <i class="hero-threshold__pipe" /><i class="hero-threshold__conduit" />
      <span><b>{{ FLOOR.about.number }}</b> {{ FLOOR.about.label }} · Floor below</span>
    </div>
  </section>
</template>
