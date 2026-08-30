<script setup lang="ts">
import { useEnvironment } from "../composables/useEnvironment";

const { state } = useEnvironment();
</script>

<template>
  <svg class="hero-clock" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <foreignObject class="hero-clock__viewport" x="450" y="610" width="51" height="34">
      <div class="hero-clock__plane" xmlns="http://www.w3.org/1999/xhtml">
        <span class="hero-clock__time">{{ state.localTime }}</span>
      </div>
    </foreignObject>
  </svg>
</template>
