<script setup lang="ts">
import { computed } from "vue";
import type { Project } from "../types/content";
const props = withDefaults(defineProps<{ project: Project; featured?: boolean }>(), { featured: false });
defineEmits<{ details: [project: Project, trigger: HTMLElement] }>();
const image = computed(() => props.project.cover ?? props.project.preview);
</script>

<template>
  <article class="work-panel" :class="[{ 'work-panel--featured': featured, 'work-panel--professional': project.category === 'professional', 'work-panel--cover': project.cover }, `work-panel--${project.id}`]" :aria-labelledby="`work-title-${project.id}`">
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
      <p class="work-panel__eyebrow">{{ project.categoryLabel ?? project.displayTitle }}</p>
      <h3 :id="`work-title-${project.id}`">{{ project.title }}</h3>
      <p class="work-panel__description">{{ project.cardDescription ?? project.shortDescription }}</p>
      <p v-if="project.credit" class="work-panel__credit">{{ project.credit }}</p>
      <ul v-if="project.technologies.length" class="work-panel__tags" aria-label="Technologies"><li v-for="technology in (featured ? project.technologies : project.technologies.slice(0, 3))" :key="technology">{{ technology }}</li><li v-if="!featured && project.technologies.length > 3" :aria-label="`${project.technologies.length - 3} additional technologies in Project Details`">+{{ project.technologies.length - 3 }} more</li></ul>
      <div class="work-panel__actions" :aria-label="`${project.title} actions`">
        <button type="button" @click="$emit('details', project, $event.currentTarget as HTMLElement)">Project Details <span aria-hidden="true">↗</span></button>
        <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noreferrer">{{ project.liveLabel ?? "Live Demo" }} <span aria-hidden="true">↗</span></a>
        <a v-if="project.repositoryUrl" :href="project.repositoryUrl" target="_blank" rel="noreferrer">Source Code <span aria-hidden="true">↗</span></a>
        <a v-if="project.caseStudy" :href="project.caseStudy.experienceUrl" target="_blank" rel="noopener noreferrer" aria-label="View my professional experience on LinkedIn (opens in a new tab)">View my professional experience on LinkedIn <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.work-panel { --work-accent: #ffa929; position: relative; min-width: 0; overflow: hidden; border: 1px solid #827668; border-radius: 14px 4px 14px 4px; background: #000; box-shadow: inset 0 1px 0 #ffffff16, 0 10px 25px #0005; color: #f7eee2; transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease; }
.work-panel::after { content: ''; position: absolute; inset: auto 0 0; height: 2px; background: linear-gradient(90deg, var(--work-accent), transparent 70%); pointer-events: none; }
.work-panel__development-status { position: absolute; z-index: 1; top: .8rem; right: .8rem; background: #101619eb; margin: 0; padding: .25rem .5rem; border: 1px solid #bbb18b66; border-radius: 3px; color: #d1c79f; font: .7rem/1.5 "IBM Plex Mono", monospace; }
.work-panel--nerve-ending { --work-accent: #bdc88d; }
.work-panel--magic-herbs { --work-accent: #a7e68a; }
.work-panel--fashion-show { --work-accent: #e991c2; }
.work-panel--tip-calculator { --work-accent: #55d7c5; }
.work-panel--meme-generator { --work-accent: #b9abf4; }
.work-panel--enterprise-traceability { --work-accent: #53d9e4; }
.work-panel--orthobyron { --work-accent: #8fceef; }
.work-panel { border-radius: 2px; clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px); }
.work-panel::before { content: ''; position: absolute; z-index: 2; inset: 0; background: linear-gradient(135deg, transparent 7px, var(--work-accent) 7px 9px, transparent 9px) top left / 14px 14px no-repeat, linear-gradient(135deg, transparent 7px, var(--work-accent) 7px 9px, transparent 9px) bottom right / 14px 14px no-repeat; pointer-events: none; }
.work-panel--featured { display: grid; grid-template-columns: 55fr 45fr; border-color: #f6ab45; border-width: 1px 1px 2px; box-shadow: 0 0 0 1px #ffb43825, 0 14px 36px #0007; }

.work-panel__media { position: relative; display: grid; place-items: center; aspect-ratio: 16 / 10; overflow: hidden; background: radial-gradient(ellipse at center, #293137, #0b1014 75%); border-bottom: 1px solid #ffffff20; }
.work-panel--featured .work-panel__media { aspect-ratio: auto; min-height: 22rem; border-bottom: 0; border-right: 1px solid #ffb43855; }

.work-panel__media img { display: block; width: 100%; height: 100%; min-height: 0; max-height: 100%; object-fit: contain; }
.work-panel--featured .work-panel__media img { position: absolute; inset: 0; }
.work-panel--cover .work-panel__media img { object-fit: cover; transition: transform .45s ease; }
.work-panel__badge { position: absolute; top: .9rem; left: .9rem; display: inline-flex; gap: .4rem; padding: .4rem .7rem; background: #ffb02e; color: #17120a; font-size: .78rem; font-weight: 850; text-transform: uppercase; border-radius: 6px 2px 6px 2px; box-shadow: 0 2px 12px #0007; }
.work-panel__media-label { position: absolute; bottom: .5rem; left: .6rem; padding: .15rem .4rem; background: #080d12e8; color: #e3ddd3; font: .6rem "IBM Plex Mono", monospace; letter-spacing: .06em; text-transform: uppercase; }
.work-panel__source { display: grid; align-content: center; gap: .8rem; width: 100%; height: 100%; padding: 1.5rem; background: repeating-linear-gradient(0deg, #b9abf407 0 1px, transparent 1px 5px), linear-gradient(135deg, #201c32, #11141e); }
.work-panel__source strong { color: #cbbaf6; font-size: clamp(1.5rem, 2.5vw, 2.8rem); line-height: 1.05; letter-spacing: -.04em; }
.work-panel__source span { font: .65rem "IBM Plex Mono", monospace; color: #ccc1e1; }
.work-panel__content { display: flex; flex-direction: column; gap: .8rem; padding: clamp(1rem, 1.5vw, 1.6rem); min-width: 0; }
.work-panel--featured .work-panel__content { padding: clamp(1.3rem, 2vw, 2.2rem); gap: 1rem; }
.work-panel__eyebrow { margin: 0; font: .65rem/1.5 "IBM Plex Mono", monospace; color: var(--work-accent); letter-spacing: .08em; text-transform: uppercase; overflow-wrap: anywhere; }
.work-panel h3 { margin: 0; color: #fff5e8; font-size: clamp(1.2rem, 1.5vw, 1.75rem); line-height: 1.1; font-weight: 850; letter-spacing: -.03em; text-transform: uppercase; overflow-wrap: anywhere; }
.work-panel--featured h3 { font-size: clamp(1.8rem, 2.5vw, 3rem); }
.work-panel__description { margin: 0; color: #ded9d3; font-size: .88rem; line-height: 1.65; }
.work-panel__credit { margin: 0; color: #b6d5d2; font-size: .75rem; line-height: 1.6; }
.work-panel--featured .work-panel__description { font-size: 1rem; }
.work-panel__tags { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0 0 .4rem; padding: 0; list-style: none; }
.work-panel__tags li { min-width: 0; max-width: 100%; padding: .25rem .55rem; border: 1px solid #7e777263; border-radius: 999px; background: linear-gradient(#ffffff0b, #ffffff02); color: #eee6db; font-size: .75rem; line-height: 1.4; overflow-wrap: anywhere; }
.work-panel__actions { display: flex; flex-wrap: wrap; gap: .6rem .8rem; align-items: center; margin-top: auto; padding-top: .4rem; }
.work-panel__actions button, .work-panel__actions a { display: inline-flex; align-items: center; justify-content: space-between; gap: .45rem; min-height: 44px; max-width: 100%; font-size: .75rem; font-weight: 800; text-transform: uppercase; text-decoration: none; color: #f0e5d4; border: 1px solid #a0917c66; border-radius: 6px 2px 6px 2px; padding: .6rem .7rem; background: #ffffff05; transition: background .2s ease, color .2s ease, border-color .2s ease; }
.work-panel__actions button { background: linear-gradient(120deg, #ffbc45, #f99b20); border-color: #ffba48; color: #17130c; box-shadow: 0 3px 14px #ff9f171c; }
.work-panel__actions a:hover { color: #ffbc45; border-color: #ffbc45; background: #ffbc4510; }
.work-panel__actions button:hover { background: #ffcf72; }
.work-panel__actions :focus-visible { outline: 3px solid #8fe5e6; outline-offset: 3px; }
.work-panel:focus-within { border-color: var(--work-accent); }

/* A consistent supporting-card rhythm; full project copy remains in Details. */
.work-panel:not(.work-panel--featured) { display: flex; flex-direction: column; height: 100%; }
.work-panel:not(.work-panel--featured) .work-panel__content { flex: 1; min-height: 31rem; padding: 1rem 1rem 1.5rem; gap: .65rem; }
.work-panel:not(.work-panel--featured) .work-panel__eyebrow { min-height: 3em; }
.work-panel:not(.work-panel--featured) h3 { min-height: 2.2em; }
.work-panel:not(.work-panel--featured) .work-panel__description { height: 4.95em; flex-shrink: 0; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
.work-panel:not(.work-panel--featured) .work-panel__actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; min-height: 6rem; align-content: start; }
.work-panel:not(.work-panel--featured) .work-panel__actions button { grid-column: 1 / -1; }
.work-panel:not(.work-panel--featured) .work-panel__actions a:only-of-type { grid-column: 1 / -1; }
.work-panel:not(.work-panel--featured) .work-panel__actions a, .work-panel:not(.work-panel--featured) .work-panel__actions button { min-width: 0; overflow-wrap: anywhere; }

@media (hover: hover) { .work-panel:hover { transform: translateY(-3px); border-color: var(--work-accent); box-shadow: 0 12px 30px #0008, 0 0 18px #ffb4380e; } .work-panel--cover:hover .work-panel__media img { transform: scale(1.025); } }
@media (max-width: 980px) { .work-panel--featured { grid-template-columns: minmax(0, 1fr); } .work-panel--featured .work-panel__media { aspect-ratio: 16 / 10; min-height: 0; border-right: 0; border-bottom: 1px solid #ffb43855; } }
@media (max-width: 620px) { .work-panel__content, .work-panel--featured .work-panel__content { padding: 1.1rem; } .work-panel__actions { display: grid; grid-template-columns: minmax(0, 1fr); } .work-panel__actions a, .work-panel__actions button { width: 100%; } .work-panel__description { font-size: .95rem; } }
@media (prefers-reduced-motion: reduce) { .work-panel, .work-panel__media img, .work-panel__actions a, .work-panel__actions button { transition: none; } .work-panel:hover, .work-panel--cover:hover .work-panel__media img { transform: none; } }
</style>
