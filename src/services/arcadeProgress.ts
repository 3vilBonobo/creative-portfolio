import type { BreakoutLevel } from '../data/breakoutLevels';
import type { BreakoutState } from './neonBreakout';

export const BREAKOUT_SAVE_KEY = 'athens-arcade:breakout:v1';
type SaveStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const finite = (value: unknown, low: number, high: number): value is number => typeof value === 'number' && Number.isFinite(value) && value >= low && value <= high;
export function readArcadeProgress(storage: SaveStorage | undefined, levels: BreakoutLevel[]): { state?: BreakoutState; message?: string } {
  try {
    if (!storage) return { message: 'Local storage is unavailable. You can still play.' };
    const raw = storage.getItem(BREAKOUT_SAVE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw), state = data.game as BreakoutState;
    if (data.version !== 1 || !state || !Number.isInteger(state.level) || !levels[state.level - 1]) throw new Error();
    const definition = levels[state.level - 1]!;
    if (state.paddleWidth !== definition.paddleWidth || !finite(state.paddle, state.paddleWidth / 2, 720 - state.paddleWidth / 2)
      || !finite(state.x, 0, 720) || !finite(state.y, 0, 461) || !finite(state.vx, -600, 600) || !finite(state.vy, -600, 600)
      || Math.hypot(state.vx, state.vy) < 100 || Math.hypot(state.vx, state.vy) > 600
      || !Number.isInteger(state.score) || !finite(state.score, 0, 1000000) || !Number.isInteger(state.lives) || !finite(state.lives, 0, 3)
      || !['ready','playing','paused','cleared','lost','won'].includes(state.status)
      || !Array.isArray(state.bricks) || state.bricks.length !== definition.layout.length * 8) throw new Error();
    if (state.bricks.some((brick, i) => !brick || brick.x !== 38 + i % 8 * 82 || brick.y !== 62 + Math.floor(i / 8) * 29
      || brick.row !== Math.floor(i / 8) || !Number.isInteger(brick.health)
      || !finite(brick.health, 0, Number(definition.layout[Math.floor(i / 8)]![i % 8])) || brick.alive !== (brick.health > 0))) throw new Error();
    const complete = state.bricks.every(brick => !brick.alive);
    if ((state.status === 'lost') !== (state.lives === 0)
      || complete !== ['cleared','won'].includes(state.status)
      || state.status === 'won' && state.level !== levels.length
      || state.status === 'cleared' && state.level === levels.length) throw new Error();
    return { state: { ...state, status: state.status === 'playing' ? 'paused' : state.status } };
  } catch { return { message: 'Saved progress could not be loaded. Start a fresh game or delete the save.' }; }
}
export function saveArcadeProgress(storage: SaveStorage | undefined, state: BreakoutState) {
  try {
    if (!storage) return false;
    storage.setItem(BREAKOUT_SAVE_KEY, JSON.stringify({ version: 1, game: { ...state, status: state.status === 'playing' ? 'paused' : state.status } }));
    return true;
  } catch { return false; }
}
export function deleteArcadeProgress(storage: SaveStorage | undefined) {
  try { if (!storage) return false; storage.removeItem(BREAKOUT_SAVE_KEY); return true; } catch { return false; }
}
