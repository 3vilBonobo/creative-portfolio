<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import ProjectCard from "../components/ProjectCard.vue";
import ProjectsEnvironment from "../components/ProjectsEnvironment.vue";
import { projects } from "../data/projects";
import type { Project } from "../types/content";
import { FLOOR } from "../config/floors";

const detailDialog = ref<HTMLDialogElement | null>(null);
const sectionElement = ref<HTMLElement | null>(null);
const contentClearance = ref(0);
let headerObserver: ResizeObserver | undefined;
function updateContentClearance() {
  const section = sectionElement.value;
  if (!section) return;
  const style = getComputedStyle(section);
  const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
  contentClearance.value = Math.max(0, Math.ceil(headerBottom + 16 - (parseFloat(style.scrollMarginTop) || 0) - (parseFloat(style.paddingTop) || 0)));
}
onMounted(() => {
  headerObserver = new ResizeObserver(updateContentClearance);
  const header = document.querySelector(".site-header");
  if (header) headerObserver.observe(header);
  if (sectionElement.value) headerObserver.observe(sectionElement.value);
  updateContentClearance();
});
onBeforeUnmount(() => headerObserver?.disconnect());
const selectedProject = ref<Project | null>(null), triggerElement = ref<HTMLElement | null>(null);
type ProjectCategory = "all" | "creative" | "professional";
const category = ref<ProjectCategory>("all");
const featuredProject = computed(() => projects.find(project => project.id === "iss-tracker"));
const creativeProjects = computed(() => projects.filter(project => project.category === "creative" && project.id !== featuredProject.value?.id));
const professionalProjects = computed(() => projects.filter(project => project.category === "professional"));
const categories = computed(() => [
  { id: "all" as const, label: "All Projects", count: projects.length, symbol: "▦" },
  { id: "creative" as const, label: "Creative & Interactive", count: projects.filter(project => project.category === "creative").length, symbol: "◇" },
  { id: "professional" as const, label: "Professional Work", count: professionalProjects.value.length, symbol: "⌘" },
]);
const visibleProjectCount = computed(() => categories.value.find(item => item.id === category.value)?.count ?? 0);
const technologies = computed(() => [...new Set(projects.flatMap(project => project.technologies))].slice(0, 8));
async function openDetails(project: Project, trigger: HTMLElement) { selectedProject.value = project; triggerElement.value = trigger; await nextTick(); detailDialog.value?.showModal(); }
function closeDetails() { detailDialog.value?.close(); }
function onDialogClose() { selectedProject.value = null; triggerElement.value?.focus(); }
function onBackdropClick(event: MouseEvent) { if (event.target === detailDialog.value) closeDetails(); }

</script>

<template>
  <section ref="sectionElement" :id="FLOOR.projects.id" class="floor-section projects" :data-floor-number="FLOOR.projects.number" aria-labelledby="projects-title">
    <ProjectsEnvironment />
    <div class="projects-showcase" :style="{ '--projects-ui-clearance': `${contentClearance}px` }">
      <header class="projects-showcase__header">
        <div class="projects-showcase__level" :aria-label="`Level ${FLOOR.projects.number}, ${FLOOR.projects.label}`"><small>Level</small><strong>{{ FLOOR.projects.number }}</strong><span aria-hidden="true">▰ ▰ ▰</span></div>
        <div class="projects-showcase__title"><p class="eyebrow">Portfolio / Selected work</p><h2 id="projects-title">Selected<br />Projects</h2></div>
        <p class="projects-showcase__intro">Frontend development, interactive experiences and creative web projects.<span aria-hidden="true">////</span></p>
      </header>
      <div class="projects-showcase__layout">
        <aside class="projects-showcase__rail" aria-label="Project browsing">
          <label class="projects-showcase__mobile-category">Browse projects<select v-model="category" aria-controls="projects-results"><option v-for="item in categories" :key="item.id" :value="item.id">{{ item.label }} ({{ item.count }})</option></select></label>
          <nav class="project-categories" aria-label="Project categories">
            <button v-for="item in categories" :key="item.id" type="button" :aria-pressed="category === item.id" aria-controls="projects-results" @click="category = item.id"><span class="project-categories__symbol" aria-hidden="true">{{ item.symbol }}</span><span>{{ item.label }}</span><b>{{ item.count }}</b></button>
          </nav>
          <div class="projects-showcase__metadata"><p>Technology</p><ul aria-label="Selected project technologies"><li v-for="technology in technologies" :key="technology">{{ technology }}</li></ul></div>
        </aside>
        <div id="projects-results" class="projects-showcase__results">
          <p class="projects-showcase__count" role="status">{{ visibleProjectCount }} {{ visibleProjectCount === 1 ? 'project' : 'projects' }} / {{ categories.find(item => item.id === category)?.label }}</p>
          <ProjectCard v-if="category !== 'professional' && featuredProject" :project="featuredProject" featured @details="openDetails" />
          <section v-if="category !== 'professional' && creativeProjects.length" class="projects-showcase__group" aria-labelledby="creative-projects-title">
            <div class="projects-showcase__group-heading"><h3 id="creative-projects-title">Creative &amp; Interactive</h3><span>{{ creativeProjects.length }} projects</span></div>
            <ol class="projects-showcase__grid" aria-label="Creative and interactive projects"><li v-for="project in creativeProjects" :key="project.id"><ProjectCard :project="project" @details="openDetails" /></li></ol>
          </section>
          <section v-if="category !== 'creative' && professionalProjects.length" class="projects-showcase__group" aria-labelledby="professional-projects-title">
            <div class="projects-showcase__group-heading"><h3 id="professional-projects-title">Professional Work</h3><span>{{ professionalProjects.length }} {{ professionalProjects.length === 1 ? 'project' : 'projects' }}</span></div>
            <ol class="projects-showcase__grid projects-showcase__grid--professional" aria-label="Professional projects"><li v-for="project in professionalProjects" :key="project.id"><ProjectCard :project="project" @details="openDetails" /></li></ol>
          </section>
        </div>
      </div>
      <footer class="projects-showcase__footer"><span>{{ visibleProjectCount }} of {{ projects.length }} projects</span><span>Selected work / Floor {{ FLOOR.projects.number }}</span></footer>
    </div>
    <dialog ref="detailDialog" class="project-dialog" aria-labelledby="project-dialog-title" @close="onDialogClose" @click="onBackdropClick" @keydown.esc.prevent="closeDetails">
      <article v-if="selectedProject" class="project-dialog__panel"><button class="project-dialog__close" type="button" aria-label="Close project details" @click="closeDetails">×</button><div class="project-dialog__preview" :class="{ 'project-dialog__preview--mockups': selectedProject.preview.kind === 'mockup' }"><template v-if="selectedProject.preview.kind === 'mockup'"><figure v-for="(preview, index) in [selectedProject.preview, ...(selectedProject.additionalPreviews ?? [])]" :key="preview.src ?? index"><img v-if="preview.src" :src="preview.src" :width="preview.width" :height="preview.height" :alt="preview.alt" :loading="index === 0 ? 'eager' : 'lazy'" /><figcaption>{{ preview.source }}</figcaption></figure></template><img v-else-if="selectedProject.preview.src" :src="selectedProject.preview.src" :width="selectedProject.preview.width" :height="selectedProject.preview.height" :alt="selectedProject.preview.alt" /><div v-else class="source-preview" role="img" :aria-label="selectedProject.preview.alt"><span>Source project</span><strong>{{ selectedProject.title }}</strong></div></div><div class="project-dialog__content"><p class="eyebrow">{{ selectedProject.title }}</p><h3 id="project-dialog-title">{{ selectedProject.displayTitle }}</h3><p>{{ selectedProject.shortDescription }}</p><dl><div><dt>Role</dt><dd>{{ selectedProject.role }}</dd></div><div v-if="selectedProject.technologies.length"><dt>Technologies</dt><dd>{{ selectedProject.technologies.join(" · ") }}</dd></div><div v-if="selectedProject.attribution"><dt>Attribution</dt><dd>{{ selectedProject.attribution }}</dd></div><div><dt>Preview source</dt><dd>{{ selectedProject.preview.source }}</dd></div></dl><div v-if="selectedProject.liveUrl || selectedProject.repositoryUrl" class="project-dialog__links"><a v-if="selectedProject.liveUrl" :href="selectedProject.liveUrl" target="_blank" rel="noreferrer">View demo ↗</a><a v-if="selectedProject.repositoryUrl" :href="selectedProject.repositoryUrl" target="_blank" rel="noreferrer">Source code ↗</a></div></div></article>
    </dialog>
  </section>
</template>

<style scoped>
.projects { background: #10191b; }
.projects::before { content: none; }
.project-dialog__preview--mockups { display: grid; align-content: start; gap: 1rem; min-height: 0; max-height: none; padding: 1rem; }
.project-dialog__preview--mockups figure { margin: 0; min-width: 0; }
.project-dialog__preview--mockups img { width: 100%; height: auto; object-fit: contain; }
.project-dialog__preview--mockups figcaption { margin-top: .5rem; color: #d0c7b8; font-size: .75rem; line-height: 1.5; }

.projects-showcase { width: min(92rem, calc(100% - 2 * var(--space))); margin: 0 auto; padding-top: var(--projects-ui-clearance, 0px); }
.projects-showcase__header { display: grid; grid-template-columns: max-content minmax(0, 1fr) minmax(12rem, .9fr); gap: 1.7rem; align-items: center; padding: 0 0 2rem; }
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
.projects-showcase__rail { min-width: 0; }
.projects-showcase__mobile-category { display: none; }
.project-categories { display: flex; flex-wrap: wrap; gap: .55rem; }
.project-categories button { display: flex; align-items: center; gap: .6rem; min-width: 0; min-height: 44px; padding: .65rem .8rem; border: 1px solid #afa18a77; border-radius: 7px 2px 7px 2px; background: #111417e8; color: #e9dfd0; font-size: .76rem; text-align: left; transition: background .2s, color .2s; }
.project-categories button[aria-pressed="true"] { border-color: #ffb33c; background: linear-gradient(110deg, #ffbd48, #f59f20); color: #1b140b; box-shadow: 0 3px 14px #ffaf2422; }
.project-categories button:hover { border-color: #ffbd48; }
.project-categories button:focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
.project-categories button > span:nth-child(2) { min-width: 0; overflow-wrap: anywhere; }
.project-categories__symbol { font-size: 1.2rem; }
.project-categories button b { margin-left: auto; padding-left: .5rem; font-size: .72rem; }
.projects-showcase__metadata { display: none; }
.projects-showcase__results { min-width: 0; }
.projects-showcase__count { margin: 0 0 .7rem; color: #d5c8b4; font: .65rem/1.6 "IBM Plex Mono", monospace; letter-spacing: .05em; }
.projects-showcase__group { margin-top: 1.8rem; }
.projects-showcase__group:first-of-type { margin-top: 1.4rem; }
.projects-showcase__group-heading { display: flex; flex-wrap: wrap; align-items: center; gap: .7rem; margin-bottom: 1rem; border-bottom: 1px solid #c5a67b55; padding-bottom: .7rem; }
.projects-showcase__group-heading h3 { margin: 0; color: #e5d5be; text-transform: uppercase; font-size: .8rem; letter-spacing: .12em; }
.projects-showcase__group-heading > span { color: #bfae95; font: .65rem "IBM Plex Mono", monospace; margin-left: auto; }
.projects-showcase__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: start; gap: 1.1rem; list-style: none; padding: 0; margin: 0; }
.projects-showcase__grid > li { min-width: 0; }
.projects-showcase__grid.projects-showcase__grid--professional { grid-template-columns: minmax(0, 1fr); }
.projects-showcase__footer { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; border-top: 1px solid #ac8d6755; margin-top: 2rem; padding-top: 1rem; color: #c7b8a3; font: .65rem/1.8 "IBM Plex Mono", monospace; text-transform: uppercase; letter-spacing: .08em; }
@media (min-width: 1400px) {
  .projects-showcase__layout { grid-template-columns: 11.5rem minmax(0, 1fr); gap: 1.5rem; }
  .projects-showcase__rail { position: sticky; top: 6rem; }
  .project-categories { display: grid; }
  .project-categories button { width: 100%; }
  .projects-showcase__metadata { display: block; margin-top: 1.7rem; border-top: 1px solid #ac8d6755; padding-top: 1rem; }
  .projects-showcase__metadata p { margin: 0 0 .7rem; color: #c7b8a3; font: .65rem "IBM Plex Mono", monospace; text-transform: uppercase; letter-spacing: .12em; }
  .projects-showcase__metadata ul { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0; padding: 0; list-style: none; }
  .projects-showcase__metadata li { max-width: 100%; padding: .3rem .5rem; border: 1px solid #8d847666; border-radius: 999px; background: #111417dc; font-size: .65rem; color: #ddd0bc; overflow-wrap: anywhere; }
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
@media (prefers-reduced-motion: reduce) { .project-categories button { transition: none; } }
</style>
