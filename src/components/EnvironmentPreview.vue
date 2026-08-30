<script setup lang="ts">
import { useEnvironment } from "../composables/useEnvironment";
const { timePhases, weatherConditions, heroLayerIds, previewTimePhase, previewWeather, previewIntensity, heroCompositeMode, hiddenHeroLayers, showExteriorMask, showInteriorMask, tintHeroLayers, freezeParallax, resetPreview } = useEnvironment();
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
    <label>Effects
      <select v-model="previewIntensity">
        <option value="auto">Live intensity</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
      </select>
    </label>
    <label>Weather
      <select v-model="previewWeather">
        <option :value="null">Live weather</option>
        <option v-for="weather in weatherConditions" :key="weather" :value="weather">{{ weather }}</option>
      </select>
    </label>
    <label>Composite
      <select v-model="heroCompositeMode"><option value="layers">Layered composite</option><option value="reference">Original reference</option></select>
    </label>
    <div class="environment-preview__checks">
      <label><input v-model="showExteriorMask" type="checkbox"> Exterior mask</label><label><input v-model="showInteriorMask" type="checkbox"> Interior mask</label><label><input v-model="tintHeroLayers" type="checkbox"> Tint layers</label><label><input v-model="freezeParallax" type="checkbox"> Freeze parallax</label>
    </div>
    <details class="environment-preview__layers"><summary>Individual layers</summary><label v-for="layer in heroLayerIds" :key="layer"><input v-model="hiddenHeroLayers" type="checkbox" :value="layer"> Hide {{ layer }}</label></details>
    <button type="button" @click="resetPreview">Reset to live time</button>
  </aside>
</template>
