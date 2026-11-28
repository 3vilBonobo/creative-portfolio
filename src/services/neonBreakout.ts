import type { BreakoutLevel } from '../data/breakoutLevels';
import { breakoutLevel } from './breakoutDifficulty.mjs';
export const COURT = { width: 720, height: 440, paddleY: 398, radius: 7 } as const;
export type BreakoutStatus = 'ready' | 'playing' | 'paused' | 'cleared' | 'lost' | 'won';
export interface NeonBrick { x: number; y: number; alive: boolean; row: number; health: number }
export interface BreakoutState {
  x: number; y: number; vx: number; vy: number; paddle: number; paddleWidth: number; level: number;
  score: number; lives: number; status: BreakoutStatus; bricks: NeonBrick[];
}
export function createBreakout(level = 1, definition?: BreakoutLevel): BreakoutState {
  const layout = definition?.layout ?? ['11111111','11111111','11111111','11111111','11111111'];
  const speed = definition?.speed ?? 310;
  return { level, x: 360, y: 385, vx: speed * .55, vy: -speed * Math.sqrt(1 - .55 ** 2), paddle: 360,
    paddleWidth: definition?.paddleWidth ?? 100, score: 0, lives: 3, status: 'ready',
    bricks: layout.flatMap((row, r) => [...row].map((cell, c) => ({ x: 38 + c * 82, y: 62 + r * 29, alive: cell !== '0', row: r, health: Number(cell) }))) };
}
export function movePaddle(state: BreakoutState, x: number) {
  const half = state.paddleWidth / 2;
  state.paddle = Math.max(half, Math.min(720 - half, x));
  if (state.status === 'ready') { state.x = state.paddle; state.y = 385; }
}
export function launchBreakout(state: BreakoutState) {
  if (state.status === 'ready' || state.status === 'paused') state.status = 'playing';
}
export function advanceBreakout(state: BreakoutState, levels: BreakoutLevel[] = []) {
  if (state.status !== 'cleared') return;
  const score = state.score, lives = state.lives;
  Object.assign(state, createBreakout(state.level + 1, breakoutLevel(state.level + 1, levels)));
  state.score = score; state.lives = lives;
}
// Small steps prevent the ball crossing thin bricks between rendered frames.
export function stepBreakout(state: BreakoutState, elapsed: number, _totalLevels = 1) {
  if (state.status !== 'playing') return;
  let remaining = Math.min(Math.max(elapsed, 0), .05);
  while (remaining > 0 && state.status === 'playing') {
    const dt = Math.min(remaining, 1 / 240); remaining -= dt;
    const oldY = state.y;
    state.x += state.vx * dt; state.y += state.vy * dt;
    if (state.x < 7 || state.x > 713) { state.x = Math.max(7, Math.min(713, state.x)); state.vx *= -1; }
    if (state.y < 7) { state.y = 7; state.vy = Math.abs(state.vy); }
    const half = state.paddleWidth / 2;
    if (state.vy > 0 && oldY + 7 <= COURT.paddleY && state.y + 7 >= COURT.paddleY && Math.abs(state.x - state.paddle) <= half + 7) {
      const angle = Math.max(-1, Math.min(1, (state.x - state.paddle) / half)) * 1.05;
      const speed = Math.min(480, Math.hypot(state.vx, state.vy) + 5);
      state.vx = Math.sin(angle) * speed; state.vy = -Math.cos(angle) * speed; state.y = 391;
    }
    for (const brick of state.bricks) {
      if (!brick.alive || state.x + 7 < brick.x || state.x - 7 > brick.x + 70 || state.y + 7 < brick.y || state.y - 7 > brick.y + 18) continue;
      brick.health -= 1;
      if (brick.health === 0) { brick.alive = false; state.score += 25; }
      if (oldY + 7 <= brick.y) { state.y = brick.y - 7; state.vy = -Math.abs(state.vy); }
      else if (oldY - 7 >= brick.y + 18) { state.y = brick.y + 25; state.vy = Math.abs(state.vy); }
      else { state.x = state.vx > 0 ? brick.x - 7 : brick.x + 77; state.vx *= -1; }
      if (state.bricks.every(item => !item.alive)) state.status = 'cleared';
      break;
    }
    if (state.y > 460) {
      state.lives -= 1; state.status = state.lives ? 'ready' : 'lost';
      const speed = Math.hypot(state.vx, state.vy);
      state.vx = speed * .55; state.vy = -speed * Math.sqrt(1 - .55 ** 2); state.x = state.paddle; state.y = 385;
    }
  }
}
