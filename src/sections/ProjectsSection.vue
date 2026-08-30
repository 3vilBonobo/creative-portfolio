<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import ProjectCard from "../components/ProjectCard.vue";
import { projects } from "../data/projects";
import type { Project } from "../types/content";

const detailDialog = ref<HTMLDialogElement | null>(null);
const selectedProject = ref<Project | null>(null), triggerElement = ref<HTMLElement | null>(null);
const visibleCount = ref(6);
const visibleProjects = computed(() => projects.slice(0, visibleCount.value));
const hasMoreProjects = computed(() => visibleCount.value < projects.length);
function showMoreProjects() { visibleCount.value = Math.min(visibleCount.value + 3, projects.length); }
async function openDetails(project: Project, trigger: HTMLElement) { selectedProject.value = project; triggerElement.value = trigger; await nextTick(); detailDialog.value?.showModal(); }
function closeDetails() { detailDialog.value?.close(); }
function onDialogClose() { selectedProject.value = null; triggerElement.value?.focus(); }
function onBackdropClick(event: MouseEvent) { if (event.target === detailDialog.value) closeDetails(); }

</script>

<template>
  <section id="projects" class="floor-section projects" aria-labelledby="projects-title">
    <div class="projects__header">
      <div class="projects__level" aria-label="Level 03"><small>Level</small><strong>03</strong><span><i></i><i></i><i></i></span></div>
      <div class="projects__title"><p class="eyebrow">Curated work / {{ projects.length }} projects</p><h2 id="projects-title">Selected<br />Projects</h2></div>
    </div>
    <ol class="projects-gallery" aria-label="Selected projects">
      <li v-for="(project, index) in visibleProjects" :key="project.id" class="projects-gallery__item"><ProjectCard :project="project" :index="index" :active="false" @details="openDetails" /></li>
    </ol>
    <div v-if="hasMoreProjects" class="projects__more">
      <button type="button" @click="showMoreProjects">Show more projects <span aria-hidden="true">↓</span></button>
      <p>{{ projects.length - visibleCount }} more available</p>
    </div>
    <dialog ref="detailDialog" class="project-dialog" aria-labelledby="project-dialog-title" @close="onDialogClose" @click="onBackdropClick" @keydown.esc.prevent="closeDetails">
      <article v-if="selectedProject" class="project-dialog__panel"><button class="project-dialog__close" type="button" aria-label="Close project details" @click="closeDetails">×</button><div class="project-dialog__preview"><img v-if="selectedProject.preview.src" :src="selectedProject.preview.src" :width="selectedProject.preview.width" :height="selectedProject.preview.height" :alt="selectedProject.preview.alt" /><div v-else class="source-preview" role="img" :aria-label="selectedProject.preview.alt"><span>Source project</span><strong>MEME<br />GENERATOR</strong><pre aria-hidden="true"><code>React + ImgFlip API</code></pre></div></div><div class="project-dialog__content"><p class="eyebrow">{{ selectedProject.title }}</p><h3 id="project-dialog-title">{{ selectedProject.displayTitle }}</h3><p>{{ selectedProject.shortDescription }}</p><dl><div><dt>Role</dt><dd>{{ selectedProject.role }}</dd></div><div><dt>Technologies</dt><dd>{{ selectedProject.technologies.join(" · ") }}</dd></div><div v-if="selectedProject.attribution"><dt>Attribution</dt><dd>{{ selectedProject.attribution }}</dd></div><div><dt>Preview source</dt><dd>{{ selectedProject.preview.source }}</dd></div></dl><div class="project-dialog__links"><a v-if="selectedProject.liveUrl" :href="selectedProject.liveUrl" target="_blank" rel="noreferrer">View demo ↗</a><a :href="selectedProject.repositoryUrl" target="_blank" rel="noreferrer">Source code ↗</a></div></div></article>
    </dialog>
  </section>
</template>
