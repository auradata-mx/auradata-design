/**
 * Writes the registry.json at the root of the repository from the source, so the registry never
 * drifts from it. The shadcn CLI reads it straight from GitHub (`npx shadcn add
 * cristianruben-dev/auradata-design/<item>`), so every path is relative to the repository root:
 *
 *   - one registry:theme item, `auradata-theme`, with the cssVars that @auradata/tokens builds;
 *   - one item per AuraData file of src/components/ui (registry:ui), src/components/blocks
 *     (registry:block), src/hooks (registry:hook) and src/lib (registry:lib), with the npm packages
 *     and the registry items it imports;
 *   - the Continua SVGs of @auradata/tokens with the logo item, installed into public/brand/continua.
 *
 * An AuraData file says so on a line of its own: `// registry: auradata (<why>)`. The other files are
 * stock shadcn, kept for Storybook: apps install them from shadcn, and items that import them name
 * them bare ("card"), which the shadcn CLI resolves to its own registry. Items that import an AuraData
 * item name it by its GitHub address: a bare name would mean the shadcn one.
 *
 * `shadcn build` then turns it into registry/public/r/*.json, for installs from a local file.
 */
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = join(import.meta.dirname, '..');
const repoRoot = join(root, '..');
/** The GitHub address of this registry: owner/repo. */
export const GITHUB = 'cristianruben-dev/auradata-design';
const uiDir = join(root, 'src/components/ui');
const hooksDir = join(root, 'src/hooks');
const libDir = join(root, 'src/lib');
const logosDir = join(root, '../packages/tokens/assets/continua');

/** Files a component needs beside its source, by item name. */
const EXTRA_FILES = {
  logo: readdirSync(logosDir)
    .filter((file) => file.endsWith('.svg'))
    .sort()
    .map((file) => ({
      path: `packages/tokens/assets/continua/${file}`,
      type: 'registry:file',
      // "~/" is the project root: a bare path lands under src/ in a Vite app.
      target: `~/public/brand/continua/${file}`,
    })),
};

/** The line that makes a source file an item of this registry. */
const MARKER = /^\/\/ registry: auradata\b/m;
const isAuraData = (source) => MARKER.test(source);
const require = createRequire(import.meta.url);
const theme = require('@auradata/tokens/shadcn-theme.json');

/** Packages a consumer already has, or that are aliases of this project. */
const PROVIDED = new Set(['react', 'react-dom']);

/** "@base-ui/react/button" → "@base-ui/react", "cn" → "cn"; null for relative or alias imports. */
function packageOf(specifier) {
  if (specifier.startsWith('.') || specifier.startsWith('@/')) return null;
  const parts = specifier.split('/');
  const name = specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
  return PROVIDED.has(name) ? null : name;
}

function dependenciesOf(source) {
  const specifiers = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  return [...new Set(specifiers.map(packageOf).filter(Boolean))].sort();
}

const FOLDERS = {
  'components/ui': { dir: uiDir, type: 'registry:ui', extension: '.tsx' },
  'components/blocks': { dir: join(root, 'src/components/blocks'), type: 'registry:block', extension: '.tsx' },
  hooks: { dir: hooksDir, type: 'registry:hook', extension: '.ts' },
  lib: { dir: libDir, type: 'registry:lib', extension: '.ts' },
};

/** Other registry items a file imports: "@auradata/<name>" for ours, the bare shadcn name otherwise. */
function registryDependenciesOf(source) {
  const imports = [...source.matchAll(/from\s+["']@\/(components\/ui|components\/blocks|hooks|lib)\/([^"']+)["']/g)];
  const names = imports
    // utils (cn) comes with every shadcn app.
    .filter(([, folder, name]) => !(folder === 'lib' && name === 'utils'))
    .map(([, folder, name]) => {
      const { dir, extension } = FOLDERS[folder];
      return isAuraData(readFileSync(join(dir, name + extension), 'utf8')) ? `${GITHUB}/${name}` : name;
    });
  return [...new Set(names)].sort();
}

/** "dropdown-menu" → "Dropdown menu". */
const titleOf = (name) => (name.charAt(0).toUpperCase() + name.slice(1)).replaceAll('-', ' ');

/** One registry item per AuraData source file of a folder. */
function itemsOf(folder) {
  const { dir, type, extension } = FOLDERS[folder];
  return readdirSync(dir)
    .filter((file) => file.endsWith(extension))
    .sort()
    .map((file) => ({ file, source: readFileSync(join(dir, file), 'utf8') }))
    .filter(({ source }) => isAuraData(source))
    .map(({ file, source }) => {
      const name = basename(file, extension);
      const registryDependencies = registryDependenciesOf(source);
      return {
        name,
        type,
        title: titleOf(name),
        dependencies: dependenciesOf(source),
        ...(registryDependencies.length ? { registryDependencies } : {}),
        files: [{ path: `registry/src/${folder}/${file}`, type }, ...(EXTRA_FILES[name] ?? [])],
      };
    });
}

export function buildRegistry() {
  return {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'auradata',
    homepage: 'https://auradata.mx',
    items: [
      {
        name: 'auradata-theme',
        type: 'registry:theme',
        title: 'AuraData theme',
        description: 'The AuraData brand: Azul Aura, Outfit and Geist Mono, light and dark.',
        cssVars: theme,
      },
      ...Object.keys(FOLDERS).flatMap(itemsOf),
    ],
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const registry = buildRegistry();
  writeFileSync(join(repoRoot, 'registry.json'), JSON.stringify(registry, null, 2) + '\n');
  // shadcn build only adds files: drop the items that left the registry.
  rmSync(join(root, 'public/r'), { recursive: true, force: true });
  console.log(`registry.json: ${registry.items.length} items`);
}
