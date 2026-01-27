<script setup>
import { ref } from "vue";
import FloorFrame from "../components/FloorFrame.vue";
import HeroWindow from "../components/HeroWindow.vue";

const timeOfDay = ref("night"); // dawn | day | dusk | night
const weather = ref("clear"); // clear | clouds | rain | fog
</script>

<template>
  <FloorFrame floorLabel="Floor 01" title="Cyberpunk Office Lobby" accent="emerald">
    <div class="grid gap-8 lg:grid-cols-2 lg:items-start">
      <!-- Left: text + controls -->
      <div>
        <p class="max-w-2xl text-neutral-300">
          This is the hero window prototype. We’ll later swap the city layer with AI art, and wire it to real weather +
          time.
        </p>

        <!-- Controls (dev-only for now) -->
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <p class="text-xs uppercase tracking-wider text-neutral-400">Time of day</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                class="rounded-xl border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
                :class="timeOfDay === 'dawn' ? 'bg-neutral-900 text-white' : 'text-neutral-200'"
                @click="timeOfDay = 'dawn'">
                dawn
              </button>
              <button
                class="rounded-xl border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
                :class="timeOfDay === 'day' ? 'bg-neutral-900 text-white' : 'text-neutral-200'"
                @click="timeOfDay = 'day'">
                day
              </button>
              <button
                class="rounded-xl border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
                :class="timeOfDay === 'dusk' ? 'bg-neutral-900 text-white' : 'text-neutral-200'"
                @click="timeOfDay = 'dusk'">
                dusk
              </button>
              <button
                class="rounded-xl border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
                :class="timeOfDay === 'night' ? 'bg-neutral-900 text-white' : 'text-neutral-200'"
                @click="timeOfDay = 'night'">
                night
              </button>
            </div>
          </div>

          <div class="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <p class="text-xs uppercase tracking-wider text-neutral-400">Weather</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                class="rounded-xl border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
                :class="weather === 'clear' ? 'bg-neutral-900 text-white' : 'text-neutral-200'"
                @click="weather = 'clear'">
                clear
              </button>
              <button
                class="rounded-xl border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
                :class="weather === 'clouds' ? 'bg-neutral-900 text-white' : 'text-neutral-200'"
                @click="weather = 'clouds'">
                clouds
              </button>
              <button
                class="rounded-xl border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
                :class="weather === 'rain' ? 'bg-neutral-900 text-white' : 'text-neutral-200'"
                @click="weather = 'rain'">
                rain
              </button>
              <button
                class="rounded-xl border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
                :class="weather === 'fog' ? 'bg-neutral-900 text-white' : 'text-neutral-200'"
                @click="weather = 'fog'">
                fog
              </button>
            </div>
          </div>
        </div>

        <p class="mt-6 text-sm text-neutral-400">
          Scroll down to descend. (We’ll remove these controls later or hide behind a dev flag.)
        </p>
      </div>

      <!-- Right: window -->
      <div>
        <HeroWindow :timeOfDay="timeOfDay" :weather="weather" />
        <p class="mt-3 text-xs text-neutral-500">
          Window prototype: gradients + overlays. Later: AI city art + real-time mapping.
        </p>
      </div>
    </div>
  </FloorFrame>
</template>
