<script setup lang="ts">
defineProps<{ name: "sound" | "muted" | "play" | "pause" | "radio" }>();
</script>
<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="name === 'sound' || name === 'muted'"><path d="M11 5 6 9H3v6h3l5 4Z"/><path v-if="name === 'sound'" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path v-else d="m16 9 5 6m0-6-5 6"/></template>
    <path v-else-if="name === 'play'" d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none"/>
    <path v-else-if="name === 'pause'" d="M8 5v14M16 5v14" stroke-width="3"/>
    <template v-else><path d="M9 8v8m4-11v14m4-11v8M5 10v4M21 10v4"/></template>
  </svg>
</template>
