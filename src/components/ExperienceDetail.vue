<script setup lang="ts">
import type { ExperienceEntry } from "../types/content";
defineProps<{ entry: ExperienceEntry; compact?: boolean }>();
</script>

<template>
  <div class="experience__details-body">
    <div class="experience__details-meta">
      <p class="experience__details-label">{{ entry.current ? 'Current role' : 'Selected experience' }}</p>
      <p class="experience__details-date">{{ entry.dateLabel }}</p>
    </div>
    <h3 v-if="!compact" id="experience-detail-title">{{ entry.role }}</h3>
    <p class="experience__details-company">{{ entry.company }}</p>
    <p class="experience__summary">{{ compact ? entry.mobileSummary || entry.summary : entry.summary }}</p>
    <ul v-if="entry.technologies.length" class="experience__technologies" aria-label="Technologies">
      <li v-for="technology in (compact ? entry.technologies.slice(0, entry.current ? 3 : 4) : entry.technologies)" :key="technology">{{ technology }}</li>
    </ul>
    <details v-if="compact && entry.highlights.length" class="experience__focus">
      <summary>Selected contributions <span aria-hidden="true">⌄</span></summary>
      <ul class="experience__highlights"><li v-for="highlight in entry.highlights" :key="highlight"><p>{{ highlight }}</p></li></ul>
    </details>
    <section v-else-if="entry.highlights.length" class="experience__focus" aria-label="Selected contributions">
      <h4>Selected contributions</h4>
      <ul class="experience__highlights"><li v-for="highlight in entry.highlights" :key="highlight"><p>{{ highlight }}</p></li></ul>
    </section>
  </div>
</template>
