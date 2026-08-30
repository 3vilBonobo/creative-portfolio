<script setup lang="ts">
interface Floor { id: string; number: string; label: string }
defineProps<{ floors: readonly Floor[]; activeFloor: string }>();
</script>
<template><nav class="floor-nav" aria-label="Floor navigation"><span class="floor-nav__title">Floors</span><a v-for="floor in floors" :key="floor.id" :href="`#${floor.id}`" :class="{ active: floor.id === activeFloor }" :aria-current="floor.id === activeFloor ? 'location' : undefined"><span>{{ floor.number }}</span><b>{{ floor.label }}</b><i aria-hidden="true"></i></a></nav></template>
