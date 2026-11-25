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
  const planted = sampleMouseMotion(6350);
  assert.equal(planted.phase, 'settle');
  assert.equal(planted.approach, 1);
  assert.equal(planted.turn, 0);
  assert.equal(planted.depthOffset, .16);
  assert.equal(planted.scale, 1);
  assert.equal(planted.opacity, 1);
  assert.equal(sampleMouseMotion(6500).frame, 8);
  assert.equal(sampleMouseMotion(6900).frame, 9);
  assert.equal(sampleMouseMotion(7200).frame, 10);
  assert.equal(sampleMouseMotion(7450).frame, 10);
  assert.equal(sampleMouseMotion(7570).frame, 11);
  assert.equal(sampleMouseMotion(7690).frame, 10);
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
      assert.ok(pose.scale < 1);
      assert.ok(pose.brightness < .78);
      assert.ok(pose.depthOffset < .16);
      if (pose.entry <= .2) assert.equal(pose.opacity, 1);
    }
    previousEntry = pose.entry;
  }
  assert.equal(sampleMouseMotion(MOUSE_VISIT_MS).opacity, 0);
  assert.equal(sampleMouseMotion(MOUSE_VISIT_MS).entry, 1);
  assert.equal(sampleMouseMotion(MOUSE_VISIT_MS).done, true);
  assert.equal(sampleMouseMotion(MOUSE_VISIT_MS - 1).done, false);
  const midway = sampleMouseMotion(8375);
  assert.ok(midway.opacity > 0 && midway.opacity < 1);
  assert.ok(midway.scale > .72 && midway.scale < 1);
});
