import test from 'node:test';
import assert from 'node:assert/strict';
import { ARCADE_RECORDS_KEY, readArcadeRecords, recordArcadeHighScore } from '../src/services/arcadeRecords.ts';

test('personal bests persist per game and only a better score replaces one', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.equal(recordArcadeHighScore(storage, 'snake', 120, 4), true);
  assert.equal(recordArcadeHighScore(storage, 'snake', 100, 8), false);
  assert.equal(recordArcadeHighScore(storage, 'invaders', 220, 3), true);
  assert.deepEqual(readArcadeRecords(storage), { snake: { score: 120, level: 4 }, invaders: { score: 220, level: 3 } });
  assert.ok(values.has(ARCADE_RECORDS_KEY));
});

test('corrupt records and unavailable storage fail safely', () => {
  assert.deepEqual(readArcadeRecords({ getItem: () => '{broken' }), {});
  assert.deepEqual(readArcadeRecords(undefined), {});
  assert.equal(recordArcadeHighScore(undefined, 'breakout', 1, 1), false);
  assert.equal(recordArcadeHighScore({ getItem: () => null, setItem: () => { throw new Error(); } }, 'breakout', 1, 1), false);
});
