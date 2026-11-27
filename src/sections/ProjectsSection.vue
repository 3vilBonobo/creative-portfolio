<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ProjectCard from "../components/ProjectCard.vue";
import MobileProjectPreview from "../components/MobileProjectPreview.vue";
import { usePhoneLayout } from "../composables/usePhoneLayout";
import { categoryProjects, projectDisclosure, type CatalogueCategory } from "../services/projectCatalogue";
import "../floor02-mobile.css";
import ProjectsEnvironment from "../components/ProjectsEnvironment.vue";
import { projects } from "../data/projects";
import type { Project } from "../types/content";
import { FLOOR } from "../config/floors";

const detailDialog = ref<HTMLDialogElement | null>(null);
const { phone, portrait, landscape } = usePhoneLayout();
const expanded = ref<Record<CatalogueCategory, boolean>>({ professional: false, creative: false });
const rowSize = ref(1);
const sectionElement = ref<HTMLElement | null>(null);
const contentClearance = ref(0);
const showcaseHeader = ref<HTMLElement | null>(null);
const categoryRail = ref<HTMLElement | null>(null);
const showcaseFooter = ref<HTMLElement | null>(null);
const projectResults = ref<HTMLElement | null>(null);
const windowed = ref(false);
const paneHeight = ref(0);
let headerObserver: ResizeObserver | undefined;
function updateContentClearance() {
  const section = sectionElement.value;
  if (!section) return;
  const style = getComputedStyle(section);
  // Follow the rendered CSS grid, including phone orientation and tablet rules.
  const grid = section.querySelector<HTMLElement>(".projects-showcase__grid");
  if (grid) rowSize.value = Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(/\s+/).length);
  const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
  contentClearance.value = Math.max(0, Math.ceil(headerBottom + 16 - (parseFloat(style.scrollMarginTop) || 0) - (parseFloat(style.paddingTop) || 0)));
  const footer = showcaseFooter.value;
  const header = showcaseHeader.value;
  if (!footer || !header) return;
  const available = Math.floor(window.innerHeight
    - (parseFloat(style.paddingTop) || 0) - (parseFloat(style.paddingBottom) || 0)
    - contentClearance.value - header.offsetHeight - footer.offsetHeight
    - (parseFloat(getComputedStyle(footer).marginTop) || 0));
  // Retain document flow when the fixed UI or enlarged text leaves too little room.
  windowed.value = window.matchMedia("(min-width: 1400px) and (min-height: 780px)").matches
    && available >= 360 && (categoryRail.value?.scrollHeight ?? 0) <= available;
  paneHeight.value = Math.max(0, available);
}
onMounted(() => {
  headerObserver = new ResizeObserver(updateContentClearance);
  const header = document.querySelector(".site-header");
  if (header) headerObserver.observe(header);
  if (sectionElement.value) headerObserver.observe(sectionElement.value);
  for (const element of [showcaseHeader.value, categoryRail.value, showcaseFooter.value]) {
    if (element) headerObserver.observe(element);
  }
  window.addEventListener("resize", updateContentClearance);
  updateContentClearance();
});
onBeforeUnmount(() => {
  headerObserver?.disconnect();
  window.removeEventListener("resize", updateContentClearance);
});
const selectedProject = ref<Project | null>(null), triggerElement = ref<HTMLElement | null>(null);
type ProjectCategory = "all" | "creative" | "professional";
const category = ref<ProjectCategory>("all");
watch(category, async () => {
  await nextTick();
  updateContentClearance();
  if (windowed.value) projectResults.value?.scrollTo({ top: 0, behavior: "auto" });
});
watch([phone, landscape], async () => { await nextTick(); updateContentClearance(); });
const featuredProject = computed(() => projects.find(project => project.id === "nerve-ending"));
const creativeProjects = computed(() => categoryProjects(projects, "creative", featuredProject.value?.id));
const professionalProjects = computed(() => categoryProjects(projects, "professional", featuredProject.value?.id));
const creativeDisclosure = computed(() => projectDisclosure(creativeProjects.value, expanded.value.creative, rowSize.value));
const professionalDisclosure = computed(() => projectDisclosure(professionalProjects.value, expanded.value.professional, rowSize.value));
const displayedCount = computed(() => (category.value !== "professional" ? creativeDisclosure.value.visible.length + (featuredProject.value ? 1 : 0) : 0)
    + (category.value !== "creative" ? professionalDisclosure.value.visible.length : 0)
);
async function toggleCategory(id: CatalogueCategory, event: Event) {
  const button = event.currentTarget as HTMLButtonElement;
  expanded.value[id] = !expanded.value[id];
  await nextTick();
  button.focus({ preventScroll: true });
  if (!expanded.value[id]) {
    const bounds = button.getBoundingClientRect();
    const header = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 64;
    if (bounds.top < header || bounds.bottom > window.innerHeight) button.scrollIntoView({ block: "center", behavior: "instant" });
  }
}
// Both orientations keep the same preview and dialog nodes. Compensate for
// upstream floor height changes without resetting catalogue state on rotation.
watch([portrait, landscape], async (_, previous) => {
  if (!(previous[0] || previous[1]) || !phone.value || selectedProject.value
    || document.querySelector('.app-shell')?.getAttribute('data-active-floor') !== FLOOR.projects.id) return;
  const anchor = [...(sectionElement.value?.querySelectorAll<HTMLElement>('[data-project-id]') ?? [])]
    .find(element => element.getBoundingClientRect().bottom > 64) ?? sectionElement.value;
  const top = anchor?.getBoundingClientRect().top ?? 0;
  await nextTick();
  if (anchor?.isConnected) window.scrollBy({ top: anchor.getBoundingClientRect().top - top, behavior: "instant" });
});
const categories = computed(() => [
  { id: "all" as const, label: "All Projects", count: projects.length, symbol: "▦" },
  { id: "creative" as const, label: "Creative & Interactive", count: projects.filter(project => project.category === "creative").length, symbol: "◇" },
  { id: "professional" as const, label: "Professional Work", count: professionalProjects.value.length, symbol: "⌘" },
]);
const visibleProjectCount = computed(() => categories.value.find(item => item.id === category.value)?.count ?? 0);
const technologyGroups = computed(() => {
  const recorded = projects.flatMap(project => project.technologies);
  const groups = [
    { label: "Frontend", items: ["Angular", "Vue 3", "React", "TypeScript"] },
    { label: "Motion & graphics", items: ["GSAP", "Three.js", "SVG"] },
    { label: "Data & APIs", items: ["REST APIs", "SQL"] },
  ];
  return groups.map(group => ({ ...group, items: group.items.filter(name => recorded.some(technology =>
    name === "Angular" ? /^Angular(?:\s|$)/.test(technology)
      : name === "REST APIs" ? /^REST API/.test(technology) : technology === name,
  )) })).filter(group => group.items.length);
});
async function openDetails(project: Project, trigger: HTMLElement) { selectedProject.value = project; triggerElement.value = trigger; await nextTick(); detailDialog.value?.showModal(); }
function closeDetails() { detailDialog.value?.close(); }
function keepPhoneDialogFocus(event: KeyboardEvent) {
  if (!phone.value || event.key !== "Tab") return;
  const controls = [...(detailDialog.value?.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]') ?? [])]
    .filter(element => element.getClientRects().length);
  const first = controls[0], last = controls[controls.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && (document.activeElement === first || document.activeElement === detailDialog.value)) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
}
function onDialogClose() {
  const projectId = selectedProject.value?.id;
  selectedProject.value = null;
  const trigger = triggerElement.value?.isConnected ? triggerElement.value
    : projectId ? sectionElement.value?.querySelector<HTMLElement>(`[data-project-id="${projectId}"] button, button[data-project-id="${projectId}"]`) : null;
  if (phone.value) trigger?.focus({ preventScroll: true });
  else trigger?.focus();
  if (phone.value && trigger) {
    const bounds = trigger.getBoundingClientRect();
    const header = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 64;
    if (bounds.top < header || bounds.bottom > innerHeight) trigger.scrollIntoView({ block: "center", behavior: "instant" });
  }
}
function onBackdropClick(event: MouseEvent) { if (event.target === detailDialog.value) closeDetails(); }

</script>

<template>
  <section ref="sectionElement" :id="FLOOR.projects.id" class="floor-section projects" :class="{ 'projects--windowed': windowed, 'projects--phone': phone, 'projects--portrait': portrait, 'projects--landscape': landscape }" :data-floor-number="FLOOR.projects.number" aria-labelledby="projects-title">
    <ProjectsEnvironment />
    <div class="projects-showcase" :style="{ '--projects-ui-clearance': `${contentClearance}px`, '--projects-pane-height': `${paneHeight}px` }">
      <header ref="showcaseHeader" class="projects-showcase__header">
        <div class="projects-showcase__level" :aria-label="`Level ${FLOOR.projects.number}, ${FLOOR.projects.label}`"><small>Level</small><strong>{{ FLOOR.projects.number }}</strong><span aria-hidden="true">▰ ▰ ▰</span></div>
        <div class="projects-showcase__title"><p class="eyebrow">Portfolio / Selected work</p><h2 id="projects-title">Selected<br />{{ phone ? ' Projects' : 'Projects' }}</h2></div>
        <p class="projects-showcase__intro">Frontend development, interactive experiences and creative web projects.<span aria-hidden="true">////</span></p>
      </header>
      <div class="projects-showcase__layout">
        <aside ref="categoryRail" class="projects-showcase__rail" aria-label="Project browsing">
          <label class="projects-showcase__mobile-category">Browse projects<select v-model="category" aria-controls="projects-results"><option v-for="item in categories" :key="item.id" :value="item.id">{{ item.label }} ({{ item.count }})</option></select></label>
          <nav class="project-categories" aria-label="Project categories">
            <button v-for="item in categories" :key="item.id" type="button" :aria-pressed="category === item.id" aria-controls="projects-results" @click="category = item.id"><span class="project-categories__symbol" aria-hidden="true">{{ item.symbol }}</span><span>{{ item.label }}</span><b>{{ item.count }}</b></button>
          </nav>
          <div class="projects-showcase__metadata">
            <p>Technology overview</p>
            <div v-for="group in technologyGroups" :key="group.label" class="projects-showcase__technology-group">
              <h3>{{ group.label }}</h3>
              <ul :aria-label="`${group.label} technologies across selected projects`"><li v-for="technology in group.items" :key="technology">{{ technology }}</li></ul>
            </div>
            <small>Across selected projects. Full stacks in Project Details.</small>
          </div>
        </aside>
        <div id="projects-results" ref="projectResults" class="projects-showcase__results" role="region" aria-label="Project collection" :tabindex="windowed ? 0 : undefined" :aria-describedby="windowed ? 'projects-scroll-hint' : undefined">
          <p class="projects-showcase__count" role="status">{{ visibleProjectCount }} {{ visibleProjectCount === 1 ? 'project' : 'projects' }} / {{ categories.find(item => item.id === category)?.label }}</p>
          <component :is="phone ? MobileProjectPreview : ProjectCard" v-if="category !== 'professional' && featuredProject" :project="featuredProject" featured @details="openDetails" />
          <section v-if="category !== 'creative' && professionalProjects.length" class="projects-showcase__group" aria-labelledby="professional-projects-title">
            <div class="projects-showcase__group-heading"><h3 id="professional-projects-title">Professional Work</h3><span>{{ professionalProjects.length }} {{ professionalProjects.length === 1 ? 'project' : 'projects' }}</span></div>
            <ol id="professional-project-list" class="projects-showcase__grid projects-showcase__grid--professional" aria-label="Professional projects"><li v-for="project in professionalDisclosure.visible" :key="project.id"><component :is="phone ? MobileProjectPreview : ProjectCard" :project="project" @details="openDetails" /></li></ol>
            <button v-if="professionalDisclosure.expandable" class="projects-showcase__more" type="button" :aria-expanded="expanded.professional" aria-controls="professional-project-list" @click="toggleCategory('professional', $event)">{{ expanded.professional ? 'See fewer professional projects' : `See ${professionalDisclosure.remaining} more professional projects` }} <span aria-hidden="true">{{ expanded.professional ? '−' : '+' }}</span></button>
          </section>
          <section v-if="category !== 'professional' && creativeProjects.length" class="projects-showcase__group" aria-labelledby="creative-projects-title">
            <div class="projects-showcase__group-heading"><h3 id="creative-projects-title">Creative &amp; Interactive</h3><span>{{ creativeProjects.length }} projects</span></div>
            <ol id="creative-project-list" class="projects-showcase__grid" aria-label="Creative and interactive projects"><li v-for="project in creativeDisclosure.visible" :key="project.id"><component :is="phone ? MobileProjectPreview : ProjectCard" :project="project" @details="openDetails" /></li></ol>
            <button v-if="creativeDisclosure.expandable" class="projects-showcase__more" type="button" :aria-expanded="expanded.creative" aria-controls="creative-project-list" @click="toggleCategory('creative', $event)">{{ expanded.creative ? 'See fewer creative projects' : `See ${creativeDisclosure.remaining} more creative projects` }} <span aria-hidden="true">{{ expanded.creative ? '−' : '+' }}</span></button>
          </section>
        </div>
      </div>
      <footer ref="showcaseFooter" class="projects-showcase__footer"><span role="status">{{ displayedCount }} of {{ projects.length }} projects</span><span id="projects-scroll-hint">{{ windowed ? 'Scroll inside the project window ↓' : `Selected work / Floor ${FLOOR.projects.number}` }}</span></footer>
      <div v-if="portrait" class="mobile-office-rotation projects-rotation">
        <img src="/hero/loft-mobile-v1/rotate-phone.svg" alt="" aria-hidden="true" width="32" height="32">
        <p><strong>Explore the full exhibition</strong><span>Rotate your phone sideways for the immersive experience.</span></p>
      </div>
      <a v-if="phone" class="projects-next-floor" :href="`#${FLOOR.experience.id}`">Experience <span aria-hidden="true">↓</span></a>
    </div>
    <dialog ref="detailDialog" class="project-dialog" :class="{ 'project-dialog--case-study': selectedProject?.caseStudy, 'project-dialog--responsive-preview': selectedProject?.preview.srcSet }" aria-labelledby="project-dialog-title" @close="onDialogClose" @click="onBackdropClick" @keydown="keepPhoneDialogFocus" @keydown.esc.prevent="closeDetails">
      <article v-if="selectedProject" class="project-dialog__panel">
        <button class="project-dialog__close" type="button" aria-label="Close project details" @click="closeDetails">×</button>
        <div class="project-dialog__preview" :class="{ 'project-dialog__preview--mockups': selectedProject.preview.kind === 'mockup' || selectedProject.additionalPreviews?.length }">
          <template v-if="selectedProject.preview.kind === 'mockup' || selectedProject.additionalPreviews?.length">
            <figure v-for="(preview, index) in [selectedProject.preview, ...(selectedProject.additionalPreviews ?? [])]" :key="preview.src ?? index">
              <img v-if="preview.src" :src="preview.src" :srcset="preview.srcSet" sizes="(max-width: 760px) 90vw, 50vw" :width="preview.width" :height="preview.height" :alt="preview.alt" :loading="index === 0 ? 'eager' : 'lazy'" />
              <figcaption>{{ preview.source }}</figcaption>
            </figure>
          </template>
          <img v-else-if="selectedProject.preview.src" :src="selectedProject.preview.src" :srcset="selectedProject.preview.srcSet" sizes="(max-width: 760px) 90vw, 50vw" :width="selectedProject.preview.width" :height="selectedProject.preview.height" :alt="selectedProject.preview.alt" />
          <div v-else class="source-preview" role="img" :aria-label="selectedProject.preview.alt"><span>Source project</span><strong>{{ selectedProject.title }}</strong></div>
        </div>
        <div class="project-dialog__content">
          <p class="eyebrow">{{ selectedProject.categoryLabel ?? selectedProject.title }}</p>
          <p v-if="selectedProject.status" class="project-development-status">{{ selectedProject.status }}</p>
          <h3 id="project-dialog-title">{{ selectedProject.displayTitle }}</h3>
          <template v-if="selectedProject.caseStudy">
            <p v-for="paragraph in selectedProject.caseStudy.introduction" :key="paragraph">{{ paragraph }}</p>
            <section class="project-case-study" aria-labelledby="engineering-contributions-title">
              <h4 id="engineering-contributions-title">Selected engineering contributions</h4>
              <ul><li v-for="contribution in selectedProject.caseStudy.contributions" :key="contribution.title"><strong>{{ contribution.title }}:</strong> {{ contribution.text }}</li></ul>
            </section>
          </template>
          <p v-else>{{ selectedProject.shortDescription }}</p>
          <p v-if="selectedProject.credit">{{ selectedProject.credit }}</p>
          <div v-if="selectedProject.developmentDetails" class="project-development">
            <section aria-labelledby="development-concept-title"><h4 id="development-concept-title">Concept &amp; player experience</h4><p>{{ selectedProject.developmentDetails.concept }}</p></section>
            <section aria-labelledby="development-implemented-title"><h4 id="development-implemented-title">Implemented in the prototype</h4><ul><li v-for="item in selectedProject.developmentDetails.implemented" :key="item">{{ item }}</li></ul></section>
            <section aria-labelledby="development-planned-title"><h4 id="development-planned-title">Planned &amp; still in development</h4><ul><li v-for="item in selectedProject.developmentDetails.planned" :key="item">{{ item }}</li></ul></section>
            <section aria-labelledby="development-architecture-title"><h4 id="development-architecture-title">Technical architecture</h4><p>{{ selectedProject.developmentDetails.architecture }}</p></section>
            <section aria-labelledby="development-art-direction-title"><h4 id="development-art-direction-title">Artistic direction</h4><p>{{ selectedProject.developmentDetails.artisticDirection }}</p></section>
          </div>
          <dl>
            <div v-if="selectedProject.genre"><dt>Genre</dt><dd>{{ selectedProject.genre }}</dd></div>
            <div><dt>Role</dt><dd>{{ selectedProject.role }}</dd></div>
            <div v-if="selectedProject.interactionNotes"><dt>Interaction</dt><dd>{{ selectedProject.interactionNotes }}</dd></div>
            <div v-if="selectedProject.industry"><dt>Industry</dt><dd>{{ selectedProject.industry }}</dd></div>
            <div v-if="selectedProject.skills?.length"><dt>Skills demonstrated</dt><dd>{{ selectedProject.skills.join(" · ") }}</dd></div>
            <div v-if="selectedProject.technologies.length"><dt>Technologies</dt><dd>{{ selectedProject.technologies.join(" · ") }}</dd></div>
            <div v-if="selectedProject.attribution"><dt>Attribution</dt><dd>{{ selectedProject.attribution }}</dd></div>
            <div><dt>Preview source</dt><dd>{{ selectedProject.preview.source }}</dd></div>
          </dl>
          <template v-if="selectedProject.caseStudy">
            <section class="project-case-study project-case-study--disclosure" aria-labelledby="case-study-visuals-title">
              <h4 id="case-study-visuals-title">About the visuals</h4>
              <p>{{ selectedProject.caseStudy.confidentiality }}</p>
            </section>
            <section class="project-case-study" aria-labelledby="professional-experience-title">
              <h4 id="professional-experience-title">Professional experience</h4>
              <p>For more information about my role, employment history, and technical experience, visit my LinkedIn profile.</p>
              <a class="project-case-study__experience" :href="selectedProject.caseStudy.experienceUrl" target="_blank" rel="noopener noreferrer" aria-label="View my professional experience on LinkedIn (opens in a new tab)">View my professional experience on LinkedIn <span aria-hidden="true">↗</span></a>
            </section>
          </template>
          <div v-if="selectedProject.liveUrl || selectedProject.repositoryUrl" class="project-dialog__links">
            <a v-if="selectedProject.liveUrl" :href="selectedProject.liveUrl" target="_blank" rel="noreferrer">{{ selectedProject.liveLabel ?? "View demo" }} ↗</a>
            <a v-if="selectedProject.repositoryUrl" :href="selectedProject.repositoryUrl" target="_blank" rel="noreferrer">Source code ↗</a>
          </div>
        </div>
      </article>
    </dialog>
  </section>
</template>

<style scoped>
.projects { background: #10191b; }
.projects::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(90deg, #0008, #0004 45%, #0001 75%), linear-gradient(to bottom, #0001, #0003 70%, #0006);
  mix-blend-mode: normal;
}
.project-development-status { display: inline-block; margin: 0 0 1rem; padding: .3rem .6rem; border: 1px solid #bbb18b66; color: #d1c79f; font: .75rem/1.5 "IBM Plex Mono", monospace; }
.project-development { color: #d8d8cf; font-size: .95rem; line-height: 1.75; }
.project-development section { margin: 1.5rem 0; }
.project-development h4 { margin: 0 0 .7rem; color: #e1d8b1; font-size: 1rem; line-height: 1.5; }
.project-development p { margin: 0; }
.project-development ul { margin: 0; padding-left: 1.2rem; list-style: disc; }
.project-development li + li { margin-top: .6rem; }

.project-dialog--case-study, .project-dialog--responsive-preview { max-height: calc(100dvh - 2rem); overflow: hidden; }
.project-dialog--case-study .project-dialog__panel, .project-dialog--responsive-preview .project-dialog__panel { max-height: calc(100dvh - 2rem - 4px); }
.project-dialog--case-study .project-dialog__content, .project-dialog--responsive-preview .project-dialog__content { min-width: 0; overflow-wrap: anywhere; }
.project-dialog--case-study .project-dialog__content h3, .project-dialog--responsive-preview .project-dialog__content h3 { font-size: clamp(2rem, 3.2vw, 3rem); line-height: 1.08; }
.project-dialog--responsive-preview .project-dialog__preview > img { height: auto; object-fit: contain; }
.project-case-study { margin: 1.5rem 0; color: #d8d8cf; font-size: .95rem; line-height: 1.75; }
.project-case-study h4 { margin: 0 0 .8rem; color: #f4d3a0; font-size: 1rem; font-weight: 600; line-height: 1.5; }
.project-case-study ul { margin: 0; padding-left: 1.1rem; list-style: disc; }
.project-case-study li + li { margin-top: .9rem; }
.project-case-study strong { color: #f1e6d3; }
.project-case-study p { margin: 0 0 1rem; }
.project-case-study--disclosure { padding: 1rem; border-left: 2px solid #dca95f; background: #dca95f0a; }
.project-case-study__experience { display: inline-flex; gap: .5rem; align-items: center; min-height: 44px; padding: .6rem .8rem; border: 1px solid #8ed8d0; color: #bce9e2; text-decoration: underline; text-underline-offset: .2em; overflow-wrap: anywhere; }
.project-case-study__experience:hover { background: #8ed8d012; }
.project-case-study__experience:focus-visible { outline: 2px solid #8ed8d0; outline-offset: 4px; }

.project-dialog__preview--mockups { display: grid; align-content: start; gap: 1rem; min-height: 0; max-height: none; padding: 1rem; }
.project-dialog__preview--mockups figure { margin: 0; min-width: 0; }
.project-dialog__preview--mockups img { width: 100%; height: auto; object-fit: contain; }
.project-dialog__preview--mockups figcaption { margin-top: .5rem; color: #d0c7b8; font-size: .75rem; line-height: 1.5; }

.projects-showcase { position: relative; z-index: 1; width: min(92rem, calc(100% - 2 * var(--space))); margin: 0 auto; padding-top: var(--projects-ui-clearance, 0px); }
.projects-showcase__header { display: grid; grid-template-columns: max-content minmax(0, 1fr) minmax(12rem, .9fr); gap: 1.7rem; align-items: center; padding: 0 0 2rem; }
.projects-showcase__level, .projects-showcase__title, .projects-showcase__intro { background: #000a; box-shadow: 0 0 22px 14px #000a; }
.projects-showcase__level { display: grid; gap: .4rem; align-self: stretch; align-content: center; padding-right: 1rem; border-right: 1px solid #dbb28955; color: #ce8296; }
.projects-showcase__level small { font: .65rem "IBM Plex Mono", monospace; text-transform: uppercase; }
.projects-showcase__level strong { font-size: 2.8rem; line-height: 1; font-weight: 900; }
.projects-showcase__level span { font-size: .7rem; color: #ffac35; }
.projects-showcase__title { min-width: 0; }
.projects-showcase__title .eyebrow { margin: 0 0 .7rem; font-size: .68rem; color: #e9dccc; letter-spacing: .16em; }
.projects-showcase__title h2 { margin: 0; color: #f1e9dc; font-size: clamp(2.4rem, 3.7vw, 4.4rem); line-height: .95; letter-spacing: -.045em; font-weight: 900; text-transform: uppercase; overflow-wrap: anywhere; text-shadow: 0 3px 0 #0005; }
.projects-showcase__intro { position: relative; margin: 0; padding: .3rem 2rem .3rem 1.2rem; border-left: 2px solid #ffae31; font-size: .85rem; line-height: 1.7; color: #e2dbd1; }
.projects-showcase__intro > span { display: block; color: #d88d2c; font-size: 1.3rem; letter-spacing: .12em; font-weight: 900; margin-top: .8rem; }
.projects-showcase__layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; align-items: start; }
.projects-showcase__rail { min-width: 0; padding: .75rem; border: 1px solid #c68a414d; border-radius: 3px; background: #000; }
.projects-showcase__mobile-category { display: none; }
.project-categories { display: flex; flex-wrap: wrap; gap: .55rem; }
.project-categories button { display: flex; align-items: center; gap: .6rem; min-width: 0; min-height: 44px; padding: .65rem .8rem; border: 1px solid #afa18a77; border-radius: 7px 2px 7px 2px; background: #080808; color: #e9dfd0; font-size: .76rem; text-align: left; transition: background .2s, color .2s; }
.project-categories button[aria-pressed="true"] { border-color: #ffb33c; background: linear-gradient(110deg, #ffbd48, #f59f20); color: #1b140b; box-shadow: 0 3px 14px #ffaf2422; }
.project-categories button:hover { border-color: #ffbd48; }
.project-categories button:focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
.project-categories button > span:nth-child(2) { min-width: 0; overflow-wrap: anywhere; }
.project-categories__symbol { font-size: 1.2rem; }
.project-categories button b { margin-left: auto; padding-left: .5rem; font-size: .72rem; }
.projects-showcase__metadata { display: none; }
.projects-showcase__results { min-width: 0; padding: .75rem .75rem 2rem; border: clamp(.75rem, 1.2vw, 1.25rem) solid #000; outline: 1px solid #c68a414d; border-radius: 3px; background: #000; }
.projects--windowed .projects-showcase__rail { position: static; }
.projects--windowed .projects-showcase__results {
  height: auto;
  max-height: var(--projects-pane-height);
  overflow-y: auto;
  scrollbar-gutter: stable;
  scrollbar-color: #dc9f45 #10171a;
  scroll-padding-block: .75rem;
  scroll-padding-block-end: 2rem;
}
.projects--windowed .projects-showcase__results:focus-visible {
  outline: 2px solid #8fe5e6;
  outline-offset: 4px;
}
.projects-showcase__count { margin: 0 0 .7rem; color: #d5c8b4; font: .65rem/1.6 "IBM Plex Mono", monospace; letter-spacing: .05em; }
.projects-showcase__group { margin-top: 1.8rem; }
.projects-showcase__group:first-of-type { margin-top: 1.4rem; }
.projects-showcase__group-heading { display: flex; flex-wrap: wrap; align-items: center; gap: .7rem; margin-bottom: 1rem; border-bottom: 1px solid #c5a67b55; padding-bottom: .7rem; }
.projects-showcase__group-heading h3 { margin: 0; color: #e5d5be; text-transform: uppercase; font-size: .8rem; letter-spacing: .12em; }
.projects-showcase__group-heading > span { color: #bfae95; font: .65rem "IBM Plex Mono", monospace; margin-left: auto; }
.projects-showcase__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: stretch; grid-auto-rows: 1fr; gap: 1.1rem; list-style: none; padding: 0; margin: 0; }
.projects-showcase__grid > li { display: flex; min-width: 0; }

.projects-showcase__footer { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; border-top: 1px solid #ac8d6755; margin-top: 2rem; padding-top: 1rem; color: #c7b8a3; font: .65rem/1.8 "IBM Plex Mono", monospace; text-transform: uppercase; letter-spacing: .08em; }
@media (min-width: 1400px) {
  .projects-showcase__layout { grid-template-columns: 11.5rem minmax(0, 1fr); gap: 0; }
  .projects-showcase__rail { position: sticky; top: 6rem; border-right: 0; border-radius: 3px 0 0 3px; }
  .projects-showcase__results { border-radius: 0 3px 3px 3px; outline: none; }
  .project-categories { display: grid; }
  .project-categories button { width: 100%; }
  .projects-showcase__metadata { display: block; margin-top: 1.7rem; border-top: 1px solid #ac8d6755; padding-top: 1rem; }
  .projects-showcase__metadata p { margin: 0 0 .7rem; color: #c7b8a3; font: .65rem "IBM Plex Mono", monospace; text-transform: uppercase; letter-spacing: .12em; }
  .projects-showcase__metadata ul { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0; padding: 0; list-style: none; }
  .projects-showcase__metadata li { max-width: 100%; padding: .3rem .5rem; border: 1px solid #8d847666; border-radius: 999px; background: #101010; font-size: .65rem; color: #ddd0bc; overflow-wrap: anywhere; }
  .projects-showcase__technology-group + .projects-showcase__technology-group { margin-top: .8rem; }
  .projects-showcase__technology-group h3 { margin: 0 0 .4rem; color: #aebfc1; font-size: .65rem; font-weight: 500; }
  .projects-showcase__metadata small { display: block; margin-top: .85rem; color: #b7b4aa; font-size: .62rem; line-height: 1.5; }
}
@media (max-width: 980px) {
  .projects-showcase__header { grid-template-columns: max-content minmax(0, 1fr); gap: 1.2rem; }
  .projects-showcase__intro { grid-column: 2; padding-right: 0; }
  .projects-showcase__intro > span { display: none; }
  .projects-showcase__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 620px) {
  .projects-showcase { width: calc(100% - 2rem); }
  .projects-showcase__header { grid-template-columns: minmax(0, 1fr); gap: 1rem; padding-bottom: 1.4rem; }
  .projects-showcase__level { display: flex; align-items: center; gap: .6rem; border: 0; }
  .projects-showcase__level strong { font-size: 1.3rem; }
  .projects-showcase__title h2 { font-size: clamp(2.2rem, 9vw, 3.5rem); line-height: 1; }
  .projects-showcase__intro { grid-column: 1; font-size: .9rem; }
  .project-categories { display: none; }
  .projects-showcase__mobile-category { display: grid; gap: .5rem; color: #e8d5b9; font: .7rem "IBM Plex Mono", monospace; text-transform: uppercase; letter-spacing: .08em; }
  .projects-showcase__mobile-category select { width: 100%; min-width: 0; min-height: 44px; padding: .8rem; border: 1px solid #ffb33c; border-radius: 7px 2px 7px 2px; color: #ffbf50; background: #101316; font: inherit; white-space: normal; }
  .projects-showcase__mobile-category select:focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
  .projects-showcase__grid { grid-template-columns: minmax(0, 1fr); }
}
.projects-showcase__more:focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .project-categories button { transition: none; } }
</style>
