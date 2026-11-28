import test from 'node:test';
import assert from 'node:assert/strict';
import { createPinball, deletePinballSave, launchPinball, readPinballSave, savePinball, stepPinball, PINBALL_SAVE_KEY } from '../src/services/midnightPinball.ts';

test('the shooter launches once and the ball accelerates under gravity', () => {
  const game = createPinball();
  assert.equal(launchPinball(game), true);
  assert.equal(launchPinball(game), false);
  assert.equal(game.ballInShooterLane, true);
  const vy = game.ball.vy;
  stepPinball(game, {}, 0.05);
  assert.ok(game.ball.y < 666);
  assert.ok(game.ball.vy > vy);
});

test('the two flippers are independent and return the ball up-table', () => {
  const game = createPinball();
  game.ballOnShooter = false;
  game.ball = { x: 192, y: 610, vx: 0, vy: 120 };
  const left = stepPinball(game, { left: true }, 0.016);
  assert.equal(left.flipperHit, true);
  assert.ok(game.ball.vy < 0);
  assert.ok(game.score > 0);
  assert.equal(game.leftFlipper, true);
  assert.equal(game.rightFlipper, false);
});

test('bumpers kick the ball away, flash, and award score', () => {
  const game = createPinball();
  game.ballOnShooter = false;
  game.ball = { x: 220, y: 380, vx: 0, vy: -40 };
  const events = stepPinball(game, {}, 0.016);
  assert.equal(events.bumperHits, 1);
  assert.equal(game.score, 100);
  assert.ok(game.bumperFlash[1] > 0);
});

test('a center drain costs one ball and the final drain ends the run', () => {
  const game = createPinball();
  game.ballOnShooter = false;
  game.ball = { x: 220, y: 685, vx: 0, vy: 500 };
  const drain = stepPinball(game, {}, 0.04);
  assert.equal(drain.drain, true);
  assert.equal(game.lives, 2);
  assert.equal(game.ballOnShooter, true);
  game.lives = 1;
  game.ballOnShooter = false;
  game.ball = { x: 220, y: 685, vx: 0, vy: 500 };
  assert.equal(stepPinball(game, {}, 0.04).gameOver, true);
  assert.equal(game.lives, 0);
});

test('the three neighborhood targets complete a combo and earn a ball', () => {
  const game = createPinball();
  game.ballOnShooter = false;
  game.ball = { x: 104, y: 451, vx: 0, vy: 100 };
  assert.equal(stepPinball(game, {}, 0.016).targetHits, 1);
  game.ball = { x: 220, y: 468, vx: 0, vy: 100 };
  assert.equal(stepPinball(game, {}, 0.016).targetHits, 1);
  game.ball = { x: 328, y: 451, vx: 0, vy: 100 };
  const combo = stepPinball(game, {}, 0.016);
  assert.equal(combo.streetCombo, true);
  assert.equal(game.lives, 4);
  assert.equal(game.hitTargets.every(hit => !hit), true);
});

test('pinball saves restore at the plunger and can be deleted', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const game = createPinball(620);
  game.lives = 0;
  assert.equal(savePinball(storage, game), true);
  const restored = readPinballSave(storage);
  assert.equal(restored.score, 620);
  assert.equal(restored.level, 2);
  assert.equal(restored.lives, 1);
  assert.equal(restored.ballOnShooter, true);
  assert.equal(restored.ballInShooterLane, false);
  assert.equal(deletePinballSave(storage), true);
  assert.equal(values.has(PINBALL_SAVE_KEY), false);
});
