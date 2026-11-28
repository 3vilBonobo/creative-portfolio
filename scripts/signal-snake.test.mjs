import test from 'node:test';
import assert from 'node:assert/strict';
import { createSnake, deleteSnakeSave, readSnakeSave, saveSnake, SNAKE_LEVELS, SNAKE_SAVE_KEY, SNAKE_TICK_SECONDS, snakeTickSeconds, steerSnake, stepSnake } from '../src/services/signalSnake.ts';

test('ten districts have distinct progressive route layouts', () => {
  assert.equal(SNAKE_LEVELS.length, 10);
  assert.deepEqual(SNAKE_LEVELS.map(level => level.target), [10,10,12,12,14,14,16,16,18,18]);
  assert.deepEqual(SNAKE_LEVELS.map(level => level.obstacles.length), [0,4,6,8,10,12,14,16,18,20]);
  assert.ok(SNAKE_LEVELS.every(level => level.target >= 10));
  assert.equal(SNAKE_LEVELS[0].obstacles.length, 0);
  assert.ok(SNAKE_LEVELS[9].obstacles.length > 0);
});

test('opening district starts gently and later districts increase pace gradually', () => {
  assert.equal(SNAKE_TICK_SECONDS, 0.22);
  assert.equal(snakeTickSeconds(1), 0.22);
  assert.ok(snakeTickSeconds(5) < snakeTickSeconds(1));
  assert.ok(snakeTickSeconds(10) >= 0.15);
});

test('steering queues legal turns and blocks reversing into the courier', () => {
  const game = createSnake(1, 0, () => .99);
  assert.equal(steerSnake(game, 'left'), false);
  assert.equal(steerSnake(game, 'up'), true);
  game.status = 'playing';
  assert.equal(stepSnake(game), 'moved');
  assert.deepEqual(game.body[0], {x:5,y:4});
});

test('wall and obstacle collisions end the run without wrapping', () => {
  const wall = createSnake(); wall.body = [{x:17,y:5},{x:16,y:5},{x:15,y:5}]; wall.direction = wall.queuedDirection = 'right'; wall.status = 'playing';
  assert.equal(stepSnake(wall), 'lost');
  const obstacle = createSnake(2); obstacle.body = [{x:7,y:3},{x:7,y:4},{x:7,y:5}]; obstacle.direction = obstacle.queuedDirection = 'right'; obstacle.status = 'playing';
  assert.equal(stepSnake(obstacle), 'lost');
});

test('eating advances score, and only the moving tail cell is safely enterable', () => {
  const game = createSnake(); game.status = 'playing'; game.food = {x:6,y:5};
  assert.equal(stepSnake(game), 'snack'); assert.equal(game.score, 10); assert.equal(game.body.length, 4);
  game.body = [{x:5,y:5},{x:5,y:6},{x:4,y:6},{x:4,y:5}]; game.direction = game.queuedDirection = 'left'; game.food = {x:12,y:8};
  assert.equal(stepSnake(game), 'moved'); assert.deepEqual(game.body[0], {x:4,y:5});
});

test('collecting the sector quota advances districts, and the tenth district wins', () => {
  const game = createSnake(); game.status = 'playing'; game.snacksThisLevel = 9; game.food = {x:6,y:5};
  assert.equal(stepSnake(game, () => 0), 'sector'); assert.equal(game.level, 2); assert.equal(game.status, 'ready');
  game.level = 10; game.snacksThisLevel = 17; game.body = [{x:5,y:5},{x:4,y:5},{x:3,y:5}]; game.direction = game.queuedDirection = 'right'; game.food = {x:6,y:5}; game.status = 'playing';
  assert.equal(stepSnake(game), 'won'); assert.equal(game.status, 'won');
});

test('local save pauses active runs, restores valid progress, and deletes cleanly', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const game = createSnake(3, 60); game.status = 'playing';
  assert.equal(saveSnake(storage, game), true);
  assert.equal(game.status, 'playing');
  assert.equal(readSnakeSave(storage).status, 'paused');
  values.set(SNAKE_SAVE_KEY, '{bad json'); assert.equal(readSnakeSave(storage), undefined);
  const forged = createSnake(2); forged.obstacles = []; values.set(SNAKE_SAVE_KEY, JSON.stringify(forged));
  assert.equal(readSnakeSave(storage), undefined);
  assert.equal(deleteSnakeSave(storage), true); assert.equal(readSnakeSave(storage), undefined);
});
