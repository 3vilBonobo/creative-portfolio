<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ProjectCard from "../components/projects/ProjectCard.vue";
import MobileProjectPreview from "../components/projects/MobileProjectPreview.vue";
import { usePhoneLayout } from "../composables/usePhoneLayout";
import { categoryProjects, projectDisclosure, type CatalogueCategory } from "../services/projectCatalogue";
import "../floor02-mobile.css";
import ProjectsEnvironment from "../components/projects/ProjectsEnvironment.vue";
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
const sectionHeight = ref(0);
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
  const layout = section.querySelector<HTMLElement>(".projects-showcase__layout");
  const rail = categoryRail.value;
  const stackedRail = layout && rail && getComputedStyle(layout).gridTemplateColumns.split(/\s+/).length === 1
    ? rail.offsetHeight + (parseFloat(getComputedStyle(layout).rowGap) || 0) : 0;
  const available = Math.floor(window.innerHeight
    - (parseFloat(style.scrollMarginTop) || 0)
    - (parseFloat(style.borderTopWidth) || 0) - (parseFloat(style.borderBottomWidth) || 0)
    - (parseFloat(style.paddingTop) || 0) - (parseFloat(style.paddingBottom) || 0)
    - contentClearance.value - header.offsetHeight - footer.offsetHeight
    - (parseFloat(getComputedStyle(footer).marginTop) || 0) - stackedRail);
  // Standard desktop windows retain a contained catalogue; touch layouts and
  // exceptionally short/enlarged-text windows keep accessible document flow.
  windowed.value = !phone.value
    && window.matchMedia("(min-width: 1024px) and (min-height: 600px) and (hover: hover) and (pointer: fine)").matches
    && available >= 200;
  paneHeight.value = Math.max(0, available);
  if (windowed.value) {
    sectionHeight.value = window.innerHeight;
  }
}
onMounted(() => {
  headerObserver = new ResizeObserver(updateContentClearance);
  const header = document.querySelector(".site-header");
  if (header) headerObserver.observe(header);
  if (sectionElement.value) headerObserver.observe(sectionElement.value);
  const layout = sectionElement.value?.querySelector(".projects-showcase__layout");
  if (layout) headerObserver.observe(layout);
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
  expanded.value.creative = category.value === "creative";
  expanded.value.professional = category.value === "professional";
  await nextTick();
  updateContentClearance();
  if (windowed.value) projectResults.value?.scrollTo({ top: 0, behavior: "auto" });
});
watch([phone, landscape], async () => { await nextTick(); updateContentClearance(); });
const featuredProject = computed(() => projects.find(project => project.id === "nerve-ending"));
const projectPreviews = computed(() => selectedProject.value
  ? [selectedProject.value.preview, ...(selectedProject.value.additionalPreviews ?? [])].filter(preview => preview.src)
  : []);
const hasPreviewGallery = computed(() => projectPreviews.value.length > 1);
const creativeProjects = computed(() => categoryProjects(projects, "creative", featuredProject.value?.id));
const professionalProjects = computed(() => categoryProjects(projects, "professional", featuredProject.value?.id));
const creativeDisclosure = computed(() => projectDisclosure(creativeProjects.value, expanded.value.creative, rowSize.value));
const professionalDisclosure = computed(() => projectDisclosure(professionalProjects.value, expanded.value.professional, rowSize.value));
const displayedCount = computed(() => (category.value !== "professional" ? creativeDisclosure.value.visible.length + (featuredProject.value ? 1 : 0) : 0)
    + (category.value !== "creative" ? professionalDisclosure.value.visible.length : 0)
);
function revealCatalogueControl(control: HTMLElement) {
  const pane = projectResults.value;
  const bounds = control.getBoundingClientRect();
  if (windowed.value && pane?.contains(control)) {
    const viewport = pane.getBoundingClientRect();
    const top = viewport.top + pane.clientTop + 12;
    const bottom = viewport.top + pane.clientTop + pane.clientHeight - 12;
    const delta = bounds.top < top ? bounds.top - top : bounds.bottom > bottom ? bounds.bottom - bottom : 0;
    if (delta) pane.scrollBy({ top: delta, behavior: "instant" });
    return;
  }
  const header = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 64;
  if (bounds.top < header || bounds.bottom > window.innerHeight) control.scrollIntoView({ block: "center", behavior: "instant" });
}
async function toggleCategory(id: CatalogueCategory, event: Event) {
  const button = event.currentTarget as HTMLButtonElement;
  expanded.value[id] = !expanded.value[id];
  await nextTick();
  button.focus({ preventScroll: true });
  if (!expanded.value[id]) revealCatalogueControl(button);
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
  if (phone.value || windowed.value) trigger?.focus({ preventScroll: true });
  else trigger?.focus();
  if ((phone.value || windowed.value) && trigger) revealCatalogueControl(trigger);
}
function onBackdropClick(event: MouseEvent) { if (event.target === detailDialog.value) closeDetails(); }

</script>

<template>
  <section ref="sectionElement" :id="FLOOR.projects.id" class="floor-section projects" :class="{ 'projects--windowed': windowed, 'projects--phone': phone, 'projects--portrait': portrait, 'projects--landscape': landscape }" :style="windowed && sectionHeight ? { '--projects-section-height': `${sectionHeight}px` } : undefined" :data-floor-number="FLOOR.projects.number" aria-labelledby="projects-title">
    <ProjectsEnvironment />
    <div class="projects-showcase" :style="{ '--projects-ui-clearance': `${contentClearance}px`, '--projects-pane-height': `${paneHeight}px` }">
      <header ref="showcaseHeader" class="projects-showcase__header">
        <div class="projects-showcase__title"><h2 id="projects-title">Selected Projects</h2></div>
      </header>
      <div class="projects-showcase__layout">
        <aside ref="categoryRail" class="projects-showcase__rail" :tabindex="windowed ? 0 : undefined" aria-label="Project browsing">
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
            <small>Technologies used across these projects.</small>
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
    </div>
    <dialog ref="detailDialog" class="project-dialog" :class="{ 'project-dialog--case-study': selectedProject?.caseStudy, 'project-dialog--responsive-preview': selectedProject?.preview.srcSet }" aria-labelledby="project-dialog-title" @close="onDialogClose" @click="onBackdropClick" @keydown="keepPhoneDialogFocus" @keydown.esc.prevent="closeDetails">
      <article v-if="selectedProject" class="project-dialog__panel">
        <button class="project-dialog__close" type="button" aria-label="Close project details" @click="closeDetails">×</button>
        <div class="project-dialog__preview" :class="{ 'project-dialog__preview--gallery': hasPreviewGallery }" role="region" aria-label="Project image previews" tabindex="0">
          <div class="project-dialog__preview-track">
            <figure v-for="(preview, index) in projectPreviews" :key="preview.src ?? index" class="project-dialog__slide">
              <img v-if="preview.src" :src="preview.src" :srcset="preview.srcSet" sizes="(max-width: 760px) 90vw, 42vw" :width="preview.width" :height="preview.height" :alt="preview.alt" :loading="index === 0 ? 'eager' : 'lazy'" />
              <figcaption>{{ preview.source }}</figcaption>
            </figure>
            <div v-if="!selectedProject.preview.src" class="source-preview" role="img" :aria-label="selectedProject.preview.alt"><span>Source project</span><strong>{{ selectedProject.title }}</strong></div>
          </div>
          <span v-if="hasPreviewGallery" class="project-dialog__preview-hint" aria-hidden="true">Scroll for more images <span>↓</span></span>
        </div>
        <div class="project-dialog__content">
          <div class="project-dialog__content-scroll" tabindex="0" aria-label="Project details">
            <header class="project-dialog__heading">
              <p class="eyebrow">{{ selectedProject.categoryLabel ?? (selectedProject.category === "creative" ? "Creative project" : "Professional project") }}</p>
              <span v-if="selectedProject.status" class="project-development-status">{{ selectedProject.status }}</span>
              <h3 id="project-dialog-title">{{ selectedProject.displayTitle }}</h3>
            </header>
            <section class="project-dialog__overview" aria-labelledby="project-overview-title">
              <h4 id="project-overview-title"><span aria-hidden="true">✳</span> The project</h4>
              <p>{{ selectedProject.shortDescription }}</p>
            </section>
            <div class="project-dialog__facts">
              <section class="project-dialog__fact"><span>Your role</span><p>{{ selectedProject.role }}</p></section>
              <section v-if="selectedProject.industry" class="project-dialog__fact"><span>Area</span><p>{{ selectedProject.industry }}</p></section>
              <section v-if="selectedProject.genre" class="project-dialog__fact"><span>Experience</span><p>{{ selectedProject.genre }}</p></section>
            </div>
            <section v-if="selectedProject.technologies.length" class="project-dialog__technology" aria-labelledby="project-technologies-title">
              <h4 id="project-technologies-title">Built with</h4>
              <ul><li v-for="technology in selectedProject.technologies" :key="technology">{{ technology }}</li></ul>
            </section>
            <section v-if="selectedProject.skills?.length" class="project-dialog__technology" aria-labelledby="project-skills-title">
              <h4 id="project-skills-title">Focus</h4>
              <ul><li v-for="skill in selectedProject.skills" :key="skill">{{ skill }}</li></ul>
            </section>
            <section v-if="selectedProject.interactionNotes" class="project-dialog__interaction" aria-labelledby="project-interaction-title">
              <h4 id="project-interaction-title">Try it</h4>
              <p>{{ selectedProject.interactionNotes }}</p>
            </section>
            <p v-if="selectedProject.credit" class="project-dialog__credit">{{ selectedProject.credit }}</p>
            <p v-if="selectedProject.attribution" class="project-dialog__credit">{{ selectedProject.attribution }}</p>
            <section v-if="selectedProject.caseStudy" class="project-case-study" aria-labelledby="engineering-contributions-title">
              <h4 id="engineering-contributions-title">Engineering contributions</h4>
                <p v-for="paragraph in selectedProject.caseStudy.introduction" :key="paragraph">{{ paragraph }}</p>
                <ul class="project-case-study__contributions"><li v-for="contribution in selectedProject.caseStudy.contributions" :key="contribution.title"><strong>{{ contribution.title }}</strong><span>{{ contribution.text }}</span></li></ul>
                <p class="project-case-study__disclosure">{{ selectedProject.caseStudy.confidentiality }}</p>
            </section>
            <section v-if="selectedProject.developmentDetails" class="project-development" aria-labelledby="development-details-title">
              <h4 id="development-details-title">Behind the prototype</h4>
                <section><h5>Concept &amp; player experience</h5><p>{{ selectedProject.developmentDetails.concept }}</p></section>
                <section><h5>In the prototype</h5><ul><li v-for="item in selectedProject.developmentDetails.implemented" :key="item">{{ item }}</li></ul></section>
                <section><h5>Next steps</h5><ul><li v-for="item in selectedProject.developmentDetails.planned" :key="item">{{ item }}</li></ul></section>
                <section><h5>Technical architecture</h5><p>{{ selectedProject.developmentDetails.architecture }}</p></section>
                <section><h5>Art direction</h5><p>{{ selectedProject.developmentDetails.artisticDirection }}</p></section>
            </section>
            <template v-if="selectedProject.caseStudy">
              <a class="project-case-study__experience" :href="selectedProject.caseStudy.experienceUrl" target="_blank" rel="noopener noreferrer" aria-label="View my professional experience on LinkedIn (opens in a new tab)">View my professional experience on LinkedIn <span aria-hidden="true">↗</span></a>
            </template>
          </div>
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
.projects {
  --projects-amber: #dea044;
  --projects-amber-hover: #efb65c;
  --projects-amber-border: #a66c27;
  --projects-button-fill: linear-gradient(180deg, #edb555 0%, #df9a36 52%, #bd7526 100%);
  --projects-button-hover: linear-gradient(180deg, #f3c06a 0%, #eaaa4c 52%, #cb8836 100%);
  --projects-button-pressed: linear-gradient(180deg, #b87325, #d79232);
  --projects-button-shadow: inset 0 1px 0 #fff4, inset 0 -1px 0 #0004, 0 3px 8px #0005;
  --projects-surface: rgb(6 12 14 / .88);
  --projects-card-surface: rgb(8 15 17 / .72);
  background: #10191b;
}
.projects::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(90deg, #0008, #0004 45%, #0001 75%), linear-gradient(to bottom, #0001, #0003 70%, #0006);
  mix-blend-mode: normal;
}
.project-development-status { display: inline-flex; width: fit-content; margin: .7rem 0 0; padding: .3rem .6rem; border: 1px solid #e6ae4f70; border-radius: 999px; color: #f0c16f; background: #e6ae4f12; font: .68rem/1.4 "IBM Plex Mono", monospace; }
.project-dialog { width: min(76rem, calc(100vw - 2rem)); height: min(86dvh, 54rem); max-height: calc(100dvh - 2rem); overflow: hidden; border: 1px solid #8e826c; border-radius: 5px; background: #101716; color: var(--project-cream); box-shadow: 0 2rem 7rem #000; }
.project-dialog__panel { position: relative; display: grid; grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr); grid-template-rows: minmax(0, 1fr); width: 100%; height: 100%; max-height: none; overflow: hidden; }
.project-dialog__close { position: absolute; top: .75rem; right: .75rem; z-index: 4; width: 2.75rem; height: 2.75rem; margin: 0; border: 1px solid #d8c59b75; border-radius: 50%; background: #0b1111ed; color: #fff4e1; font-size: 1.5rem; }
.project-dialog__close:hover { border-color: #f0b653; color: #f0b653; }
.project-dialog__preview { position: relative; grid-column: 1; grid-row: 1; min-width: 0; min-height: 0; overflow: auto; overscroll-behavior: contain; scrollbar-color: #8d7650 #0c1110; scrollbar-width: thin; background: radial-gradient(ellipse at center, #233033, #090d0d 78%); }
.project-dialog__preview-track { display: flex; flex-direction: column; gap: .75rem; min-height: 100%; }
.project-dialog__slide { display: grid; flex: 0 0 100%; grid-template-rows: minmax(0, 1fr) auto; min-width: 0; min-height: 100%; margin: 0; padding: 1.25rem; scroll-snap-align: start; }
.project-dialog__slide img { display: block; width: 100%; height: 100%; min-height: 0; object-fit: contain; }
.project-dialog__slide figcaption { padding: .65rem .25rem 0; color: #b8c7c3; font-size: .72rem; line-height: 1.5; }
.project-dialog__preview--gallery { scroll-snap-type: y proximity; }
.project-dialog__preview-hint { position: sticky; bottom: .65rem; display: flex; align-items: center; justify-content: center; gap: .5rem; width: fit-content; margin: -2.7rem auto .65rem; padding: .35rem .65rem; border: 1px solid #c8a36680; border-radius: 999px; color: #f0d7ad; background: #0b1111e8; font: .62rem/1.4 "IBM Plex Mono", monospace; pointer-events: none; }
.project-dialog__content { display: grid; grid-column: 2; grid-row: 1; grid-template-rows: minmax(0, 1fr) auto; min-width: 0; min-height: 0; overflow: hidden; border-left: 1px solid #ffffff15; background: linear-gradient(160deg, #151e1d, #0d1313 68%); }
.project-dialog__content-scroll { min-width: 0; min-height: 0; overflow: auto; overscroll-behavior: contain; overflow-wrap: anywhere; padding: clamp(1.5rem, 3vw, 2.6rem); padding-top: 2rem; scrollbar-color: #8d7650 #0d1313; scrollbar-width: thin; }
.project-dialog__heading { padding-right: 2.5rem; }
.project-dialog__heading .eyebrow { margin: 0; color: #a8c6b9; font: .67rem/1.5 "IBM Plex Mono", monospace; letter-spacing: .11em; text-transform: uppercase; }
.project-dialog__heading h3 { margin: .7rem 0 1.25rem; color: #fff4e5; font: 600 clamp(2.2rem, 4vw, 3.8rem)/.98 "Barlow Condensed", sans-serif; letter-spacing: -.02em; text-transform: uppercase; }
.project-dialog__overview { margin: 0 0 1rem; padding: 1rem 1.1rem; border: 1px solid #88c9bd40; border-left: 3px solid #83c9be; border-radius: 3px 10px 3px 10px; background: linear-gradient(135deg, #87cfc00f, #87cfc004); }
.project-dialog__overview h4, .project-dialog__technology h4, .project-dialog__interaction h4, .project-development > h4 { margin: 0 0 .55rem; color: #90d5cb; font: 600 .66rem/1.4 "IBM Plex Mono", monospace; letter-spacing: .1em; text-transform: uppercase; }
.project-dialog__overview h4 span { margin-right: .4rem; color: #f0b653; }
.project-dialog__overview p, .project-dialog__interaction p { margin: 0; color: #e0e3db; font-size: .94rem; line-height: 1.65; }
.project-dialog__facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: .55rem; margin: .8rem 0 1rem; }
.project-dialog__fact { min-width: 0; padding: .75rem; border: 1px solid #ffffff16; border-radius: 3px 8px 3px 8px; background: #ffffff05; }
.project-dialog__fact > span { display: block; margin-bottom: .35rem; color: #e9b760; font: .6rem/1.4 "IBM Plex Mono", monospace; letter-spacing: .08em; text-transform: uppercase; }
.project-dialog__fact p { margin: 0; color: #e1e2dc; font-size: .82rem; line-height: 1.5; }
.project-dialog__technology, .project-dialog__interaction, .project-development, .project-case-study { margin: 1rem 0; }
.project-dialog__technology ul { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0; padding: 0; list-style: none; }
.project-dialog__technology li { padding: .33rem .58rem; border: 1px solid #b99c6a4d; border-radius: 999px; color: #e9dfcd; background: #e2b45d0b; font-size: .72rem; line-height: 1.3; }
.project-dialog__interaction { padding: .9rem 1rem; border: 1px solid #d2a95532; border-radius: 3px 8px 3px 8px; background: #d2a95509; }
.project-dialog__credit { margin: .8rem 0; color: #bbc5bf; font-size: .78rem; line-height: 1.55; }
.project-case-study, .project-development { color: #d8d8cf; font-size: .86rem; line-height: 1.65; }
.project-case-study h4, .project-development > h4 { margin: 0 0 .65rem; color: #f0c16f; font: 600 .72rem/1.5 "IBM Plex Mono", monospace; letter-spacing: .08em; text-transform: uppercase; }
.project-case-study p { margin: 0 0 .75rem; }
.project-case-study__contributions { display: grid; gap: .5rem; margin: .8rem 0; padding: 0; list-style: none; }
.project-case-study__contributions li { display: grid; gap: .2rem; padding: .7rem .8rem; border-left: 2px solid #81c9be8c; background: #ffffff06; }
.project-case-study__contributions strong { color: #f2d6a5; font-size: .8rem; }
.project-case-study__contributions span { color: #c9d1cb; font-size: .78rem; line-height: 1.55; }
.project-case-study__disclosure { padding: .75rem; border-left: 2px solid #dca95f; color: #d1c7b8; background: #dca95f0a; font-size: .77rem; }
.project-case-study__experience { display: inline-flex; gap: .5rem; align-items: center; min-height: 44px; margin-top: .25rem; padding: .6rem .8rem; border: 1px solid #8ed8d0; border-radius: 3px 8px 3px 8px; color: #bce9e2; text-decoration: none; overflow-wrap: anywhere; }
.project-case-study__experience:hover { background: #8ed8d012; }
.project-case-study__experience:focus-visible { outline: 2px solid #8ed8d0; outline-offset: 4px; }
.project-development section { margin: .9rem 0; padding: .8rem; border: 1px solid #ffffff12; border-radius: 3px 8px 3px 8px; background: #ffffff04; }
.project-development h5 { margin: 0 0 .4rem; color: #f0c16f; font-size: .8rem; line-height: 1.4; }
.project-development p { margin: 0; }
.project-development ul { margin: 0; padding-left: 1.2rem; list-style: disc; }
.project-development li + li { margin-top: .4rem; }
.project-dialog__links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .55rem; padding: .75rem clamp(1rem, 2.5vw, 1.8rem); border-top: 1px solid #ffffff16; background: #0b1111f5; }
.project-dialog__links a { display: inline-flex; align-items: center; justify-content: center; min-width: 0; min-height: 44px; padding: .6rem .75rem; border: 1px solid #8ed8d0; border-radius: 3px 8px 3px 8px; color: #bce9e2; background: #8ed8d00d; font: 600 .68rem/1.35 "IBM Plex Mono", monospace; text-align: center; text-decoration: none; text-transform: uppercase; }
.project-dialog__links a:first-child { border-color: #d8953d; color: #17130c; background: linear-gradient(180deg,#edb555,#bd7526); }
.project-dialog__links a:focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
.project-dialog__preview:focus-visible, .project-dialog__content-scroll:focus-visible { outline: 2px solid #8ed8d0; outline-offset: -3px; }

.projects-showcase { position: relative; z-index: 1; width: min(96rem, calc(100% - 2 * var(--space))); margin: 0 auto; padding-top: var(--projects-ui-clearance, 0px); }
.projects-showcase__header { display: flex; align-items: center; padding: 0 0 .8rem; }
.projects-showcase__title { background: #000a; box-shadow: 0 0 22px 14px #000a; }
.projects-showcase__title { min-width: 0; }
.projects-showcase__title h2 { margin: 0; color: #f1e9dc; font-size: clamp(1.5rem, 4vw, 3.4rem); line-height: 1; letter-spacing: -.035em; font-weight: 900; text-transform: uppercase; white-space: nowrap; text-shadow: 0 3px 0 #0005; }
.projects-showcase__layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; align-items: start; }
.projects-showcase__rail { min-width: 0; padding: .75rem; border: 1px solid #a98d644d; border-radius: 3px; background: var(--projects-surface); }
.projects-showcase__mobile-category { display: none; }
.project-categories { display: flex; flex-wrap: wrap; gap: .55rem; }
.project-categories button { display: flex; align-items: center; gap: .6rem; min-width: 0; min-height: 3.75rem; padding: .55rem .7rem; border: 1px solid #afa18a77; border-radius: 7px 2px 7px 2px; background: rgb(13 20 22 / .8); color: #e9dfd0; font-size: .76rem; line-height: 1.25; text-align: left; transition: background .2s, color .2s; }
.project-categories button[aria-pressed="true"] { border-color: var(--projects-amber-border); background: var(--projects-button-fill); color: #1b140b; box-shadow: var(--projects-button-shadow); }
.project-categories button[aria-pressed="true"]:hover { background: var(--projects-button-hover); }
.project-categories button[aria-pressed="true"]:active { background: var(--projects-button-pressed); box-shadow: inset 0 2px 4px #0005; }
.project-categories button:hover { border-color: var(--projects-amber); }
.project-categories button:focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
.project-categories button > span:nth-child(2) { display: -webkit-box; flex: 1 1 auto; min-width: 0; overflow: hidden; overflow-wrap: normal; word-break: normal; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.project-categories__symbol { font-size: 1.2rem; }
.project-categories button b { margin-left: auto; padding-left: .5rem; font-size: .72rem; }
.projects-showcase__metadata { display: none; }
.projects-showcase__results { min-width: 0; padding: .75rem .75rem 2rem; border: clamp(.75rem, 1.2vw, 1.25rem) solid transparent; outline: 1px solid #a98d644d; border-radius: 3px; background: var(--projects-surface); }
.projects--windowed { height: var(--projects-section-height, calc(150dvh - 1.5rem)); min-height: 0; scroll-margin-top: 1rem; }
.projects--windowed .projects-showcase__rail { position: static; max-height: var(--projects-pane-height); overflow-y: auto; overscroll-behavior-y: auto; scrollbar-width: thin; }
.projects--windowed .projects-showcase__results {
  height: auto;
  max-height: var(--projects-pane-height);
  overflow-y: auto;
  overscroll-behavior-y: auto;
  scrollbar-gutter: stable;
  scrollbar-color: var(--projects-amber-border) #10171a;
  scroll-padding-block: .75rem;
  scroll-padding-block-end: 2rem;
}
.projects--windowed .projects-showcase__results:focus-visible,
.projects--windowed .projects-showcase__rail:focus-visible {
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
@media (min-width: 760px) {
  .projects-showcase__layout { grid-template-columns: 13rem minmax(0, 1fr); gap: .6rem; }
  .projects-showcase__rail { position: sticky; top: 1rem; }
  .projects-showcase__results { border-radius: 0 3px 3px 3px; outline: none; }
  .project-categories { display: grid; }
  .project-categories button { width: 100%; }
  .projects-showcase__metadata { display: none; }
}
@media (max-width: 980px) {
  .projects-showcase__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 620px) {
  .projects-showcase { width: calc(100% - 2rem); }
  .projects-showcase__header { padding-bottom: .7rem; }
  .projects-showcase__title h2 { font-size: clamp(1.35rem, 7vw, 2.2rem); }
  .project-categories { display: none; }
  .projects-showcase__mobile-category { display: grid; gap: .5rem; color: #e8d5b9; font: .7rem "IBM Plex Mono", monospace; text-transform: uppercase; letter-spacing: .08em; }
  .projects-showcase__mobile-category select { width: 100%; min-width: 0; min-height: 44px; padding: .8rem; border: 1px solid var(--projects-amber-border); border-radius: 7px 2px 7px 2px; color: var(--projects-amber-hover); background: #101316; font: inherit; white-space: normal; }
  .projects-showcase__mobile-category select:focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
  .projects-showcase__grid { grid-template-columns: minmax(0, 1fr); }
}
.projects-showcase__more:focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
@media (min-width: 1024px) and (min-height: 600px) and (hover: hover) and (pointer: fine) {
  .projects:not(.projects--phone) { padding-top: clamp(.75rem, 2vh, 1.5rem); padding-bottom: clamp(.75rem, 1.5vh, 1.25rem); }
}
@media (prefers-reduced-motion: reduce) { .project-categories button { transition: none; } }
</style>
