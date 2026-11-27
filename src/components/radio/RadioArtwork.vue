<script setup lang="ts">
import { ref, watch } from "vue";
import type { RadioStation } from "../../types/radio";
const props = defineProps<{ station: RadioStation }>();
const failed = ref(false);
watch(() => props.station.artwork, () => { failed.value = false; });
</script>
<template>
  <span class="radio-art" :data-art="station.artworkStyle" :style="{ '--cover-accent': station.accent, '--cover-ambient': station.ambient }" aria-hidden="true">
    <img v-if="station.artwork && !failed" :src="station.artwork" alt="" width="640" height="640" decoding="async" @error="failed = true" />
    <span v-else class="radio-art__placeholder"><span class="radio-art__texture"></span><span class="radio-art__sculpture"></span><span class="radio-art__caption">ATHENS / {{ station.frequency }}<b>{{ station.signature }}</b><small>INDEPENDENT SOUND</small></span></span>
  </span>
</template>
