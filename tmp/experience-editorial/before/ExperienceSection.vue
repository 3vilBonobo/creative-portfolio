<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ExperienceTimeline from "../components/ExperienceTimeline.vue";
import ExperienceEnvironment from "../components/ExperienceEnvironment.vue";
import { experience } from "../data/experience";
import { FLOOR } from "../config/floors";

const root = ref<HTMLElement>();
const activeIndex = ref(0);
const status = ref<HTMLElement>();
const reducedMotion = ref(false);
const compact = ref(false);
let context: gsap.Context | undefined;
let mediaQuery: MediaQueryList | undefined;
let compactQuery: MediaQueryList | undefined;
let manualSelection = false;

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
  if (!root.value || reducedMotion.value || compact.value || experience.length < 2) return;
  gsap.registerPlugin(ScrollTrigger);
  context = gsap.context(() => {
    ScrollTrigger.create({
      trigger: root.value,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (manualSelection) return;
        setActive(Math.min(experience.length - 1, Math.floor(self.progress * experience.length)));
      },
    });
  }, root.value);
}

function resumeScrollSelection(event: Event) {
  const target = event.target;
  if (target instanceof Element && target.closest('.experience-timeline, .experience__details')) return;
  if (event instanceof KeyboardEvent) {
    if (!['PageDown', 'PageUp', 'Home', 'End', 'ArrowDown', 'ArrowUp', ' '].includes(event.key)) return;
    if (target instanceof Element && target.closest('button, a, input, select, textarea, summary')) return;
  }
  manualSelection = false;
}

function handleMotionChange(event: MediaQueryListEvent) {
  reducedMotion.value = event.matches;
  setupScroll();
}

function handleLayoutChange(event: MediaQueryListEvent) {
  compact.value = event.matches;
  setupScroll();
}

onMounted(() => {
  mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotion.value = mediaQuery.matches;
  compactQuery = window.matchMedia("(max-width: 760px), (max-height: 820px)");
  compact.value = compactQuery.matches;
  compactQuery.addEventListener("change", handleLayoutChange);
  mediaQuery.addEventListener("change", handleMotionChange);
  window.addEventListener("wheel", resumeScrollSelection, { passive: true });
  window.addEventListener("touchstart", resumeScrollSelection, { passive: true });
  window.addEventListener("keydown", resumeScrollSelection);
  setupScroll();
});

onBeforeUnmount(() => {
  context?.revert();
  mediaQuery?.removeEventListener("change", handleMotionChange);
  compactQuery?.removeEventListener("change", handleLayoutChange);
  window.removeEventListener("wheel", resumeScrollSelection);
  window.removeEventListener("touchstart", resumeScrollSelection);
  window.removeEventListener("keydown", resumeScrollSelection);
});
</script>

<template>
  <section :id="FLOOR.experience.id" ref="root" class="floor-section experience" :data-floor-number="FLOOR.experience.number" :style="sectionStyle" aria-labelledby="experience-title">
    <div class="experience__scene">
      <ExperienceEnvironment />
      <div class="experience__shade" aria-hidden="true"></div>
      <aside class="experience__level" :aria-label="`Level ${FLOOR.experience.number}, ${FLOOR.experience.label}`">
        <span class="sr-only">Level {{ FLOOR.experience.number }} · {{ FLOOR.experience.label }}</span>
        <div class="experience__level-progress" aria-hidden="true">
          <i v-for="(_, index) in experience" :key="index" :class="{ active: index <= activeIndex }"></i>
        </div>
      </aside>
      <div class="experience__content">
        <header class="experience__heading">
          <div class="experience__title-group">
            <p class="eyebrow">Career archive <span aria-hidden="true">///</span></p>
            <h2 id="experience-title">Experience</h2>
          </div>
          <p class="experience__intro">From law and criminology to software engineering and creative web development.</p>
        </header>
        <div class="experience__toolbar">
          <p>Professional journey</p>
          <p class="experience__progress"><span>{{ String(activeIndex + 1).padStart(2, "0") }}</span> / {{ String(experience.length).padStart(2, "0") }} <b>{{ compact ? 'Select a record' : 'Scroll or select a record' }}</b></p>
        </div>
        <ExperienceTimeline :entries="experience" :active-index="activeIndex" @select="selectEntry" @preview="previewEntry" />
        <article :key="activeEntry.id" class="experience__details" :tabindex="!compact && !reducedMotion ? 0 : undefined" aria-labelledby="experience-detail-title" id="experience-detail">
          <div class="experience__details-meta">
            <p class="experience__details-label">{{ activeEntry.current ? 'Current role' : 'Selected record' }}</p>
            <p class="experience__details-date">{{ activeEntry.dateLabel }}</p>
          </div>
          <h3 id="experience-detail-title">{{ activeEntry.role }}</h3>
          <p class="experience__details-company">{{ activeEntry.company }}<template v-if="activeEntry.employmentType"> · {{ activeEntry.employmentType }}</template><template v-if="activeEntry.location"> · {{ activeEntry.location }}</template></p>
          <p class="experience__summary">{{ activeEntry.summary }}</p>
          <ul v-if="activeEntry.technologies.length" class="experience__technologies" aria-label="Technologies"><li v-for="technology in activeEntry.technologies" :key="technology"><span aria-hidden="true">&lt;/&gt;</span>{{ technology }}</li></ul>
          <details v-if="activeEntry.highlights.length" class="experience__focus" :open="!compact">
            <summary>Key focus <span aria-hidden="true">⌄</span></summary>
            <ul class="experience__highlights"><li v-for="(highlight, index) in activeEntry.highlights" :key="highlight"><span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span><p>{{ highlight }}</p></li></ul>
          </details>
        </article>
      </div>
      <div ref="status" class="sr-only" aria-live="polite"></div>
    </div>
  </section>
</template>
