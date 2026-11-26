<script setup lang="ts">
import { FLOOR, FLOORS } from "/src/config/floors";
</script>
<template>
  <header class="site-header">
    <a class="wordmark" :href="`#${FLOOR.office.id}`" aria-label="Return to office">PORTFOLIO <span>/ ATHENS</span></a>
    <nav class="site-nav" aria-label="Portfolio sections">
      <a v-for="floor in FLOORS.slice(1)" :key="floor.id" :href="`#${floor.id}`">{{ floor.label }}</a>
    </nav>
  </header>
</template>