import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FLOOR, FLOORS, FLOOR_TRANSITIONS } from '../src/config/floors.ts';
import { findActiveFloor } from '../src/services/floorNavigation.ts';

test('canonical floors retain semantic anchors, ground zero and four adjacent transitions', () => {
  assert.deepEqual(FLOORS.map(({ id, number }) => [id, number]), [
    ['office', '04'], ['about', '03'], ['projects', '02'], ['experience', '01'], ['street', '00'],
  ]);
  assert.equal(FLOOR.street.number, '00');
  assert.deepEqual(FLOOR_TRANSITIONS.map(({ id }) => id), ['04-to-03', '03-to-02', '02-to-01', '01-to-00']);
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
