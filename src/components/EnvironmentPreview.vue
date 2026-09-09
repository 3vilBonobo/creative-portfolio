<script setup lang="ts">
import { computed, ref } from "vue";
import { useEnvironment } from "../composables/useEnvironment";
import { MOON_PHASES, getPreviewMoonAppearance } from "../services/moonMath";
const { timePhases, weatherConditions, heroLayerIds, previewTimePhase, previewWeather, previewMoonPhase, previewMoonProgress, hiddenHeroLayers, showExteriorMask, showInteriorMask, tintHeroLayers, freezeParallax, resetPreview } = useEnvironment();
const isOpen = ref(false);
const previewMoon = computed(() => previewMoonPhase.value === null ? null : getPreviewMoonAppearance(previewMoonPhase.value, previewMoonProgress.value));
const customMoonPhase = computed(() => previewMoonPhase.value !== null && !MOON_PHASES.some(phase => phase.value === previewMoonPhase.value));
function selectMoonPhase() {
  if (previewMoonPhase.value !== null) previewTimePhase.value = "night";
}
</script>

<template>
  <button class="environment-preview-toggle" type="button" :aria-expanded="isOpen" aria-controls="environment-preview-panel" @click="isOpen = !isOpen">
    <span aria-hidden="true">{{ isOpen ? '×' : '◐' }}</span>{{ isOpen ? 'Hide scene preview' : 'Scene preview' }}
  </button>
  <aside v-show="isOpen" id="environment-preview-panel" class="environment-preview" aria-label="Environment preview controls">
    <p>Scene preview</p>
    <label>Time
      <select v-model="previewTimePhase">
        <option :value="null">Live Athens time</option>
        <option v-for="phase in timePhases" :key="phase" :value="phase">{{ phase }}</option>
      </select>
    </label>
    <label>Weather
      <select v-model="previewWeather">
        <option :value="null">Live weather</option>
        <option v-for="weather in weatherConditions" :key="weather" :value="weather">{{ weather }}</option>
      </select>
    </label>
    <label>Moon phase
      <select v-model="previewMoonPhase" @change="selectMoonPhase">
        <option :value="null">Live moon</option>
        <option v-if="customMoonPhase" :value="previewMoonPhase">Custom · {{ previewMoon?.label }}</option>
        <option v-for="phase in MOON_PHASES" :key="phase.value" :value="phase.value">{{ phase.label }}</option>
      </select>
    </label>
    <div v-if="previewMoon" class="environment-preview__moon">
      <label>Lunar cycle · {{ ((previewMoonPhase ?? 0) * 100).toFixed(1) }}% · {{ previewMoon.label }}
        <input v-model.number="previewMoonPhase" type="range" min="0" max="1" step="0.001" aria-label="Lunar cycle from new moon through full moon to new moon">
      </label>
      <label>Moon position · {{ Math.round(previewMoonProgress * 100) }}% · {{ previewMoonProgress === 0 ? 'Moonrise' : previewMoonProgress === 1 ? 'Moonset' : 'Across sky' }}
        <input v-model.number="previewMoonProgress" type="range" min="0" max="1" step="0.001" aria-label="Moon position from rise to set">
      </label>
      <span>{{ (previewMoon.illumination * 100).toFixed(1) }}% illuminated. {{ previewMoon.visible ? '0% rises on the left; 50% is highest; 100% sets behind the skyline on the right.' : 'New moon is intentionally invisible.' }}</span>
      <span>Phase selection sets night. Use Time and Weather to check dusk, daylight and clouds.</span>
    </div>
    <div class="environment-preview__checks">
      <label><input v-model="showExteriorMask" type="checkbox"> Exterior mask</label><label><input v-model="showInteriorMask" type="checkbox"> Interior mask</label><label><input v-model="tintHeroLayers" type="checkbox"> Tint layers</label><label><input v-model="freezeParallax" type="checkbox"> Freeze parallax</label>
    </div>
    <details class="environment-preview__layers"><summary>Individual layers</summary><label v-for="layer in heroLayerIds" :key="layer"><input v-model="hiddenHeroLayers" type="checkbox" :value="layer"> Hide {{ layer }}</label></details>
    <button type="button" @click="resetPreview">Reset to live</button>
  </aside>
</template>
