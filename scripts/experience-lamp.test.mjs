import test from 'node:test';
import assert from 'node:assert/strict';
// Load the isolated service with the same Node 22 type-stripping strategy as the
// existing lamp tests. Its only dependency is a type-only clock interface.
import { createExperienceLamp } from '../src/services/experienceLamp.ts';

function rig(values) {
  let time = 0, id = 0, index = 0;
  const jobs = new Map(), changes = [];
  const lamp = createExperienceLamp(value => changes.push({ time, value }), {
    schedule(fn, delay) { const handle = ++id; jobs.set(handle, { time: time + delay, fn }); return handle; },
    cancel(handle) { jobs.delete(handle); },
  }, () => values[index++ % values.length]);
  function advance(duration) {
    const end = time + duration;
    while (jobs.size) {
      const [handle, job] = [...jobs].sort((a, b) => a[1].time - b[1].time)[0];
      if (job.time > end) break;
      time = job.time; jobs.delete(handle); job.fn();
      assert.ok(jobs.size <= 1, 'at most one scheduled callback');
    }
    time = end;
  }
  return { lamp, jobs, changes, advance };
}

test('rare interruption has an uneven recovery and a fresh quiet period', () => {
  const r = rig([0]);
  r.lamp.setEnabled(true);
  r.advance(24_999);
  assert.deepEqual(r.changes.map(c => c.value), [1]);
  r.advance(1);
  assert.equal(r.changes.at(-1).value, .08);
  r.advance(1_000);
  assert.deepEqual(r.changes.map(c => c.value), [1, .08, .72, 1]);
  r.advance(23_999);
  assert.equal(r.changes.length, 4);
});

test('shallow dips and unstable sequences stay bounded and return within 1.1 seconds', () => {
  for (const values of [[.5], [.9]]) {
    const r = rig(values);
    r.lamp.setEnabled(true);
    const next = [...r.jobs.values()][0].time;
    assert.ok(next >= 25_000 && next <= 75_000);
    r.advance(next);
    assert.ok(r.changes.at(-1).value < 1);
    r.advance(1_100);
    assert.equal(r.changes.at(-1).value, 1);
    assert.ok(r.changes.every(c => c.value >= .08 && c.value <= 1));
  }
});

test('visibility/motion suspension during a dip restores steady and cancels recovery', () => {
  const r = rig([0]);
  r.lamp.setEnabled(true); r.advance(25_000);
  r.lamp.setEnabled(false);
  assert.equal(r.changes.at(-1).value, 1);
  assert.equal(r.jobs.size, 0);
  r.advance(100_000);
  assert.equal(r.jobs.size, 0);
  r.lamp.setEnabled(true); r.advance(24_999);
  assert.equal(r.changes.at(-1).value, 1);
});

test('repeated enabled notifications preserve schedule; unmounted service cannot restart', () => {
  const r = rig([0]);
  r.lamp.setEnabled(true); r.advance(10_000);
  r.lamp.setEnabled(true); r.advance(15_000);
  assert.equal(r.changes.at(-1).value, .08);
  r.lamp.dispose(); r.lamp.dispose(); r.lamp.setEnabled(true);
  r.advance(100_000);
  assert.equal(r.jobs.size, 0);
  assert.equal(r.changes.at(-1).value, 1);
});
