export const COURIER_WIDTH = 720;
export const COURIER_HEIGHT = 440;
export const COURIER_SAVE_KEY = 'athens-arcade:asteroids:v1';

export type CourierRockSize = 'large' | 'medium' | 'small';
export type CourierRock = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  spin: number;
  size: CourierRockSize;
  points: string;
};
export type CourierShot = { id: number; x: number; y: number; vx: number; vy: number; life: number };
export type CourierState = {
  level: number;
  score: number;
  lives: number;
  invulnerability: number;
  fireCooldown: number;
  ship: { x: number; y: number; angle: number; vx: number; vy: number };
  rocks: CourierRock[];
  shots: CourierShot[];
  nextId: number;
  thrusting: boolean;
};
export type CourierInput = { left?: boolean; right?: boolean; thrust?: boolean; fire?: boolean; aim?: { x: number; y: number } };
export type CourierEvents = { hit: number; lifeLost: boolean; waveCleared: boolean; gameOver: boolean };
type CourierStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const SIZE_RADIUS: Record<CourierRockSize, number> = { large: 27, medium: 16, small: 9 };
const NEXT_SIZE: Partial<Record<CourierRockSize, CourierRockSize>> = { large: 'medium', medium: 'small' };
const ROCK_SCORE: Record<CourierRockSize, number> = { large: 20, medium: 50, small: 100 };
const wrap = (value: number, extent: number) => ((value % extent) + extent) % extent;
const randomUnit = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

function rockPoints(seed: number, radius: number): string {
  const count = 10;
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    const length = radius * (0.72 + randomUnit(seed * 19 + index * 7) * 0.28);
    return `${(Math.cos(angle) * length).toFixed(1)},${(Math.sin(angle) * length).toFixed(1)}`;
  }).join(' ');
}

function createRock(state: CourierState, size: CourierRockSize, x: number, y: number, angle: number, speed: number): CourierRock {
  const id = state.nextId++;
  const radius = SIZE_RADIUS[size];
  return {
    id, x: wrap(x, COURIER_WIDTH), y: wrap(y, COURIER_HEIGHT),
    vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
    radius, rotation: randomUnit(id * 3) * 360, spin: (randomUnit(id * 11) - 0.5) * 60,
    size, points: rockPoints(id, radius),
  };
}

function seedWave(state: CourierState): void {
  // Keep the stream endless: add rocks logarithmically, and let their speed
  // continue to rise slowly after the field reaches its practical size limit.
  const count = Math.min(14, 4 + Math.ceil(Math.log2(state.level) * 2));
  const speedScale = 1 + Math.log2(state.level) * 0.09;
  state.rocks = Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count + Math.PI / count;
    const x = COURIER_WIDTH / 2 + Math.cos(angle) * 238;
    const y = COURIER_HEIGHT / 2 + Math.sin(angle) * 156;
    const drift = index * 1.83 + state.level * 0.71;
    const speed = (38 + (index % 3) * 10) * speedScale;
    return createRock(state, 'large', x, y, drift, speed);
  });
}

export function createCourier(level = 1, score = 0): CourierState {
  const state: CourierState = {
    level: Math.max(1, Math.floor(level)), score: Math.max(0, Math.floor(score)), lives: 3,
    invulnerability: 0, fireCooldown: 0,
    ship: { x: COURIER_WIDTH / 2, y: COURIER_HEIGHT / 2, angle: -Math.PI / 2, vx: 0, vy: 0 },
    rocks: [], shots: [], nextId: 1, thrusting: false,
  };
  seedWave(state);
  return state;
}

function fire(state: CourierState): void {
  if (state.fireCooldown > 0 || state.shots.length >= 5) return;
  const { ship } = state;
  const speed = 430;
  state.shots.push({
    id: state.nextId++,
    x: wrap(ship.x + Math.cos(ship.angle) * 15, COURIER_WIDTH),
    y: wrap(ship.y + Math.sin(ship.angle) * 15, COURIER_HEIGHT),
    vx: Math.cos(ship.angle) * speed + ship.vx * 0.25,
    vy: Math.sin(ship.angle) * speed + ship.vy * 0.25,
    life: 1.15,
  });
  state.fireCooldown = 0.2;
}

function splitRock(state: CourierState, rock: CourierRock): void {
  const childSize = NEXT_SIZE[rock.size];
  if (!childSize) return;
  const baseAngle = Math.atan2(rock.vy, rock.vx);
  const speed = Math.max(65, Math.hypot(rock.vx, rock.vy) + 28);
  for (const direction of [-1, 1]) {
    const angle = baseAngle + direction * (0.72 + randomUnit(rock.id * 5 + direction) * 0.42);
    const offset = SIZE_RADIUS[childSize] * 0.8;
    state.rocks.push(createRock(state, childSize,
      rock.x + Math.cos(angle) * offset,
      rock.y + Math.sin(angle) * offset,
      angle, speed));
  }
}

function toroidalDistance(ax: number, ay: number, bx: number, by: number): number {
  const dx = Math.min(Math.abs(ax - bx), COURIER_WIDTH - Math.abs(ax - bx));
  const dy = Math.min(Math.abs(ay - by), COURIER_HEIGHT - Math.abs(ay - by));
  return Math.hypot(dx, dy);
}

export function stepCourier(state: CourierState, input: CourierInput, dt: number): CourierEvents {
  const events: CourierEvents = { hit: 0, lifeLost: false, waveCleared: false, gameOver: false };
  const elapsed = Math.max(0, Math.min(dt, 0.05));
  if (elapsed === 0) return events;
  state.fireCooldown = Math.max(0, state.fireCooldown - elapsed);
  state.invulnerability = Math.max(0, state.invulnerability - elapsed);
  state.thrusting = !!input.thrust;
  if (input.left) state.ship.angle -= 3.8 * elapsed;
  if (input.right) state.ship.angle += 3.8 * elapsed;
  if (input.aim) {
    const dx = input.aim.x - state.ship.x;
    const dy = input.aim.y - state.ship.y;
    if (dx * dx + dy * dy > 12) state.ship.angle = Math.atan2(dy, dx);
  }
  if (input.thrust) {
    state.ship.vx += Math.cos(state.ship.angle) * 205 * elapsed;
    state.ship.vy += Math.sin(state.ship.angle) * 205 * elapsed;
  }
  const damping = Math.exp(-0.22 * elapsed);
  state.ship.vx *= damping;
  state.ship.vy *= damping;
  const speed = Math.hypot(state.ship.vx, state.ship.vy);
  const maxSpeed = 240;
  if (speed > maxSpeed) {
    state.ship.vx = (state.ship.vx / speed) * maxSpeed;
    state.ship.vy = (state.ship.vy / speed) * maxSpeed;
  }
  state.ship.x = wrap(state.ship.x + state.ship.vx * elapsed, COURIER_WIDTH);
  state.ship.y = wrap(state.ship.y + state.ship.vy * elapsed, COURIER_HEIGHT);
  if (input.fire) fire(state);

  for (const rock of state.rocks) {
    rock.x = wrap(rock.x + rock.vx * elapsed, COURIER_WIDTH);
    rock.y = wrap(rock.y + rock.vy * elapsed, COURIER_HEIGHT);
    rock.rotation = (rock.rotation + rock.spin * elapsed + 360) % 360;
  }
  for (const shot of state.shots) {
    shot.x = wrap(shot.x + shot.vx * elapsed, COURIER_WIDTH);
    shot.y = wrap(shot.y + shot.vy * elapsed, COURIER_HEIGHT);
    shot.life -= elapsed;
  }
  state.shots = state.shots.filter(shot => shot.life > 0);

  for (const shot of [...state.shots]) {
    const rockIndex = state.rocks.findIndex(rock => toroidalDistance(shot.x, shot.y, rock.x, rock.y) <= rock.radius + 3);
    if (rockIndex < 0) continue;
    const [rock] = state.rocks.splice(rockIndex, 1);
    state.shots = state.shots.filter(liveShot => liveShot.id !== shot.id);
    if (!rock) continue;
    state.score += ROCK_SCORE[rock.size];
    events.hit++;
    splitRock(state, rock);
  }

  if (state.rocks.length === 0) {
    state.level++;
    seedWave(state);
    events.waveCleared = true;
  }

  if (state.invulnerability === 0 && state.rocks.some(rock => toroidalDistance(state.ship.x, state.ship.y, rock.x, rock.y) <= rock.radius + 10)) {
    state.lives--;
    events.lifeLost = true;
    if (state.lives <= 0) {
      state.lives = 0;
      events.gameOver = true;
    } else {
      state.ship = { x: COURIER_WIDTH / 2, y: COURIER_HEIGHT / 2, angle: -Math.PI / 2, vx: 0, vy: 0 };
      state.invulnerability = 2.8;
    }
  }
  return events;
}

export function saveCourier(storage: CourierStorage | undefined, state: CourierState): boolean {
  try {
    if (!storage) return false;
    const { thrusting: _thrusting, ...saved } = state;
    storage.setItem(COURIER_SAVE_KEY, JSON.stringify(saved));
    return true;
  } catch { return false; }
}

export function readCourierSave(storage: CourierStorage | undefined): CourierState | undefined {
  try {
    const raw = storage?.getItem(COURIER_SAVE_KEY);
    if (!raw) return undefined;
    const saved = JSON.parse(raw) as CourierState;
    if (!Number.isInteger(saved.level) || saved.level < 1 || saved.level > 100000
      || !Number.isInteger(saved.score) || saved.score < 0 || saved.score > 1e8
      || !Number.isInteger(saved.lives) || saved.lives < 0 || saved.lives > 3
      || !Number.isFinite(saved.ship?.x) || !Number.isFinite(saved.ship?.y)
      || !Number.isFinite(saved.ship?.angle) || !Number.isFinite(saved.ship?.vx) || !Number.isFinite(saved.ship?.vy)
      || !Array.isArray(saved.rocks) || saved.rocks.length < 1 || saved.rocks.length > 80
      || !Array.isArray(saved.shots) || saved.shots.length > 5
      || !saved.rocks.every(rock => ['large','medium','small'].includes(rock.size)
        && [rock.x,rock.y,rock.vx,rock.vy,rock.radius,rock.rotation,rock.spin].every(Number.isFinite)
        && typeof rock.points === 'string' && rock.points.length < 500)
      || !saved.shots.every(shot => [shot.x,shot.y,shot.vx,shot.vy,shot.life].every(Number.isFinite))) return undefined;
    return {
      ...saved,
      // A finished run can be continued from its current wave after reload.
      lives: Math.max(1, saved.lives),
      ship: { ...saved.ship },
      rocks: saved.rocks.map(rock => ({ ...rock })),
      shots: saved.shots.map(shot => ({ ...shot })),
      invulnerability: 0,
      fireCooldown: 0,
      thrusting: false,
    };
  } catch { return undefined; }
}

export function deleteCourierSave(storage: CourierStorage | undefined): boolean {
  try { if (!storage) return false; storage.removeItem(COURIER_SAVE_KEY); return true; } catch { return false; }
}
