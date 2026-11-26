import test from 'node:test';
import assert from 'node:assert/strict';
import { createExperienceArchive, selectExperienceChapter } from '../src/services/experienceArchive.ts';

test('fresh phone highlights the current chapter without opening a panel', () => {
  assert.deepEqual(createExperienceArchive(true), { activeIndex: 0, expanded: false, contributions: {} });
});

test('desktop and tablet preserve the current-role default', () => {
  assert.deepEqual(createExperienceArchive(false), { activeIndex: 0, expanded: true, contributions: {} });
});

test('accordion activation opens, closes, and replaces one selected chapter', () => {
  const state = createExperienceArchive(true);
  selectExperienceChapter(state, 0, 4, true);
  assert.equal(state.expanded, true);
  selectExperienceChapter(state, 0, 4, true);
  assert.equal(state.expanded, false);
  selectExperienceChapter(state, 2, 4, true);
  assert.equal(state.activeIndex, 2);
  assert.equal(state.expanded, true);
  selectExperienceChapter(state, 1, 4, true);
  assert.equal(state.activeIndex, 1);
  assert.equal(state.expanded, true);
});

test('selection across display modes preserves contribution disclosures', () => {
  const state = createExperienceArchive(true);
  selectExperienceChapter(state, 1, 4, true);
  state.contributions['internet-now'] = true;
  // Phone portrait and landscape share the same accordion state. Desktop
  // activation selects a chapter without the accordion close-on-repeat rule.
  selectExperienceChapter(state, 1, 4, false);
  assert.equal(state.activeIndex, 1);
  assert.equal(state.expanded, true);
  assert.equal(state.contributions['internet-now'], true);
  selectExperienceChapter(state, 1, 4, true);
  assert.equal(state.expanded, false);
  assert.equal(state.contributions['internet-now'], true);
});
