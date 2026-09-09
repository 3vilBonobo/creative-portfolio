/** One shared clock keeps the gait, turn and doorway fade in sync. */
export const MOUSE_VISIT_MS = 8500;
const RUN_END = 6250;
const TURN_END = 7250;
const ENTRY_END = 8375;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

export function sampleMouseMotion(elapsed: number) {
  const time = Math.max(0, elapsed);
  const braking = clamp((time - 5650) / 600);
  const strideTime = time <= 5650 ? time : 5650 + 600 * (braking - braking * braking / 2);
  const approach = clamp(strideTime / 5950);
  const turn = clamp((time - RUN_END) / (TURN_END - RUN_END));
  const entry = smooth(clamp((time - TURN_END) / (ENTRY_END - TURN_END)));
  // Slow the last few strides before planting the feet to turn.
  const frame = time < RUN_END
    ? Math.floor(strideTime / 55) % 8
    : time < TURN_END
      ? 8 + Math.min(2, Math.floor(turn * 3))
      : 10 + Math.floor((time - TURN_END) / 100) % 2;
  return {
    frame,
    approach,
    turn: smooth(turn),
    entry,
    opacity: Math.min(clamp(time / 180), 1 - entry),
    done: time >= MOUSE_VISIT_MS,
  };
}
