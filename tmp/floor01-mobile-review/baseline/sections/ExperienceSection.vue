<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import ExperienceTimeline from "../components/ExperienceTimeline.vue";
import ExperienceDetail from "../components/ExperienceDetail.vue";
import ExperienceEnvironment from "../components/ExperienceEnvironment.vue";
import { experience, communityExperience } from "/src/data/experience";
import { FLOOR } from "/src/config/floors";

const activeIndex = ref(0);
const status = ref<HTMLElement>();
const compact = ref(false);
const expanded = ref(true);
let layoutQuery: MediaQueryList | undefined;
const activeEntry = computed(() => experience[activeIndex.value]!);

function selectEntry(index: number) {
  expanded.value = compact.value && index === activeIndex.value ? !expanded.value : true;
  activeIndex.value = Math.max(0, Math.min(index, experience.length - 1));
  nextTick(() => {
    if (status.value) status.value.textContent = `${activeEntry.value.role} at ${activeEntry.value.company}`;
    if (!compact.value) return;
    const heading = document.getElementById(`experience-select-${activeEntry.value.id}`);
    const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
    const top = heading?.getBoundingClientRect().top;
    // Closing a preceding accordion must not strand the activated heading
    // behind fixed navigation. This runs only on explicit role activation.
    if (top !== undefined && top < headerBottom + 16) {
      window.scrollBy({ top: top - headerBottom - 16, behavior: 'instant' });
    }
  });
}
function updateLayout() { compact.value = layoutQuery?.matches ?? false; }
onMounted(() => {
  layoutQuery = matchMedia("(max-width: 980px)");
  updateLayout();
  layoutQuery.addEventListener("change", updateLayout);
});
onBeforeUnmount(() => layoutQuery?.removeEventListener("change", updateLayout));
</script>

<template>
  <section :id="FLOOR.experience.id" class="floor-section experience" :data-floor-number="FLOOR.experience.number" aria-labelledby="experience-title">
    <div class="experience__scene">
      <ExperienceEnvironment />
      <div class="experience__shade" aria-hidden="true"></div>
      <aside class="experience__level" :aria-label="`Level ${FLOOR.experience.number}, ${FLOOR.experience.label}`">
        <span class="sr-only">Level {{ FLOOR.experience.number }} · {{ FLOOR.experience.label }}</span>
        <div class="experience__level-progress" aria-hidden="true"><i v-for="(_, index) in experience" :key="index" :class="{ active: index <= activeIndex }"></i></div>
      </aside>
      <div class="experience__content">
        <header class="experience__heading">
          <div class="experience__title-group"><p class="eyebrow">Professional experience <span aria-hidden="true">///</span></p><h2 id="experience-title">Experience</h2></div>
          <p class="experience__intro">{{ compact ? 'I build production web applications and interactive projects, informed by law, criminology, and community work.' : 'I build production web applications and interactive projects, informed by earlier work in law, criminology, and community organisations.' }}</p>
        </header>
        <div class="experience__toolbar"><p>Career chapters</p><p class="experience__progress"><span>{{ String(activeIndex + 1).padStart(2, '0') }}</span> / {{ String(experience.length).padStart(2, '0') }} <b>Select a role</b></p></div>
        <ExperienceTimeline :entries="experience" :active-index="activeIndex" :accordion="compact" :expanded="expanded" @select="selectEntry">
          <template #detail="{ entry }"><ExperienceDetail :entry="entry" compact /></template>
        </ExperienceTimeline>
        <article v-if="!compact" :key="activeEntry.id" id="experience-detail" class="experience__details" aria-labelledby="experience-detail-title"><ExperienceDetail :entry="activeEntry" /></article>
        <details class="experience__community">
          <summary>Community &amp; earlier work <span aria-hidden="true">+</span></summary>
          <ul>
            <li v-for="entry in communityExperience" :key="entry.id">
              <h3>{{ entry.role }} <span>— {{ entry.company }}</span></h3>
              <p class="experience__community-date">{{ entry.dateLabel }}<template v-if="entry.employmentType"> · {{ entry.employmentType }}</template></p>
              <p>{{ entry.summary }}</p>
            </li>
          </ul>
        </details>
        <p class="experience__projects-link">I explore visual interaction, animation, and creative coding further in my <a href="#projects">Selected Projects <span aria-hidden="true">↗</span></a>.</p>
      </div>
      <div ref="status" class="sr-only" aria-live="polite"></div>
    </div>
  </section>
</template>