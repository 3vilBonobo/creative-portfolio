<script setup lang="ts">
import { computed } from "vue";
import { provideEnvironment } from "../../composables/useEnvironment";
import EnvironmentPreview from "../dev/EnvironmentPreview.vue";
import RadioPlayer from "../radio/RadioPlayer.vue";
import { provideRadio } from "../../composables/useRadio";

const { state } = provideEnvironment();
const timePhase = computed(() => state.value.timePhase);
const weather = computed(() => state.value.weatherCondition);
const isDevelopment = import.meta.env.DEV;
provideRadio();
</script>

<template>
  <div class="app-shell" :data-time-phase="timePhase" :data-weather="weather">
    <slot />
    <RadioPlayer />
    <EnvironmentPreview v-if="isDevelopment" />
  </div>
</template>
