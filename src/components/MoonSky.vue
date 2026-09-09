<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { getWeatherEffectValues } from "../services/weatherEffects";
import type { EnvironmentState } from "../types/environment";
import { getMoonAppearance, getPreviewMoonAppearance } from "../services/moonMath";

const props = defineProps<{ state: EnvironmentState; paused?: boolean; previewPhase?: number | null; previewProgress?: number }>();
const now = ref(new Date());
const moon = computed(() => props.previewPhase != null ? getPreviewMoonAppearance(props.previewPhase, props.previewProgress) : getMoonAppearance(now.value));
const arcX = computed(() => 21 + moon.value.progress * 39.8);
// Put the entire disc below the skyline at both ends, preserving the 19% apex.
const arcY = computed(() => 40 - Math.sin(moon.value.progress * Math.PI) * 21);
const cloudiness = computed(() => getWeatherEffectValues(props.state).cloud);
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
  <div class="moon-sky" :class="{ 'moon-sky--paused': paused, 'moon-sky--preview': previewPhase != null }" :style="style">
    <svg class="moon-sky__moon" viewBox="0 0 100 100" role="img" :aria-label="moon.label">
      <defs>
        <clipPath id="moon-phase"><path :d="moon.path"/></clipPath>
      </defs>
      <image href="/moon-realistic-warm.png" x="1" y="1" width="98" height="98" preserveAspectRatio="xMidYMid slice" clip-path="url(#moon-phase)"/>
    </svg>
  </div>
</template>
