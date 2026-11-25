<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import type { ExperienceEntry } from "../types/content";

const props = defineProps<{ entries: ExperienceEntry[]; activeIndex: number }>();
const emit = defineEmits<{ select: [index: number]; preview: [index: number] }>();
const list = ref<HTMLOListElement>();
watch(() => props.activeIndex, async () => {
  await nextTick();
  const element = list.value;
  if (!element || element.scrollHeight <= element.clientHeight) return;
  const selected = element.children[props.activeIndex];
  if (!selected) return;
  const item = selected.getBoundingClientRect();
  const box = element.getBoundingClientRect();
  // Reveal within this list only; never scroll the document on record changes.
  if (item.top < box.top) element.scrollTop += item.top - box.top - 8;
  else if (item.bottom > box.bottom) element.scrollTop += item.bottom - box.bottom + 8;
});
</script>

<template>
  <ol ref="list" class="experience-timeline" aria-label="Professional experience, newest to oldest">
    <li
      v-for="(entry, index) in entries"
      :id="`experience-entry-${entry.id}`"
      :key="entry.id"
      class="experience-entry"
      :class="{ 'is-active': index === activeIndex, 'is-past': index < activeIndex }"
      :style="{ '--entry-index': index }"
      :aria-current="index === activeIndex ? 'step' : undefined"
    >
      <button
        class="experience-entry__select"
        type="button"
        :aria-label="`Show ${entry.role} at ${entry.company}, ${entry.dateLabel}`"
        :aria-pressed="index === activeIndex"
        aria-controls="experience-detail"
        @mouseenter="emit('preview', index)"
        @focus="emit('preview', index)"
        @click="emit('select', index)"
      ><span class="experience-entry__node" aria-hidden="true"></span>
      <span class="experience-entry__copy">
        <span class="experience-entry__date">{{ entry.dateLabel }}</span>
        <span class="experience-entry__role">{{ entry.role }}</span>
        <span class="experience-entry__company">{{ entry.company }}</span>
        <span v-if="entry.temporary" class="experience-entry__temporary">Profile-informed mockup</span>
      </span>
      <span class="experience-entry__arrow" aria-hidden="true">›</span>
      </button>
    </li>
  </ol>
</template>
