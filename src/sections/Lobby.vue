<script setup>
import FloorFrame from "../components/FloorFrame.vue";
</script>

<template>
  <FloorFrame floorLabel="Floor 01" title="Cyberpunk Office Lobby" accent="emerald">
    <p class="max-w-2xl text-neutral-300">
      Placeholder hero. This becomes the office interior + the reactive window (time + weather).
    </p>

    <div class="mt-8 grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
        <p class="text-sm text-neutral-300">Time</p>
        <p class="mt-1 text-lg text-white">Local</p>
      </div>
      <div class="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
        <p class="text-sm text-neutral-300">Weather</p>
        <p class="mt-1 text-lg text-white">Soon™</p>
      </div>
      <div class="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
        <p class="text-sm text-neutral-300">Status</p>
        <p class="mt-1 text-lg text-emerald-300">System Online</p>
      </div>
    </div>

    <p class="mt-10 text-sm text-neutral-400">Scroll down to descend.</p>
  </FloorFrame>
</template>
