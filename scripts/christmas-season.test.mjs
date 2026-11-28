import test from 'node:test';
import assert from 'node:assert/strict';
import { isChristmasSeason } from '../src/services/christmasSeason.ts';

test('Christmas starts at midnight December 1 in Athens', () => {
  assert.equal(isChristmasSeason(new Date('2026-11-30T21:59:59.999Z')), false);
  assert.equal(isChristmasSeason(new Date('2026-11-30T22:00:00Z')), true);
});

test('Christmas includes January 7 and ends at midnight January 8 in Athens', () => {
  assert.equal(isChristmasSeason(new Date('2027-01-07T21:59:59.999Z')), true);
  assert.equal(isChristmasSeason(new Date('2027-01-07T22:00:00Z')), false);
});

test('the season recurs every year and stays absent during other months', () => {
  for (const year of [2026, 2027, 2028, 2030]) {
    assert.equal(isChristmasSeason(new Date(`${year}-12-25T12:00:00Z`)), true);
    assert.equal(isChristmasSeason(new Date(`${year}-01-01T12:00:00Z`)), true);
    for (const month of ['02', '03', '04', '05', '06', '07', '08', '09', '10', '11']) {
      assert.equal(isChristmasSeason(new Date(`${year}-${month}-15T12:00:00Z`)), false);
    }
  }
  assert.equal(isChristmasSeason(new Date(NaN)), false);
});
