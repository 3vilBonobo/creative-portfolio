<script setup lang="ts">
import type { ExperienceEntry } from "../../types/content";
defineProps<{ entries: ExperienceEntry[]; activeIndex: number; accordion?: boolean; expanded?: boolean }>();
const emit = defineEmits<{ select: [index: number] }>();
</script>

<template>
  <ol class="experience-timeline" :class="{ 'experience-timeline--accordion': accordion }" aria-label="Professional experience">
    <li v-for="(entry, index) in entries" :id="`experience-entry-${entry.id}`" :key="entry.id" class="experience-entry" :class="{ 'is-active': index === activeIndex, 'is-current': entry.current }" :style="{ '--chapter-row': index + 1 }">
      <button
        :id="`experience-select-${entry.id}`"
        class="experience-entry__select"
        type="button"
        :aria-label="`Show ${entry.role} at ${entry.company}, ${entry.dateLabel}`"
        :aria-pressed="!accordion ? index === activeIndex : undefined"
        :aria-expanded="accordion ? index === activeIndex && expanded !== false : undefined"
        :aria-controls="accordion ? `experience-panel-${entry.id}` : 'experience-detail'"
        @click="emit('select', index)"
      >
        <span class="experience-entry__node" aria-hidden="true"></span>
        <span class="experience-entry__copy"><span class="experience-entry__date">{{ entry.dateLabel }}</span><span class="experience-entry__role">{{ entry.role }}</span><span class="experience-entry__company">{{ entry.company }}</span></span>
        <span class="experience-entry__arrow" aria-hidden="true">{{ accordion && index === activeIndex && expanded !== false ? '⌄' : '›' }}</span>
      </button>
      <div v-if="accordion" v-show="index === activeIndex && expanded !== false" :id="`experience-panel-${entry.id}`" class="experience__details experience__accordion-panel" role="region" :aria-labelledby="`experience-select-${entry.id}`"><slot name="detail" :entry="entry"></slot></div>
    </li>
  </ol>
</template>
