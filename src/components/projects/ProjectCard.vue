<script setup lang="ts">
import { computed } from "vue";
import type { Project } from "../../types/content";
import { projectBorderColor } from "../../data/projectBorders";
const props = withDefaults(defineProps<{ project: Project; featured?: boolean }>(), { featured: false });
const emit = defineEmits<{ details: [project: Project, trigger: HTMLElement] }>();
const image = computed(() => props.project.cover ?? props.project.preview);
const liveActionLabel = computed(() => props.project.liveLabel?.toLowerCase().includes("website") ? "Visit Website" : "Live Demo");
function openDetails(event: MouseEvent) {
  if ((event.target as HTMLElement).closest("a")) return;
  const trigger = event.currentTarget;
  if (trigger instanceof HTMLElement) emit("details", props.project, trigger);
}
</script>

<template>
  <article class="work-panel" :style="{ '--project-border': projectBorderColor(project.id) }" :data-project-id="project.id" :class="[{ 'work-panel--featured': featured, 'work-panel--professional': project.category === 'professional', 'work-panel--cover': project.cover }, `work-panel--${project.id}`]" :aria-labelledby="`work-title-${project.id}`" :aria-describedby="`work-actions-${project.id}`" tabindex="0" @click="openDetails" @keydown.enter.self.prevent="$emit('details', project, $event.currentTarget as HTMLElement)">
    <div class="work-panel__media">
      <img v-if="image.src" :src="image.src" :width="image.width" :height="image.height" :alt="image.alt" :srcset="image.srcSet"
        :sizes="featured ? '(min-width: 1400px) 45vw, (min-width: 981px) 50vw, 100vw' : '(min-width: 1400px) 25vw, (min-width: 981px) 30vw, (min-width: 621px) 45vw, 100vw'"
        :style="{ objectPosition: project.cover?.objectPosition }" :loading="featured ? 'eager' : 'lazy'" :fetchpriority="featured ? 'high' : 'auto'" />
      <div v-else class="work-panel__source" role="img" :aria-label="project.preview.alt"><span>Project preview</span><strong>{{ project.title }}</strong><span>{{ project.preview.source }}</span></div>
      <p v-if="project.status" class="work-panel__development-status">{{ project.status }}</p>
      <span v-if="featured" class="work-panel__badge"><span aria-hidden="true">★</span> Featured</span>
      <span class="work-panel__media-label">{{ project.cover?.label ?? (project.preview.kind === 'mockup' ? 'Illustrative interface concept' : project.cover ? 'Project cover' : project.preview.src ? 'Application preview' : 'Source project') }}</span>
    </div>
    <div class="work-panel__content">
      <p v-if="featured" class="work-panel__eyebrow">{{ project.categoryLabel ?? project.displayTitle }}</p>
      <h3 :id="`work-title-${project.id}`">{{ project.title }}</h3>
      <p class="work-panel__description">{{ project.cardDescription ?? project.shortDescription }}</p>
      <p v-if="featured && project.credit" class="work-panel__credit">{{ project.credit }}</p>
      <p v-if="!featured && project.caseStudy" class="work-panel__credit">Confidential work · See details</p>
      <ul v-if="featured && project.technologies.length" class="work-panel__tags" aria-label="Technologies"><li v-for="technology in project.technologies" :key="technology">{{ technology }}</li></ul>
      <div :id="`work-actions-${project.id}`" class="work-panel__actions" :aria-label="`${project.title} links. Click this card, or focus it and press Enter, for project details.`">
        <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noreferrer">{{ liveActionLabel }} <span aria-hidden="true">↗</span></a>
        <a v-if="project.repositoryUrl" :href="project.repositoryUrl" target="_blank" rel="noreferrer">View code <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.work-panel { --work-accent: var(--projects-amber, #dea044); position: relative; min-width: 0; overflow: hidden; border: 1px solid var(--project-border); border-radius: 14px 4px 14px 4px; background: var(--projects-card-surface, rgb(8 15 17 / .72)); box-shadow: inset 0 1px 0 #ffffff16, 0 10px 25px #0005; color: #f7eee2; cursor: pointer; transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease; }
.work-panel::after { content: ''; position: absolute; inset: auto 0 0; height: 2px; background: linear-gradient(90deg, var(--project-border), transparent 70%); pointer-events: none; }
.work-panel__development-status { position: absolute; z-index: 1; top: .8rem; right: .8rem; background: #101619eb; margin: 0; padding: .25rem .5rem; border: 1px solid #bbb18b66; border-radius: 3px; color: #d1c79f; font: .7rem/1.5 "IBM Plex Mono", monospace; }
.work-panel--nerve-ending { --work-accent: #bdc88d; }
.work-panel--magic-herbs { --work-accent: #a7e68a; }
.work-panel--fashion-show { --work-accent: #e991c2; }
.work-panel--tip-calculator { --work-accent: #55d7c5; }
.work-panel--meme-generator { --work-accent: #b9abf4; }
.work-panel--enterprise-traceability { --work-accent: #53d9e4; }
.work-panel--orthobyron { --work-accent: #8fceef; }
.work-panel { border-radius: 2px; clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px); }
.work-panel::before { content: ''; position: absolute; z-index: 2; inset: 0; background: linear-gradient(135deg, transparent 7px, var(--project-border) 7px 9px, transparent 9px) top left / 14px 14px no-repeat, linear-gradient(135deg, transparent 7px, var(--project-border) 7px 9px, transparent 9px) bottom right / 14px 14px no-repeat; pointer-events: none; }
.work-panel--featured { display: grid; grid-template-columns: 55fr 45fr; border-color: var(--project-border); border-width: 1px 1px 2px; box-shadow: 0 0 0 1px color-mix(in srgb, var(--project-border) 15%, transparent), 0 14px 36px #0007; }

.work-panel__media { position: relative; display: grid; place-items: center; aspect-ratio: 16 / 10; padding: .45rem; overflow: hidden; background: radial-gradient(ellipse at center, #293137, #0b1014 75%); border-bottom: 1px solid #ffffff20; }
.work-panel--featured .work-panel__media { aspect-ratio: auto; min-height: 0; border-bottom: 0; border-right: 1px solid color-mix(in srgb, var(--project-border) 35%, transparent); }

.work-panel__media img { display: block; width: 100%; height: 100%; min-height: 0; max-height: 100%; object-fit: contain; }
.work-panel--featured .work-panel__media img { position: absolute; inset: .55rem; width: calc(100% - 1.1rem); height: calc(100% - 1.1rem); }
.work-panel--cover .work-panel__media img { transition: transform .45s ease; }
.work-panel__badge { position: absolute; top: .9rem; left: .9rem; display: inline-flex; gap: .4rem; padding: .4rem .7rem; background: var(--projects-button-fill, linear-gradient(180deg, #edb555, #bd7526)); color: #17120a; font-size: .78rem; font-weight: 850; text-transform: uppercase; border-radius: 6px 2px 6px 2px; box-shadow: 0 2px 12px #0007; }
.work-panel__media-label { position: absolute; bottom: .5rem; left: .6rem; padding: .15rem .4rem; background: #080d12e8; color: #e3ddd3; font: .6rem "IBM Plex Mono", monospace; letter-spacing: .06em; text-transform: uppercase; }
.work-panel__source { display: grid; align-content: center; gap: .8rem; width: 100%; height: 100%; padding: 1.5rem; background: repeating-linear-gradient(0deg, #b9abf407 0 1px, transparent 1px 5px), linear-gradient(135deg, #201c32, #11141e); }
.work-panel__source strong { color: #cbbaf6; font-size: clamp(1.5rem, 2.5vw, 2.8rem); line-height: 1.05; letter-spacing: -.04em; }
.work-panel__source span { font: .65rem "IBM Plex Mono", monospace; color: #ccc1e1; }
.work-panel__content { display: flex; flex-direction: column; gap: .8rem; padding: clamp(1rem, 1.5vw, 1.6rem); min-width: 0; }
.work-panel--featured .work-panel__content { padding: clamp(1rem, 1.5vw, 1.4rem); gap: .65rem; }
.work-panel__eyebrow { margin: 0; font: .65rem/1.5 "IBM Plex Mono", monospace; color: var(--work-accent); letter-spacing: .08em; text-transform: uppercase; overflow-wrap: anywhere; }
.work-panel h3 { margin: 0; color: #fff5e8; font-size: clamp(1.2rem, 1.5vw, 1.75rem); line-height: 1.1; font-weight: 850; letter-spacing: -.03em; text-transform: uppercase; overflow-wrap: anywhere; }
.work-panel--featured h3 { font-size: clamp(1.8rem, 2.5vw, 3rem); }
.work-panel__description { margin: 0; color: #ded9d3; font-size: .88rem; line-height: 1.65; }
.work-panel__credit { margin: 0; color: #b6d5d2; font-size: .75rem; line-height: 1.6; }
.work-panel--featured .work-panel__description { font-size: 1rem; }
.work-panel__tags { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0 0 .4rem; padding: 0; list-style: none; }
.work-panel__tags li { min-width: 0; max-width: 100%; padding: .25rem .55rem; border: 1px solid #7e777263; border-radius: 999px; background: linear-gradient(#ffffff0b, #ffffff02); color: #eee6db; font-size: .75rem; line-height: 1.4; overflow-wrap: anywhere; }
.work-panel__actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; align-items: center; width: min(100%, 24rem); align-self: center; margin-top: auto; padding-top: .4rem; }
.work-panel__actions a { display: inline-flex; align-items: center; justify-content: center; gap: .35rem; min-width: 0; min-height: 44px; max-width: 100%; padding: .55rem .45rem; font-size: .72rem; line-height: 1.2; font-weight: 800; text-align: center; text-transform: uppercase; text-decoration: none; color: #f0e5d4; border: 1px solid #a0917c66; border-radius: 6px 2px 6px 2px; background: #ffffff05; transition: background .2s ease, color .2s ease, border-color .2s ease; }
.work-panel__actions a:first-child { background: var(--projects-button-fill, linear-gradient(180deg, #edb555, #bd7526)); border-color: var(--projects-amber-border, #a66c27); color: #17130c; box-shadow: var(--projects-button-shadow); }
.work-panel__actions a:hover { color: var(--projects-amber-hover, #efb65c); border-color: var(--projects-amber-border, #a98d64); background: #dea04410; }
.work-panel__actions a:first-child:hover { color: #17130c; background: var(--projects-button-hover, linear-gradient(180deg, #f3c06a, #cb8836)); }
.work-panel__actions :focus-visible, .work-panel:focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
.work-panel:focus-within { border-color: var(--project-border); }

/* Supporting cards size to their preview and caption; full content and links
   stay in the shared dialog rather than stretching every exhibition card. */
.work-panel:not(.work-panel--featured) .work-panel__media { aspect-ratio: 16 / 9; }
.work-panel:not(.work-panel--featured) { display: flex; flex-direction: column; width: 100%; height: 100%; }
.work-panel:not(.work-panel--featured) .work-panel__media { flex-shrink: 0; }
.work-panel:not(.work-panel--featured) .work-panel__content { flex: 1; padding: .8rem; gap: .55rem; }
.work-panel:not(.work-panel--featured) h3 { font-size: clamp(1.1rem, 1.4vw, 1.4rem); }
.work-panel:not(.work-panel--featured) .work-panel__description { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 3; color: #cdd3d1; font-size: .75rem; line-height: 1.5; }
.work-panel:not(.work-panel--featured) .work-panel__actions { margin-top: auto; padding-top: 0; }
.work-panel:not(.work-panel--featured) .work-panel__actions { width: min(100%, 24rem); }

@media (hover: hover) { .work-panel:hover { transform: translateY(-3px); border-color: var(--project-border); box-shadow: 0 12px 30px #0008, 0 0 18px #a98d640a; } .work-panel--cover:hover .work-panel__media img { transform: scale(1.025); } }
@media (max-width: 980px) { .work-panel--featured { grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); } }
@media (max-width: 900px) { .work-panel--featured { grid-template-columns: minmax(0, 1fr); } .work-panel--featured .work-panel__media { aspect-ratio: 21 / 9; border-right: 0; border-bottom: 1px solid color-mix(in srgb, var(--project-border) 35%, transparent); } }
@media (max-width: 620px) { .work-panel__content, .work-panel--featured .work-panel__content { padding: 1.1rem; } .work-panel__description { font-size: .95rem; } }
@media (prefers-reduced-motion: reduce) { .work-panel, .work-panel__media img, .work-panel__actions a { transition: none; } .work-panel:hover, .work-panel--cover:hover .work-panel__media img { transform: none; } }
</style>
