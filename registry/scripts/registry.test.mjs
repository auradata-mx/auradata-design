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
    // T54-T56: shadcn components whose states, spacing, copy or contrast AuraData polished.
    'dialog', 'sidebar', 'chart', 'empty', 'input', 'textarea', 'field', 'tabs', 'sonner', 'navigation-menu',
  ]) {
    expect(names).toContain(name)
  }
})

test('leaves the stock shadcn components to shadcn', () => {
  const names = registry.items.map((entry) => entry.name)
  for (const name of ['card', 'popover', 'separator', 'skeleton', 'table', 'spinner', 'message']) {
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
  expect(item('chart-palette').registryDependencies).toEqual(['cristianruben-dev/auradata-design/chart'])
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
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/logo',
      'card',
      'cristianruben-dev/auradata-design/field',
      'cristianruben-dev/auradata-design/input',
    ]),
  )
  expect(item('app-shell').registryDependencies).toEqual(
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/logo',
      'cristianruben-dev/auradata-design/sidebar',
      'cristianruben-dev/auradata-design/user-menu',
    ]),
  )
  // The avatar comes with the user menu (T65).
  expect(item('user-menu').registryDependencies).toContain('cristianruben-dev/auradata-design/avatar')
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
      'cristianruben-dev/auradata-design/chart',
      'cristianruben-dev/auradata-design/textarea',
    ]),
  )
  expect(item('chat').dependencies).toContain('recharts')
})

test("builds the chat block on shadcn's chat primitives", () => {
  // `message` stays stock; the others carry AuraData's Spanish copy, alignment and focus fixes (T55).
  expect(item('chat').registryDependencies).toEqual(
    expect.arrayContaining([
      'message',
      'cristianruben-dev/auradata-design/bubble',
      'cristianruben-dev/auradata-design/message-scroller',
      'cristianruben-dev/auradata-design/code-block',
      'cristianruben-dev/auradata-design/trace',
    ]),
  )
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

// Apps that install the theme get the data palettes, the status scales, compact density and print styles (T59).
// No @page: the shadcn CLI cannot write declarations inside it ("Unknown word 16mm").
test('gives the theme the data palettes, status scales, compact density and print styles', () => {
  const theme = item('auradata-theme')
  for (const mode of ['light', 'dark']) {
    expect(theme.cssVars[mode]).toHaveProperty('sequential-9')
    expect(theme.cssVars[mode]).toHaveProperty('diverging-5')
    expect(theme.cssVars[mode]).toHaveProperty('destructive-700')
  }
  expect(theme.cssVars.theme['color-success-50']).toBe('var(--success-50)')
  expect(theme.css['@layer base']['[data-density="compact"]']).toEqual({ '--spacing': '0.21875rem' })
  expect(theme.css['@media print'][':root:root, .dark.dark']['--background']).toBe('#FFFFFF')
  expect(Object.keys(theme.css)).not.toContain('@page')
})

// T60: notifications.
test('publishes the announcement banner and the notification center, and gives the app shell the bell', () => {
  expect(item('announcement-banner').registryDependencies).toEqual(['cristianruben-dev/auradata-design/button'])
  expect(item('notification-center').registryDependencies).toEqual(
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/button',
      'cristianruben-dev/auradata-design/empty',
      'popover',
      'cristianruben-dev/auradata-design/sheet',
      'skeleton',
      'cristianruben-dev/auradata-design/use-mobile',
    ]),
  )
  expect(item('app-shell').registryDependencies).toContain('cristianruben-dev/auradata-design/notification-center')
})

test('installs the progress bar and the formatter with sonner, for progress toasts', () => {
  expect(item('sonner').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/progress', 'cristianruben-dev/auradata-design/format']),
  )
})

test('installs the data table with its own parts (T61)', () => {
  expect(item('data-table').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/checkbox', 'cristianruben-dev/auradata-design/data-table-selection-bar'])
  )
  expect(item('data-table-selection-bar').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/button', 'cristianruben-dev/auradata-design/format', 'separator'])
  )
})

// T65: app patterns.
test('publishes the segmented control on the Base UI radio group, and tabs with counts', () => {
  expect(item('segmented-control')?.type).toBe('registry:ui')
  expect(item('segmented-control').dependencies).toContain('@base-ui/react')
  expect(item('tabs').registryDependencies).toEqual(expect.arrayContaining(['cristianruben-dev/auradata-design/format']))
})

test('publishes the master-detail view', () => {
  expect(item('master-detail')?.type).toBe('registry:ui')
  expect(item('master-detail').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/button']),
  )
})

test('publishes the onboarding checklist with its progress bar', () => {
  expect(item('onboarding-checklist')?.type).toBe('registry:ui')
  expect(item('onboarding-checklist').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/progress', 'card']),
  )
})

test('publishes the guided tour on the Base UI popover', () => {
  expect(item('tour')?.type).toBe('registry:ui')
  expect(item('tour').dependencies).toContain('@base-ui/react')
  expect(item('tour').registryDependencies).toEqual(expect.arrayContaining(['cristianruben-dev/auradata-design/button']))
})

test('publishes the shortcuts dialog with the search command, whose key labels it reuses', () => {
  expect(item('shortcuts-dialog')?.type).toBe('registry:ui')
  expect(item('shortcuts-dialog').registryDependencies).toEqual(
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/search-command',
      'cristianruben-dev/auradata-design/kbd',
      'cristianruben-dev/auradata-design/dialog',
    ]),
  )
})

test('publishes the user menu and installs it with the app shell', () => {
  expect(item('user-menu')?.type).toBe('registry:ui')
  expect(item('user-menu').registryDependencies).toEqual(
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/dropdown-menu',
      'cristianruben-dev/auradata-design/theme-toggle',
      'cristianruben-dev/auradata-design/initials',
    ]),
  )
  expect(item('app-shell').registryDependencies).toContain('cristianruben-dev/auradata-design/user-menu')
})

test('publishes the empty-state illustrations', () => {
  expect(item('empty-illustration')?.type).toBe('registry:ui')
})

test('installs the attachment with the chat block, for the files of a question', () => {
  expect(item('chat').registryDependencies).toContain('cristianruben-dev/auradata-design/attachment')
})

test('publishes the message feedback and installs it with the chat block', () => {
  expect(item('message-feedback')?.type).toBe('registry:ui')
  expect(item('chat').registryDependencies).toContain('cristianruben-dev/auradata-design/message-feedback')
})

test('publishes the insight card and installs it with the chat block', () => {
  expect(item('insight-card')?.type).toBe('registry:ui')
  expect(item('insight-card').registryDependencies).toEqual(
    expect.arrayContaining(['card', 'cristianruben-dev/auradata-design/format']),
  )
  expect(item('chat').registryDependencies).toContain('cristianruben-dev/auradata-design/insight-card')
})
