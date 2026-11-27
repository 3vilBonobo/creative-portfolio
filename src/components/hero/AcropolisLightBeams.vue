<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{ visible: boolean; paused?: boolean }>();

type Beam = { x: number; y: number; angle: number; travel: number; width: number; height: number; intensity: number; delay: number; duration: number; hue: number };

const beams = ref<Beam[]>([]);
const sequence = ref(0);
let timer: number | undefined;

const between = (min: number, max: number) => min + Math.random() * (max - min);

function clearTimer() {
  window.clearTimeout(timer);
  timer = undefined;
}

function schedule(delay = between(1_200, 3_000)) {
  clearTimer();
  if (!props.visible || props.paused) return;
  timer = window.setTimeout(playSequence, delay);
}

function playSequence() {
  if (!props.visible || props.paused) return;

  const countRoll = Math.random();
  const count = countRoll < .48 ? 1 : countRoll < .82 ? 2 : 3;
  const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
  const left = [{ x: 43.4, y: 36.0 }, { x: 44.8, y: 35.2 }, { x: 46.1, y: 34.7 }];
  const middle = [{ x: 47.2, y: 34.6 }, { x: 48.3, y: 34.4 }, { x: 49.3, y: 34.7 }];
  const right = [{ x: 50.0, y: 35.0 }, { x: 50.6, y: 35.6 }, { x: 51.1, y: 36.3 }];
  const launchPoints = count === 1
    ? [pick([...left, ...middle, ...right])]
    : count === 2
      ? [pick(left), pick(right)]
      : [pick(left), pick(middle), pick(right)];
  const palette = [188, 205, 226, 264, 292, 322, 36];

  beams.value = launchPoints.map((point, index) => ({
    ...point,
    angle: count === 1 ? between(-15, 15) : index === 0 ? between(7, 16) : index === count - 1 ? between(-16, -7) : between(-4, 4),
    travel: (index % 2 === 0 ? 1 : -1) * between(3.5, 7.5),
    width: between(2.6, 4),
    height: between(18, 25),
    intensity: between(.45, .65),
    delay: index * between(.7, 1.5),
    duration: between(12, 18),
    hue: palette[Math.floor(Math.random() * palette.length)],
  }));
  sequence.value += 1;

  const performanceLength = Math.max(...beams.value.map((beam) => beam.delay + beam.duration)) * 1_000 + 750;
  timer = window.setTimeout(() => {
    beams.value = [];
    schedule(between(4_000, 9_000));
  }, performanceLength);
}

watch(() => [props.visible, props.paused], ([visible, paused]) => {
  clearTimer();
  beams.value = [];
  if (visible && !paused) schedule();
});

onMounted(() => { if (props.visible && !props.paused) schedule(); });
onBeforeUnmount(clearTimer);
</script>

<template>
  <div class="acropolis-beams" :data-paused="paused || undefined">
    <div class="acropolis-beams__canvas">
      <i
        v-for="(beam, index) in beams"
        :key="`${sequence}-${index}`"
        class="acropolis-beams__beam"
        :style="{
          '--beam-angle': `${beam.angle}deg`,
          '--beam-travel': `${beam.travel}deg`,
          '--beam-x': `${beam.x}%`,
          '--beam-y': `${beam.y}%`,
          '--beam-width': `${beam.width}%`,
          '--beam-height': `${beam.height}%`,
          '--beam-strength': beam.intensity,
          '--beam-delay': `${beam.delay}s`,
          '--beam-duration': `${beam.duration}s`,
          '--beam-hue': beam.hue,
        }"
      />
    </div>
  </div>
</template>
