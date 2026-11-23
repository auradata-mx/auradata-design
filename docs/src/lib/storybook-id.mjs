// Story ids and links, computed the way Storybook computes them, so a docs page links to a story that exists.
// Plain JavaScript so `node --test` runs it as is (scripts/storybook-id.test.mjs); the docs import it from TypeScript.

/**
 * Storybook's `sanitize`: lower case, every punctuation or space run becomes one dash, no dash at the ends.
 * @param {string} value
 */
function sanitize(value) {
  return value
    .toLowerCase()
    .replace(/[ '`~!@#$%^&*()_|+\-=?;:",.<>{}[\]\\/]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Storybook's `storyNameFromExport` (lodash `startCase`): `IconSizes` -> `Icon Sizes`, `Pattern2` -> `Pattern 2`.
 * @param {string} exportName
 */
function storyNameFromExport(exportName) {
  return exportName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([A-Za-z])(\d)/g, '$1 $2')
    .replace(/(\d)([A-Za-z])/g, '$1 $2');
}

/**
 * The id of a story: `Components/Button` + `IconSizes` -> `components-button--icon-sizes`.
 * The export name decides the id; a `name:` on the story only changes its label.
 * @param {string} title The `title` of the stories file's meta.
 * @param {string} exportName The story's export.
 */
export function storyIdFor(title, exportName) {
  return `${sanitize(title)}--${sanitize(storyNameFromExport(exportName))}`;
}

/**
 * The URL of a story under a Storybook served at `base`.
 * @param {string} base
 * @param {string} storyId
 */
export function storyUrlFor(base, storyId) {
  return `${base.replace(/\/+$/, '')}/?path=/story/${storyId}`;
}

/**
 * The meta title and the story exports of a `*.stories.tsx` source.
 * @param {string} source
 * @returns {{ title: string, stories: string[] }}
 */
export function parseStoriesFile(source) {
  const meta = /const meta\b[^=]*=\s*\{[\s\S]*?\btitle:\s*(['"])(.+?)\1/.exec(source);
  if (!meta) throw new Error('The stories file has no meta title (`const meta = { title: ... }`).');
  const stories = [...source.matchAll(/^export const (\w+)\b/gm)].map((match) => match[1]);
  return { title: meta[2], stories };
}
