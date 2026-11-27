<script setup lang="ts">
import { computed } from "vue";
import { useEnvironment } from "../../composables/useEnvironment";
import { FLOOR } from "../../config/floors";
const { state } = useEnvironment();
const year = new Date().getFullYear();
const condition = computed(() => state.value.weatherCondition.replace(/([A-Z])/g, " $1").toLowerCase());
</script>
<template>
  <footer class="alley-footer">
    <p>© {{ year }} Irinella Boutsika</p>
    <p class="alley-footer__environment"><span class="sr-only">Athens conditions: </span>{{ state.localTime }} · {{ Math.round(state.temperature) }}°C · {{ condition }}</p>
    <p>Athens, Greece · Level {{ FLOOR.street.number }}</p>
  </footer>
</template>
