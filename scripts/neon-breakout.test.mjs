import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceBreakout, createBreakout, launchBreakout, movePaddle, stepBreakout } from '../src/services/neonBreakout.ts';
import { BREAKOUT_LEVELS } from '../src/data/breakoutLevels.ts';
import { breakoutLevel } from '../src/services/breakoutDifficulty.mjs';

test('paddle stays in bounds and carries the ball before launch', () => {
  const game = createBreakout();
  movePaddle(game, -100); assert.equal(game.paddle, 50); assert.equal(game.x, 50);
  movePaddle(game, 900); assert.equal(game.paddle, 670); assert.equal(game.x, 670);
});
test('paused games do not advance', () => {
  const game = createBreakout(); launchBreakout(game); stepBreakout(game, .02);
  assert.ok(game.y < 385); game.status = 'paused';
  const before = structuredClone(game); stepBreakout(game, 1); assert.deepEqual(game, before);
});
test('wall and paddle collisions bounce toward the court', () => {
  const game = createBreakout(); launchBreakout(game);
  game.x = 8; game.y = 250; game.vx = -170; stepBreakout(game, .02); assert.ok(game.vx > 0);
  game.x = game.paddle; game.y = 389; game.vy = 260; stepBreakout(game, .02); assert.ok(game.vy < 0);
});
test('a brick scores once and the last brick clears the current level', () => {
  const game = createBreakout(); launchBreakout(game);
  game.bricks.forEach((brick, index) => brick.alive = index === 0);
  game.x = 70; game.y = 90; game.vx = 0; game.vy = -260;
  stepBreakout(game, .05); assert.equal(game.score, 25); assert.equal(game.status, 'cleared');
  stepBreakout(game, .05); assert.equal(game.score, 25);
});
test('a missed ball consumes one life; the final miss ends the game', () => {
  const game = createBreakout(); launchBreakout(game);
  game.y = 459; game.vy = 260; stepBreakout(game, .02);
  assert.equal(game.lives, 2); assert.equal(game.status, 'ready'); assert.equal(game.y, 385);
  launchBreakout(game); game.lives = 1; game.y = 459; game.vy = 260; stepBreakout(game, .02);
  assert.equal(game.lives, 0); assert.equal(game.status, 'lost');
});

test('ten handcrafted sectors advance into endless generated remixes', () => {
  assert.equal(BREAKOUT_LEVELS.length, 10);
  assert.equal(new Set(BREAKOUT_LEVELS.map(level => level.layout.join(''))).size, 10);
  const game = createBreakout(1, BREAKOUT_LEVELS[0]); game.lives = 2;
  for (let sector = 1; sector <= 10; sector++) {
    assert.equal(game.level, sector); assert.equal(game.status, 'ready');
    assert.equal(game.paddleWidth, BREAKOUT_LEVELS[sector - 1].paddleWidth);
    assert.ok(game.bricks.some(brick => brick.alive));
    game.bricks.forEach(brick => { brick.alive = false; brick.health = 0; });
    const target = game.bricks.find(brick => BREAKOUT_LEVELS[sector - 1].layout[brick.row][Math.round((brick.x - 38) / 82)] !== '0');
    target.alive = true; target.health = 1;
    game.x = target.x + 30; game.y = target.y + 28; game.vx = 0; game.vy = -260;
    launchBreakout(game); stepBreakout(game, .05, 10);
    assert.equal(game.status, 'cleared');
    assert.equal(game.score, sector * 25); assert.equal(game.lives, 2);
    advanceBreakout(game, BREAKOUT_LEVELS);
  }
  assert.equal(game.level, 11); assert.equal(game.status, 'ready'); assert.ok(game.bricks.length >= 32);
  assert.ok(breakoutLevel(16, BREAKOUT_LEVELS).paddleWidth < BREAKOUT_LEVELS[9].paddleWidth); assert.ok(game.vx > 0);
});
test('reinforced signs require two distinct impacts', () => {
  const game = createBreakout(6, BREAKOUT_LEVELS[5]); launchBreakout(game);
  const target = game.bricks[0]; assert.equal(target.health, 2);
  game.bricks.forEach((brick, index) => { if (index) { brick.alive = false; brick.health = 0; } });
  game.x = target.x + 30; game.y = target.y + 28; game.vx = 0; game.vy = -260;
  stepBreakout(game, .05, 10);
  assert.equal(target.health, 1); assert.equal(game.score, 0); assert.ok(game.vy > 0);
  game.y = target.y + 28; game.vy = -260; stepBreakout(game, .05, 10);
  assert.equal(target.health, 0); assert.equal(target.alive, false); assert.equal(game.score, 25);
});
