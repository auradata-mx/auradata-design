// Build-time access to the repository the component pages document: the registry items, the example sources and
// the Storybook stories. Every page is statically generated, so these read real files with `fs` while building.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createFileSystemGeneratorCache, createGenerator } from 'fumadocs-typescript';
import type { AutoTypeTableProps } from 'fumadocs-typescript/ui';
import { storybookStoryUrl } from './shared';
import { parseStoriesFile, storyIdFor } from './storybook-id.mjs';

/** `next build` and `next dev` run in docs/, so the repository root is its parent. */
const repoRoot = path.resolve(process.cwd(), '..');
const docsRoot = process.cwd();

export const registryComponentsDir = path.join(repoRoot, 'registry/src/components/ui');
const storiesDir = path.join(repoRoot, 'registry/src/stories');
const examplesDir = path.join(docsRoot, 'src/examples');

type RegistryItem = { name: string; type: string; title?: string; description?: string };

let registryItems: Promise<RegistryItem[]> | undefined;
let storyFiles: Promise<Set<string>> | undefined;

/** A registry item by name; a typo fails the build instead of publishing a command that installs nothing. */
export async function getRegistryItem(name: string): Promise<RegistryItem> {
  registryItems ??= readFile(path.join(repoRoot, 'registry.json'), 'utf8').then(
    (json) => (JSON.parse(json) as { items: RegistryItem[] }).items,
  );
  const item = (await registryItems).find((candidate) => candidate.name === name);
  if (!item) throw new Error(`registry.json has no item named «${name}».`);
  return item;
}

/** The source of an example, `button/variants` -> docs/src/examples/button/variants.tsx, as the code tab shows it. */
export async function readExampleSource(name: string): Promise<string> {
  return (await readFile(path.join(examplesDir, `${name}.tsx`), 'utf8')).trimEnd();
}

/**
 * The Storybook URL of a story: `Button` + `Primary` reads registry/src/stories/Button.stories.tsx and links to
 * `components-button--primary`. A story that does not exist fails the build, so a page never links to nothing.
 */
export async function getStoryUrl(stories: string, story: string): Promise<string> {
  const fileName = `${stories}.stories.tsx`;
  // Check the exact directory entry name so macOS's case-insensitive FS cannot mask a Linux build failure.
  storyFiles ??= readdir(storiesDir).then((entries) => new Set(entries));
  if (!(await storyFiles).has(fileName)) {
    throw new Error(`registry/src/stories has no file named «${fileName}» (case-sensitive check).`);
  }
  const source = await readFile(path.join(storiesDir, fileName), 'utf8');
  const { title, id, stories: exports } = parseStoriesFile(source);
  if (!exports.includes(story)) {
    throw new Error(`${fileName} has no story «${story}». Its stories: ${exports.join(', ')}.`);
  }
  return storybookStoryUrl(storyIdFor(id ?? title, story));
}

/** One TypeScript generator for every props table, cached between builds. */
export const typeGenerator = createGenerator({
  tsconfigPath: path.join(docsRoot, 'tsconfig.json'),
  cache: createFileSystemGeneratorCache('.next/fumadocs-typescript'),
});

/**
 * The props table's options. A short union is spelled out (`"default" | "outline" | …`, without `null` and
 * `undefined`) instead of Fumadocs' bare «union», since its values are what a reader looks for; a long one stays
 * short in the column and complete when the row opens.
 */
export const typeTableOptions: NonNullable<AutoTypeTableProps['options']> = {
  basePath: registryComponentsDir,
  typeSimplifier: {
    override: ({ type, checker, location }) => {
      const full = checker.typeToString(type, location);
      if (!full.includes(' | ')) return undefined;
      const members = full.split(' | ').filter((member: string) => member !== 'undefined' && member !== 'null');
      const spelled = members.join(' | ');
      return spelled.length <= 100 ? spelled : undefined;
    },
  },
};
