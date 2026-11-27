<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRadio } from "../composables/useRadio";
const radio = useRadio();
const { station, audible, playing, busy, statusLabel, stations } = radio;
const root = ref<SVGSVGElement>();
const visible = ref(false);
const hidden = ref(document.hidden);
const animate = computed(() => audible.value && visible.value && !hidden.value);
const visibility = () => { hidden.value = document.hidden; };
let observer: IntersectionObserver | undefined;
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => { visible.value = !!entry?.isIntersecting; });
  if (root.value) observer.observe(root.value);
  document.addEventListener("visibilitychange", visibility);
});
onBeforeUnmount(() => { observer?.disconnect(); document.removeEventListener("visibilitychange", visibility); });
</script>

<template>
  <svg ref="root" class="radio-laptop-map" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet" :style="{ '--radio-accent': station.accent }">
    <defs>
      <radialGradient id="radio-discovery-halo"><stop offset="0%" stop-color="#efad3f" stop-opacity="0"/><stop offset="79%" stop-color="#efad3f" stop-opacity="0"/><stop offset="86%" stop-color="#efad3f" stop-opacity=".34"/><stop offset="100%" stop-color="#efad3f" stop-opacity="0"/></radialGradient>
      <linearGradient id="radio-screen-glass" x2="1" y2="1"><stop stop-color="#a4c8df" stop-opacity=".12"/><stop offset=".5" stop-color="#151825" stop-opacity="0"/><stop offset="1" stop-color="#567a98" stop-opacity=".07"/></linearGradient>
    </defs>
    <!-- Registered inside the original screen bezel; all content shares its plane. -->
    <g class="radio-laptop-screen" transform="matrix(.15 .016 -.032 .17 1090 528)" aria-hidden="true">
      <rect width="240" height="200" fill="#10161d"/>
      <rect width="240" height="24" fill="#1b2530"/><circle cx="9" cy="12" r="2" fill="#f28b80"/><circle cx="17" cy="12" r="2" fill="#eac184"/>
      <rect x="40" y="7" width="160" height="10" rx="3" fill="#10161d"/><text x="120" y="14" text-anchor="middle" font-size="6" fill="#b9c8d3">athens.onair / listen</text>
      <text x="12" y="43" font-size="11" font-weight="700" fill="#e2eaf0">ATHENS // ON AIR</text><path d="M12 53H228" stroke="#31404f"/>
      <g v-for="(item,index) in stations" :key="item.id"><rect x="9" :y="65 + index * 19" width="66" height="17" :fill="item.id === station.id ? '#293443' : '#151e28'"/><text x="14" :y="76 + index * 19" font-size="8" :fill="item.id === station.id ? station.accent : '#98a7b4'">{{ item.frequency }} FM</text></g>
      <text x="87" y="78" font-size="10" :fill="station.accent">{{ station.frequency }} FM</text>
      <text x="87" y="98" font-size="14" font-weight="700" fill="#e1e8ef" textLength="132" lengthAdjust="spacingAndGlyphs">{{ station.name }}</text>
      <text x="87" y="113" font-size="7" fill="#aab9c8">INDEPENDENT / ATHENS</text>
      <g class="radio-screen-bars" :class="{ 'is-active': animate }" :fill="station.accent"><rect v-for="n in 12" :key="n" :x="88+n*10" y="124" width="4" :height="7 + (n*7 % 19)" :style="{ '--bar': n }" /></g>
      <circle cx="97" cy="169" r="10" :fill="station.accent"/><path v-if="playing || busy" d="M94 164v10m6-10v10" stroke="#16212c" stroke-width="2.5"/><path v-else d="m94 164 7 5-7 5Z" fill="#16212c"/>
      <path d="M116 169H214" stroke="#485868" stroke-width="3"/><path d="M116 169H155" :stroke="station.accent" stroke-width="3"/>
      <text x="12" y="188" font-size="7" fill="#bac8d4">{{ statusLabel.toUpperCase() }}</text><rect width="240" height="200" fill="url(#radio-screen-glass)"/>
    </g>
    <g v-if="animate" class="radio-laptop-notes" aria-hidden="true"><text v-for="n in 3" :key="n" :x="1090 + n*9" y="518" :style="{ '--note': n }">{{ n === 2 ? '♫' : '♪' }}</text></g>
    <!-- The telescope's exact halo/scale/label animation classes are reused. -->
    <g class="telescope-hotspot-target radio-laptop-target" role="button" tabindex="0" aria-label="Open Athens radio from the laptop" aria-haspopup="dialog" @click.stop="radio.show" @keydown.enter.prevent.stop="radio.show" @keydown.space.prevent.stop="radio.show">
      <title>ATHENS // ON AIR · Open radio</title>
      <circle class="telescope-hotspot-target__halo" cx="1105" cy="552" r="48" fill="url(#radio-discovery-halo)"/>
      <circle class="telescope-hotspot-target__shape" cx="1105" cy="552" r="38"/>
      <g class="telescope-hotspot-target__label"><rect x="1033" y="602" width="144" height="28"/><text x="1105" y="620" text-anchor="middle">Open Athens radio</text></g>
    </g>
  </svg>
</template>
