<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { EnvironmentState } from "../types/environment";
import { getMoonAppearance } from "../services/moonMath";

const props = defineProps<{ state: EnvironmentState; paused?: boolean }>();
const now = ref(new Date());
const moon = computed(() => getMoonAppearance(now.value));
const arcX = computed(() => 21 + moon.value.progress * 48);
const arcY = computed(() => 31 - Math.sin(moon.value.progress * Math.PI) * 12);
const cloudiness = computed(() => Math.min(1, Math.max(0, props.state.cloudCover / 100)));
const moonOpacity = computed(() => {
  if (!moon.value.visible || (props.state.timePhase !== "night" && props.state.timePhase !== "dusk")) return 0;
  return Math.max(.1, 1 - cloudiness.value * .7);
});
const style = computed(() => ({
  "--moon-x": `${arcX.value}%`, "--moon-y": `${arcY.value}%`,
  "--moon-opacity": moonOpacity.value.toFixed(3), "--moon-light": moon.value.illumination.toFixed(3),
  "--moon-cloud": cloudiness.value.toFixed(3),
}));
let timer: number | undefined;

function tick() { now.value = new Date(); }
onMounted(() => { tick(); timer = window.setInterval(tick, 60_000); });
onBeforeUnmount(() => window.clearInterval(timer));
</script>

<template>
  <div class="moon-sky" :class="{ 'moon-sky--paused': paused }" :style="style">
    <svg class="moon-sky__moon" viewBox="0 0 100 100" role="img" :aria-label="moon.label">
      <defs>
        <radialGradient id="moon-surface" cx="38%" cy="32%" r="72%">
          <stop offset="0" stop-color="#fffde4"/><stop offset=".58" stop-color="#f2edc8"/><stop offset="1" stop-color="#c9c59f"/>
        </radialGradient>
        <filter id="moon-grain"><feTurbulence baseFrequency=".085" numOctaves="3" seed="12" type="fractalNoise"/><feBlend in="SourceGraphic" mode="multiply"/></filter>
        <clipPath id="moon-disc"><circle cx="50" cy="50" r="49"/></clipPath>
      </defs>
      <circle class="moon-sky__glow" cx="50" cy="50" r="48"/>
      <circle cx="50" cy="50" r="49" fill="#101725"/>
      <path :d="moon.path" fill="url(#moon-surface)" filter="url(#moon-grain)" clip-path="url(#moon-disc)"/>
      <g class="moon-sky__craters" :class="{ 'moon-sky__craters--waxing': moon.waxing }" clip-path="url(#moon-disc)">
        <circle cx="35" cy="33" r="6"/><circle cx="65" cy="58" r="8"/><circle cx="44" cy="72" r="4"/><circle cx="70" cy="27" r="3"/>
      </g>
    </svg>
    <div class="moon-sky__cloud moon-sky__cloud--far"/><div class="moon-sky__cloud moon-sky__cloud--near"/>
  </div>
</template>
