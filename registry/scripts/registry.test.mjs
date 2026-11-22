import { expect, test } from 'vitest'

import { GITHUB, buildRegistry } from './registry.mjs'

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
  expect(item('kpi-card').registryDependencies).toEqual([
    'card',
    'cristianruben-dev/auradata-design/delta',
    'cristianruben-dev/auradata-design/sparkline',
    'skeleton',
  ])
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

// T64: the effects are components; the new marketing blocks build on them.
test('publishes the effects and the new marketing blocks on top of them', () => {
  const ours = (name) => `cristianruben-dev/auradata-design/${name}`
  for (const name of ['progressive-blur', 'marquee', 'number-ticker', 'spotlight-card', 'gradient-border', 'shimmer-button', 'text-reveal']) {
    expect(item(name)?.type).toBe('registry:ui')
  }
  for (const name of ['pricing', 'plan-comparison', 'testimonials', 'logo-cloud', 'feature-tabs', 'changelog']) {
    expect(item(name)?.type).toBe('registry:block')
  }
  // Effects that wrap a component take ours (button) or shadcn's (card); the ticker writes with lib/format.
  expect(item('shimmer-button').registryDependencies).toEqual([ours('button')])
  expect(item('spotlight-card').registryDependencies).toEqual(['card'])
  expect(item('number-ticker').registryDependencies).toEqual([ours('format')])
  // The recommended plan wears the gradient border; prices in MXN come from lib/format.
  expect(item('pricing').registryDependencies).toEqual(
    expect.arrayContaining([ours('gradient-border'), ours('format'), ours('toggle-group'), ours('section-header')]),
  )
  expect(item('logo-cloud').registryDependencies).toEqual([ours('marquee')])
  expect(item('plan-comparison').registryDependencies).toEqual([ours('badge'), ours('section-header'), 'table'])
  expect(item('testimonials').registryDependencies).toEqual([ours('avatar'), ours('initials'), ours('section-header')])
  expect(item('changelog').registryDependencies).toEqual(expect.arrayContaining([ours('format')]))
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
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/checkbox',
      'cristianruben-dev/auradata-design/data-table-selection-bar',
      'cristianruben-dev/auradata-design/faceted-filter',
      'cristianruben-dev/auradata-design/filter-chips',
      'cristianruben-dev/auradata-design/range-filter',
      'cristianruben-dev/auradata-design/date-range-filter',
      'cristianruben-dev/auradata-design/filter-builder',
      'cristianruben-dev/auradata-design/filter-conditions',
    ])
  )
  expect(item('data-table-selection-bar').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/button', 'cristianruben-dev/auradata-design/format', 'separator'])
  )
  // The filter system stands alone: a dashboard installs a filter without the table.
  for (const filter of ['faceted-filter', 'range-filter', 'filter-chips'])
    expect(item(filter).registryDependencies).not.toContain('cristianruben-dev/auradata-design/data-table')
  expect(item('range-filter').registryDependencies).toContain('cristianruben-dev/auradata-design/slider')
  expect(item('filter-builder').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/filter-conditions', 'cristianruben-dev/auradata-design/native-select'])
  )
  expect(item('filter-conditions').type).toBe('registry:lib')
  expect(item('table-export').dependencies).toEqual(['fflate'])
  expect(item('use-saved-views').type).toBe('registry:hook')
  expect(item('data-table').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/data-table-views', 'cristianruben-dev/auradata-design/use-saved-views'])
  )
  expect(item('use-data-table-url-state').type).toBe('registry:hook')
  expect(item('use-data-table-url-state').registryDependencies).toEqual(['cristianruben-dev/auradata-design/data-table'])
  expect(item('data-table').registryDependencies).toContain('cristianruben-dev/auradata-design/table-export')
  expect(item('faceted-filter').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/command', 'popover', 'cristianruben-dev/auradata-design/badge'])
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

test('publishes the chart pieces with the formats and the delta they share', () => {
  expect(item('delta').registryDependencies).toEqual(['cristianruben-dev/auradata-design/format'])
  expect(item('chart').registryDependencies).toEqual([
    'cristianruben-dev/auradata-design/delta',
    'cristianruben-dev/auradata-design/format',
  ])
})

test('publishes the chart card with its states, its menu and the PNG export', () => {
  expect(item('chart-export').type).toBe('registry:lib')
  expect(item('chart-card').registryDependencies).toEqual(
    expect.arrayContaining([
      'card',
      'skeleton',
      'table',
      'cristianruben-dev/auradata-design/chart-export',
      'cristianruben-dev/auradata-design/dialog',
      'cristianruben-dev/auradata-design/dropdown-menu',
      'cristianruben-dev/auradata-design/empty',
      'cristianruben-dev/auradata-design/error-state',
      'cristianruben-dev/auradata-design/format',
    ]),
  )
})

test('publishes the cartesian charts on the chart, its palette and the formats', () => {
  expect(item('cartesian-chart').registryDependencies).toEqual([
    'cristianruben-dev/auradata-design/chart',
    'cristianruben-dev/auradata-design/chart-palette',
    'cristianruben-dev/auradata-design/format',
  ])
  expect(item('cartesian-chart').dependencies).toEqual(['cn', 'recharts'])
})

test('publishes the donut and the funnel on the palette and the formats', () => {
  expect(item('donut-chart').registryDependencies).toEqual([
    'cristianruben-dev/auradata-design/chart',
    'cristianruben-dev/auradata-design/chart-palette',
    'cristianruben-dev/auradata-design/format',
  ])
  expect(item('funnel-chart').registryDependencies).toEqual(['cristianruben-dev/auradata-design/format'])
})

test('publishes the sparkline on its own and the gauge with the formats', () => {
  expect(item('sparkline').dependencies).toEqual(['cn'])
  expect(item('sparkline').registryDependencies).toBeUndefined()
  expect(item('gauge').registryDependencies).toEqual(['cristianruben-dev/auradata-design/format'])
})

test('publishes the heatmaps on the sequential and diverging palettes', () => {
  expect(item('heatmap').registryDependencies).toEqual([
    'cristianruben-dev/auradata-design/chart-palette',
    'cristianruben-dev/auradata-design/format',
  ])
})

test('publishes the dashboard grid and the dashboard block built on it', () => {
  expect(item('dashboard-grid').type).toBe('registry:ui')
  expect(item('dashboard').type).toBe('registry:block')
  expect(item('dashboard').registryDependencies).toEqual(
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/dashboard-grid',
      'cristianruben-dev/auradata-design/kpi-card',
      'cristianruben-dev/auradata-design/chart-card',
      'cristianruben-dev/auradata-design/cartesian-chart',
      'cristianruben-dev/auradata-design/donut-chart',
      'cristianruben-dev/auradata-design/funnel-chart',
      'cristianruben-dev/auradata-design/data-table',
      'cristianruben-dev/auradata-design/date-range-filter',
      'cristianruben-dev/auradata-design/page-header',
    ]),
  )
})

test('publishes the advanced form controls with their helpers (T63)', () => {
  const names = registry.items.map((entry) => entry.name)
  for (const name of [
    'number-input', 'currency-input', 'phone-input', 'file-dropzone', 'csv-preview', 'date-picker', 'time-picker',
    'input-otp', 'password-input', 'stepper', 'amount-input', 'phone', 'file-upload', 'date-time', 'password-strength',
  ]) {
    expect(names).toContain(name)
  }
  expect(item('currency-input').registryDependencies).toContain(`${GITHUB}/amount-input`)
  expect(item('amount-input').registryDependencies).toEqual([`${GITHUB}/format`])
  expect(item('phone-input').registryDependencies).toContain(`${GITHUB}/phone`)
  expect(item('file-dropzone').registryDependencies).toEqual(
    expect.arrayContaining([`${GITHUB}/attachment`, `${GITHUB}/file-upload`, `${GITHUB}/progress`])
  )
  expect(item('date-picker').registryDependencies).toEqual(
    expect.arrayContaining([`${GITHUB}/calendar`, `${GITHUB}/time-picker`, `${GITHUB}/date-time`, 'popover'])
  )
  expect(item('input-otp').dependencies).toContain('input-otp')
})

test('publishes the validated connection form with react-hook-form and zod (T63)', () => {
  expect(item('connection-form')?.type).toBe('registry:block')
  expect(item('connection-form').dependencies).toEqual(['@hookform/resolvers', 'react-hook-form', 'zod'])
  expect(item('connection-form').registryDependencies).toEqual(
    expect.arrayContaining([`${GITHUB}/number-input`, `${GITHUB}/password-input`, `${GITHUB}/select`, `${GITHUB}/field`])
  )
})
