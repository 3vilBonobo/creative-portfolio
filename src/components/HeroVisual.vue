<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger";
const root = ref<HTMLElement>(); let context: gsap.Context | undefined;
onMounted(() => { if (!root.value || matchMedia("(prefers-reduced-motion: reduce)").matches) return; gsap.registerPlugin(ScrollTrigger); context = gsap.context(() => { gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((layer) => gsap.to(layer, { yPercent: Number(layer.dataset.depth ?? 0), ease: "none", scrollTrigger: { trigger: root.value, start: "top top", end: "bottom top", scrub: true } })); }, root.value); });
onBeforeUnmount(() => context?.revert());
</script>
<template>
  <div ref="root" class="hero-visual" role="img" aria-label="Layered placeholder scene of a developer's rooftop office overlooking Athens">
    <div class="hero-layer hero-layer--sky" data-depth="3" aria-hidden="true" />
    <div class="hero-layer hero-layer--athens" data-depth="8" aria-hidden="true"><i class="acropolis-placeholder" /></div>
    <div class="hero-layer hero-layer--haze" aria-hidden="true" />
    <div class="hero-layer hero-layer--rooftops" data-depth="14" aria-hidden="true" />
    <div class="hero-layer hero-layer--frame" aria-hidden="true" />
    <div class="hero-layer hero-layer--office" data-depth="4" aria-hidden="true"><i class="practical-light" /><i class="shelf" /></div>
    <div class="hero-layer hero-layer--desk" data-depth="7" aria-hidden="true"><i class="monitor monitor--one" /><i class="monitor monitor--two" /><i class="desk-lamp" /></div>
    <div class="hero-layer hero-layer--developer" data-depth="10" aria-hidden="true" />
    <div class="hero-layer hero-layer--weather" aria-hidden="true" />
    <div class="hero-layer hero-layer--lighting" aria-hidden="true" />
  </div>
</template>
