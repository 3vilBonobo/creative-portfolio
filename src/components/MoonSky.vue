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
        <clipPath id="moon-phase"><path :d="moon.path"/></clipPath>
      </defs>
      <image href="/moon-realistic-warm.png" x="1" y="1" width="98" height="98" preserveAspectRatio="xMidYMid slice" clip-path="url(#moon-phase)"/>
    </svg>
    <div class="moon-sky__cloud moon-sky__cloud--far"/><div class="moon-sky__cloud moon-sky__cloud--near"/>
  </div>
</template>
