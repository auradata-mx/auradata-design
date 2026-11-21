import { expect, test } from 'vitest'

import { buildRegistry } from './registry.mjs'

const registry = buildRegistry()
const item = (name) => registry.items.find((entry) => entry.name === name)

test('publishes the theme, the AuraData components and the shadcn ones AuraData changed', () => {
  const names = registry.items.map((entry) => entry.name)
  for (const name of ['auradata-theme', 'logo', 'kpi-card', 'page-header', 'chart-palette', 'button', 'badge', 'use-mobile']) {
    expect(names).toContain(name)
  }
})

test('leaves the stock shadcn components to shadcn', () => {
  const names = registry.items.map((entry) => entry.name)
  for (const name of ['card', 'dialog', 'sidebar', 'select', 'chart', 'empty', 'input']) {
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
  // The FAQ takes the stock accordion from shadcn.
  expect(item('faq').registryDependencies).toEqual(['accordion', 'cristianruben-dev/auradata-design/section-header'])
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

test('installs the stock spinner with the button, for its loading state', () => {
  expect(item('button').registryDependencies).toEqual(['spinner'])
  expect(registry.items.map((entry) => entry.name)).not.toContain('spinner')
})
