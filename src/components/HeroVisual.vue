<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger";
const root = ref<HTMLElement>(); let context: gsap.Context | undefined;
onMounted(() => { if (!root.value || matchMedia("(prefers-reduced-motion: reduce)").matches) return; gsap.registerPlugin(ScrollTrigger); context = gsap.context(() => { gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((layer) => gsap.to(layer, { yPercent: Number(layer.dataset.depth ?? 0), ease: "none", scrollTrigger: { trigger: root.value, start: "top top", end: "bottom top", scrub: true } })); }, root.value); });
onBeforeUnmount(() => context?.revert());
</script>
<template><div ref="root" class="hero-visual" role="img" aria-label="Temporary layered placeholder for a rooftop office overlooking Athens"><div class="hero-layer hero-layer--athens" data-depth="8"><span>Athens background placeholder</span></div><div class="hero-layer hero-layer--skyline" data-depth="13"><span>Distant skyline</span></div><div class="hero-layer hero-layer--rooftops" data-depth="20"><span>Near rooftops</span></div><div class="hero-layer hero-layer--frame"><span>Architectural frame</span></div><div class="hero-layer hero-layer--desk" data-depth="5"><span>Office foreground</span></div><div class="hero-layer hero-layer--developer" data-depth="10"><span>Developer silhouette</span></div></div></template>
