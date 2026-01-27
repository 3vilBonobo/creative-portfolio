<script setup>
import { computed } from "vue";
import { getWindowScene } from "../config/windowScenes";

const props = defineProps({
  timeOfDay: { type: String, default: "night" }, // dawn | day | dusk | night
  weather: { type: String, default: "clear" }, // clear | clouds | rain | fog
});
const scene = computed(() => getWindowScene(props.timeOfDay, props.weather));
const fx = computed(() => scene.value.fx || []);

/**
 * We fake the "city" with gradients + shapes for now.
 * Later we will replace the city layer with your AI art.
 */

const skyGradient = computed(() => {
  const t = props.timeOfDay;

  // Sky colors are intentionally subtle — cyberpunk comes from overlays + lights.
  if (t === "dawn") return "bg-gradient-to-b from-indigo-950 via-fuchsia-950 to-neutral-950";
  if (t === "day") return "bg-gradient-to-b from-slate-900 via-neutral-950 to-black";
  if (t === "dusk") return "bg-gradient-to-b from-fuchsia-950 via-rose-950 to-neutral-950";
  return "bg-gradient-to-b from-black via-neutral-950 to-black"; // night
});

const lightingOverlay = computed(() => {
  const t = props.timeOfDay;

  if (t === "dawn") return "from-amber-400/10 via-transparent to-emerald-400/5";
  if (t === "day") return "from-cyan-400/6 via-transparent to-transparent";
  if (t === "dusk") return "from-rose-400/10 via-transparent to-fuchsia-400/6";
  return "from-emerald-400/6 via-transparent to-cyan-400/6"; // night
});

const weatherOverlay = computed(() => {
  const w = props.weather;
  if (w === "clouds") return "opacity-100";
  if (w === "fog") return "opacity-100";
  if (w === "rain") return "opacity-100";
  return "opacity-0"; // clear
});
</script>

<template>
  <div
    class="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
    <!-- Window frame -->
    <div class="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5"></div>

    <!-- Scene -->
    <div class="relative aspect-[16/9] w-full">
      <!-- Sky -->
      <div class="absolute inset-0" :class="skyGradient"></div>

      <!-- City layer (image-ready) -->
      <div class="absolute inset-0">
        <!-- Base city image (placeholder now, AI later) -->
        <img
          :src="scene.cityImageUrl"
          alt="Cyberpunk city view"
          class="absolute inset-0 h-full w-full object-cover opacity-80"
          draggable="false" />

        <!-- Darken lower area for contrast -->
        <div
          class="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-neutral-950/70 to-transparent"></div>

        <!-- Neon hints (still fine on top of image) -->
        <div class="absolute bottom-[18%] left-[24%] h-1 w-10 rounded bg-emerald-400/30 blur-[1px]"></div>
        <div class="absolute bottom-[34%] left-[59%] h-1 w-12 rounded bg-cyan-400/25 blur-[1px]"></div>
        <div class="absolute bottom-[22%] left-[74%] h-1 w-16 rounded bg-fuchsia-400/20 blur-[1px]"></div>
      </div>

      <!-- Lighting overlay (time-based) -->
      <div class="absolute inset-0 bg-gradient-to-b" :class="lightingOverlay"></div>

      <!-- Clouds overlay -->
      <div v-if="fx.includes('clouds')" class="absolute inset-0">
        <div class="absolute -top-10 left-10 h-40 w-72 rounded-full bg-white/6 blur-2xl"></div>
        <div class="absolute top-6 right-0 h-48 w-80 rounded-full bg-white/5 blur-3xl"></div>
        <div class="absolute top-24 left-40 h-40 w-96 rounded-full bg-white/4 blur-3xl"></div>
      </div>

      <!-- Fog overlay -->
      <div v-if="fx.includes('fog')" class="absolute inset-0">
        <div
          class="absolute bottom-0 left-0 h-[60%] w-full bg-gradient-to-t from-white/10 via-white/6 to-transparent"></div>
        <div class="absolute inset-0 animate-fogMove opacity-60">
          <div class="absolute bottom-10 left-[-20%] h-40 w-[60%] rounded-full bg-white/6 blur-3xl"></div>
          <div class="absolute bottom-24 left-[30%] h-44 w-[70%] rounded-full bg-white/5 blur-3xl"></div>
        </div>
      </div>

      <!-- Rain overlay -->
      <div v-if="fx.includes('rain')" class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-b from-cyan-400/6 via-transparent to-transparent"></div>

        <!-- Rain streaks (CSS animation) -->
        <div class="absolute inset-0 opacity-60">
          <div class="rain-layer"></div>
          <div class="rain-layer rain-layer2"></div>
        </div>
      </div>

      <!-- Glass reflection -->
      <div class="absolute inset-0 opacity-40">
        <div
          class="absolute -left-10 -top-20 h-80 w-80 rotate-12 bg-gradient-to-br from-white/8 via-white/2 to-transparent blur-2xl"></div>
        <div
          class="absolute right-[-10%] top-10 h-72 w-72 -rotate-12 bg-gradient-to-bl from-white/6 via-white/2 to-transparent blur-2xl"></div>
      </div>

      <!-- Inner vignette -->
      <div
        class="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),inset_0_-80px_120px_rgba(0,0,0,0.65)]"></div>

      <!-- Label (debug) -->
      <div
        class="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-neutral-200 backdrop-blur">
        {{ timeOfDay }} · {{ weather }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fog drift */
@keyframes fogMove {
  0% {
    transform: translateX(-2%);
  }
  50% {
    transform: translateX(2%);
  }
  100% {
    transform: translateX(-2%);
  }
}
.animate-fogMove {
  animation: fogMove 6s ease-in-out infinite;
}

/* Rain effect */
.rain-layer {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    115deg,
    rgba(255, 255, 255, 0.14) 0px,
    rgba(255, 255, 255, 0.14) 1px,
    transparent 2px,
    transparent 10px
  );
  background-size: 180px 180px;
  animation: rainFall 0.6s linear infinite;
  filter: blur(0.2px);
  opacity: 0.55;
}

.rain-layer2 {
  animation-duration: 0.85s;
  opacity: 0.35;
  background-size: 240px 240px;
}

@keyframes rainFall {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 0 180px;
  }
}
</style>
