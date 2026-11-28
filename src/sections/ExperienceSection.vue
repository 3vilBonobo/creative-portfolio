<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRefs } from "vue";
import ExperienceTimeline from "../components/experience/ExperienceTimeline.vue";
import ExperienceDetail from "../components/experience/ExperienceDetail.vue";
import ExperienceEnvironment from "../components/experience/ExperienceEnvironment.vue";
import { experience, communityExperience } from "../data/experience";
import { FLOOR } from "../config/floors";
import { usePhoneLayout } from "../composables/usePhoneLayout";
import { createExperienceArchive, selectExperienceChapter } from "../services/experienceArchive";
import "../floor01-mobile.css";

const { phone, portrait, landscape } = usePhoneLayout();
const archive = reactive(createExperienceArchive(phone.value));
const { activeIndex, expanded, contributions } = toRefs(archive);
const status = ref<HTMLElement>();
const compactWidth = ref(matchMedia("(max-width: 760px)").matches);
const compact = computed(() => compactWidth.value || phone.value);
let layoutQuery: MediaQueryList | undefined;
const activeEntry = computed(() => experience[activeIndex.value]!);

function selectEntry(index: number) {
  selectExperienceChapter(archive, index, experience.length, compact.value);
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
function updateLayout() { compactWidth.value = layoutQuery?.matches ?? false; }
onMounted(() => {
  layoutQuery = matchMedia("(max-width: 760px)");
  updateLayout();
  layoutQuery.addEventListener("change", updateLayout);
});
onBeforeUnmount(() => layoutQuery?.removeEventListener("change", updateLayout));
</script>

<template>
  <section :id="FLOOR.experience.id" class="floor-section experience" :class="{ 'experience--phone': phone, 'experience--portrait': portrait, 'experience--landscape': landscape }" :data-floor-number="FLOOR.experience.number" aria-labelledby="experience-title">
    <div class="experience__scene">
      <ExperienceEnvironment :phone-landscape="landscape" />
      <div class="experience__shade" aria-hidden="true"></div>
      <aside class="experience__level" :aria-label="`Level ${FLOOR.experience.number}, ${FLOOR.experience.label}`">
        <span class="sr-only">Level {{ FLOOR.experience.number }} · {{ FLOOR.experience.label }}</span>
        <div class="experience__level-progress" aria-hidden="true"><i v-for="(_, index) in experience" :key="index" :class="{ active: index <= activeIndex }"></i></div>
      </aside>
      <div class="experience__content">
        <header class="experience__heading">
          <div class="experience__title-group"><p class="eyebrow">Professional experience <span aria-hidden="true">///</span></p><h2 id="experience-title">Experience</h2></div>
          <p class="experience__intro">I turn complex requirements into clear, dependable web experiences. My work spans production software, creative frontend, and a decade in law, bringing technical delivery together with careful analysis and a strong understanding of people.</p>
        </header>
        <div class="experience__toolbar"><p><span aria-hidden="true">↗</span> Career timeline</p><p class="experience__progress"><span>{{ String(activeIndex + 1).padStart(2, '0') }}</span> / {{ String(experience.length).padStart(2, '0') }} <b>Select a chapter</b></p></div>
        <ExperienceTimeline :entries="experience" :active-index="activeIndex" :accordion="compact" :expanded="expanded" @select="selectEntry">
          <template #detail="{ entry }"><ExperienceDetail :entry="entry" compact :phone="phone" :contributions-open="contributions[entry.id]" @contributions-toggle="contributions[entry.id] = $event" /></template>
        </ExperienceTimeline>
        <article v-if="!compact" :key="activeEntry.id" id="experience-detail" class="experience__details" aria-labelledby="experience-detail-title"><ExperienceDetail :entry="activeEntry" /></article>
        <details class="experience__community">
          <summary><span class="experience__community-title"><span aria-hidden="true">◎</span> Community, teaching &amp; hands-on work</span><span aria-hidden="true">+</span></summary>
          <ul>
            <li v-for="entry in communityExperience" :key="entry.id">
              <h3>{{ entry.role }} <span>— {{ entry.company }}</span></h3>
              <p class="experience__community-date">{{ entry.dateLabel }}<template v-if="entry.employmentType"> · {{ entry.employmentType }}</template></p>
              <p>{{ entry.summary }}</p>
            </li>
          </ul>
        </details>
        <p v-if="!phone" class="experience__projects-link">I explore visual interaction, animation, and creative coding further in my <a href="#projects">Selected Projects <span aria-hidden="true">↗</span></a>.</p>
      </div>
      <div ref="status" class="sr-only" aria-live="polite"></div>
    </div>
  </section>
</template>
