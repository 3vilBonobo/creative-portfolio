from pathlib import Path

root = Path.cwd()
backup = root / 'tmp/experience-editorial/before'
backup.mkdir(parents=True, exist_ok=True)
for name in ['src/sections/ExperienceSection.vue', 'src/components/ExperienceTimeline.vue', 'src/data/experience.ts']:
    target = backup / Path(name).name
    if not target.exists(): target.write_bytes((root / name).read_bytes())

section = '''<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import ExperienceTimeline from "../components/ExperienceTimeline.vue";
import ExperienceDetail from "../components/ExperienceDetail.vue";
import ExperienceEnvironment from "../components/ExperienceEnvironment.vue";
import { experience, communityExperience } from "../data/experience";
import { FLOOR } from "../config/floors";

const activeIndex = ref(0);
const status = ref<HTMLElement>();
const compact = ref(false);
let layoutQuery: MediaQueryList | undefined;
const activeEntry = computed(() => experience[activeIndex.value]!);

function selectEntry(index: number) {
  activeIndex.value = Math.max(0, Math.min(index, experience.length - 1));
  nextTick(() => {
    if (status.value) status.value.textContent = `${activeEntry.value.role} at ${activeEntry.value.company}`;
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
        <ExperienceTimeline :entries="experience" :active-index="activeIndex" :accordion="compact" @select="selectEntry">
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
'''

timeline = '''<script setup lang="ts">
import type { ExperienceEntry } from "../types/content";
defineProps<{ entries: ExperienceEntry[]; activeIndex: number; accordion?: boolean }>();
const emit = defineEmits<{ select: [index: number] }>();
</script>

<template>
  <ol class="experience-timeline" :class="{ 'experience-timeline--accordion': accordion }" aria-label="Professional experience">
    <li v-for="(entry, index) in entries" :id="`experience-entry-${entry.id}`" :key="entry.id" class="experience-entry" :class="{ 'is-active': index === activeIndex }">
      <button
        :id="`experience-select-${entry.id}`"
        class="experience-entry__select"
        type="button"
        :aria-label="`Show ${entry.role} at ${entry.company}, ${entry.dateLabel}`"
        :aria-pressed="!accordion ? index === activeIndex : undefined"
        :aria-expanded="accordion ? index === activeIndex : undefined"
        :aria-controls="accordion ? `experience-panel-${entry.id}` : 'experience-detail'"
        @click="emit('select', index)"
      >
        <span class="experience-entry__node" aria-hidden="true"></span>
        <span class="experience-entry__copy"><span class="experience-entry__date">{{ entry.dateLabel }}</span><span class="experience-entry__role">{{ entry.role }}</span><span class="experience-entry__company">{{ entry.company }}</span></span>
        <span class="experience-entry__arrow" aria-hidden="true">{{ accordion && index === activeIndex ? '⌄' : '›' }}</span>
      </button>
      <div v-if="accordion" v-show="index === activeIndex" :id="`experience-panel-${entry.id}`" class="experience__details experience__accordion-panel" role="region" :aria-labelledby="`experience-select-${entry.id}`"><slot name="detail" :entry="entry"></slot></div>
    </li>
  </ol>
</template>
'''

data = '''import type { ExperienceEntry } from "../types/content";

// Curated portfolio copy approved by the owner, based on the supplied 2026 CV.
// Overlapping employment dates are intentional. Supporting roles remain separate.
export const experience: ExperienceEntry[] = [
  {
    id: "agritrack-frontend", role: "Software Engineer", company: "Agritrack SA",
    startDate: "2025-01", endDate: "Present", dateLabel: "Jan 2025 — Present",
    summary: "I build and maintain a B2B food and seafood traceability application, taking responsibility for substantial parts of its frontend. My work brings operational requirements into data-heavy interfaces, offline-capable workflows, and reliable production behaviour.",
    mobileSummary: "I own substantial frontend work on a food and seafood traceability platform, including its UX/UI redesign, offline-capable workflows, and production debugging. I also contribute to Java/Spring Boot features.",
    highlights: ["I redesigned the application's UX/UI and build reusable Angular components, reactive forms, and state management.", "I trace frontend and API failures, maintain automated checks, and contribute to Java and Spring Boot features."],
    technologies: ["Angular", "TypeScript", "RxJS", "IndexedDB", "Dexie"],
    current: true, category: "development",
  },
  {
    id: "internet-now", role: "Web Developer", company: "Internet Now",
    startDate: "2022-09", endDate: "2025-02", dateLabel: "Sep 2022 — Feb 2025",
    summary: "I worked across multiple websites and web applications, balancing new development with the upkeep of existing systems. The work involved different frontend frameworks, WordPress, client requirements, and the constraints of established production websites.",
    mobileSummary: "I developed responsive websites and web applications using JavaScript, React, Vue, and WordPress, while maintaining existing code and improving performance.",
    highlights: ["I built custom frontend functionality and responsive interfaces using JavaScript, React, Vue, and WordPress.", "I investigated legacy code, maintained existing functionality, and improved website performance."],
    technologies: ["JavaScript", "React", "Vue", "WordPress", "HTML/CSS"],
    current: false, category: "development",
  },
  {
    id: "freelance-frontend", role: "Frontend Developer", company: "Freelance",
    startDate: "2021-05", endDate: "2024-09", dateLabel: "May 2021 — Sep 2024",
    summary: "I built responsive, accessible websites and web applications, combining interface development with custom SVG graphics and web animation. Independent work connected practical web development with my interest in visual interaction.",
    mobileSummary: "I built responsive, accessible websites and created custom SVG graphics and web animations.",
    highlights: ["I built responsive, accessible interfaces and custom functionality for web projects.", "I created SVG graphics and web animations, exploring how movement changes the feel of an interface."],
    technologies: ["SVG"], current: false, category: "consulting",
  },
  {
    id: "boutsika-associates", role: "Lawyer", company: "Boutsika & Associates",
    startDate: "2011", endDate: "2020-12", dateLabel: "2011 — Dec 2020",
    summary: "I practised law across criminal, property, immigration, and human rights matters. The discipline of examining evidence and interpreting complex requirements remains useful when I approach technical problems and unfamiliar systems today.",
    mobileSummary: "I worked across criminal, property, immigration, and human rights law, including pro bono refugee cases.",
    highlights: ["I managed legal matters involving client communication, negotiations, and case analysis.", "I worked on immigration and human rights cases, including pro bono refugee matters."],
    technologies: [], current: false, category: "legal",
  },
];

export const communityExperience: ExperienceEntry[] = [
  {
    id: "rainbow-school", role: "Web Manager", company: "Rainbow School NGO",
    startDate: "2021-11", endDate: "2025-01", dateLabel: "Nov 2021 — Jan 2025", employmentType: "Volunteer",
    summary: "I maintained the organisation's website content, functionality, visual presentation, and performance monitoring.",
    highlights: [], technologies: [], current: false,
  },
  {
    id: "enargeia-ngo", role: "Legal Counsellor and Founding Member", company: "Enargeia NGO",
    startDate: "2013-11", endDate: "2014-06", dateLabel: "Nov 2013 — Jun 2014",
    summary: "I contributed as a legal counsellor and founding member of the organisation.",
    highlights: [], technologies: [], current: false,
  },
  {
    id: "peri-psychis", role: "Seminar Tutor", company: "Peri Psychis",
    startDate: "2013-02", endDate: "2014-06", dateLabel: "Feb 2013 — Jun 2014",
    summary: "I taught seminars covering criminal law, criminology, and forensic psychology.",
    highlights: [], technologies: [], current: false,
  },
];
'''

for name, content in [('src/sections/ExperienceSection.vue', section), ('src/components/ExperienceTimeline.vue', timeline), ('src/data/experience.ts', data)]:
    (root / name).write_text(content, encoding='utf-8')
