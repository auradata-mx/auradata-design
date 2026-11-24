import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { loader } from 'fumadocs-core/source';
import { parseStoriesFile, storyIdFor } from '../src/lib/storybook-id.mjs';

const chartPages = [
  'chart', 'chart-card', 'cartesian-chart', 'donut-chart', 'funnel-chart', 'gauge', 'heatmap', 'sparkline',
];

test('Gráficas owns the chart navigation entries without moving their static routes', async () => {
  const directory = new URL('../content/docs/', import.meta.url);
  const files = (await Promise.all((await readdir(directory, { recursive: true })).map(async (path) => {
    if (path.endsWith('/meta.json') || path === 'meta.json') {
      return { path, type: 'meta', data: JSON.parse(await readFile(new URL(path, directory), 'utf8')) };
    }
    if (path.endsWith('.mdx')) return { path, type: 'page', data: {} };
  }))).filter(Boolean);
  const source = loader({ baseUrl: '/docs', source: { files } });
  const children = source.getPageTree().children;
  const charts = children.find((node) => node.type === 'folder' && node.name === 'Gráficas');
  const components = children.find((node) => node.type === 'folder' && node.name === 'Componentes');

  assert.equal(charts?.index?.url, '/docs/charts');
  assert.deepEqual(charts.children.map((node) => node.url), chartPages.map((slug) => `/docs/components/${slug}`));
  for (const slug of chartPages) {
    assert.equal(source.getPage(['components', slug])?.url, `/docs/components/${slug}`);
    assert.ok(!components.children.some((node) => node.url === `/docs/components/${slug}`));
  }
});

test('chart stories belong to Gráficas while keeping their legacy story IDs', async () => {
  const legacyIds = {
    Chart: 'chart',
    ChartCard: 'chart-card',
    Charts: 'charts',
    DonutChart: 'donut-chart',
    FunnelChart: 'funnel-chart',
    Gauge: 'gauge',
    Heatmap: 'heatmap',
    Sparkline: 'sparkline',
  };
  for (const [story, legacyId] of Object.entries(legacyIds)) {
    const file = new URL(`../../registry/src/stories/${story}.stories.tsx`, import.meta.url);
    const { title, id, stories } = parseStoriesFile(await readFile(file, 'utf8'));
    assert.match(title, /^Gráficas\//);
    assert.ok(stories.length > 0);
    for (const story of stories) {
      assert.equal(storyIdFor(id ?? title, story), storyIdFor(`AuraData/${legacyId}`, story));
    }
  }
});
