<script setup lang="ts">
import { computed } from "vue";
import HeroVisual from "../components/HeroVisual.vue";
import { useEnvironment } from "../composables/useEnvironment";

const { state } = useEnvironment();
const weatherLabel = computed(() => state.value.weatherCondition.replace(/([A-Z])/g, " $1").toLowerCase());
const sourceLabel = computed(() => ({ live: "Live", cache: "Cached", staleCache: "Cached", fallback: "Unavailable", preview: "Preview" }[state.value.source]));
</script>

<template>
  <section id="office" class="hero floor-section" aria-labelledby="hero-title">
    <HeroVisual />
    <div class="hero__content">
      <p class="eyebrow">Level 05 · Rooftop office · Athens</p>
      <h1 id="hero-title"><span>Name placeholder</span>Frontend developer.</h1>
      <p class="hero__lede">Temporary introduction — add what you build, who you help, and what makes your approach distinct.</p>
      <div class="hero__status" aria-label="Current Athens time and weather">
        <span><b>Athens</b><time :datetime="state.lastUpdated.toISOString()">{{ state.localTime }}</time></span>
        <span><b>Weather · {{ sourceLabel }}</b>{{ Math.round(state.temperature) }}°C · {{ weatherLabel }}</span>
      </div>
      <div class="actions"><a class="button button--primary" href="#projects">View selected work <span>↓</span></a><a class="button button--ghost" href="#about">About the developer</a></div>
    </div>
    <div class="scroll-cue" aria-hidden="true">Scroll to descend <span>↓</span></div>
  </section>
</template>
