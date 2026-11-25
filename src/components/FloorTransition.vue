<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FloorTransition } from "../config/floors";
const props = defineProps<{ transition: FloorTransition }>();
const artwork = {
  pipes: "/transitions/service-void-pipes.png",
  cables: "/transitions/service-void-cables.png",
} as const;
const root = ref<HTMLElement>(); let context: gsap.Context | undefined;
onMounted(() => { if (!root.value || matchMedia("(prefers-reduced-motion: reduce)").matches) return; gsap.registerPlugin(ScrollTrigger); context = gsap.context(() => { gsap.fromTo(".transition__art", { yPercent: -5, scale: 1.06 }, { yPercent: 5, scale: 1.06, ease: "none", scrollTrigger: { trigger: root.value, start: "top bottom", end: "bottom top", scrub: 0.5 } }); }, root.value); });
onBeforeUnmount(() => context?.revert());
</script>
<template>
  <div :id="`transition-${transition.id}`" ref="root" class="floor-transition" :class="`floor-transition--${transition.variant}`" :data-transition-id="transition.id" aria-hidden="true">
    <img class="transition__art" :src="artwork[props.transition.variant]" alt="" loading="lazy" decoding="async" />
    <div class="transition__readout"><span>Inter-floor utilities</span><p>Descending to floor {{ transition.to.number }} · {{ transition.to.label }}</p></div>
  </div>
</template>
