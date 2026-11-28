<script setup lang="ts">
import { computed } from "vue";
import { useEnvironment } from "../../composables/useEnvironment";
const { state } = useEnvironment();
const expanded = defineModel<boolean>("expanded", { default: false });
const variant = computed(() => ["night", "dusk"].includes(state.value.timePhase) ? "night" : "day");
const base = "/hero/loft-mobile-v1/";
</script>

<template>
  <figure class="mobile-studio-plate" :class="{ 'mobile-studio-plate--full': expanded }">
    <img :src="`${base}${variant}-941.webp`"
      :srcset="`${base}${variant}-720.webp 720w, ${base}${variant}-941.webp 941w`"
      sizes="100vw" width="941" height="1672" fetchpriority="high"
      alt="An Athens studio overlooking the Acropolis, with a developer at the workstation, a telescope and a cat on the sofa." />
    <button type="button" :aria-expanded="expanded" @click.stop="expanded = !expanded">
      {{ expanded ? 'Frame the studio' : 'View full artwork' }} <span aria-hidden="true">{{ expanded ? '−' : '+' }}</span>
    </button>
  </figure>
</template>

<style scoped>
.mobile-studio-plate { position: relative; margin: 0; width: 100%; height: min(38svh, 18rem); min-height: 12rem; }
.mobile-studio-plate img { display: block; width: 100%; height: 100%; aspect-ratio: 941 / 1672; object-fit: cover; object-position: center 44%; }
.mobile-studio-plate--full { height: auto; }
.mobile-studio-plate--full img { height: auto; }
.mobile-studio-plate button { position: absolute; right: max(1rem, env(safe-area-inset-right)); bottom: .6rem; min-height: 44px; padding: .5rem .75rem; border: 1px solid #e8dfcf55; background: #0d1112e8; color: #f3eee4; font: 500 .7rem "IBM Plex Mono", monospace; }
.mobile-studio-plate button span { margin-left: .75rem; color: var(--cyan); }
</style>
