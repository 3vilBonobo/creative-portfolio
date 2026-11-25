<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const scene = ref<HTMLElement | null>(null);
const topOffset = ref(0);
let observer: ResizeObserver | undefined;

// Measure clearance at the section's anchor position, never at its current scroll position.
function updateClearance() {
  const element = scene.value;
  if (!element) return;
  const section = element.closest("section");
  const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
  const anchorGap = section ? parseFloat(getComputedStyle(section).scrollMarginTop) || 0 : 0;
  const mobile = window.matchMedia("(max-width: 620px)").matches;
  const sourceWidth = mobile ? 768 : 1370;
  // Conservative top of the complete fixture housing in the unchanged v004 canvases.
  const fixtureTop = (mobile ? 68 : 110) * element.clientWidth / sourceWidth;
  topOffset.value = Math.max(mobile ? 82 : 0, Math.ceil(headerBottom + 12 - anchorGap - fixtureTop));
}

onMounted(() => {
  observer = new ResizeObserver(updateClearance);
  if (scene.value) observer.observe(scene.value);
  const header = document.querySelector(".site-header");
  if (header) observer.observe(header);
  updateClearance();
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div ref="scene" class="projects-environment" :style="{ '--projects-scene-offset': `${topOffset}px` }" aria-hidden="true">
    <div class="projects-environment__continuation"></div>
    <div class="projects-environment__plate">
      <div class="projects-environment__spill"></div>
      <div class="projects-environment__emission"></div>
    </div>
  </div>
</template>

<style scoped>
.projects-environment {
  position: absolute;
  z-index: -1;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  container-type: inline-size;
  background: #10191b;
}
.projects-environment__plate {
  position: absolute;
  z-index: 1;
  inset: var(--projects-scene-offset, 0px) 0 auto;
  aspect-ratio: 1370 / 1148;
  background: url('/environments/floor-02-projects/floor-02-projects-wall-base-desktop.webp') center top / 100% 100% no-repeat;
  mask-image: linear-gradient(to bottom, #000 calc(100% - 110px), transparent);
}
.projects-environment__spill,
.projects-environment__emission {
  position: absolute;
  inset: 0;
  background-position: center top;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  opacity: var(--projects-light-intensity, 1);
}
.projects-environment__spill {
  z-index: 1;
  background-image: url('/environments/floor-02-projects/floor-02-projects-light-01-spill-desktop.png');
}
.projects-environment__emission {
  z-index: 2;
  background-image: url('/environments/floor-02-projects/floor-02-projects-light-01-emission-desktop.png');
}
.projects-environment__continuation {
  position: absolute;
  z-index: 0;
  inset: calc(var(--projects-scene-offset, 0px) + 100cqw * 1148 / 1370 - 110px) 0 0;
  background: url('/environments/floor-02-projects/floor-02-projects-wall-continuation-desktop.webp') center top / 100% auto repeat-y;
}
@media (max-width: 620px) {
  .projects-environment__plate {
    aspect-ratio: 768 / 2048;
    background-image: url('/environments/floor-02-projects/floor-02-projects-wall-base-mobile.webp');
  }
  .projects-environment__spill {
    background-image: url('/environments/floor-02-projects/floor-02-projects-light-01-spill-mobile.png');
  }
  .projects-environment__emission {
    background-image: url('/environments/floor-02-projects/floor-02-projects-light-01-emission-mobile.png');
  }
  .projects-environment__continuation {
    top: calc(var(--projects-scene-offset, 0px) + 100cqw * 2048 / 768 - 110px);
    background-image: url('/environments/floor-02-projects/floor-02-projects-wall-continuation-mobile.webp');
  }
}
</style>
