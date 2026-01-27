<script setup>
const props = defineProps({
  floors: { type: Array, required: true },
  activeFloor: { type: String, default: null },
});

const emit = defineEmits(["go"]);

function go(id) {
  emit("go", id);
}
</script>

<template>
  <nav
    class="fixed right-4 top-1/2 z-50 -translate-y-1/2 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-2 backdrop-blur"
    aria-label="Elevator navigation">
    <div class="px-3 py-2 text-xs uppercase tracking-wider text-neutral-400">Floors</div>

    <ul class="flex flex-col gap-2 p-2">
      <li v-for="f in floors" :key="f.id">
        <button
          class="group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-neutral-900"
          :class="f.id === activeFloor ? 'bg-neutral-900 text-white' : 'text-neutral-200'"
          @click="go(f.id)">
          <span class="font-medium">{{ f.label }}</span>

          <!-- little indicator light -->
          <span
            class="h-2 w-2 rounded-full transition"
            :class="f.id === activeFloor ? 'bg-emerald-400' : 'bg-neutral-700 group-hover:bg-neutral-500'"
            aria-hidden="true" />
        </button>
      </li>
    </ul>
  </nav>
</template>
