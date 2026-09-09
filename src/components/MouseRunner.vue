<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from "vue";
import { sampleMouseMotion } from "../services/mouseMotion";

const props = defineProps<{ active: boolean }>();
const emit = defineEmits<{ ready: [] }>();
const elapsed = ref(0);
const matteId = `mouse-matte-${useId()}`;
const pose = computed(() => sampleMouseMotion(elapsed.value));
// Source windows align the generated rows to a common paw baseline and keep
// the rear-view ears inside the crop. The first column includes its long nose.
const columnX = [0, 392, 774, 1152];
const columnWidth = [396, 384, 384, 384];
const rowY = [0, 300, 613];
let animationFrame = 0;
let startedAt: number | undefined;

function tick(now: number) {
  startedAt ??= now;
  elapsed.value = now - startedAt;
  if (!pose.value.done) animationFrame = requestAnimationFrame(tick);
}
watch(() => props.active, (active) => {
  cancelAnimationFrame(animationFrame);
  elapsed.value = 0;
  startedAt = undefined;
  if (active) animationFrame = requestAnimationFrame(tick);
}, { immediate: true });
onBeforeUnmount(() => cancelAnimationFrame(animationFrame));

const runnerStyle = computed(() => ({
  // The nose leads in profile; the rump is centred on the hole after turning.
  left: `calc(${pose.value.approach * 100}% - ${pose.value.approach * 48}px - var(--mouse-size) * ${1 - pose.value.approach * .06 - pose.value.turn * .32})`,
  opacity: props.active ? pose.value.opacity : 0,
  transform: `translateY(${-pose.value.entry * 4}px) scale(${1 - pose.value.entry * .12})`,
}));
const spriteStyle = computed(() => {
  const column = pose.value.frame % 4;
  const width = columnWidth[column];
  return {
  backgroundSize: `${1536 / width * 100}% ${1024 / 342 * 100}%`,
  backgroundPosition: `${columnX[column] / (1536 - width) * 100}% ${rowY[Math.floor(pose.value.frame / 4)] / (1024 - 342) * 100}%`,
  // The whole animal fades into the doorway; no moving crop or mask.
  filter: `url(#${matteId}) brightness(${.78 - pose.value.entry * .18})`,
  };
});
</script>

<template>
  <svg class="mouse-runner__filters" aria-hidden="true" width="0" height="0">
    <defs>
      <!-- A luminance key removes the generated black matte at render time. -->
      <filter :id="matteId" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  6 6 6 0 0" />
      </filter>
    </defs>
  </svg>
  <img class="mouse-runner__preload" src="/contact/mouse/house-mouse-gait.png" alt="" @load="emit('ready')" />
  <div class="mouse-runner" :style="runnerStyle" :data-pose="pose.frame" :data-entering="pose.entry > 0">
    <span class="mouse-runner__shadow" :style="{ opacity: .5 * (1 - pose.entry) }" />
    <span class="mouse-runner__sprite" :style="spriteStyle" />
  </div>
</template>

<style scoped>
.mouse-runner__preload { display: none; }
.mouse-runner__filters { position: absolute; pointer-events: none; }
.mouse-runner { position: absolute; bottom: 15px; width: var(--mouse-size); aspect-ratio: 9 / 8; transform-origin: 62% 82%; pointer-events: none; will-change: left, transform; }
.mouse-runner__sprite { display: block; width: 100%; height: 100%; background: url('/contact/mouse/house-mouse-gait.png') no-repeat; background-size: 400% 300%; }
.mouse-runner__shadow { position: absolute; left: 35%; bottom: 15%; width: 48%; height: 5%; border-radius: 50%; background: #000; filter: blur(2px); transform: skewX(-20deg); }
@media (prefers-reduced-motion: reduce) { .mouse-runner { display: none; } }
</style>
