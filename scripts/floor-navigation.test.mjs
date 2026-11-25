import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { FLOOR, FLOORS, FLOOR_TRANSITIONS } from '../src/config/floors.ts';
import { findActiveFloor } from '../src/services/floorNavigation.ts';

test('canonical floors retain semantic anchors, ground zero and four adjacent transitions', () => {
  assert.deepEqual(FLOORS.map(({ id, number }) => [id, number]), [
    ['office', '04'], ['about', '03'], ['projects', '02'], ['experience', '01'], ['street', '00'],
  ]);
  assert.equal(FLOOR.street.number, '00');
  assert.deepEqual(FLOOR_TRANSITIONS.map(({ id }) => id), ['04-to-03', '03-to-02', '02-to-01', '01-to-00']);
});

test('each connector ships distinct, bounded WebP artwork with an aligned light anchor', () => {
  const artworkHashes = new Set();
  for (const transition of FLOOR_TRANSITIONS) {
    const bytes = readFileSync(new URL(`../public${transition.artwork}`, import.meta.url));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    assert.ok(bytes.length <= 180 * 1024, `${transition.id} exceeds its image budget`);
    artworkHashes.add(createHash('sha256').update(bytes).digest('hex'));
    assert.ok(transition.light.x >= 0 && transition.light.x <= 2160);
    assert.ok(transition.light.y >= 0 && transition.light.y <= 216);
  }
  assert.equal(artworkHashes.size, 4);
});

test('long sections and sticky scenes remain active until the next floor reaches the reference line', () => {
  const positions = [
    { id: 'office', top: 0 }, { id: 'about', top: 1000 }, { id: 'projects', top: 2500 },
    { id: 'experience', top: 6500 }, { id: 'street', top: 9000 },
  ];
  for (const y of [2500, 3500, 5000, 6400]) assert.equal(findActiveFloor(positions, y), 'projects');
  for (const y of [6500, 7500, 8999]) assert.equal(findActiveFloor(positions, y), 'experience');
  assert.equal(findActiveFloor(positions, 2500), 'projects'); // Direct anchor.
  assert.equal(findActiveFloor(positions, 1500), 'about'); // Upward navigation.
  assert.equal(findActiveFloor(positions, 950), 'office'); // Infrastructure gap.
  assert.equal(findActiveFloor(positions, -10), 'office');
});

test('the bottom of the document selects Contact even in a short final section', () => {
  const positions = [{ id: 'experience', top: -1000 }, { id: 'street', top: 350 }];
  assert.equal(findActiveFloor(positions, 200, true), 'street');
  assert.equal(findActiveFloor([], 200), '');
});
