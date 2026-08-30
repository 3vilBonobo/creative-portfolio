<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ExperienceTimeline from "../components/ExperienceTimeline.vue";
import { experience } from "../data/experience";

const root = ref<HTMLElement>();
const activeIndex = ref(0);
const status = ref<HTMLElement>();
const reducedMotion = ref(false);
let context: gsap.Context | undefined;
let mediaQuery: MediaQueryList | undefined;
let manualSelection = false;
let previousProgress = -1;

const activeEntry = computed(() => experience[activeIndex.value]);
const sectionStyle = computed(() => ({ "--experience-scroll-height": `${100 + Math.max(0, experience.length - 1) * 48}svh` }));

function setActive(index: number, announce = false) {
  activeIndex.value = Math.max(0, Math.min(index, experience.length - 1));
  if (announce) nextTick(() => { if (status.value) status.value.textContent = `${activeEntry.value.role} at ${activeEntry.value.company}`; });
}

function selectEntry(index: number) {
  manualSelection = true;
  setActive(index, true);
}

function previewEntry(index: number) {
  manualSelection = true;
  setActive(index);
}

function setupScroll() {
  context?.revert();
  if (!root.value || reducedMotion.value || experience.length < 2) return;
  gsap.registerPlugin(ScrollTrigger);
  context = gsap.context(() => {
    ScrollTrigger.create({
      trigger: root.value,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (manualSelection && Math.abs(self.progress - previousProgress) < .002) return;
        manualSelection = false;
        previousProgress = self.progress;
        setActive(Math.min(experience.length - 1, Math.floor(self.progress * experience.length)));
      },
    });
  }, root.value);
}

function handleMotionChange(event: MediaQueryListEvent) {
  reducedMotion.value = event.matches;
  setupScroll();
}

onMounted(() => {
  mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotion.value = mediaQuery.matches;
  mediaQuery.addEventListener("change", handleMotionChange);
  setupScroll();
});

onBeforeUnmount(() => {
  context?.revert();
  mediaQuery?.removeEventListener("change", handleMotionChange);
});
</script>

<template>
  <section id="experience" ref="root" class="floor-section experience" :style="sectionStyle" aria-labelledby="experience-title">
    <div class="experience__scene">
      <div class="experience__shade" aria-hidden="true"></div>
      <aside class="experience__level" aria-label="Level 02, Experience">
        <small>Level</small><strong>02</strong><span>Experience</span>
        <div class="experience__level-progress" aria-hidden="true">
          <i v-for="(_, index) in experience" :key="index" :class="{ active: index <= activeIndex }"></i>
        </div>
      </aside>
      <div class="experience__content">
        <header class="experience__heading">
          <p class="eyebrow">Career archive</p>
          <h2 id="experience-title">Experience</h2>
          <p class="experience__progress"><span>{{ String(activeIndex + 1).padStart(2, "0") }}</span> / {{ String(experience.length).padStart(2, "0") }} <b>Scroll, hover or focus</b></p>
        </header>
        <ExperienceTimeline :entries="experience" :active-index="activeIndex" @select="selectEntry" @preview="previewEntry" />
        <article :key="activeEntry.id" class="experience__details" :aria-labelledby="`experience-entry-${activeEntry.id}`">
          <p class="experience__details-label">Selected record</p>
          <h3>{{ activeEntry.role }}</h3>
          <p class="experience__details-company">{{ activeEntry.company }}<template v-if="activeEntry.location"> · {{ activeEntry.location }}</template></p>
          <p>{{ activeEntry.summary }}</p>
          <ul v-if="activeEntry.highlights.length" class="experience__highlights"><li v-for="highlight in activeEntry.highlights.slice(0, 3)" :key="highlight">{{ highlight }}</li></ul>
          <ul v-if="activeEntry.technologies.length" class="experience__technologies" aria-label="Technologies"><li v-for="technology in activeEntry.technologies" :key="technology">{{ technology }}</li></ul>
        </article>
      </div>
      <div ref="status" class="sr-only" aria-live="polite"></div>
    </div>
  </section>
</template>
