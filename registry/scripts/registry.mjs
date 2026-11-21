/**
 * Writes registry.json from the source, so the registry never drifts from it:
 *
 *   - one registry:theme item, `auradata-theme`, with the cssVars that @auradata/tokens builds;
 *   - one registry:ui item per file in src/components/ui, with the npm packages it imports.
 *
 * `shadcn build` then turns registry.json into public/r/*.json.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, join } from 'node:path';

const root = join(import.meta.dirname, '..');
const uiDir = join(root, 'src/components/ui');
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

/** Other registry components a file imports through the @/components/ui alias. */
function registryDependenciesOf(source) {
  const names = [...source.matchAll(/from\s+["']@\/components\/ui\/([^"']+)["']/g)].map((match) => match[1]);
  return [...new Set(names)].sort();
}

const components = readdirSync(uiDir)
  .filter((file) => file.endsWith('.tsx'))
  .sort()
  .map((file) => {
    const source = readFileSync(join(uiDir, file), 'utf8');
    const name = basename(file, '.tsx');
    const registryDependencies = registryDependenciesOf(source).map((dep) => `@auradata/${dep}`);
    return {
      name,
      type: 'registry:ui',
      title: name.charAt(0).toUpperCase() + name.slice(1),
      dependencies: dependenciesOf(source),
      ...(registryDependencies.length ? { registryDependencies } : {}),
      files: [{ path: `src/components/ui/${file}`, type: 'registry:ui' }],
    };
  });

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
