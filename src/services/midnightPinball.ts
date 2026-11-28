export const PINBALL_WIDTH = 440;
export const PINBALL_HEIGHT = 720;
export const PINBALL_SAVE_KEY = 'athens-arcade:pinball:v1';

export type PinballState = {
  score: number;
  level: number;
  lives: number;
  ball: { x: number; y: number; vx: number; vy: number };
  ballOnShooter: boolean;
  ballInShooterLane: boolean;
  leftFlipper: boolean;
  rightFlipper: boolean;
  flipperCooldown: number;
  slingCooldown: number;
  bumperFlash: number[];
  hitTargets: boolean[];
};
export type PinballInput = { left?: boolean; right?: boolean; launch?: boolean };
export type PinballEvents = { launched: boolean; bumperHits: number; targetHits: number; slingHit: boolean; flipperHit: boolean; bounced: boolean; drain: boolean; gameOver: boolean; levelUp: boolean; streetCombo: boolean };
type PinballStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const BALL_RADIUS = 7;
export const PINBALL_BUMPERS = [
  { x: 150, y: 302, radius: 22 },
  { x: 220, y: 350, radius: 25 },
  { x: 290, y: 302, radius: 22 },
] as const;
export const PINBALL_TARGETS = [
  { x: 104, y: 451, radius: 15 },
  { x: 220, y: 468, radius: 15 },
  { x: 328, y: 451, radius: 15 },
] as const;
const SHOOTER_BALL = () => ({ x: 393, y: 666, vx: 0, vy: 0 });
const levelFor = (score: number) => 1 + Math.floor(score / 600);

export function createPinball(score = 0): PinballState {
  const safeScore = Math.max(0, Math.floor(score));
  return {
    score: safeScore, level: levelFor(safeScore), lives: 3,
    ball: SHOOTER_BALL(), ballOnShooter: true, ballInShooterLane: false,
    leftFlipper: false, rightFlipper: false, flipperCooldown: 0, slingCooldown: 0,
    bumperFlash: [0, 0, 0], hitTargets: [false, false, false],
  };
}

export function launchPinball(state: PinballState): boolean {
  if (!state.ballOnShooter || state.lives <= 0) return false;
  state.ball = { x: 393, y: 666, vx: 0, vy: -680 - Math.log2(state.level) * 18 };
  state.ballOnShooter = false;
  state.ballInShooterLane = true;
  return true;
}

function distanceToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax, dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function bump(state: PinballState, x: number, y: number, radius: number, push = 1.1) {
  const dx = state.ball.x - x, dy = state.ball.y - y;
  const distance = Math.hypot(dx, dy);
  if (distance >= radius + BALL_RADIUS || distance === 0) return false;
  const nx = dx / distance, ny = dy / distance;
  state.ball.x = x + nx * (radius + BALL_RADIUS);
  state.ball.y = y + ny * (radius + BALL_RADIUS);
  const speed = Math.max(300, Math.hypot(state.ball.vx, state.ball.vy) * push);
  const projection = state.ball.vx * nx + state.ball.vy * ny;
  const rebound = Math.max(0, -projection);
  state.ball.vx = state.ball.vx - 2 * projection * nx + nx * (speed - rebound);
  state.ball.vy = state.ball.vy - 2 * projection * ny + ny * (speed - rebound);
  return true;
}

function drain(state: PinballState, events: PinballEvents) {
  state.lives = Math.max(0, state.lives - 1);
  events.drain = true;
  if (state.lives === 0) { events.gameOver = true; return; }
  state.ball = SHOOTER_BALL();
  state.ballOnShooter = true;
  state.ballInShooterLane = false;
}

export function stepPinball(state: PinballState, input: PinballInput, dt: number): PinballEvents {
  const events: PinballEvents = { launched: false, bumperHits: 0, targetHits: 0, slingHit: false, flipperHit: false, bounced: false, drain: false, gameOver: false, levelUp: false, streetCombo: false };
  const elapsed = Math.max(0, Math.min(dt, 0.04));
  if (!elapsed) return events;
  state.leftFlipper = !!input.left;
  state.rightFlipper = !!input.right;
  state.flipperCooldown = Math.max(0, state.flipperCooldown - elapsed);
  state.slingCooldown = Math.max(0, state.slingCooldown - elapsed);
  state.bumperFlash = state.bumperFlash.map(flash => Math.max(0, flash - elapsed));
  if (input.launch) events.launched = launchPinball(state);
  if (state.ballOnShooter) return events;

  const ball = state.ball;
  if (state.ballInShooterLane) {
    ball.y += ball.vy * elapsed;
    ball.vy = Math.min(-380, ball.vy + 540 * elapsed);
    if (ball.y <= 92) {
      state.ballInShooterLane = false;
      ball.x = 348; ball.y = 101; ball.vx = -260; ball.vy = 185;
    }
    return events;
  }

  const oldLevel = state.level;
  const difficulty = Math.log2(state.level);
  const gravity = 560 + difficulty * 26;
  ball.vy += gravity * elapsed;
  const speed = Math.hypot(ball.vx, ball.vy);
  const maxSpeed = 760 + difficulty * 40;
  if (speed > maxSpeed) { ball.vx *= maxSpeed / speed; ball.vy *= maxSpeed / speed; }
  ball.x += ball.vx * elapsed;
  ball.y += ball.vy * elapsed;

  if (ball.y < 50 + BALL_RADIUS) { ball.y = 50 + BALL_RADIUS; ball.vy = Math.abs(ball.vy) * .78; events.bounced = true; }
  if (ball.x < 40 + BALL_RADIUS) { ball.x = 40 + BALL_RADIUS; ball.vx = Math.abs(ball.vx) * .78; events.bounced = true; }
  if (ball.x > 360 - BALL_RADIUS) { ball.x = 360 - BALL_RADIUS; ball.vx = -Math.abs(ball.vx) * .78; events.bounced = true; }

  for (let index = 0; index < PINBALL_BUMPERS.length; index++) {
    const bumper = PINBALL_BUMPERS[index]!;
    if (!bump(state, bumper.x, bumper.y, bumper.radius, 1.12)) continue;
    const multiplier = Math.min(6, 1 + Math.floor((state.level - 1) / 2));
    state.score += (index === 1 ? 100 : 75) * multiplier;
    state.bumperFlash[index] = .48;
    events.bumperHits++;
  }

  if (state.slingCooldown === 0 && ball.y > 510 && ball.y < 596
    && ((ball.x > 73 && ball.x < 157 && ball.vy > 0) || (ball.x > 283 && ball.x < 367 && ball.vy > 0))) {
    const leftSling = ball.x < 220;
    ball.vx += leftSling ? 210 : -210;
    ball.vy = -Math.max(300, Math.abs(ball.vy) * .9);
    state.slingCooldown = .24;
    state.score += 25;
    events.slingHit = true;
  }

  for (let index = 0; index < PINBALL_TARGETS.length; index++) {
    if (state.hitTargets[index]) continue;
    const target = PINBALL_TARGETS[index]!;
    if (!bump(state, target.x, target.y, target.radius, .92)) continue;
    state.hitTargets[index] = true;
    const multiplier = Math.min(6, 1 + Math.floor((state.level - 1) / 2));
    state.score += 125 * multiplier;
    events.targetHits++;
  }
  if (state.hitTargets.every(Boolean)) {
    state.score += 200;
    state.lives = Math.min(5, state.lives + 1);
    state.hitTargets = [false, false, false];
    events.streetCombo = true;
  }

  if (state.flipperCooldown === 0 && ball.vy > 0 && ball.y > 584 && ball.y < 665) {
    const leftTipY = state.leftFlipper ? 584 : 618;
    const rightTipY = state.rightFlipper ? 584 : 618;
    const hitsLeft = state.leftFlipper && ball.x < 222 && distanceToSegment(ball.x, ball.y, 132, 641, 216, leftTipY) <= BALL_RADIUS + 7;
    const hitsRight = state.rightFlipper && ball.x > 210 && distanceToSegment(ball.x, ball.y, 308, 641, 224, rightTipY) <= BALL_RADIUS + 7;
    if (hitsLeft || hitsRight) {
      ball.y = Math.min(ball.y, 625);
      ball.vy = -Math.max(430, Math.abs(ball.vy) * 1.22);
      ball.vx += hitsLeft ? 170 : -170;
      state.score += 15;
      state.flipperCooldown = .2;
      events.flipperHit = true;
    }
  }

  const isOutlane = ball.y > 565 && (ball.x < 77 || ball.x > 323);
  const centerDrain = ball.y > 682 && ball.x > 180 && ball.x < 260;
  if (isOutlane || centerDrain || ball.y > 716) drain(state, events);
  else if (ball.y > 678) {
    // The inlanes feed a missed center shot back toward a flipper.
    ball.y = 678;
    ball.vy = -Math.max(180, Math.abs(ball.vy) * .62);
    ball.vx += ball.x < 220 ? 95 : -95;
    events.bounced = true;
  }

  state.level = levelFor(state.score);
  events.levelUp = state.level > oldLevel;
  return events;
}

export function savePinball(storage: PinballStorage | undefined, state: PinballState): boolean {
  try {
    if (!storage) return false;
    storage.setItem(PINBALL_SAVE_KEY, JSON.stringify({
      score: state.score, level: state.level, lives: state.lives, ballOnShooter: state.ballOnShooter,
      hitTargets: state.hitTargets,
    }));
    return true;
  } catch { return false; }
}

export function readPinballSave(storage: PinballStorage | undefined): PinballState | undefined {
  try {
    const raw = storage?.getItem(PINBALL_SAVE_KEY);
    if (!raw) return undefined;
    const saved = JSON.parse(raw) as { score: number; level: number; lives: number; ballOnShooter: boolean; hitTargets: boolean[] };
    if (!Number.isInteger(saved.score) || saved.score < 0 || saved.score > 1e8
      || !Number.isInteger(saved.level) || saved.level < 1 || saved.level > 200001
      || !Number.isInteger(saved.lives) || saved.lives < 0 || saved.lives > 5
      || typeof saved.ballOnShooter !== 'boolean'
      || !Array.isArray(saved.hitTargets) || saved.hitTargets.length !== 3 || !saved.hitTargets.every(value => typeof value === 'boolean')) return undefined;
    return {
      ...createPinball(saved.score), level: saved.level, lives: Math.max(1, saved.lives), hitTargets: [...saved.hitTargets],
    };
  } catch { return undefined; }
}

export function deletePinballSave(storage: PinballStorage | undefined): boolean {
  try { if (!storage) return false; storage.removeItem(PINBALL_SAVE_KEY); return true; } catch { return false; }
}
