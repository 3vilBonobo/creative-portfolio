<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";
import { useEnvironment } from "../../composables/useEnvironment";

const props = defineProps<{ portrait?: boolean; paused?: boolean }>();
const { state, christmasVisible } = useEnvironment();
const root = ref<SVGSVGElement>();
const hidden = ref(document.hidden);
const offscreen = ref(false);
const paused = computed(() => props.paused || hidden.value || offscreen.value);
const nightOpacity = computed(
  () => ({ dawn: 0.02, day: 0, goldenHour: 0, dusk: 0.1, night: 0.3 })[state.value.timePhase],
);
const treeBrightness = computed(() => 1 - nightOpacity.value * 1.5);
const id = `christmas-${useId().replace(/:/g, "")}`;
const placement = computed(() =>
  props.portrait ? "translate(-100 460) scale(.293)" : "translate(185 235) scale(.215)",
);
const colors = ["#ff4665", "#55ff89", "#579aff", "#ffc24d", "#ff64d4"] as const;
// Registered to the photographed bulbs in the 1024 × 1536 tree cutouts.
const bulbs = [
  [586, 322, 0],
  [533, 371, 1],
  [526, 420, 3],
  [477, 470, 0],
  [435, 489, 2],
  [371, 508, 4],
  [339, 522, 3],
  [670, 605, 4],
  [626, 617, 0],
  [574, 647, 1],
  [522, 686, 3],
  [456, 725, 0],
  [395, 747, 2],
  [348, 763, 4],
  [244, 763, 3],
  [706, 846, 0],
  [681, 905, 1],
  [615, 928, 0],
  [540, 960, 4],
  [559, 954, 2],
  [495, 1010, 3],
  [429, 1038, 0],
  [330, 1050, 1],
  [278, 1070, 0],
  [190, 1076, 2],
  [852, 1090, 3],
  [816, 1171, 0],
  [776, 1218, 3],
  [713, 1239, 4],
  [610, 1260, 0],
  [528, 1264, 1],
  [482, 1275, 4],
  [425, 1301, 3],
] as const;
let observer: IntersectionObserver | undefined;
function syncVisibility() {
  hidden.value = document.hidden;
}
onMounted(() => {
  document.addEventListener("visibilitychange", syncVisibility);
  if (root.value && typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) offscreen.value = !entry.isIntersecting;
      },
      { rootMargin: "160px" },
    );
    observer.observe(root.value);
  }
});
onBeforeUnmount(() => {
  observer?.disconnect();
  document.removeEventListener("visibilitychange", syncVisibility);
});
</script>

<template>
  <svg
    ref="root"
    class="christmas-tree"
    :class="{ 'christmas-tree--paused': paused }"
    :viewBox="portrait ? '0 0 941 1672' : '0 0 1672 941'"
    :data-season-visible="christmasVisible"
    :data-phase="state.timePhase"
    aria-hidden="true">
    <template v-if="christmasVisible">
      <defs>
        <clipPath :id="`${id}-foreground`">
          <!-- Keep the sofa in front of the tree in the wide room. In the
               portrait plate, preserve the telescope tube and its mount. -->
          <path v-if="!portrait" d="M0 0H1672V941H427V590L395 572 348 545 310 542 265 548 190 560 0 590Z" />
          <path
            v-else
            clip-rule="evenodd"
            d="M0 0H941V1672H0ZM20 800L129 690Q141 678 154 692L163 709Q165 720 155 728L50 825ZM59 803L106 786 130 820 113 854 66 847Z" />
        </clipPath>
      </defs>
      <g :clip-path="`url(#${id}-foreground)`">
        <g :transform="placement">
          <image
            href="/hero/christmas/tree-day.png"
            width="1024"
            height="1536"
            :style="{ filter: `brightness(${treeBrightness})` }" />
          <image
            href="/hero/christmas/tree-night.png"
            width="1024"
            height="1536"
            :opacity="nightOpacity"
            class="christmas-tree__night" />
          <g class="christmas-tree__lights">
            <g
              v-for="([x, y, color], index) in bulbs"
              :key="index"
              class="christmas-tree__bulb"
              :style="{
                '--delay': `${-(index % 9) * 0.63}s`,
                '--duration': `${3.8 + (index % 5) * 0.47}s`,
                color: colors[color],
              }">
              <circle :cx="x" :cy="y" r="16" fill="currentColor" opacity=".32" class="christmas-tree__halo" />
              <circle :cx="x" :cy="y" r="8" fill="currentColor" opacity=".8" class="christmas-tree__bulb-core" />
              <circle :cx="x" :cy="y" r="4" fill="#fff5e4" />
            </g>
          </g>
        </g>
      </g>
    </template>
  </svg>
</template>

<style scoped>
.christmas-tree {
  position: absolute;
  inset: 0;
  z-index: 4;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.christmas-tree__night {
  transition: opacity 0.8s ease;
}
.christmas-tree__bulb {
  opacity: 0.46;
  animation: christmas-twinkle var(--duration) ease-in-out var(--delay) infinite;
  transform-box: fill-box;
  transform-origin: center;
}
.christmas-tree__halo {
  filter: blur(4px);
}
.christmas-tree--paused .christmas-tree__bulb {
  animation-play-state: paused;
}
@keyframes christmas-twinkle {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.82);
  }
  50% {
    opacity: 1;
    transform: scale(1.35);
  }
}
@media (prefers-reduced-motion: reduce) {
  .christmas-tree__bulb {
    animation: none;
    opacity: 0.72;
    transform: none;
  }
  .christmas-tree__night {
    transition: none;
  }
}
</style>
