<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{ snow: boolean; strength: number; windSpeed: number; paused?: boolean }>();
const canvas = ref<HTMLCanvasElement>();
const wind = computed(() => Number.isFinite(props.windSpeed) ? Math.max(0, props.windSpeed) : 0);
interface Particle { x: number; y: number; depth: number; size: number; phase: number; speed: number; }
let particles: Particle[] = [];
let width = 0, height = 0, frame = 0, previous = 0, elapsed = 0;
let context: CanvasRenderingContext2D | null = null;
let resize: ResizeObserver | undefined, intersection: IntersectionObserver | undefined;
let motion: MediaQueryList | undefined;
let visible = false;

function seed(): Particle {
  const depth = Math.random() ** 1.5;
  return { x: Math.random() * width, y: Math.random() * height, depth,
    size: .45 + depth * 2.4, phase: Math.random() * Math.PI * 2, speed: .75 + Math.random() * .5 };
}
function populate() {
  // Density follows screen area rather than repeating a small texture tile.
  const density = props.snow ? 1 / 2400 : 1 / 1500;
  const count = Math.min(props.snow ? 500 : 850, Math.round(width * height * density * (.35 + props.strength)));
  while (particles.length < count) particles.push(seed());
  particles.length = count;
}
function measure() {
  if (!canvas.value || !context) return;
  const rect = canvas.value.getBoundingClientRect();
  width = rect.width; height = rect.height;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.value.width = Math.round(width * dpr);
  canvas.value.height = Math.round(height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = []; populate(); draw(0);
}
function draw(dt: number) {
  if (!context || !width || !height) return;
  const ctx = context;
  ctx.clearRect(0, 0, width, height);
  elapsed += dt;
  for (const p of particles) {
    const depth = .3 + p.depth * .7;
    const vx = wind.value * (props.snow ? 1.6 : 3.2) * depth;
    const vy = (props.snow ? 20 + p.depth * 55 : 430 + p.depth * 670) * p.speed;
    const flutter = props.snow ? Math.sin(elapsed * (.6 + p.depth) + p.phase) * (12 + p.depth * 22) : 0;
    p.x += (vx + flutter) * dt;
    p.y += vy * dt;
    if (p.y > height + 35) { p.y = -35 - Math.random() * 30; p.x = Math.random() * width; }
    if (p.x > width + 35) p.x = -35;
    if (p.x < -35) p.x = width + 35;
    if (props.snow) {
      const radius = p.size * (.85 + Math.sin(elapsed * 1.4 + p.phase) * .15);
      const alpha = (.22 + p.depth * .48) * (.55 + props.strength * .45);
      // Soft discs, with a denser core: distant flakes stay small and near flakes defocus.
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 1.8);
      glow.addColorStop(0, `rgba(242,248,251,${alpha})`);
      glow.addColorStop(.4, `rgba(235,245,250,${alpha * .8})`);
      glow.addColorStop(1, 'rgba(235,245,250,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(p.x, p.y, radius * 1.8, 0, Math.PI * 2); ctx.fill();
    } else {
      const shutter = .012 + p.depth * .012;
      const tailX = p.x - vx * shutter, tailY = p.y - vy * shutter;
      const alpha = (.1 + p.depth * .28) * (.6 + props.strength * .4);
      const streak = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
      streak.addColorStop(0, 'rgba(190,218,235,0)');
      streak.addColorStop(.8, `rgba(200,224,239,${alpha})`);
      streak.addColorStop(1, `rgba(229,240,246,${alpha * .65})`);
      ctx.strokeStyle = streak; ctx.lineWidth = .45 + p.depth * .85;
      ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
  }
}
function tick(now: number) {
  frame = 0;
  draw(previous ? Math.min((now - previous) / 1000, .04) : 0);
  previous = now;
  frame = requestAnimationFrame(tick);
}
function sync() {
  cancelAnimationFrame(frame); frame = 0; previous = 0;
  if (!props.paused && visible && !document.hidden && !motion?.matches) frame = requestAnimationFrame(tick);
  else if (motion?.matches) draw(0);
}
watch(() => [props.snow, props.strength], () => { populate(); draw(0); });
watch(() => props.paused, sync);
onMounted(() => {
  context = canvas.value!.getContext('2d');
  motion = matchMedia('(prefers-reduced-motion: reduce)');
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  resize = new ResizeObserver(measure); resize.observe(canvas.value!);
  intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  intersection.observe(canvas.value!);
  measure();
});
onBeforeUnmount(() => {
  cancelAnimationFrame(frame); resize?.disconnect(); intersection?.disconnect();
  motion?.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync);
});
</script>

<template><canvas ref="canvas" class="weather-particles" aria-hidden="true" /></template>
