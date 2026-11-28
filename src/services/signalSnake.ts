export const SNAKE_COLUMNS = 18;
export const SNAKE_ROWS = 11;
export const SNAKE_TICK_SECONDS = 0.22;
export const snakeTickSeconds = (level: number) => Math.max(0.145, SNAKE_TICK_SECONDS - (level - 1) * 0.004);
export const SNAKE_SAVE_KEY = 'athens-arcade:snake:v1';

export type SnakeDirection = 'up' | 'down' | 'left' | 'right';
export type SnakeCell = { x: number; y: number };
export type SnakeState = {
  level: number;
  score: number;
  body: SnakeCell[];
  direction: SnakeDirection;
  queuedDirection: SnakeDirection;
  food: SnakeCell;
  obstacles: SnakeCell[];
  snacksThisLevel: number;
  status: 'ready' | 'playing' | 'paused' | 'won' | 'lost';
};
type SaveStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const opposite: Record<SnakeDirection, SnakeDirection> = { up: 'down', down: 'up', left: 'right', right: 'left' };
const delta: Record<SnakeDirection, SnakeCell> = { up: {x:0,y:-1}, down: {x:0,y:1}, left: {x:-1,y:0}, right: {x:1,y:0} };
const sectors = [
  { name: 'Monastiraki', obstacles: [] },
  { name: 'Psyrri', obstacles: [{x:8,y:3},{x:9,y:3},{x:8,y:7},{x:9,y:7}] },
  { name: 'Syntagma', obstacles: [{x:3,y:2},{x:4,y:2},{x:13,y:8},{x:14,y:8},{x:8,y:3},{x:9,y:7}] },
  { name: 'Exarchia', obstacles: [{x:4,y:2},{x:5,y:2},{x:12,y:8},{x:13,y:8},{x:8,y:3},{x:9,y:3},{x:8,y:7},{x:9,y:7}] },
  { name: 'Gazi', obstacles: [{x:2,y:3},{x:3,y:3},{x:14,y:7},{x:15,y:7},{x:6,y:2},{x:11,y:8},{x:8,y:3},{x:9,y:3},{x:8,y:7},{x:9,y:7}] },
  { name: 'Piraeus', obstacles: [{x:2,y:3},{x:3,y:3},{x:14,y:7},{x:15,y:7},{x:5,y:2},{x:6,y:2},{x:11,y:8},{x:12,y:8},{x:8,y:3},{x:9,y:3},{x:8,y:7},{x:9,y:7}] },
  { name: 'Kolonaki', obstacles: [{x:2,y:3},{x:3,y:3},{x:14,y:7},{x:15,y:7},{x:5,y:2},{x:6,y:2},{x:11,y:8},{x:12,y:8},{x:8,y:3},{x:9,y:3},{x:8,y:7},{x:9,y:7},{x:2,y:7},{x:15,y:3}] },
  { name: 'Lycabettus', obstacles: [{x:2,y:3},{x:3,y:3},{x:14,y:7},{x:15,y:7},{x:5,y:2},{x:6,y:2},{x:11,y:8},{x:12,y:8},{x:8,y:3},{x:9,y:3},{x:8,y:7},{x:9,y:7},{x:2,y:7},{x:15,y:3},{x:5,y:8},{x:12,y:2}] },
  { name: 'Acropolis', obstacles: [{x:2,y:3},{x:3,y:3},{x:14,y:7},{x:15,y:7},{x:5,y:2},{x:6,y:2},{x:11,y:8},{x:12,y:8},{x:8,y:3},{x:9,y:3},{x:8,y:7},{x:9,y:7},{x:2,y:7},{x:15,y:3},{x:5,y:8},{x:12,y:2},{x:6,y:7},{x:11,y:3}] },
  { name: 'Athens', obstacles: [{x:2,y:3},{x:3,y:3},{x:14,y:7},{x:15,y:7},{x:5,y:2},{x:6,y:2},{x:11,y:8},{x:12,y:8},{x:8,y:3},{x:9,y:3},{x:8,y:7},{x:9,y:7},{x:2,y:7},{x:15,y:3},{x:5,y:8},{x:12,y:2},{x:6,y:7},{x:11,y:3},{x:4,y:7},{x:13,y:3}] },
] as const;
export const SNAKE_LEVELS = sectors.map((sector, i) => ({ ...sector, number: i + 1, target: 10 + Math.floor(i / 2) * 2 }));
export const snakeLevel = (level: number) => {
  const number = Math.max(1, Math.floor(level));
  const template = SNAKE_LEVELS[(number - 1) % SNAKE_LEVELS.length]!;
  if (number <= SNAKE_LEVELS.length) return template;
  const cycle = Math.floor((number - 1) / SNAKE_LEVELS.length);
  const obstacles = template.obstacles.map(({ x, y }) => ({ x: cycle % 2 ? SNAKE_COLUMNS - x - 1 : x, y }));
  return { ...template, name: `${template.name} ${cycle + 1}`, number, obstacles, target: Math.min(40, 18 + Math.floor((number - 10) / 2) * 2) };
};

function makeFood(body: SnakeCell[], obstacles: SnakeCell[], random: () => number): SnakeCell {
  const occupied = new Set([...body, ...obstacles].map(cell => `${cell.x},${cell.y}`));
  const free: SnakeCell[] = [];
  for (let y = 0; y < SNAKE_ROWS; y++) for (let x = 0; x < SNAKE_COLUMNS; x++) if (!occupied.has(`${x},${y}`)) free.push({x,y});
  return free[Math.min(free.length - 1, Math.floor(random() * free.length))] ?? {x:0,y:0};
}
export function createSnake(level = 1, score = 0, random = Math.random): SnakeState {
  const body = [{x:5,y:5},{x:4,y:5},{x:3,y:5}];
  const obstacles = [...snakeLevel(level).obstacles];
  return { level, score, body, direction:'right', queuedDirection:'right', food:makeFood(body, obstacles, random), obstacles, snacksThisLevel:0, status:'ready' };
}
export function steerSnake(state: SnakeState, direction: SnakeDirection): boolean {
  if (direction === opposite[state.direction] || direction === opposite[state.queuedDirection]) return false;
  state.queuedDirection = direction;
  return true;
}
export function stepSnake(state: SnakeState, random = Math.random): 'moved' | 'snack' | 'sector' | 'won' | 'lost' | 'idle' {
  if (state.status !== 'playing') return 'idle';
  state.direction = state.queuedDirection;
  const move = delta[state.direction];
  const head = {x:state.body[0]!.x + move.x, y:state.body[0]!.y + move.y};
  const eating = head.x === state.food.x && head.y === state.food.y;
  const occupied = eating ? state.body : state.body.slice(0, -1);
  if (head.x < 0 || head.y < 0 || head.x >= SNAKE_COLUMNS || head.y >= SNAKE_ROWS
    || occupied.some(cell => cell.x === head.x && cell.y === head.y)
    || state.obstacles.some(cell => cell.x === head.x && cell.y === head.y)) {
    state.status = 'lost'; return 'lost';
  }
  state.body.unshift(head);
  if (!eating) { state.body.pop(); return 'moved'; }
  state.score += 10;
  state.snacksThisLevel++;
  if (state.snacksThisLevel >= snakeLevel(state.level)!.target) {
    state.level++;
    state.obstacles = [...snakeLevel(state.level)!.obstacles];
    state.body = [{x:5,y:5},{x:4,y:5},{x:3,y:5}];
    state.direction = state.queuedDirection = 'right';
    state.snacksThisLevel = 0;
    state.food = makeFood(state.body, state.obstacles, random);
    state.status = 'ready';
    return 'sector';
  }
  state.food = makeFood(state.body, state.obstacles, random);
  return 'snack';
}

export function readSnakeSave(storage: SaveStorage | undefined): SnakeState | undefined {
  try {
    const raw = storage?.getItem(SNAKE_SAVE_KEY);
    if (!raw) return undefined;
    const state = JSON.parse(raw) as SnakeState;
    const validCell = (cell: SnakeCell) => cell && Number.isInteger(cell.x) && Number.isInteger(cell.y) && cell.x >= 0 && cell.x < SNAKE_COLUMNS && cell.y >= 0 && cell.y < SNAKE_ROWS;
    if (!Number.isInteger(state.level) || state.level < 1 || state.level > 100000 || !Number.isInteger(state.score) || state.score < 0 || state.score > 1e7
      || !Array.isArray(state.body) || state.body.length < 3 || state.body.length > SNAKE_COLUMNS * SNAKE_ROWS || !state.body.every(validCell)
      || !Array.isArray(state.obstacles) || !state.obstacles.every(validCell) || !validCell(state.food)
      || !['up','down','left','right'].includes(state.direction) || !['up','down','left','right'].includes(state.queuedDirection)
      || !Number.isInteger(state.snacksThisLevel) || state.snacksThisLevel < 0 || state.snacksThisLevel >= snakeLevel(state.level)!.target
      || !['ready','playing','paused','won','lost'].includes(state.status)) return undefined;
    const expectedObstacles = snakeLevel(state.level)!.obstacles;
    const bodyCells = new Set(state.body.map(cell => `${cell.x},${cell.y}`));
    const obstacleCells = new Set(state.obstacles.map(cell => `${cell.x},${cell.y}`));
    if (bodyCells.size !== state.body.length || obstacleCells.size !== state.obstacles.length
      || JSON.stringify(state.obstacles) !== JSON.stringify(expectedObstacles)
      || state.body.some(cell => obstacleCells.has(`${cell.x},${cell.y}`))
      || bodyCells.has(`${state.food.x},${state.food.y}`) || obstacleCells.has(`${state.food.x},${state.food.y}`)
      || state.status === 'won' && (state.level !== SNAKE_LEVELS.length || state.snacksThisLevel !== snakeLevel(state.level)!.target)) return undefined;
    return { ...state, status: state.status === 'playing' ? 'paused' : state.status };
  } catch { return undefined; }
}
export function saveSnake(storage: SaveStorage | undefined, state: SnakeState): boolean {
  try {
    if (!storage) return false;
    storage.setItem(SNAKE_SAVE_KEY, JSON.stringify({ ...state, status: state.status === 'playing' ? 'paused' : state.status }));
    return true;
  } catch { return false; }
}
export function deleteSnakeSave(storage: SaveStorage | undefined): boolean {
  try { if (!storage) return false; storage.removeItem(SNAKE_SAVE_KEY); return true; } catch { return false; }
}
