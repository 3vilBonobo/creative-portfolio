import test from 'node:test';
import assert from 'node:assert/strict';
import { createCourier, deleteCourierSave, readCourierSave, saveCourier, stepCourier, COURIER_SAVE_KEY } from '../src/services/orbitalCourier.ts';

test('the launch field is clear around the spawn and starts with three lives', () => {
  const game = createCourier();
  assert.equal(game.lives, 3);
  assert.equal(game.level, 1);
  assert.equal(game.rocks.length, 4);
  assert.ok(game.rocks.every(rock => Math.hypot(rock.x - game.ship.x, rock.y - game.ship.y) > rock.radius + 30));
});

test('thrust accelerates in the ship direction and coasts after release', () => {
  const game = createCourier();
  game.ship.angle = 0;
  stepCourier(game, { thrust: true }, 0.05);
  assert.ok(game.ship.vx > 0);
  assert.equal(game.ship.vy, 0);
  const speed = game.ship.vx;
  stepCourier(game, {}, 0.05);
  assert.ok(game.ship.vx > 0 && game.ship.vx < speed);
  assert.ok(game.ship.x > 360);
});

test('shots split large rocks, award score, and wrap around the playfield', () => {
  const game = createCourier();
  game.ship.angle = 0;
  const rock = game.rocks[0];
  game.rocks = [{ ...rock, x: 400, y: 220, vx: 0, vy: 0 }];
  const events = stepCourier(game, { fire: true }, 0.05);
  assert.equal(events.hit, 1);
  assert.equal(game.score, 20);
  assert.equal(game.rocks.length, 2);
  assert.ok(game.rocks.every(piece => piece.size === 'medium'));
  const wrapped = createCourier();
  wrapped.ship.x = 719;
  wrapped.ship.angle = 0;
  wrapped.ship.vx = 80;
  stepCourier(wrapped, {}, 0.05);
  assert.ok(wrapped.ship.x >= 0 && wrapped.ship.x < 720);
});

test('a hit removes one life, respawns safely, and protects the player briefly', () => {
  const game = createCourier();
  const rock = game.rocks[0];
  game.rocks = [{ ...rock, x: game.ship.x + 8, y: game.ship.y, vx: 0, vy: 0 }];
  const first = stepCourier(game, {}, 0.01);
  assert.equal(first.lifeLost, true);
  assert.equal(game.lives, 2);
  assert.ok(game.invulnerability > 2);
  const protectedHit = stepCourier(game, {}, 0.05);
  assert.equal(protectedHit.lifeLost, false);
  assert.equal(game.lives, 2);
});

test('clearing a wave creates a harder next wave', () => {
  const game = createCourier();
  game.rocks = [];
  const events = stepCourier(game, {}, 0.016);
  assert.equal(events.waveCleared, true);
  assert.equal(game.level, 2);
  assert.ok(game.rocks.length > 4);
  const laterWave = createCourier(100);
  assert.equal(laterWave.rocks.length, 14);
  assert.ok(Math.hypot(laterWave.rocks[0].vx, laterWave.rocks[0].vy) > Math.hypot(game.rocks[0].vx, game.rocks[0].vy));
});

test('courier progress can be saved, restored, and deleted locally', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const game = createCourier(4, 360);
  game.lives = 2;
  game.ship.vx = 42;
  assert.equal(saveCourier(storage, game), true);
  const restored = readCourierSave(storage);
  assert.equal(restored.level, 4);
  assert.equal(restored.score, 360);
  assert.equal(restored.lives, 2);
  assert.equal(restored.ship.vx, 42);
  game.lives = 0;
  assert.equal(saveCourier(storage, game), true);
  assert.equal(readCourierSave(storage).lives, 1);
  values.set(COURIER_SAVE_KEY, '{bad json');
  assert.equal(readCourierSave(storage), undefined);
  assert.equal(deleteCourierSave(storage), true);
  assert.equal(readCourierSave(storage), undefined);
});
