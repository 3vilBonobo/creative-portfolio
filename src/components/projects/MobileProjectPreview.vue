<script setup lang="ts">
import { computed } from "vue";
import type { Project } from "../../types/content";
import { projectBorderColor } from "../../data/projectBorders";

const props = defineProps<{ project: Project; featured?: boolean }>();
const emit = defineEmits<{ details: [project: Project, trigger: HTMLElement] }>();
const image = computed(() => props.project.cover ?? props.project.preview);
const disclosure = computed(() => props.project.cover?.label ?? (props.project.preview.kind === "mockup" ? "Illustrative interface concept" : null));
const liveActionLabel = computed(() => props.project.liveLabel?.toLowerCase().includes("website") ? "Visit Website" : "Live Demo");
function openPreview(event: MouseEvent) {
  if ((event.target as HTMLElement).closest("a")) return;
  const trigger = event.currentTarget;
  if (trigger instanceof HTMLElement) emitDetails(trigger);
}
function emitDetails(trigger: HTMLElement) { emit("details", props.project, trigger); }
</script>

<template>
  <article v-if="featured" class="mobile-project-feature" :style="{ '--project-border': projectBorderColor(project.id) }" :data-project-id="project.id" aria-labelledby="mobile-feature-title" :aria-describedby="`mobile-feature-actions-${project.id}`" tabindex="0" @click="openPreview" @keydown.enter.self.prevent="$emit('details', project, $event.currentTarget as HTMLElement)">
    <div class="mobile-project-feature__art">
      <img v-if="image.src" :src="image.src" :srcset="image.srcSet" sizes="(orientation: landscape) 40vw, 100vw" :width="image.width" :height="image.height" :alt="image.alt" :style="{ objectPosition: project.cover?.objectPosition }">
      <span class="mobile-project-feature__badge">★ Featured</span>
      <span v-if="project.status" class="mobile-project-feature__status">{{ project.status }}</span>
      <span v-if="disclosure" class="mobile-project-feature__disclosure">{{ disclosure }}</span>
    </div>
    <div class="mobile-project-feature__copy">
      <p class="sr-only">{{ project.categoryLabel }}</p>
      <h3 id="mobile-feature-title">{{ project.title }}</h3>
      <p class="mobile-project-feature__summary">{{ project.cardDescription ?? project.shortDescription }}</p>
      <div :id="`mobile-feature-actions-${project.id}`" class="mobile-project-feature__actions" :aria-label="`${project.title} links. Tap this card, or focus it and press Enter, for project details.`">
        <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noreferrer">{{ liveActionLabel }} <span aria-hidden="true">↗</span></a>
        <a v-if="project.repositoryUrl" :href="project.repositoryUrl" target="_blank" rel="noreferrer">View code <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>
  <article v-else class="mobile-project-preview" :style="{ '--project-border': projectBorderColor(project.id) }" :data-project-id="project.id" :aria-labelledby="`mobile-project-title-${project.id}`" :aria-describedby="`mobile-project-actions-${project.id}`" tabindex="0" @click="openPreview" @keydown.enter.self.prevent="$emit('details', project, $event.currentTarget as HTMLElement)">
    <span class="mobile-project-preview__image">
      <img v-if="image.src" :src="image.src" :srcset="image.srcSet" sizes="104px" :width="image.width" :height="image.height" alt="" loading="lazy" :style="{ objectPosition: project.cover?.objectPosition }">
      <span v-else aria-hidden="true">&lt;/&gt;</span>
    </span>
    <span class="mobile-project-preview__copy">
      <strong :id="`mobile-project-title-${project.id}`">{{ project.title }}</strong>
      <span>{{ project.categoryLabel ?? project.displayTitle }}</span>
      <span class="mobile-project-preview__summary">{{ project.cardDescription ?? project.shortDescription }}</span>
      <small v-if="project.status">{{ project.status }}</small>
      <small v-if="disclosure" class="mobile-project-preview__disclosure">{{ disclosure }}</small>
      <span :id="`mobile-project-actions-${project.id}`" class="mobile-project-preview__actions" :aria-label="`${project.title} links. Tap this card, or focus it and press Enter, for project details.`">
        <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noreferrer">{{ liveActionLabel }}</a>
        <a v-if="project.repositoryUrl" :href="project.repositoryUrl" target="_blank" rel="noreferrer">Code</a>
      </span>
    </span>
    <span class="mobile-project-preview__arrow" aria-hidden="true">›</span>
  </article>
</template>

<style scoped>
.mobile-project-preview { display: grid; grid-template-columns: 72px minmax(0, 1fr) 12px; gap: min(.6rem, 10px); align-items: center; width: 100%; height: 100%; min-height: 76px; padding: min(.4rem, 8px); border: 1px solid var(--project-border); background: #10181de8; color: #f1e9dc; text-align: left; cursor: pointer; }
.mobile-project-preview__image { display: grid; place-items: center; aspect-ratio: 4 / 3; padding: .25rem; overflow: hidden; border: 1px solid #ffffff16; background: #202d31; color: #8bd9dc; }
.mobile-project-preview__image img { display: block; width: 100%; height: 100%; object-fit: contain; }
.mobile-project-preview__copy { display: grid; gap: .3rem; min-width: 0; overflow-wrap: anywhere; }
.mobile-project-preview__copy strong { font: 600 1.1rem/1.1 "Barlow Condensed", sans-serif; text-transform: uppercase; }
.mobile-project-preview__copy > span:not(.sr-only), .mobile-project-preview__copy small { font-size: .68rem; line-height: 1.45; color: #bfcfce; }
.mobile-project-preview__copy small { color: #d7c18f; }
.mobile-project-preview .mobile-project-preview__copy > .mobile-project-preview__summary { color: #cdd3d1; font-size: .75rem; line-height: 1.45; }
.mobile-project-preview__copy .mobile-project-preview__disclosure { color: #9cdedc; }
.mobile-project-preview__actions, .mobile-project-feature__actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); justify-self: center; gap: .5rem; width: min(100%, 18rem); }
.mobile-project-preview__actions a, .mobile-project-feature__actions a { display: inline-flex; align-items: center; justify-content: center; min-width: 0; min-height: 40px; padding: .35rem .4rem; border: 1px solid var(--projects-amber-border, #a98d64); color: var(--projects-amber-hover, #efb65c); font: 600 .62rem/1.3 "IBM Plex Mono", monospace; text-align: center; text-decoration: none; }
.mobile-project-preview__arrow { color: var(--projects-amber, #dea044); font-size: 24px; line-height: 1; }
.mobile-project-preview:hover { background: #1a2a30; border-color: var(--project-border); }
.mobile-project-preview:focus-visible, .mobile-project-feature:focus-visible, .mobile-project-preview__actions a:focus-visible, .mobile-project-feature__actions a:focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
.mobile-project-feature { overflow: hidden; border: 1px solid var(--project-border); background: var(--projects-card-surface, rgb(8 15 17 / .72)); cursor: pointer; }
.mobile-project-feature__art { position: relative; aspect-ratio: 21 / 9; padding: .45rem; overflow: hidden; background: radial-gradient(ellipse at center, #293137, #0b1014 75%); }
.mobile-project-feature__art img { display: block; width: 100%; height: 100%; object-fit: contain; }
.mobile-project-feature__badge, .mobile-project-feature__status, .mobile-project-feature__disclosure { position: absolute; padding: .25rem .4rem; font: .6rem/1.4 "IBM Plex Mono", monospace; }
.mobile-project-feature__badge, .mobile-project-feature__status { max-width: calc(50% - .8rem); overflow-wrap: anywhere; }
.mobile-project-feature__badge { top: .6rem; left: .6rem; background: var(--projects-button-fill, linear-gradient(180deg, #edb555, #bd7526)); color: #17130c; }
.mobile-project-feature__status { top: .6rem; right: .6rem; background: #0a1014ed; color: #e0d5a8; }
.mobile-project-feature__disclosure { bottom: .5rem; left: .5rem; right: .5rem; width: fit-content; background: #0a1014ed; color: #eee9e0; }
.mobile-project-feature__copy { display: grid; gap: .45rem; padding: .7rem; }
.mobile-project-feature__copy p { margin: 0; font: .6rem/1.5 "IBM Plex Mono", monospace; color: #c4cd9c; }
.mobile-project-feature__copy h3 { margin: 0; font: 600 1.8rem/1 "Barlow Condensed", sans-serif; }
.mobile-project-feature__copy .mobile-project-feature__summary { font: .85rem/1.6 var(--font-body, sans-serif); color: #dfddd4; }
@media (orientation: landscape) { .mobile-project-feature { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); } .mobile-project-feature__art { aspect-ratio: auto; min-height: 150px; } .mobile-project-feature__art img { position: absolute; inset: .45rem; width: calc(100% - .9rem); height: calc(100% - .9rem); } }
@media (max-width: 340px) { .mobile-project-preview { grid-template-columns: 72px minmax(0, 1fr) 10px; gap: .5rem; } .mobile-project-feature__badge, .mobile-project-feature__status { font-size: .55rem; } }
/* em follows the user's text size: retain horizontal rows at normal phone
   widths and let enlarged text use the full row instead of splitting words. */
@container (max-width: 15em) {
  .mobile-project-preview { grid-template-columns: minmax(0, 1fr) 12px; }
  .mobile-project-preview__image { grid-column: 1 / -1; width: 104px; }
  .mobile-project-preview__copy { grid-column: 1; }
  .mobile-project-preview__arrow { grid-column: 2; }
}
</style>
