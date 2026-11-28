<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { getWeatherEffectValues } from "../../services/weatherEffects";
import type { EnvironmentState } from "../../types/environment";
import { getMoonAppearance, getPreviewMoonAppearance } from "../../services/moonMath";

const props = defineProps<{ state: EnvironmentState; paused?: boolean; previewPhase?: number | null; previewProgress?: number; photoSpace?: boolean }>();
const now = ref(new Date());
const moon = computed(() => props.previewPhase != null ? getPreviewMoonAppearance(props.previewPhase, props.previewProgress) : getMoonAppearance(now.value));
// Span the left-hand sky to the gap just before the right-hand glass towers.
const arcX = computed(() => props.photoSpace ? 18 + moon.value.progress * 60 : 20.5 + moon.value.progress * 40.5);
// Photo-space endpoints sit below the skyline by more than the moon's radius.
// The legacy composition keeps its original path in full-scene coordinates.
const arcY = computed(() => props.photoSpace
  ? 55 - Math.sin(moon.value.progress * Math.PI) * 39
  : 42 - Math.sin(moon.value.progress * Math.PI) * 17);
const cloudiness = computed(() => getWeatherEffectValues(props.state).cloud);
const moonOpacity = computed(() => {
  if (!moon.value.visible || props.state.timePhase !== "night") return 0;
  const base = .98;
  // Keep a readable lunar disc through the weather tint; cloud layers still
  // soften the sky, but should not make an above-horizon Moon disappear.
  return Math.max(.72, base - cloudiness.value * .12);
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
