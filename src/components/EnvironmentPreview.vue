<script setup lang="ts">
import { useEnvironment } from "../composables/useEnvironment";
const { timePhases, weatherConditions, previewTimePhase, previewWeather, resetPreview } = useEnvironment();
</script>

<template>
  <aside class="environment-preview" aria-label="Environment preview controls">
    <p>Scene preview</p>
    <label>Time
      <select v-model="previewTimePhase">
        <option :value="null">Live Athens time</option>
        <option v-for="phase in timePhases" :key="phase" :value="phase">{{ phase }}</option>
      </select>
    </label>
    <label>Weather
      <select v-model="previewWeather">
        <option :value="null">Mock default</option>
        <option v-for="weather in weatherConditions" :key="weather" :value="weather">{{ weather }}</option>
      </select>
    </label>
    <button type="button" @click="resetPreview">Reset to live time</button>
  </aside>
</template>
