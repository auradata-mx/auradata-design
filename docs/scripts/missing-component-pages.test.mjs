import assert from 'node:assert/strict';
import { test } from 'node:test';

import { coveredItems, findMissingPages } from './missing-component-pages.mjs';

const items = [
  { name: 'button', type: 'registry:ui' },
  { name: 'data-table', type: 'registry:ui' },
  { name: 'data-table-views', type: 'registry:ui' },
  { name: 'auradata-theme', type: 'registry:theme' },
  { name: 'use-mobile', type: 'registry:hook' },
  { name: 'logo', type: 'registry:ui' },
];

test('a page covers every item its install blocks name', () => {
  const mdx = `
<ComponentInstall item="data-table" />
Some text.
<ComponentInstall
  item="data-table-views"
/>
`;
  assert.deepEqual([...coveredItems(mdx)], ['data-table', 'data-table-views']);
});

test('the missing items are the ui items no page installs, sorted', () => {
  const pages = { 'data-table.mdx': '<ComponentInstall item="data-table" />' };
  assert.deepEqual(findMissingPages(items, pages), ['button', 'data-table-views']);
});

test('items of other types never count as missing', () => {
  const pages = {
    'button.mdx': '<ComponentInstall item="button" />',
    'data-table.mdx': '<ComponentInstall item="data-table" /><ComponentInstall item="data-table-views" />',
  };
  assert.deepEqual(findMissingPages(items, pages), []);
});
