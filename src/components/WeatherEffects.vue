<script setup lang="ts">
import { computed } from "vue";
import type { EnvironmentState } from "../types/environment";
import { getWeatherEffectValues, type EffectIntensity } from "../services/weatherEffects";

const props = defineProps<{ state: EnvironmentState; intensity?: EffectIntensity; paused?: boolean; mode: "atmosphere" | "precipitation" }>();
const values = computed(() => getWeatherEffectValues(props.state, props.intensity));
const style = computed(() => ({
  "--effect-strength": values.value.strength.toFixed(3),
  "--effect-wind": values.value.wind.toFixed(3),
  "--effect-cloud": values.value.cloud.toFixed(3),
}));
</script>

<template>
  <div class="weather-effects" :class="[`weather-effects--${state.weatherCondition}`, `weather-effects--${mode}`]" :data-paused="paused || undefined" :style="style" aria-hidden="true">
    <div v-if="mode === 'atmosphere' && (state.weatherCondition === 'partlyCloudy' || state.weatherCondition === 'cloudy')" class="weather-cloud-shadow" />
    <template v-if="mode === 'atmosphere' && state.weatherCondition === 'fog'">
      <div class="weather-fog weather-fog--far" /><div class="weather-fog weather-fog--near" />
    </template>
    <template v-if="mode === 'precipitation' && (state.weatherCondition === 'rain' || state.weatherCondition === 'storm')">
      <div class="weather-rain weather-rain--far" /><div class="weather-rain weather-rain--near" />
      <div class="weather-streaks" />
    </template>
    <template v-if="mode === 'precipitation' && state.weatherCondition === 'snow'">
      <div class="weather-snow weather-snow--far" /><div class="weather-snow weather-snow--near" />
    </template>
    <div v-if="mode === 'atmosphere' && state.weatherCondition === 'storm'" class="weather-storm-light" />
  </div>
</template>
