/**
 * Writes registry.json from the source, so the registry never drifts from it:
 *
 *   - one registry:theme item, `auradata-theme`, with the cssVars that @auradata/tokens builds;
 *   - one registry:ui item per file in src/components/ui, with the npm packages it imports;
 *   - one registry:hook item per file in src/hooks, which the components import as @/hooks/<name>;
 *   - one registry:lib item per file in src/lib but utils.ts, which every shadcn app already has;
 *   - the Continua SVGs of @auradata/tokens with the logo item, installed into public/brand/continua.
 *
 * `shadcn build` then turns registry.json into public/r/*.json.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, join } from 'node:path';

const root = join(import.meta.dirname, '..');
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
      path: `../packages/tokens/assets/continua/${file}`,
      type: 'registry:file',
      target: `public/brand/continua/${file}`,
    })),
};

/** Shadcn ships these itself: never registry items of their own. */
const SHADCN_OWNED = new Set(['utils']);
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

/** Other registry items a file imports through the @/components/ui and @/hooks aliases. */
function registryDependenciesOf(source) {
  const names = [...source.matchAll(/from\s+["']@\/(?:components\/ui|hooks|lib)\/([^"']+)["']/g)].map((match) => match[1]);
  return [...new Set(names)].filter((name) => !SHADCN_OWNED.has(name)).sort();
}

/** "dropdown-menu" → "Dropdown menu". */
const titleOf = (name) => (name.charAt(0).toUpperCase() + name.slice(1)).replaceAll('-', ' ');

/** One registry item per source file of a folder. */
function itemsOf(dir, folder, type, extension) {
  return readdirSync(dir)
    .filter((file) => file.endsWith(extension) && !SHADCN_OWNED.has(basename(file, extension)))
    .sort()
    .map((file) => {
      const source = readFileSync(join(dir, file), 'utf8');
      const name = basename(file, extension);
      const registryDependencies = registryDependenciesOf(source).map((dep) => `@auradata/${dep}`);
      return {
        name,
        type,
        title: titleOf(name),
        dependencies: dependenciesOf(source),
        ...(registryDependencies.length ? { registryDependencies } : {}),
        files: [{ path: `${folder}/${file}`, type }, ...(EXTRA_FILES[name] ?? [])],
      };
    });
}

const components = [
  ...itemsOf(uiDir, 'src/components/ui', 'registry:ui', '.tsx'),
  ...itemsOf(hooksDir, 'src/hooks', 'registry:hook', '.ts'),
  ...itemsOf(libDir, 'src/lib', 'registry:lib', '.ts'),
];

const registry = {
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
    ...components,
  ],
};

writeFileSync(join(root, 'registry.json'), JSON.stringify(registry, null, 2) + '\n');
console.log(`registry.json: ${registry.items.length} items`);
