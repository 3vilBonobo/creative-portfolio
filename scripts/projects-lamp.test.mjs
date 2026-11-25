import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectsLamp } from '../src/services/projectsLamp.ts';

function fixture(values) {
  let now = 0, id = 0, index = 0;
  const jobs = new Map(), changes = [];
  const lamp = createProjectsLamp(value => changes.push({ at: now, value }), {
    schedule(callback, delay) { const handle = ++id; jobs.set(handle, { at: now + delay, callback }); return handle; },
    cancel(handle) { jobs.delete(handle); },
  }, () => values[index++ % values.length]);
  function advance(duration) {
    const end = now + duration;
    while (jobs.size) {
      const [handle, job] = [...jobs].sort((a, b) => a[1].at - b[1].at)[0];
      if (job.at > end) break;
      now = job.at; jobs.delete(handle); job.callback();
      assert.ok(jobs.size <= 1, 'never accumulates timers');
    }
    now = end;
  }
  return { lamp, advance, changes, jobs };
}

test('steady for 20–60 seconds, then one bounded outage and a full quiet interval', () => {
  const f = fixture([0]);
  f.lamp.setEnabled(true);
  f.advance(19_999);
  assert.deepEqual(f.changes, [{ at: 0, value: 1 }]);
  f.advance(1);
  assert.deepEqual(f.changes.at(-1), { at: 20_000, value: 0 });
  f.advance(160);
  assert.deepEqual(f.changes.at(-1), { at: 20_160, value: 1 });
  f.advance(19_999);
  assert.equal(f.changes.length, 3);
  const latest = fixture([0.999999, 0.3, 0.5, 0.5]);
  latest.lamp.setEnabled(true);
  latest.advance(59_999);
  assert.equal(latest.changes.length, 1);
  latest.advance(1);
  assert.ok(latest.changes.at(-1).value < 1);
});

test('double dip has a recovery gap, no overshoot, and returns to steady in under a second', () => {
  const f = fixture([0.5, 0.9, 0.5, 0.5, 0.5, 0.5]);
  f.lamp.setEnabled(true);
  f.advance(40_000);
  assert.equal(f.changes.at(-1).value, 0.62);
  f.advance(1_000);
  assert.deepEqual(f.changes.map(x => x.value), [1, 0.62, 1, 0.72, 1]);
  assert.ok(f.changes[3].at - f.changes[2].at >= 260);
  assert.ok(f.changes.at(-1).at - f.changes[1].at < 1_000);
  assert.ok(f.changes.every(x => x.value >= 0 && x.value <= 1));
});

test('disable during a dip restores steady, cancels work and restarts with a fresh quiet interval', () => {
  const f = fixture([0]);
  f.lamp.setEnabled(true);
  f.advance(20_000);
  f.lamp.setEnabled(false);
  assert.equal(f.changes.at(-1).value, 1);
  assert.equal(f.jobs.size, 0);
  f.advance(120_000);
  assert.equal(f.changes.at(-1).value, 1);
  f.lamp.setEnabled(true);
  f.advance(19_999);
  assert.equal(f.changes.at(-1).value, 1);
});

test('repeated visibility notifications do not reset the interval; dispose cannot restart', () => {
  const f = fixture([0]);
  f.lamp.setEnabled(true);
  f.advance(10_000);
  f.lamp.setEnabled(true);
  f.advance(10_000);
  assert.equal(f.changes.at(-1).value, 0);
  f.lamp.dispose();
  assert.equal(f.jobs.size, 0);
  f.lamp.setEnabled(true);
  f.advance(120_000);
  assert.equal(f.jobs.size, 0);
  assert.equal(f.changes.at(-1).value, 1);
});
