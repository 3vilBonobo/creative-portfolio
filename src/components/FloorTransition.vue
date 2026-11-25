<script setup lang="ts">
import type { FloorTransition } from "../config/floors";

defineProps<{ transition: FloorTransition }>();
</script>
<template>
  <div :id="`transition-${transition.id}`" class="floor-transition" :class="`floor-transition--${transition.variant}`" :data-transition-id="transition.id" aria-hidden="true">
    <img class="transition__art" :src="transition.artwork" width="2160" height="216" alt="" loading="lazy" decoding="async" />
    <!-- Same viewBox and center crop as the plate: light attenuation follows its fixture. -->
    <svg class="transition__light" viewBox="0 0 2160 216" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <radialGradient :id="`utility-light-${transition.id}`">
          <stop offset="0" stop-color="#080a09" stop-opacity=".85" />
          <stop offset="1" stop-color="#080a09" stop-opacity="0" />
        </radialGradient>
      </defs>
      <ellipse class="transition__light-pulse" :cx="transition.light.x" :cy="transition.light.y" rx="180" ry="76" :fill="`url(#utility-light-${transition.id})`" />
    </svg>
  </div>
</template>
