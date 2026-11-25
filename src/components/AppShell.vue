<script setup lang="ts">
import { computed } from "vue";
import { provideEnvironment } from "../composables/useEnvironment";
import EnvironmentPreview from "./EnvironmentPreview.vue";

const { state } = provideEnvironment();
const timePhase = computed(() => state.value.timePhase);
const weather = computed(() => state.value.weatherCondition);
const isDevelopment = import.meta.env.DEV;
</script>

<template>
  <div class="app-shell" :data-time-phase="timePhase" :data-weather="weather">
    <slot />
    <EnvironmentPreview v-if="isDevelopment" />
  </div>
</template>
