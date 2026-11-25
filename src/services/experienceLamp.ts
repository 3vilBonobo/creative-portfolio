import type { LampClock } from "./projectsLamp";

/** Sparse local electrical instability. One timeout, with an injectable clock. */
export function createExperienceLamp(
  setIntensity: (value: number) => void,
  clock: LampClock,
  random: () => number = Math.random,
) {
  let timer: number | undefined;
  let enabled = false;
  let disposed = false;
  const between = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));

  function clear() {
    if (timer !== undefined) clock.cancel(timer);
    timer = undefined;
  }

  function schedule(callback: () => void, delay: number) {
    timer = clock.schedule(() => {
      timer = undefined;
      if (enabled && !disposed) callback();
    }, delay);
  }

  function rest() { schedule(event, between(25_000, 75_000)); }

  function event() {
    const choice = random();
    const steps = choice < .12
      ? [{ value: .08, duration: between(160, 220) }, { value: .72, duration: between(140, 240) }]
      : choice < .72
        ? [{ value: .58 + random() * .2, duration: between(120, 200) }, { value: .9, duration: between(120, 200) }]
        : [{ value: .66, duration: between(100, 150) }, { value: .96, duration: between(300, 450) }, { value: .78, duration: between(120, 180) }, { value: .92, duration: between(140, 220) }];
    function step(index: number) {
      const next = steps[index];
      if (!next) { setIntensity(1); rest(); return; }
      setIntensity(next.value);
      schedule(() => step(index + 1), next.duration);
    }
    step(0);
  }

  function setEnabled(value: boolean) {
    if (disposed || value === enabled) return;
    enabled = value;
    clear();
    setIntensity(1);
    if (enabled) rest();
  }

  function dispose() {
    disposed = true;
    enabled = false;
    clear();
    setIntensity(1);
  }

  return { setEnabled, dispose };
}
