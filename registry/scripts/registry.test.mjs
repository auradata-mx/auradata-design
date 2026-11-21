import { expect, test } from 'vitest'

import { buildRegistry } from './registry.mjs'

const registry = buildRegistry()
const item = (name) => registry.items.find((entry) => entry.name === name)

test('publishes the theme, the AuraData components and the shadcn ones AuraData changed', () => {
  const names = registry.items.map((entry) => entry.name)
  for (const name of [
    'auradata-theme', 'logo', 'kpi-card', 'page-header', 'chart-palette', 'button', 'badge', 'use-mobile',
    // T52: shadcn components whose states AuraData fixed.
    'checkbox', 'accordion', 'select', 'input-group',
  ]) {
    expect(names).toContain(name)
  }
})

test('leaves the stock shadcn components to shadcn', () => {
  const names = registry.items.map((entry) => entry.name)
  for (const name of ['card', 'dialog', 'sidebar', 'chart', 'empty', 'input']) {
    expect(names).not.toContain(name)
  }
})

// shadcn reads a GitHub registry from the registry.json at the root of the repository.
test('lists files from the repository root, as a GitHub registry needs', () => {
  expect(item('kpi-card').files[0].path).toBe('registry/src/components/ui/kpi-card.tsx')
  expect(item('logo').files[1].path).toMatch(/^packages\/tokens\/assets\/continua\//)
})

test('points at shadcn for stock dependencies and at this GitHub repository for ours', () => {
  expect(item('login').registryDependencies).toContain('cristianruben-dev/auradata-design/button')
  expect(item('kpi-card').registryDependencies).toEqual(['card', 'cristianruben-dev/auradata-design/format', 'skeleton'])
  expect(item('chart-palette').registryDependencies).toEqual(['chart'])
})

test('installs the Continua SVGs with the logo', () => {
  const targets = item('logo').files.map((file) => file.target).filter(Boolean)
  expect(targets).toContain('~/public/brand/continua/horizontal-color.svg')
  expect(targets).toHaveLength(11)
})

test('publishes the blocks with their components', () => {
  for (const name of ['login', 'app-shell', 'settings']) {
    expect(item(name)?.type).toBe('registry:block')
  }
  expect(item('login').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/logo', 'card', 'field', 'input']),
  )
  expect(item('app-shell').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/logo', 'sidebar', 'avatar']),
  )
})

test('installs the workspace switcher and the theme toggle with the app shell', () => {
  expect(item('app-shell').registryDependencies).toEqual(
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/workspace-switcher',
      'cristianruben-dev/auradata-design/theme-toggle',
    ]),
  )
  expect(item('workspace-switcher').registryDependencies).toContain('cristianruben-dev/auradata-design/initials')
})

test('publishes the marketing blocks with the eyebrow, the gradient heading and the aura', () => {
  for (const name of ['hero', 'cta-band', 'benefits-grid', 'faq', 'site-footer']) {
    expect(item(name)?.type).toBe('registry:block')
  }
  expect(item('hero').registryDependencies).toEqual(
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/aura-background',
      'cristianruben-dev/auradata-design/eyebrow',
      'cristianruben-dev/auradata-design/gradient-heading',
    ]),
  )
  // The FAQ takes AuraData's accordion (its disabled item dims, T52).
  expect(item('faq').registryDependencies).toEqual([
    'cristianruben-dev/auradata-design/accordion',
    'cristianruben-dev/auradata-design/section-header',
  ])
  expect(item('site-footer').registryDependencies).toEqual(['cristianruben-dev/auradata-design/logo'])
})

test('publishes the chat block with the KPI card and the chart palette', () => {
  expect(item('chat')?.type).toBe('registry:block')
  expect(item('chat').registryDependencies).toEqual(
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/kpi-card',
      'cristianruben-dev/auradata-design/chart-palette',
      'cristianruben-dev/auradata-design/logo',
      'chart',
      'textarea',
    ]),
  )
  expect(item('chat').dependencies).toContain('recharts')
})

test("builds the chat block on shadcn's chat primitives, installed bare from shadcn", () => {
  expect(item('chat').registryDependencies).toEqual(
    expect.arrayContaining(['message', 'bubble', 'message-scroller', 'code-block', 'trace']),
  )
  // Stock primitives: shadcn installs them (and @shadcn/react with the scroller); this registry does not.
  const names = registry.items.map((entry) => entry.name)
  for (const primitive of ['message', 'bubble', 'message-scroller', 'code-block', 'trace']) {
    expect(names).not.toContain(primitive)
  }
})

test('installs the stock spinner with the button, for its loading state', () => {
  expect(item('button').registryDependencies).toEqual(['spinner'])
  expect(registry.items.map((entry) => entry.name)).not.toContain('spinner')
})

// Apps that install the theme inherit the brand focus ring, without copying any component (T51).
test('gives the theme the brand focus ring as css, apart from its variables', () => {
  const theme = item('auradata-theme')
  expect(theme.css['@layer base'][':focus-visible']).toEqual({ outline: '2px solid var(--ring)', 'outline-offset': '2px' })
  expect(Object.values(theme.css).some((rule) => rule['--tw-ring-shadow'] === '0 0 #0000')).toBe(true)
  expect(Object.keys(theme.cssVars).sort()).toEqual(['dark', 'light', 'theme'])
})
