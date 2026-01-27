<script setup>
defineProps({
  floorLabel: { type: String, default: "" }, // e.g. "Floor 01"
  title: { type: String, default: "" }, // optional
  accent: { type: String, default: "emerald" }, // emerald | cyan | pink | amber
});

const accentMap = {
  emerald: "rgba(16,185,129,0.14)",
  cyan: "rgba(34,211,238,0.14)",
  pink: "rgba(236,72,153,0.14)",
  amber: "rgba(245,158,11,0.14)",
};

function accentGlow(accent) {
  return accentMap[accent] ?? accentMap.emerald;
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Ambient + vignette -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-b from-neutral-900/35 via-neutral-950 to-black"></div>
      <div
        class="absolute inset-0"
        :style="{
          background: `radial-gradient(circle at 65% 25%, ${accentGlow(accent)}, transparent 45%)`,
          opacity: 1,
        }"></div>
      <div class="absolute inset-0 [background:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.75))]"></div>
    </div>

    <!-- Scanlines (subtle) -->
    <div class="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay">
      <div
        class="h-full w-full [background:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.25)_0px,rgba(255,255,255,0.25)_1px,transparent_3px,transparent_6px)]"></div>
    </div>

    <!-- "Building frame" edges -->
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute left-0 top-0 h-full w-[10px] bg-gradient-to-b from-neutral-700/15 via-neutral-900/0 to-neutral-700/10"></div>
      <div
        class="absolute right-0 top-0 h-full w-[10px] bg-gradient-to-b from-neutral-700/15 via-neutral-900/0 to-neutral-700/10"></div>
      <div
        class="absolute top-0 left-0 h-[10px] w-full bg-gradient-to-r from-neutral-700/10 via-neutral-900/0 to-neutral-700/10"></div>
      <div
        class="absolute bottom-0 left-0 h-[10px] w-full bg-gradient-to-r from-neutral-700/10 via-neutral-900/0 to-neutral-700/10"></div>
    </div>

    <!-- "Cables / pipes" (pure CSS shapes, repeatable) -->
    <div class="pointer-events-none absolute inset-0 opacity-40">
      <!-- left pipe -->
      <div class="absolute left-10 top-10 h-[80%] w-[3px] bg-neutral-700/50"></div>
      <div class="absolute left-10 top-[20%] h-3 w-3 rounded-full bg-neutral-600/70"></div>
      <div class="absolute left-10 top-[55%] h-3 w-3 rounded-full bg-neutral-600/70"></div>

      <!-- right cable bundle -->
      <div class="absolute right-12 top-20 h-[70%] w-[2px] bg-neutral-700/40"></div>
      <div class="absolute right-16 top-32 h-[65%] w-[2px] bg-neutral-700/30"></div>
      <div class="absolute right-20 top-44 h-[55%] w-[2px] bg-neutral-700/25"></div>
    </div>

    <!-- Tiny flicker dot (gives life) -->
    <div class="pointer-events-none absolute left-6 top-6">
      <div class="h-2 w-2 rounded-full bg-neutral-500/70 animate-pulse"></div>
    </div>

    <!-- Content -->
    <div class="relative flex min-h-screen items-center justify-center p-8">
      <div class="w-full max-w-5xl">
        <p v-if="floorLabel" class="text-sm uppercase tracking-[0.3em] text-neutral-400">
          {{ floorLabel }}
        </p>
        <h1 v-if="title" class="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
          {{ title }}
        </h1>

        <div class="mt-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
