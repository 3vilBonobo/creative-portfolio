import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/data/projects.ts';
import { categoryProjects, projectDisclosure } from '../src/services/projectCatalogue.ts';

const feature = projects.find(project => project.id === 'nerve-ending');
const professional = categoryProjects(projects, 'professional', feature.id);
const creative = categoryProjects(projects, 'creative', feature.id);

test('catalogue membership, counts, editorial order and featured deduplication', () => {
  assert.equal(projects.length, 12);
  assert.equal(professional.length, 5);
  assert.equal(creative.length, 6);
  assert.deepEqual(professional, projects.filter(p => p.category === 'professional'));
  assert.deepEqual(creative, projects.filter(p => p.category === 'creative' && p !== feature));
  assert.equal(new Set([feature, ...professional, ...creative].map(p => p.id)).size, projects.length);
});

test('default disclosure exposes one row per category at every column count', () => {
  for (const columns of [1, 2, 3]) {
    const work = projectDisclosure(professional, false, columns);
    const play = projectDisclosure(creative, false, columns);
    assert.equal(1 + work.visible.length + play.visible.length, 1 + 2 * columns);
    assert.equal(work.remaining, professional.length - columns);
    assert.equal(play.remaining, creative.length - columns);
    assert.deepEqual(work.visible, professional.slice(0, columns));
    assert.deepEqual(play.visible, creative.slice(0, columns));
  }
});

test('category expansion is independent and collapse restores the initial selection', () => {
  assert.deepEqual(projectDisclosure(professional, true, 3).visible, professional);
  assert.equal(projectDisclosure(creative, false, 3).remaining, 3);
  assert.deepEqual(projectDisclosure(professional, false, 3).visible, professional.slice(0, 3));
});

test('expanded categories preserve every project across responsive row sizes', () => {
  for (const columns of [1, 2, 3]) {
    assert.deepEqual(projectDisclosure(creative, true, columns).visible, creative);
    assert.equal(projectDisclosure(professional, true, columns).remaining, 0);
  }
});

test('categories fitting within one row omit the expansion action', () => {
  for (const items of [[], [1], [1, 2]]) {
    for (const expanded of [false, true]) {
      assert.deepEqual(projectDisclosure(items, expanded, 2), { visible: items, remaining: 0, expandable: false });
    }
  }
  assert.deepEqual(projectDisclosure([1, 2, 3], false, 2), { visible: [1, 2], remaining: 1, expandable: true });
  assert.deepEqual(projectDisclosure([1, 2], false, 1), { visible: [1], remaining: 1, expandable: true });
});
