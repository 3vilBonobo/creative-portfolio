<script setup lang="ts">
import type { ExperienceEntry } from "../types/content";

defineProps<{ entries: ExperienceEntry[]; activeIndex: number }>();
const emit = defineEmits<{ select: [index: number]; preview: [index: number] }>();
</script>

<template>
  <ol class="experience-timeline" :style="{ '--active-index': activeIndex }" aria-label="Professional experience, newest to oldest">
    <li
      v-for="(entry, index) in entries"
      :id="`experience-entry-${entry.id}`"
      :key="entry.id"
      class="experience-entry"
      :class="{ 'is-active': index === activeIndex, 'is-past': index < activeIndex }"
      :style="{ '--entry-index': index }"
      :aria-current="index === activeIndex ? 'step' : undefined"
      @mouseenter="emit('preview', index)"
      @focusin="emit('preview', index)"
      @click="emit('select', index)"
    >
      <button
        class="experience-entry__select"
        type="button"
        :aria-label="`Show ${entry.role} at ${entry.company}, ${entry.dateLabel}`"
        :aria-pressed="index === activeIndex"
        @click.stop="emit('select', index)"
        @keydown.enter.stop.prevent="emit('select', index)"
        @keydown.space.stop.prevent="emit('select', index)"
      ><span class="experience-entry__node" aria-hidden="true"></span></button>
      <span class="experience-entry__connector" aria-hidden="true"></span>
      <div class="experience-entry__copy">
        <p class="experience-entry__date">{{ entry.dateLabel }}</p>
        <h3>{{ entry.role }}</h3>
        <p class="experience-entry__company">{{ entry.company }}</p>
        <span v-if="entry.temporary" class="experience-entry__temporary">Profile-informed mockup</span>
        <div class="experience-entry__full">
          <p>{{ entry.summary }}</p>
          <ul v-if="entry.highlights.length"><li v-for="highlight in entry.highlights" :key="highlight">{{ highlight }}</li></ul>
          <ul v-if="entry.technologies.length" class="experience-entry__tech" aria-label="Technologies"><li v-for="technology in entry.technologies" :key="technology">{{ technology }}</li></ul>
        </div>
      </div>
    </li>
  </ol>
</template>
