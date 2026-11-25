/** One shared clock keeps the gait, turn and doorway fade in sync. */
export const MOUSE_VISIT_MS = 9500;
const RUN_END = 6250;
const TURN_START = 6500;
const TURN_END = 7450;
const ENTRY_END = 9300;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

export function sampleMouseMotion(elapsed: number) {
  const time = Math.max(0, elapsed);
  const braking = clamp((time - 5650) / 600);
  const strideTime = time <= 5650 ? time : 5650 + 600 * (braking - braking * braking / 2);
  const approach = clamp(strideTime / 5950);
  const turn = clamp((time - TURN_START) / (TURN_END - TURN_START));
  const entry = smooth(clamp((time - TURN_END) / (ENTRY_END - TURN_END)));
  const frontStep = smooth(braking);
  const fade = smooth(clamp((entry - .2) / .8));
  // Slow the last few strides before planting the feet to turn.
  const frame = time < RUN_END
    ? Math.floor(strideTime / 55) % 8
    : time < TURN_START
      ? 4
      : time < TURN_END
      ? 8 + Math.min(2, Math.floor(turn * 3))
      : 10 + Math.floor((time - TURN_END) / 120) % 2;
  return {
    frame,
    approach,
    turn: smooth(turn),
    entry,
    phase: time < RUN_END ? 'run' : time < TURN_START ? 'settle' : time < TURN_END ? 'turn' : 'enter',
    // Step onto the pavement in front of the door, then walk away into it.
    depthOffset: frontStep * .16 - entry * .28,
    scale: 1 - entry * .28,
    brightness: .78 - entry * .48,
    opacity: Math.min(clamp(time / 180), 1 - fade),
    done: time >= MOUSE_VISIT_MS,
  };
}
