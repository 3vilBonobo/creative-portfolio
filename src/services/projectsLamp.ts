export interface LampClock {
  schedule: (callback: () => void, delay: number) => number;
  cancel: (handle: number) => void;
}

/** One pending timeout; no animation loop or connection to environmental state. */
export function createProjectsLamp(
  setIntensity: (intensity: number) => void,
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

  function rest() {
    schedule(event, between(20_000, 60_000));
  }

  function event() {
    const choice = random();
    const steps = choice < 0.18
      ? [{ intensity: 0, duration: between(160, 220) }]
      : choice < 0.65
        ? [{ intensity: 0.55 + random() * 0.2, duration: between(90, 150) }]
        : [
            { intensity: 0.62, duration: between(100, 140) },
            { intensity: 1, duration: between(260, 360) },
            { intensity: 0.72, duration: between(90, 130) },
          ];
    function step(index: number) {
      const next = steps[index];
      if (!next) {
        setIntensity(1);
        rest();
        return;
      }
      setIntensity(next.intensity);
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
