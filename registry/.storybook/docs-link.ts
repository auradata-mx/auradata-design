import registry from '../../registry.json'

/** The public docs site: the brand guide and one page per registry component live there. */
export const DOCS_ORIGIN = 'https://design.auradata.mx'

/** The registry `ui` items: each one has its page at `/docs/components/<name>/`. */
const ITEMS = new Set(registry.items.filter((item) => item.type === 'registry:ui').map((item) => item.name))

/** Story titles whose last segment does not read as the item name. */
const ALIASES: Record<string, string> = {
  'AuraData/Charts': 'chart',
  'AuraData/Empty state': 'empty',
  'AuraData/Empty illustrations': 'empty-illustration',
}

/** Storybook's `sanitize`: `KPI card` -> `kpi-card`. */
function sanitize(value: string) {
  return value
    .toLowerCase()
    .replace(/[ '`~!@#$%^&*()_|+\-=?;:",.<>{}[\]\\/]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * The docs page of a stories file, from its title: `AuraData/KPI card` -> `/docs/components/kpi-card/`.
 * Blocks go to the blocks gallery; a title with no registry item (stock shadcn parts, showcases) goes to
 * the components index.
 */
export function docsUrlForTitle(title: string): string {
  if (title.startsWith('Blocks/')) return `${DOCS_ORIGIN}/docs/blocks/`
  const name = ALIASES[title] ?? sanitize(title.split('/').pop() ?? '')
  return ITEMS.has(name) ? `${DOCS_ORIGIN}/docs/components/${name}/` : `${DOCS_ORIGIN}/docs/components/`
}
