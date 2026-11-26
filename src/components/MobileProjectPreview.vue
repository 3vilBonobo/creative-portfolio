<script setup lang="ts">
import { computed } from "vue";
import type { Project } from "../types/content";

const props = defineProps<{ project: Project; featured?: boolean }>();
defineEmits<{ details: [project: Project, trigger: HTMLElement] }>();
const image = computed(() => props.project.cover ?? props.project.preview);
const disclosure = computed(() => props.project.cover?.label ?? (props.project.preview.kind === "mockup" ? "Illustrative interface concept" : null));
</script>

<template>
  <article v-if="featured" class="mobile-project-feature" :data-project-id="project.id" aria-labelledby="mobile-feature-title">
    <div class="mobile-project-feature__art">
      <img v-if="image.src" :src="image.src" :srcset="image.srcSet" sizes="(orientation: landscape) 40vw, 100vw" :width="image.width" :height="image.height" :alt="image.alt" :style="{ objectPosition: project.cover?.objectPosition }">
      <span class="mobile-project-feature__badge">★ Featured</span>
      <span v-if="project.status" class="mobile-project-feature__status">{{ project.status }}</span>
      <span v-if="disclosure" class="mobile-project-feature__disclosure">{{ disclosure }}</span>
    </div>
    <div class="mobile-project-feature__copy">
      <p>{{ project.categoryLabel }}</p>
      <h3 id="mobile-feature-title">{{ project.title }}</h3>
      <p class="mobile-project-feature__summary">{{ project.cardDescription ?? project.shortDescription }}</p>
      <button type="button" @click="$emit('details', project, $event.currentTarget as HTMLElement)">Project Details <span aria-hidden="true">↗</span></button>
    </div>
  </article>
  <button v-else class="mobile-project-preview" :data-project-id="project.id" type="button" @click="$emit('details', project, $event.currentTarget as HTMLElement)">
    <span class="mobile-project-preview__image">
      <img v-if="image.src" :src="image.src" :srcset="image.srcSet" sizes="104px" :width="image.width" :height="image.height" alt="" loading="lazy" :style="{ objectPosition: project.cover?.objectPosition }">
      <span v-else aria-hidden="true">&lt;/&gt;</span>
    </span>
    <span class="mobile-project-preview__copy">
      <strong>{{ project.title }}</strong>
      <span>{{ project.categoryLabel ?? project.displayTitle }}</span>
      <small v-if="project.status">{{ project.status }}</small>
      <small v-if="disclosure" class="mobile-project-preview__disclosure">{{ disclosure }}</small>
      <small v-if="project.caseStudy">Confidential work · Details</small>
      <span class="sr-only">Open project details</span>
    </span>
    <span class="mobile-project-preview__arrow" aria-hidden="true">›</span>
  </button>
</template>

<style scoped>
.mobile-project-preview { display: grid; grid-template-columns: 88px minmax(0, 1fr) 12px; gap: min(.7rem, 12px); align-items: center; width: 100%; min-height: 96px; padding: min(.55rem, 10px); border: 1px solid #8fa9aa50; border-left-color: #8bd9dc; background: #10181de8; color: #f1e9dc; text-align: left; cursor: pointer; }
.mobile-project-preview__image { display: grid; place-items: center; aspect-ratio: 4 / 3; overflow: hidden; background: #202d31; color: #8bd9dc; }
.mobile-project-preview__image img { display: block; width: 100%; height: 100%; object-fit: cover; }
.mobile-project-preview__copy { display: grid; gap: .3rem; min-width: 0; overflow-wrap: anywhere; }
.mobile-project-preview__copy strong { font: 600 1.1rem/1.1 "Barlow Condensed", sans-serif; text-transform: uppercase; }
.mobile-project-preview__copy > span:not(.sr-only), .mobile-project-preview__copy small { font-size: .68rem; line-height: 1.45; color: #bfcfce; }
.mobile-project-preview__copy small { color: #d7c18f; }
.mobile-project-preview__copy .mobile-project-preview__disclosure { color: #9cdedc; }
.mobile-project-preview__arrow { color: #ffbc45; font-size: 24px; line-height: 1; }
.mobile-project-preview:hover { background: #1a2a30; border-color: #8bd9dc; }
.mobile-project-preview:focus-visible, .mobile-project-feature button:focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
.mobile-project-feature { overflow: hidden; border: 1px solid #b89d5f; background: #0a1014e8; }
.mobile-project-feature__art { position: relative; aspect-ratio: 16 / 9; overflow: hidden; }
.mobile-project-feature__art img { display: block; width: 100%; height: 100%; object-fit: cover; }
.mobile-project-feature__badge, .mobile-project-feature__status, .mobile-project-feature__disclosure { position: absolute; padding: .25rem .4rem; font: .6rem/1.4 "IBM Plex Mono", monospace; }
.mobile-project-feature__badge, .mobile-project-feature__status { max-width: calc(50% - .8rem); overflow-wrap: anywhere; }
.mobile-project-feature__badge { top: .6rem; left: .6rem; background: #ffbc45; color: #17130c; }
.mobile-project-feature__status { top: .6rem; right: .6rem; background: #0a1014ed; color: #e0d5a8; }
.mobile-project-feature__disclosure { bottom: .5rem; left: .5rem; right: .5rem; width: fit-content; background: #0a1014ed; color: #eee9e0; }
.mobile-project-feature__copy { display: grid; gap: .6rem; padding: .85rem; }
.mobile-project-feature__copy p { margin: 0; font: .6rem/1.5 "IBM Plex Mono", monospace; color: #c4cd9c; }
.mobile-project-feature__copy h3 { margin: 0; font: 600 1.8rem/1 "Barlow Condensed", sans-serif; }
.mobile-project-feature__copy .mobile-project-feature__summary { font: .85rem/1.6 var(--font-body, sans-serif); color: #dfddd4; }
.mobile-project-feature button { display: flex; justify-content: space-between; align-items: center; min-height: 44px; padding: .65rem .8rem; border: 1px solid #ffbc45; background: #ffbc45; color: #17130c; font: 600 .7rem/1.4 "IBM Plex Mono", monospace; cursor: pointer; }
@media (orientation: landscape) { .mobile-project-feature { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); } .mobile-project-feature__art { aspect-ratio: auto; min-height: 180px; } .mobile-project-feature__art img { position: absolute; inset: 0; } }
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
