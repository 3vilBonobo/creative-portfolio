<script setup lang="ts">
import { computed, ref } from "vue";
import { useEnvironment } from "../composables/useEnvironment";
import { MOON_PHASES, getPreviewMoonAppearance } from "../services/moonMath";
import CatSprite from "./CatSprite.vue";
import { CAT_SPOTS } from "../config/heroCat";
const { previewCatSpot, previewCatPose, catScene, timePhases, weatherConditions, heroLayerIds, previewTimePhase, previewWeather, previewMoonPhase, previewMoonProgress, hiddenHeroLayers, showExteriorMask, showInteriorMask, tintHeroLayers, freezeParallax, resetPreview } = useEnvironment();
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
    <fieldset class="cat-preview">
      <legend>Black tomcat</legend>
      <svg class="cat-preview__thumbnail" viewBox="-120 -195 250 210" role="img" :aria-label="`Realistic black tomcat, ${catScene.pose}`">
        <CatSprite :pose="catScene.pose" />
      </svg>
      <div class="cat-preview__controls">
        <label>Cat location
          <select v-model="previewCatSpot">
            <option :value="null">Automatic · {{ catScene.spot.label }}</option>
            <option v-for="spot in CAT_SPOTS" :key="spot.id" :value="spot.id">{{ spot.label }}</option>
          </select>
        </label>
        <label>Cat pose
          <select v-model="previewCatPose">
            <option :value="null">Automatic · {{ catScene.pose }}</option>
            <option value="sitting">Sitting · breathing, tail, head and blinking</option>
            <option value="sleeping">Sleeping · breathing and zzz</option>
          </select>
        </label>
        <span class="cat-preview__status" aria-live="polite">{{ catScene.spot.label }} · {{ catScene.pose }}</span>
        <span class="cat-preview__hint">Choose a location and pose, then click the cat in the hero to pet him. Sleeping cats purr; too many pets may annoy him. Automatic changes hourly.</span>
      </div>
    </fieldset>
    <div class="environment-preview__checks">
      <label><input v-model="showExteriorMask" type="checkbox"> Exterior mask</label><label><input v-model="showInteriorMask" type="checkbox"> Interior mask</label><label><input v-model="tintHeroLayers" type="checkbox"> Tint layers</label><label><input v-model="freezeParallax" type="checkbox"> Freeze parallax</label>
    </div>
    <details class="environment-preview__layers"><summary>Individual layers</summary><label v-for="layer in heroLayerIds" :key="layer"><input v-model="hiddenHeroLayers" type="checkbox" :value="layer"> Hide {{ layer }}</label></details>
    <button type="button" @click="resetPreview">Reset to live</button>
  </aside>
</template>

<style scoped>
.cat-preview { grid-column: 1 / -1; display: grid; grid-template-columns: 125px minmax(0, 1fr); gap: 1rem; margin: .3rem 0; padding: .85rem; border: 1px solid #ffffff25; }
.cat-preview legend { padding: 0 .4rem; color: #c8ad7d; font-size: .8rem; }
.cat-preview__thumbnail { width: 100%; align-self: center; background: radial-gradient(ellipse, #53504a, #191b1b); border-radius: .3rem; }
.cat-preview__controls { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; }
.cat-preview__status, .cat-preview__hint { grid-column: 1 / -1; font-size: .72rem; line-height: 1.45; }
.cat-preview__status { color: #e1d3b9; }
.cat-preview__hint { color: #a4a6a2; }
@media (max-width: 600px) { .cat-preview { grid-template-columns: 80px minmax(0, 1fr); gap: .65rem; } .cat-preview__controls { grid-template-columns: 1fr; } }
</style>
