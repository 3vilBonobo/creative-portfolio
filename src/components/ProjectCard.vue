<script setup lang="ts">
import type { Project } from "../types/content";
defineProps<{ project: Project; index: number; active: boolean }>();
defineEmits<{ details: [project: Project, trigger: HTMLElement] }>();
</script>

<template>
  <article class="project-card" :class="[`project-card--${project.preview.kind}`, { 'project-card--featured': project.featured, 'is-active': active }]">
    <div class="project-card__mount" aria-hidden="true"><i></i><i></i></div>
    <div class="project-card__frame"><div class="project-card__screen">
      <div class="project-card__browserbar" aria-hidden="true"><i></i><i></i><i></i><span>{{ project.title }}</span></div>
      <img v-if="project.preview.src" :src="project.preview.src" :width="project.preview.width" :height="project.preview.height" :alt="project.preview.alt" :loading="index === 0 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : 'auto'" />
      <div v-else class="source-preview" role="img" :aria-label="project.preview.alt"><span>Source project</span><strong>MEME<br />GENERATOR</strong><pre aria-hidden="true"><code>const [meme, setMeme] = useState()
fetch("imgflip.com/api/get_memes")
  .then(response =&gt; response.json())</code></pre></div>
      <span class="project-card__number">{{ String(index + 1).padStart(2, "0") }}</span>
    </div></div>
    <div class="project-card__body">
      <p class="project-card__kicker">{{ project.featured ? "Featured project" : project.title }}</p><h3>{{ project.displayTitle }}</h3>
      <p class="project-card__summary">{{ project.shortDescription }}</p>
      <ul class="project-card__tags" aria-label="Core technologies"><li v-for="technology in project.technologies.slice(0, 5)" :key="technology">{{ technology }}</li></ul>
      <div class="project-card__actions" :aria-label="`${project.title} actions`">
        <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noreferrer">View demo <span aria-hidden="true">↗</span></a>
        <a :href="project.repositoryUrl" target="_blank" rel="noreferrer">Source code <span aria-hidden="true">↗</span></a>
        <button type="button" @click="$emit('details', project, $event.currentTarget as HTMLElement)">Details <span aria-hidden="true">→</span></button>
      </div>
    </div>
  </article>
</template>
