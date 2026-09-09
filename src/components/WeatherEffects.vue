<script setup lang="ts">
import { computed } from "vue";
import PrecipitationCanvas from "./PrecipitationCanvas.vue";
import type { EnvironmentState } from "../types/environment";
import { getWeatherEffectValues, type EffectIntensity } from "../services/weatherEffects";

const props = defineProps<{ state: EnvironmentState; intensity?: EffectIntensity; paused?: boolean; mode: "sky" | "atmosphere" | "precipitation" }>();
const values = computed(() => getWeatherEffectValues(props.state, props.intensity));
const style = computed(() => ({
  "--effect-strength": values.value.strength.toFixed(3),
  "--effect-wind": values.value.wind.toFixed(3),
  "--effect-cloud": values.value.cloud.toFixed(3),
  "--cloud-duration": `${values.value.cloudDuration}s`,
  "--cloud-play": values.value.cloudPaused ? "paused" : "running",
}));
</script>

<template>
  <div class="weather-effects" :class="[`weather-effects--${state.weatherCondition}`, `weather-effects--${mode}`]" :data-paused="paused || undefined" :style="style" aria-hidden="true">
    <template v-if="mode === 'sky'">
      <div v-if="values.cloud > 0" class="weather-clouds" :class="{ 'weather-clouds--dense': values.cloud >= .7 }">
        <div class="weather-cloud-bank weather-cloud-bank--far" /><div class="weather-cloud-bank weather-cloud-bank--near" />
      </div>
      <template v-if="state.weatherCondition === 'storm'">
        <div class="weather-storm-light" />
        <svg class="weather-lightning" viewBox="0 0 1000 400" preserveAspectRatio="none"><path d="M540 0 505 65 527 81 478 140 496 151 454 223 476 188 470 166 516 112 500 99 551 40 M507 65 568 99 573 136 608 167 M478 140 431 160 423 191" /></svg>
      </template>
    </template>
    <template v-if="mode === 'atmosphere' && state.weatherCondition === 'fog'">
      <div class="weather-fog weather-fog--far" /><div class="weather-fog weather-fog--near" />
    </template>
    <PrecipitationCanvas
      v-if="mode === 'precipitation' && ['rain', 'storm', 'snow'].includes(state.weatherCondition)"
      :snow="state.weatherCondition === 'snow'" :strength="values.strength"
      :wind-speed="state.windSpeed" :paused="paused"
    />
  </div>
</template>
