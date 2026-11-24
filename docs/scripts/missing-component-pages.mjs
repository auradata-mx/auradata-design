// Lists the registry `ui` items that no component page documents. A page documents an item when it shows its
// install block, `<ComponentInstall item="<name>" />`; one page may install several items (a component and its parts).
//
//   npm run pages:missing -w docs          # prints the missing items; exits 1 while any is missing
//
// D4 uses it to find the pages left to write, D8 to prove every item has one.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * The item names a page's install blocks name.
 * @param {string} mdx
 * @returns {Set<string>}
 */
export function coveredItems(mdx) {
  return new Set([...mdx.matchAll(/<ComponentInstall\b[^>]*?\bitem=["']([^"']+)["']/g)].map((match) => match[1]));
}

// Internal dependencies remain installable by the blocks that use them, but do not need a catalog page.
const isCatalogItem = (item) => item.type === 'registry:ui' && item.name !== 'logo';

/**
 * The `registry:ui` items no page covers, sorted.
 * @param {{ name: string, type: string }[]} items The `items` of registry.json.
 * @param {Record<string, string>} pages Page file name -> its MDX source.
 * @returns {string[]}
 */
export function findMissingPages(items, pages) {
  const covered = new Set(Object.values(pages).flatMap((mdx) => [...coveredItems(mdx)]));
  return items
    .filter((item) => isCatalogItem(item) && !covered.has(item.name))
    .map((item) => item.name)
    .sort();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const registry = JSON.parse(readFileSync(new URL('../../registry.json', import.meta.url), 'utf8'));
  const dir = new URL('../content/docs/components/', import.meta.url);
  /** @type {Record<string, string>} */
  const pages = {};
  for (const file of readdirSync(dir)) {
    if (file.endsWith('.mdx')) pages[file] = readFileSync(new URL(file, dir), 'utf8');
  }
  const ui = registry.items.filter(isCatalogItem);
  const missing = findMissingPages(registry.items, pages);
  console.log(`${ui.length - missing.length} of ${ui.length} registry ui items have a component page.`);
  if (missing.length > 0) {
    console.log(`Missing (${missing.length}):`);
    for (const name of missing) console.log(`  ${name}`);
    process.exitCode = 1;
  }
}
