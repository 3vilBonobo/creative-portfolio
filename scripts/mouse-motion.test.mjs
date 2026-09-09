import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MOUSE_VISIT_MS, sampleMouseMotion } from '../src/services/mouseMotion.ts';

test('the approach cycles through all eight gait poses before turning', () => {
  assert.equal(sampleMouseMotion(-1).opacity, 0);
  assert.deepEqual(Array.from({ length: 8 }, (_, i) => sampleMouseMotion(i * 55).frame), [0, 1, 2, 3, 4, 5, 6, 7]);
  for (let time = 0; time < 6250; time += 17) {
    const pose = sampleMouseMotion(time);
    assert.ok(pose.frame >= 0 && pose.frame < 8);
    assert.equal(pose.entry, 0);
  }
});

test('the mouse plants its feet, turns away, then alternates rear paws', () => {
  assert.equal(sampleMouseMotion(6250).frame, 8);
  assert.equal(sampleMouseMotion(6650).frame, 9);
  assert.equal(sampleMouseMotion(7000).frame, 10);
  assert.equal(sampleMouseMotion(7250).frame, 10);
  assert.equal(sampleMouseMotion(7350).frame, 11);
  assert.equal(sampleMouseMotion(7450).frame, 10);
});

test('entry fades the whole mouse smoothly and finishes within the visit timer', () => {
  let previousEntry = 0;
  for (let time = 0; time <= MOUSE_VISIT_MS; time += 10) {
    const pose = sampleMouseMotion(time);
    assert.ok(pose.frame >= 0 && pose.frame < 12);
    assert.ok(pose.opacity >= 0 && pose.opacity <= 1);
    assert.ok(pose.entry >= previousEntry);
    if (pose.entry > 0) {
      assert.equal(pose.turn, 1);
      assert.equal(pose.opacity, 1 - pose.entry);
    }
    previousEntry = pose.entry;
  }
  assert.equal(sampleMouseMotion(MOUSE_VISIT_MS).opacity, 0);
  assert.equal(sampleMouseMotion(MOUSE_VISIT_MS).entry, 1);
  assert.equal(sampleMouseMotion(MOUSE_VISIT_MS).done, true);
  assert.equal(sampleMouseMotion(MOUSE_VISIT_MS - 1).done, false);
  assert.equal(sampleMouseMotion(7812.5).opacity, .5);
});
