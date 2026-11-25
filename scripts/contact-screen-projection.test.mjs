import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contactTopProjection } from '../src/services/contactScreenProjection.ts';

const project = (m, x, y) => [
  (m[0] * x + m[4] * y + m[12]) / (m[3] * x + m[7] * y + m[15]),
  (m[1] * x + m[5] * y + m[13]) / (m[3] * x + m[7] * y + m[15]),
];
const near = (actual, expected) => actual.forEach((n, i) => assert.ok(Math.abs(n - expected[i]) < 1e-8));

test('upper-corner adjustment preserves the approved lower edge at every artwork size', () => {
  for (const [width, height, left, right] of [[294.562, 370.725, .1, .015], [380.413, 406.075, .1, .015], [666.737, 552.85, .13, .02]]) {
    const m = contactTopProjection(width, height, left, right);
    near(project(m, 0, 0), [0, -left * height]);
    near(project(m, width, 0), [width, -right * height]);
    near(project(m, 0, height), [0, height]);
    near(project(m, width, height), [width, height]);
    // The entire bottom remains horizontal in local space, not just its endpoints.
    assert.ok(Math.abs(project(m, width / 2, height)[1] - height) < 1e-8);
  }
});

test('unmeasured or hidden panels receive a finite identity transform', () => {
  for (const [width, height] of [[0, 100], [100, 0], [NaN, 100], [100, Infinity]]) {
    const m = contactTopProjection(width, height, .1, .015);
    near(project(m, 0, 0), [0, 0]);
    near(project(m, 80, 60), [80, 60]);
  }
});
