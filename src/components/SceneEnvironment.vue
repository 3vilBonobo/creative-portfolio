<script setup lang="ts">
import type { EnvironmentState } from "../types/environment";
import type { EffectIntensity } from "../services/weatherEffects";
import WeatherEffects from "./WeatherEffects.vue";
withDefaults(defineProps<{ scene: "hero" | "alley"; state: EnvironmentState; intensity?: EffectIntensity; paused?: boolean; precipitation?: boolean }>(), { precipitation: true });
</script>

<template>
  <div class="scene-environment" :class="`scene-environment--${scene}`" :data-phase="state.timePhase" :data-weather="state.weatherCondition" aria-hidden="true">
    <div class="scene-environment__sky">
      <div class="scene-clear-sky" />
      <WeatherEffects mode="sky" :state="state" :intensity="intensity" :paused="paused" />
    </div>
    <div class="scene-environment__exterior">
      <div class="scene-environment__grade" />
      <WeatherEffects mode="atmosphere" :state="state" :intensity="intensity" :paused="paused" />
      <WeatherEffects v-if="precipitation !== false" mode="precipitation" :state="state" :intensity="intensity" :paused="paused" />
    </div>
  </div>
</template>
