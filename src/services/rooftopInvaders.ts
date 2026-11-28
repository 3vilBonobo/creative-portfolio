export const INVADERS_WIDTH = 720;
export const INVADERS_HEIGHT = 440;
export const INVADERS_PLAYER_Y = 390;
export const INVADERS_SAVE_KEY = 'athens-arcade:invaders:v1';

export type InvaderStatus = 'ready' | 'playing' | 'paused' | 'won' | 'lost';
export type InvaderKind = 'scout' | 'glider' | 'commander';
export type InvaderEnemy = { id: number; x: number; y: number; row: number; kind: InvaderKind; hp: number };
export type InvaderShot = { x: number; y: number; vy: number };
export type InvaderEvent = 'hit' | 'life' | 'wave' | 'won' | 'lost';
export type InvadersState = {
  level: number;
  weaponLevel: 1 | 2 | 3;
  score: number;
  lives: number;
  playerX: number;
  enemies: InvaderEnemy[];
  playerShots: InvaderShot[];
  enemyShots: InvaderShot[];
  direction: 1 | -1;
  enemySpeed: number;
  fireCooldown: number;
  enemyFireTimer: number;
  invulnerability: number;
  status: InvaderStatus;
};
type SaveStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const finite = (value: unknown, low: number, high: number): value is number => typeof value === 'number' && Number.isFinite(value) && value >= low && value <= high;
export const invaderWeaponLevelForWave = (level: number): 1 | 2 | 3 => level >= 5 ? 3 : level >= 2 ? 2 : 1;
export const invaderEnemyVolleySize = (level: number): 1 | 2 | 3 => level >= 8 ? 3 : level >= 4 ? 2 : 1;

export function createInvaders(level = 1, score = 0, lives = 3, weaponLevel = invaderWeaponLevelForWave(level)): InvadersState {
  const columns = 5 + Math.floor((level - 1) / 2);
  const rows = 3 + Math.floor((level - 1) / 4);
  const gapX = 54, gapY = 42;
  const firstX = INVADERS_WIDTH / 2 - (columns - 1) * gapX / 2;
  const enemies: InvaderEnemy[] = [];
  for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
    enemies.push({
      id: row * columns + col,
      x: firstX + col * gapX,
      y: 76 + row * gapY,
      row,
      kind: row === 0 ? 'commander' : row === 1 ? 'glider' : 'scout',
      hp: level >= 6 && row === 0 ? 2 : 1,
    });
  }
  return {
    level, score, lives, weaponLevel: Math.max(weaponLevel, invaderWeaponLevelForWave(level)) as 1 | 2 | 3, playerX: INVADERS_WIDTH / 2,
    enemies, playerShots: [], enemyShots: [], direction: 1,
    enemySpeed: 34 + (level - 1) * 7,
    fireCooldown: 0, enemyFireTimer: 1.2 - Math.min(level - 1, 9) * .055,
    invulnerability: 0, status: 'ready',
  };
}

export function moveInvaderPlayer(state: InvadersState, axis: -1 | 0 | 1, dt: number) {
  state.playerX = Math.max(28, Math.min(INVADERS_WIDTH - 28, state.playerX + axis * 390 * dt));
}

export function aimInvaderPlayer(state: InvadersState, x: number) {
  if (Number.isFinite(x)) state.playerX = Math.max(28, Math.min(INVADERS_WIDTH - 28, x));
}

export function fireInvaderShot(state: InvadersState): boolean {
  const offsets = state.weaponLevel === 3 ? [-12, 0, 12] : state.weaponLevel === 2 ? [-9, 9] : [0];
  if (state.status !== 'playing' || state.fireCooldown > 0 || state.playerShots.length + offsets.length > 9) return false;
  for (const offset of offsets) state.playerShots.push({ x: state.playerX + offset, y: INVADERS_PLAYER_Y - 22, vy: -320 });
  state.fireCooldown = .18;
  return true;
}

export function stepInvaders(state: InvadersState, dt: number, random = Math.random): InvaderEvent[] {
  if (state.status !== 'playing' || dt <= 0) return [];
  const events: InvaderEvent[] = [];
  state.fireCooldown = Math.max(0, state.fireCooldown - dt);
  state.invulnerability = Math.max(0, state.invulnerability - dt);

  const nextEdge = state.enemies.map(enemy => enemy.x + state.direction * state.enemySpeed * dt);
  if (nextEdge.some(x => x < 38 || x > INVADERS_WIDTH - 38)) {
    state.direction = state.direction === 1 ? -1 : 1;
    state.enemies.forEach(enemy => { enemy.y += 13; });
  } else state.enemies.forEach((enemy, index) => { enemy.x = nextEdge[index]!; });
  if (state.enemies.some(enemy => enemy.y >= 345)) {
    state.status = 'lost'; events.push('lost'); return events;
  }

  for (const shot of state.playerShots) shot.y += shot.vy * dt;
  state.playerShots = state.playerShots.filter(shot => shot.y > 24);
  for (const shot of state.playerShots) {
    const target = state.enemies.find(enemy => Math.abs(enemy.x - shot.x) < 19 && Math.abs(enemy.y - shot.y) < 13);
    if (!target) continue;
    shot.y = -1;
    target.hp--;
    if (target.hp <= 0) {
      state.score += 10 + (3 - Math.min(target.row, 3)) * 5;
      state.enemies = state.enemies.filter(enemy => enemy.id !== target.id);
      events.push('hit');
    }
  }
  state.playerShots = state.playerShots.filter(shot => shot.y > 0);

  state.enemyFireTimer -= dt;
  if (state.enemyFireTimer <= 0 && state.enemies.length) {
    const columns = new Map<number, InvaderEnemy>();
    for (const enemy of state.enemies) {
      const col = Math.round((enemy.x - state.enemies[0]!.x) / 54);
      if (!columns.has(col) || columns.get(col)!.y < enemy.y) columns.set(col, enemy);
    }
    const shooters = [...columns.values()];
    const shooter = shooters[Math.min(shooters.length - 1, Math.floor(random() * shooters.length))]!;
    const enemyVolley = invaderEnemyVolleySize(state.level);
    const offsets = enemyVolley === 3 ? [-15, 0, 15] : enemyVolley === 2 ? [-10, 10] : [0];
    for (const offset of offsets) state.enemyShots.push({ x: shooter.x + offset, y: shooter.y + 13, vy: 175 + state.level * 13 });
    state.enemyFireTimer = Math.max(.48, 1.2 - Math.min(state.level - 1, 9) * .055) * (.8 + random() * .4);
  }
  for (const shot of state.enemyShots) shot.y += shot.vy * dt;
  state.enemyShots = state.enemyShots.filter(shot => shot.y < INVADERS_HEIGHT - 8);
  if (state.invulnerability <= 0) {
    const hit = state.enemyShots.find(shot => Math.abs(shot.x - state.playerX) < 18 && shot.y >= INVADERS_PLAYER_Y - 15 && shot.y <= INVADERS_PLAYER_Y + 8);
    if (hit) {
      hit.y = INVADERS_HEIGHT + 20;
      state.lives--;
      state.weaponLevel = Math.max(1, state.weaponLevel - 1) as 1 | 2 | 3;
      state.playerX = INVADERS_WIDTH / 2;
      state.invulnerability = 1.1;
      state.enemyShots = state.enemyShots.filter(shot => shot.y <= INVADERS_HEIGHT);
      events.push('life');
      if (state.lives <= 0) { state.status = 'lost'; events.push('lost'); return events; }
    }
  }

  if (state.enemies.length === 0) {
    if (state.level >= 10) {
      state.score += 500;
      state.status = 'won'; events.push('won');
    } else {
      state.score += state.level * 100;
      const next = createInvaders(state.level + 1, state.score, state.lives, state.weaponLevel);
      Object.assign(state, next);
      events.push('wave');
    }
  }
  return events;
}

export function readInvadersSave(storage: SaveStorage | undefined): InvadersState | undefined {
  try {
    const raw = storage?.getItem(INVADERS_SAVE_KEY);
    if (!raw) return undefined;
    const data = JSON.parse(raw) as Partial<InvadersState> & { invaders?: { enemies?: unknown[] }; version?: number };
    // The previous placeholder saved only a shared level and score. Migrate that progress to a clean wave.
    if (!Array.isArray(data.enemies) && data.invaders && Number.isInteger(data.level) && Number.isInteger(data.score)) {
      const legacy = createInvaders(Math.max(1, Math.min(10, data.level!)), Math.max(0, data.score!));
      return { ...legacy, status: 'paused' };
    }
    if (data.version !== 1 || !Number.isInteger(data.level) || data.level! < 1 || data.level! > 10
      || !Number.isInteger(data.score) || data.score! < 0 || data.score! > 1e7
      || !Number.isInteger(data.lives) || data.lives! < 1 || data.lives! > 3
      || !finite(data.playerX, 28, INVADERS_WIDTH - 28)
      || !Array.isArray(data.enemies) || data.enemies.length > 45
      || data.weaponLevel !== undefined && (!Number.isInteger(data.weaponLevel) || data.weaponLevel < 1 || data.weaponLevel > 3)
      || !Array.isArray(data.playerShots) || data.playerShots.length > 9
      || !Array.isArray(data.enemyShots) || data.enemyShots.length > 20
      || data.direction !== 1 && data.direction !== -1
      || !finite(data.enemySpeed, 1, 250) || !finite(data.fireCooldown, 0, 1)
      || !finite(data.enemyFireTimer, 0, 3) || !finite(data.invulnerability, 0, 2)
      || !['ready','playing','paused','won','lost'].includes(data.status ?? '')) return undefined;
    if (data.enemies.some(enemy => !enemy || !Number.isInteger(enemy.id) || !finite(enemy.x, 0, INVADERS_WIDTH) || !finite(enemy.y, 0, INVADERS_HEIGHT)
      || !Number.isInteger(enemy.row) || enemy.row! < 0 || enemy.row! > 4 || !['scout','glider','commander'].includes(enemy.kind ?? '') || !Number.isInteger(enemy.hp) || enemy.hp! < 1 || enemy.hp! > 2)
      || [...data.playerShots, ...data.enemyShots].some(shot => !shot || !finite(shot.x, 0, INVADERS_WIDTH) || !finite(shot.y, -10, INVADERS_HEIGHT) || !finite(shot.vy, -500, 500))) return undefined;
    return { ...data as InvadersState, weaponLevel: (data.weaponLevel ?? invaderWeaponLevelForWave(data.level!)) as 1 | 2 | 3, status: data.status === 'playing' ? 'paused' : data.status! };
  } catch { return undefined; }
}

export function saveInvaders(storage: SaveStorage | undefined, state: InvadersState): boolean {
  try {
    if (!storage) return false;
    storage.setItem(INVADERS_SAVE_KEY, JSON.stringify({ version: 1, ...state, status: state.status === 'playing' ? 'paused' : state.status }));
    return true;
  } catch { return false; }
}

export function deleteInvadersSave(storage: SaveStorage | undefined): boolean {
  try { if (!storage) return false; storage.removeItem(INVADERS_SAVE_KEY); return true; } catch { return false; }
}
