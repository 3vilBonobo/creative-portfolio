<script setup lang="ts">
import { useEnvironment } from "../../composables/useEnvironment";
const { state } = useEnvironment();
</script>

<template>
  <svg
    class="hero-clock hero-clock--desktop"
    viewBox="0 0 1672 941"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true">
    <g transform="translate(553 541) rotate(-0.5) skewY(-2.5) scale(1.02 0.74)">
      <foreignObject class="hero-clock__viewport" x="0" y="0" width="51" height="34">
        <div class="hero-clock__plane" xmlns="http://www.w3.org/1999/xhtml">
          <span class="hero-clock__time">{{ state.localTime }}</span>
        </div>
      </foreignObject>
    </g>
  </svg>
</template>
