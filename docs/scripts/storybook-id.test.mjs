import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseStoriesFile, storyIdFor, storyUrlFor } from '../src/lib/storybook-id.mjs';

test('the story id is the sanitized title and the export name in words, as Storybook builds it', () => {
  assert.equal(storyIdFor('Components/Button', 'Primary'), 'components-button--primary');
  assert.equal(storyIdFor('Components/Button', 'IconSizes'), 'components-button--icon-sizes');
  assert.equal(storyIdFor('AuraData/Data table', 'Default'), 'auradata-data-table--default');
  assert.equal(storyIdFor('Components/Select', 'LongValueOpen'), 'components-select--long-value-open');
  assert.equal(storyIdFor('Components/Alert dialog', 'Default'), 'components-alert-dialog--default');
  assert.equal(storyIdFor('Components/Input OTP', 'Pattern2'), 'components-input-otp--pattern-2');
});

test('a story URL puts the id after the Storybook base, with or without a trailing slash', () => {
  assert.equal(
    storyUrlFor('https://design.auradata.mx', 'components-button--primary'),
    'https://design.auradata.mx/?path=/story/components-button--primary',
  );
  assert.equal(
    storyUrlFor('https://design.auradata.mx/storybook/', 'components-button--primary'),
    'https://design.auradata.mx/storybook/?path=/story/components-button--primary',
  );
});

test('a stories file gives its meta title and its story exports', () => {
  const source = `
import { Button } from '@/components/ui/button'
const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Guardar informe' },
} satisfies Meta<typeof Button>
export default meta
export const Primary: Story = {}
export const IconSizes: Story = {
  name: 'Icon sizes',
}
const helper = 1
`;
  assert.deepEqual(parseStoriesFile(source), { title: 'Components/Button', stories: ['Primary', 'IconSizes'] });
});

test('a stories file without a meta title is an error, not a broken link', () => {
  assert.throws(() => parseStoriesFile('export const Primary = {}'), /no meta title/);
});

test('an explicit CSF component id takes priority over the sidebar title, but a nested args id does not', () => {
  const source = `
const meta = {
  title: 'Gráficas/Chart card',
  id: 'auradata-chart-card',
  args: {
    id: 'widget',
  },
}
export default meta
export const ViewData = {}
`;
  const story = parseStoriesFile(source);
  assert.equal(storyIdFor(story.id ?? story.title, 'ViewData'), 'auradata-chart-card--view-data');
  assert.equal(parseStoriesFile(source.replace("  id: 'auradata-chart-card',\n", '')).id, undefined);
});
