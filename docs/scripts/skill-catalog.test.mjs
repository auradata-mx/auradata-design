import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

// The installable agent skill (`npx skills add cristianruben-dev/auradata-design`) must not drift from the registry.
const root = fileURLToPath(new URL('../../', import.meta.url));
const skillDir = join(root, 'skills/auradata');
const componentsDir = join(root, 'docs/content/docs/components');

const read = (path) => readFile(path, 'utf8');
const registry = async () => JSON.parse(await read(join(root, 'registry.json'))).items;

/** `## Heading` → the install names listed under it as `- \`name\` …`. */
function catalogSections(markdown) {
  const sections = new Map();
  let current;
  for (const line of markdown.split('\n')) {
    const heading = line.match(/^## (.+)$/);
    if (heading) sections.set((current = heading[1].trim()), []);
    const item = line.match(/^- `([a-z0-9-]+)`/);
    if (item) {
      assert.ok(current, `«${item[1]}» is listed before any section`);
      sections.get(current).push(item[1]);
    }
  }
  return sections;
}

const pagesIn = async (group) =>
  (await readdir(join(componentsDir, group))).filter((file) => file.endsWith('.mdx')).map((file) => file.slice(0, -4));

test('SKILL.md has the frontmatter the skills CLI needs', async () => {
  const skill = await read(join(skillDir, 'SKILL.md'));
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---\n/)?.[1];
  assert.ok(frontmatter, 'SKILL.md starts with a frontmatter block');
  assert.match(frontmatter, /^name: auradata$/m);
  const description = frontmatter.match(/^description: (.+)$/m)?.[1].replace(/^"(.*)"$/, '$1').trim();
  assert.ok(description, 'description is not empty');
  assert.ok(description.length <= 1024, 'description fits the skills CLI limit');
});

test('the catalog lists every registry item once, and nothing the registry does not ship', async () => {
  const listed = [...catalogSections(await read(join(skillDir, 'references/catalog.md'))).values()].flat();
  const names = (await registry()).map((item) => item.name);
  assert.deepEqual(listed.filter((name, index) => listed.indexOf(name) !== index), [], 'no item is listed twice');
  assert.deepEqual(names.filter((name) => !listed.includes(name)), [], 'registry items missing from the catalog');
  assert.deepEqual(listed.filter((name) => !names.includes(name)), [], 'catalog items that are not in the registry');
});

// Layers follow the docs: Base, AuraData, Gráficas and Efectos are the route groups under components/; blocks, hooks
// and libraries are registry types. Brand groups the theme and the logo, which ship brand assets and have no page.
test('each catalog section holds exactly its layer', async () => {
  const sections = catalogSections(await read(join(skillDir, 'references/catalog.md')));
  const items = await registry();
  const ofType = (type) => items.filter((item) => item.type === type).map((item) => item.name);
  const expected = {
    Brand: ['auradata-theme', 'logo'],
    Base: await pagesIn('(base)'),
    AuraData: await pagesIn('(auradata)'),
    Charts: await pagesIn('(charts)'),
    Effects: await pagesIn('(effects)'),
    Blocks: ofType('registry:block'),
    Hooks: ofType('registry:hook'),
    Libraries: ofType('registry:lib'),
  };
  assert.deepEqual([...sections.keys()].sort(), Object.keys(expected).sort());
  for (const [section, names] of Object.entries(expected)) {
    assert.deepEqual([...sections.get(section)].sort(), [...names].sort(), `section «${section}»`);
  }
});

test('every relative link in the skill resolves to a file', async () => {
  const files = ['SKILL.md', ...(await readdir(join(skillDir, 'references'))).map((file) => `references/${file}`)];
  for (const file of files) {
    const markdown = await read(join(skillDir, file));
    for (const [, target] of markdown.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^[a-z]+:/.test(target) || target.startsWith('#')) continue;
      const path = join(dirname(join(skillDir, file)), target.split('#')[0]);
      assert.ok(existsSync(path), `${file} links to ${target}, which does not exist`);
    }
  }
});
