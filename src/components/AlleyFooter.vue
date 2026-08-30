<script setup lang="ts">
import { computed } from "vue";
import { useEnvironment } from "../composables/useEnvironment";
const { state } = useEnvironment();
const condition = computed(() => state.value.weatherCondition.replace(/([A-Z])/g, " $1").toLowerCase());
</script>
<template><footer class="alley-footer"><p>© Year / Name placeholder</p><p class="alley-footer__environment"><span class="sr-only">Athens conditions:</span>{{ state.localTime }} · {{ Math.round(state.temperature) }}°C · {{ condition }}</p><a href="#office">Return to rooftop ↑</a></footer></template>
