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

test('default disclosure exposes five previews with data-derived remaining counts', () => {
  const work = projectDisclosure(professional, false, true);
  const play = projectDisclosure(creative, false, true);
  assert.equal(1 + work.visible.length + play.visible.length, 5);
  assert.equal(work.remaining, 3);
  assert.equal(play.remaining, 4);
  assert.deepEqual(work.visible, professional.slice(0, 2));
  assert.deepEqual(play.visible, creative.slice(0, 2));
});

test('category expansion is independent and collapse restores the initial selection', () => {
  assert.deepEqual(projectDisclosure(professional, true, true).visible, professional);
  assert.equal(projectDisclosure(creative, false, true).remaining, 4);
  assert.deepEqual(projectDisclosure(professional, false, true).visible, professional.slice(0, 2));
});

test('desktop and tablet retain every project regardless of phone expansion', () => {
  for (const expanded of [false, true]) {
    assert.deepEqual(projectDisclosure(creative, expanded, false).visible, creative);
    assert.equal(projectDisclosure(professional, expanded, false).remaining, 0);
  }
});

test('empty, single-item and two-item categories have no expansion action', () => {
  for (const items of [[], [1], [1, 2]]) {
    for (const expanded of [false, true]) {
      assert.deepEqual(projectDisclosure(items, expanded, true), { visible: items, remaining: 0, expandable: false });
    }
  }
  assert.deepEqual(projectDisclosure([1, 2, 3], false, true), { visible: [1, 2], remaining: 1, expandable: true });
});
