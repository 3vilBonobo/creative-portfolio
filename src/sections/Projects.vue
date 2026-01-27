<script setup>
import FloorFrame from "../components/FloorFrame.vue";
</script>

<template>
  <FloorFrame floorLabel="Floor 02" title="Projects" accent="cyan">
    <p class="max-w-2xl text-neutral-300">Clickable “screens” live here. For now, placeholders.</p>

    <div class="mt-8 grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
        <p class="text-sm text-neutral-400">Project 01</p>
        <p class="mt-2 text-lg font-medium">Agritrack UI</p>
        <p class="mt-2 text-sm text-neutral-300">Complex forms, dialogs, tables.</p>
      </div>
      <div class="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
        <p class="text-sm text-neutral-400">Project 02</p>
        <p class="mt-2 text-lg font-medium">Haunted UI</p>
        <p class="mt-2 text-sm text-neutral-300">Creepy components with taste.</p>
      </div>
      <div class="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
        <p class="text-sm text-neutral-400">Project 03</p>
        <p class="mt-2 text-lg font-medium">Coming Soon</p>
        <p class="mt-2 text-sm text-neutral-300">Placeholder terminal.</p>
      </div>
    </div>
  </FloorFrame>
</template>
