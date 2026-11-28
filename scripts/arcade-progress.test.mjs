import test from 'node:test';
import assert from 'node:assert/strict';
import { BREAKOUT_LEVELS } from '../src/data/breakoutLevels.ts';
import { createBreakout } from '../src/services/neonBreakout.ts';
import { BREAKOUT_SAVE_KEY, readArcadeProgress, saveArcadeProgress, deleteArcadeProgress } from '../src/services/arcadeProgress.ts';

test('local save restores the exact board paused and deletes only its own key', () => {
  const entries = new Map([['other-game', 'keep']]);
  const storage = { getItem: key => entries.get(key), setItem: (key, value) => entries.set(key, value), removeItem: key => entries.delete(key) };
  const game = createBreakout(4, BREAKOUT_LEVELS[3]); game.status = 'playing'; game.score = 500;
  assert.equal(saveArcadeProgress(storage, game), true);
  const restored = readArcadeProgress(storage, BREAKOUT_LEVELS).state;
  assert.deepEqual(restored, { ...game, status: 'paused' });
  assert.equal(game.status, 'playing', 'saving never pauses the live simulation');
  assert.equal(deleteArcadeProgress(storage), true);
  assert.equal(entries.has(BREAKOUT_SAVE_KEY), false); assert.equal(entries.get('other-game'), 'keep');
});
test('malformed, incompatible and inconsistent saves fail safely', () => {
  const game = createBreakout(1, BREAKOUT_LEVELS[0]);
  for (const mutate of [state => state.level = 99, state => state.x = null, state => state.bricks.pop(), state => state.bricks[0].x = 0, state => state.status = 'won', state => state.lives = 0]) {
    const state = structuredClone(game); mutate(state);
    assert.equal(readArcadeProgress({getItem: () => JSON.stringify({version:1, game:state})}, BREAKOUT_LEVELS).state, undefined);
  }
  assert.match(readArcadeProgress({getItem: () => '{broken'}, BREAKOUT_LEVELS).message, /could not/);
  assert.equal(saveArcadeProgress(undefined, game), false);
  assert.equal(deleteArcadeProgress({removeItem: () => { throw new Error(); }}), false);
});
