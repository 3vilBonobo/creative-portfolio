<script setup>
import FloorFrame from "../components/FloorFrame.vue";
</script>

<template>
  <FloorFrame floorLabel="Floor 04" title="Exit: Back Alley" accent="amber">
    <p class="max-w-2xl text-neutral-300">Contact links go here. Feels like you left the building.</p>

    <div class="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
      <p class="text-neutral-200">Email: <span class="text-emerald-300">you@domain.com</span></p>
      <p class="mt-2 text-neutral-200">GitHub: <span class="text-emerald-300">github.com/you</span></p>
      <p class="mt-2 text-neutral-200">LinkedIn: <span class="text-emerald-300">linkedin.com/in/you</span></p>
    </div>
  </FloorFrame>
</template>
