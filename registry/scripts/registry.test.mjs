import { expect, test } from 'vitest'

import { GITHUB, buildRegistry } from './registry.mjs'

const registry = buildRegistry()
const item = (name) => registry.items.find((entry) => entry.name === name)
const filesOf = (name) => item(name).files.map((file) => file.path)

test('publishes the theme, the AuraData components and the shadcn ones AuraData changed', () => {
  const names = registry.items.map((entry) => entry.name)
  for (const name of [
    'auradata-theme', 'logo', 'filter', 'page-header', 'chart-palette', 'button', 'badge', 'use-mobile',
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
  expect(item('filter').files[0].path).toBe('registry/src/components/ui/filter.tsx')
  expect(item('logo').files[1].path).toMatch(/^packages\/tokens\/assets\/continua\//)
})

test('points at shadcn for stock dependencies and at this GitHub repository for ours', () => {
  expect(item('login').registryDependencies).toContain('auradata-mx/auradata-design/button')
  expect(item('dashboard').registryDependencies).toEqual(
    expect.arrayContaining(['card', 'auradata-mx/auradata-design/delta', 'auradata-mx/auradata-design/sparkline', 'skeleton']),
  )
  expect(item('chart-palette').registryDependencies).toEqual(['auradata-mx/auradata-design/chart'])
})

test('installs the Continua SVGs with the logo', () => {
  const targets = item('logo').files.map((file) => file.target).filter(Boolean)
  expect(targets).toContain('~/public/brand/continua/horizontal-color.svg')
  expect(targets).toHaveLength(11)
})

test('publishes the blocks with their components', () => {
  for (const name of ['login', 'app-shell', 'dashboard', 'chat', 'not-found']) {
    expect(item(name)?.type).toBe('registry:block')
  }
  expect(item('login').registryDependencies).toEqual(
    expect.arrayContaining([
      'auradata-mx/auradata-design/logo',
      'card',
      'auradata-mx/auradata-design/field',
      'auradata-mx/auradata-design/input',
    ]),
  )
  expect(item('app-shell').registryDependencies).toEqual(
    expect.arrayContaining([
      'auradata-mx/auradata-design/logo',
      'auradata-mx/auradata-design/sidebar',
    ]),
  )
  // The avatar comes with the user menu, a part of the shell (T65).
  expect(item('app-shell').registryDependencies).toContain('auradata-mx/auradata-design/avatar')
})

test('omits retired catalog entries while keeping the internal logo and input group', () => {
  for (const name of [
    'onboarding-checklist', 'csv-preview', 'currency-input', 'empty-illustration',
    'master-detail', 'phone-input', 'connection-form', 'settings',
  ]) {
    expect(item(name), name).toBeUndefined()
  }
  expect(item('input-group')?.type).toBe('registry:ui')
  for (const name of ['app-shell', 'chat', 'login', 'not-found']) {
    expect(item(name).registryDependencies).toContain(`${GITHUB}/logo`)
  }
})

test('installs the theme toggle with the app shell, whose workspace switcher ships inside it', () => {
  expect(item('app-shell').registryDependencies).toContain('auradata-mx/auradata-design/theme-toggle')
  expect(filesOf('app-shell')).toContain('registry/src/components/blocks/workspace-switcher.tsx')
  expect(item('app-shell').registryDependencies).toContain('auradata-mx/auradata-design/initials')
})

// No marketing blocks (hero, pricing, FAQ…) and no spotlight card, gradient border or text reveal: the effects
// that stay are components of their own.
test('publishes the effects without the marketing blocks', () => {
  const ours = (name) => `auradata-mx/auradata-design/${name}`
  const names = registry.items.map((entry) => entry.name)
  const removed = ['hero', 'logo-cloud', 'benefits-grid', 'feature-tabs', 'testimonials', 'pricing', 'plan-comparison',
    'faq', 'changelog', 'cta-band', 'site-footer', 'spotlight-card', 'gradient-border', 'text-reveal']
  for (const name of removed) expect(names).not.toContain(name)
  for (const name of ['progressive-blur', 'marquee', 'number-ticker', 'aura-background', 'eyebrow', 'gradient-heading']) {
    expect(item(name)?.type).toBe('registry:ui')
  }
  // The sheen is a prop of the button and the section header an example of the gradient heading, not components.
  for (const name of ['shimmer-button', 'section-header']) expect(names).not.toContain(name)
  // The ticker writes with lib/format.
  expect(item('number-ticker').registryDependencies).toEqual([ours('format')])
})

test('publishes the chat block with the KPI card inside it and the chart palette', () => {
  expect(item('chat')?.type).toBe('registry:block')
  expect(filesOf('chat')).toContain('registry/src/components/blocks/kpi-card.tsx')
  expect(item('chat').registryDependencies).toEqual(
    expect.arrayContaining([
      'auradata-mx/auradata-design/chart-palette',
      'auradata-mx/auradata-design/logo',
      'auradata-mx/auradata-design/chart',
      'auradata-mx/auradata-design/textarea',
    ]),
  )
  expect(item('chat').dependencies).toContain('recharts')
})

test("builds the chat block on shadcn's chat primitives", () => {
  // `message` stays stock; the others carry AuraData's Spanish copy, alignment and focus fixes (T55).
  expect(item('chat').registryDependencies).toEqual(
    expect.arrayContaining([
      'message',
      'auradata-mx/auradata-design/bubble',
      'auradata-mx/auradata-design/message-scroller',
      'auradata-mx/auradata-design/code-block',
      'auradata-mx/auradata-design/trace',
    ]),
  )
})

test('installs the stock spinner with the button, for its loading state', () => {
  expect(item('button').registryDependencies).toEqual(['spinner'])
  expect(registry.items.map((entry) => entry.name)).not.toContain('spinner')
})

// Apps that install the theme inherit the brand focus ring, without copying any component (T51).
test('gives the theme the focus halo and the soft field border, apart from its variables', () => {
  const theme = item('auradata-theme')
  expect(theme.css['@layer base'][':focus-visible']).toEqual({ outline: '2px solid var(--ring)', 'outline-offset': '2px' })
  expect(Object.values(theme.css).some((rule) => String(rule['--tw-ring-shadow']).startsWith('0 0 0 1px var(--ring)'))).toBe(true)
  expect(theme.cssVars.light['field-border']).toBe('#C4C4CC')
  expect(theme.cssVars.theme['color-field-border']).toBe('var(--field-border)')
  expect(Object.keys(theme.cssVars).sort()).toEqual(['dark', 'light', 'theme'])
})

// Apps that install the theme get the data palettes and the status scales (T59); no global density or print styles.
test('gives the theme the data palettes and status scales, without density or print styles', () => {
  const theme = item('auradata-theme')
  for (const mode of ['light', 'dark']) {
    expect(theme.cssVars[mode]).toHaveProperty('sequential-9')
    expect(theme.cssVars[mode]).toHaveProperty('diverging-5')
    expect(theme.cssVars[mode]).toHaveProperty('destructive-700')
  }
  expect(theme.cssVars.theme['color-success-50']).toBe('var(--success-50)')
  expect(theme.css['@layer base']).not.toHaveProperty('[data-density="compact"]')
  expect(Object.keys(theme.css)).not.toContain('@media print')
})

// One panel component: the responsive drawer comes up from the bottom on a phone and from a side on a wide screen.
test('has no sheet: the sidebar and the notification center open a drawer on a phone', () => {
  expect(registry.items.map((entry) => entry.name)).not.toContain('sheet')
  expect(item('sidebar').registryDependencies).toContain('auradata-mx/auradata-design/drawer')
  expect(item('drawer').registryDependencies).toEqual(
    expect.arrayContaining(['auradata-mx/auradata-design/button', 'auradata-mx/auradata-design/use-mobile']),
  )
})

// T60: notifications.
test('publishes the announcement banner, and gives the app shell the bell inside it', () => {
  expect(item('announcement-banner').registryDependencies).toEqual(['auradata-mx/auradata-design/button'])
  expect(filesOf('app-shell')).toContain('registry/src/components/blocks/notification-center.tsx')
  expect(item('app-shell').registryDependencies).toEqual(
    expect.arrayContaining([
      'auradata-mx/auradata-design/button',
      'auradata-mx/auradata-design/empty',
      'popover',
      'auradata-mx/auradata-design/drawer',
      'skeleton',
      'auradata-mx/auradata-design/use-mobile',
    ]),
  )
})

test('installs the progress bar and the formatter with sonner, for progress toasts', () => {
  expect(item('sonner').registryDependencies).toEqual(
    expect.arrayContaining(['auradata-mx/auradata-design/progress', 'auradata-mx/auradata-design/format']),
  )
})

test('installs the data table with its own parts (T61)', () => {
  expect(item('data-table').registryDependencies).toEqual(
    expect.arrayContaining([
      'auradata-mx/auradata-design/checkbox',
      'auradata-mx/auradata-design/filter',
      'auradata-mx/auradata-design/filter-chips',
      'auradata-mx/auradata-design/filter-builder',
      'auradata-mx/auradata-design/filter-conditions',
    ])
  )
  // The selection bar and the views menu are parts of the table: files of its item, not items of their own.
  for (const part of ['data-table-selection-bar', 'data-table-views']) {
    expect(item(part), part).toBeUndefined()
    expect(filesOf('data-table')).toContain(`registry/src/components/ui/${part}.tsx`)
  }
  expect(item('data-table').registryDependencies).toEqual(
    expect.arrayContaining(['separator', 'auradata-mx/auradata-design/dialog', 'auradata-mx/auradata-design/field'])
  )
  // The filter system stands alone: a dashboard installs a filter without the table.
  for (const filter of ['filter', 'filter-chips'])
    expect(item(filter).registryDependencies).not.toContain('auradata-mx/auradata-design/data-table')
  expect(item('filter').registryDependencies).toContain('auradata-mx/auradata-design/slider')
  expect(item('filter-builder').registryDependencies).toEqual(
    expect.arrayContaining(['auradata-mx/auradata-design/filter-conditions', 'auradata-mx/auradata-design/native-select'])
  )
  expect(item('filter-conditions').type).toBe('registry:lib')
  expect(item('table-export').dependencies).toEqual(['fflate'])
  expect(item('use-saved-views').type).toBe('registry:hook')
  expect(item('data-table').registryDependencies).toEqual(
    expect.arrayContaining(['auradata-mx/auradata-design/use-saved-views'])
  )
  expect(item('use-data-table-url-state').type).toBe('registry:hook')
  expect(item('use-data-table-url-state').registryDependencies).toEqual(['auradata-mx/auradata-design/data-table'])
  expect(item('data-table').registryDependencies).toContain('auradata-mx/auradata-design/table-export')
  expect(item('filter').registryDependencies).toEqual(
    expect.arrayContaining(['auradata-mx/auradata-design/command', 'popover', 'auradata-mx/auradata-design/badge', 'auradata-mx/auradata-design/calendar'])
  )
})

// T65: app patterns.
// No segmented control: it looked like the tabs; one choice among views takes tabs or a toggle group.
test('publishes tabs with counts and no segmented control', () => {
  expect(registry.items.map((entry) => entry.name)).not.toContain('segmented-control')
  expect(item('tabs').registryDependencies).toEqual(expect.arrayContaining(['auradata-mx/auradata-design/format']))
})

test('publishes the guided tour on the Base UI popover', () => {
  expect(item('tour')?.type).toBe('registry:ui')
  expect(item('tour').dependencies).toContain('@base-ui/react')
  expect(item('tour').registryDependencies).toEqual(expect.arrayContaining(['auradata-mx/auradata-design/button']))
})

test('ships the user menu and the shortcuts dialog inside the app shell, with the command whose key labels it reuses', () => {
  for (const part of ['user-menu', 'shortcuts-dialog', 'workspace-switcher', 'notification-center']) {
    expect(item(part), part).toBeUndefined()
    expect(filesOf('app-shell')).toContain(`registry/src/components/blocks/${part}.tsx`)
  }
  expect(item('app-shell').registryDependencies).toEqual(
    expect.arrayContaining([
      'auradata-mx/auradata-design/command',
      'auradata-mx/auradata-design/kbd',
      'auradata-mx/auradata-design/dialog',
      'auradata-mx/auradata-design/dropdown-menu',
    ]),
  )
  expect(registry.items.map((entry) => entry.name)).not.toContain('search-command')
})

test('installs the attachment with the chat block, for the files of a question', () => {
  expect(item('chat').registryDependencies).toContain('auradata-mx/auradata-design/attachment')
})

test('publishes the message feedback and installs it with the chat block', () => {
  expect(item('message-feedback')?.type).toBe('registry:ui')
  expect(item('chat').registryDependencies).toContain('auradata-mx/auradata-design/message-feedback')
})

test('ships the insight card inside the chat block', () => {
  expect(item('insight-card')).toBeUndefined()
  expect(filesOf('chat')).toContain('registry/src/components/blocks/insight-card.tsx')
  expect(item('chat').registryDependencies).toEqual(expect.arrayContaining(['card', 'auradata-mx/auradata-design/format']))
})

test('publishes the chart pieces with the formats and the delta they share', () => {
  expect(item('delta').registryDependencies).toEqual(['auradata-mx/auradata-design/format'])
  expect(item('chart').registryDependencies).toEqual([
    'auradata-mx/auradata-design/delta',
    'auradata-mx/auradata-design/format',
  ])
})

test('ships the chart card inside the dashboard, with its states, its menu and the PNG export', () => {
  expect(item('chart-export').type).toBe('registry:lib')
  expect(item('chart-card')).toBeUndefined()
  expect(filesOf('dashboard')).toEqual(
    expect.arrayContaining(['registry/src/components/blocks/chart-card.tsx', 'registry/src/components/blocks/kpi-card.tsx']),
  )
  expect(item('dashboard').registryDependencies).toEqual(
    expect.arrayContaining([
      'table',
      'auradata-mx/auradata-design/chart-export',
      'auradata-mx/auradata-design/dialog',
      'auradata-mx/auradata-design/dropdown-menu',
      'auradata-mx/auradata-design/empty',
    ]),
  )
  // The error state is a part of the empty state now.
  expect(item('error-state')).toBeUndefined()
})

test('publishes the cartesian charts on the chart, its palette and the formats', () => {
  expect(item('cartesian-chart').registryDependencies).toEqual([
    'auradata-mx/auradata-design/chart',
    'auradata-mx/auradata-design/chart-palette',
    'auradata-mx/auradata-design/format',
  ])
  expect(item('cartesian-chart').dependencies).toEqual(['cn', 'recharts'])
})

test('publishes the donut and the funnel on the palette and the formats', () => {
  expect(item('donut-chart').registryDependencies).toEqual([
    'auradata-mx/auradata-design/chart',
    'auradata-mx/auradata-design/chart-palette',
    'auradata-mx/auradata-design/format',
  ])
  expect(item('funnel-chart').registryDependencies).toEqual(['auradata-mx/auradata-design/format'])
})

test('publishes the sparkline on its own and the gauge with the formats', () => {
  expect(item('sparkline').dependencies).toEqual(['cn'])
  expect(item('sparkline').registryDependencies).toBeUndefined()
  expect(item('gauge').registryDependencies).toEqual(['auradata-mx/auradata-design/format'])
})

test('publishes the heatmaps on the sequential and diverging palettes', () => {
  expect(item('heatmap').registryDependencies).toEqual([
    'auradata-mx/auradata-design/chart-palette',
    'auradata-mx/auradata-design/format',
    'auradata-mx/auradata-design/progressive-blur',
  ])
})

// No dashboard-grid component: the dashboard block lays itself out with a container-query grid.
test('publishes the dashboard block without a dashboard grid', () => {
  expect(registry.items.map((entry) => entry.name)).not.toContain('dashboard-grid')
  expect(item('dashboard').type).toBe('registry:block')
  expect(item('dashboard').registryDependencies).toEqual(
    expect.arrayContaining([
      'auradata-mx/auradata-design/cartesian-chart',
      'auradata-mx/auradata-design/donut-chart',
      'auradata-mx/auradata-design/funnel-chart',
      'auradata-mx/auradata-design/data-table',
      'auradata-mx/auradata-design/filter',
      'auradata-mx/auradata-design/page-header',
    ]),
  )
})

test('publishes the advanced form controls with their helpers (T63)', () => {
  const names = registry.items.map((entry) => entry.name)
  for (const name of [
    'number-input', 'file-dropzone', 'date-picker', 'time-picker',
    'input-otp', 'password-input', 'stepper', 'amount-input', 'phone', 'file-upload', 'date-time', 'password-strength',
  ]) {
    expect(names).toContain(name)
  }
  expect(item('amount-input').registryDependencies).toEqual([`${GITHUB}/format`])
  expect(item('file-dropzone').registryDependencies).toEqual(
    expect.arrayContaining([`${GITHUB}/attachment`, `${GITHUB}/file-upload`, `${GITHUB}/progress`])
  )
  expect(item('date-picker').registryDependencies).toEqual(
    expect.arrayContaining([`${GITHUB}/calendar`, `${GITHUB}/time-picker`, `${GITHUB}/date-time`, 'popover'])
  )
  expect(item('input-otp').dependencies).toContain('input-otp')
})

test('wires progressive-blur into sticky headers, scrollable overlays and the data table', () => {
  for (const name of [
    'app-shell', 'attachment', 'carousel', 'code-block', 'combobox', 'command', 'context-menu', 'dashboard',
    'data-table', 'dialog', 'drawer', 'dropdown-menu', 'empty', 'heatmap', 'message-scroller',
    'page-header', 'scroll-area', 'select', 'sidebar',
  ]) {
    expect(item(name).registryDependencies).toContain(`${GITHUB}/progressive-blur`)
  }
})

test('gives the theme frosted floating surfaces, concentric radii, trigger-origin popup motion and view transitions', () => {
  const theme = item('auradata-theme')
  expect(theme.cssVars.light['surface-glass']).toBeDefined()
  expect(theme.cssVars.dark['surface-glass']).toBeDefined()
  expect(theme.css['@supports (backdrop-filter: blur(1px))']).toBeDefined()
  expect(theme.css[':where([data-slot="card"]) :where([data-slot="card"])']).toEqual({
    'border-radius': 'var(--radius-lg)',
  })
  expect(
    Object.keys(theme.css).some((key) => key.includes('[data-slot="popover-content"]') && key.endsWith('[data-closed]'))
  ).toBe(true)
  expect(
    Object.keys(theme.css).some((key) => key.includes(':root[data-theme-transition]::view-transition-new(root)'))
  ).toBe(true)
  expect(theme.cssVars.light.selection).toBe('#DBEAFE')
  expect(theme.css['@layer base']['::selection']).toEqual({
    'background-color': 'var(--selection)',
    color: 'var(--foreground)',
  })
  expect(theme.css[':where([data-slot="skeleton"])'].animation).toContain('aura-skeleton-shimmer')
  expect(theme.css['@layer base'][':where([data-slot="collapsible-content"])'].height).toBe(
    'var(--collapsible-panel-height)'
  )
})

test('publishes the reusable copy button and wires it into code-block', () => {
  expect(item('copy-button')?.type).toBe('registry:ui')
  expect(item('copy-button').registryDependencies).toContain(`${GITHUB}/button`)
  expect(item('code-block').registryDependencies).toContain(`${GITHUB}/copy-button`)
})

// A file without the marker that another file imports relatively ships inside it: one item per concept, not per part.
test('ships the internal parts inside every item that imports them, never as items of their own', () => {
  const names = registry.items.map((entry) => entry.name)
  for (const part of ['chart-card', 'kpi-card', 'insight-card', 'user-menu', 'workspace-switcher', 'notification-center',
    'shortcuts-dialog', 'data-table-selection-bar', 'data-table-views']) {
    expect(names, part).not.toContain(part)
  }
  // The KPI card is shared: both blocks that use it carry it.
  for (const block of ['dashboard', 'chat']) expect(filesOf(block)).toContain('registry/src/components/blocks/kpi-card.tsx')
  // A part's own npm packages travel with the item: lucide-react comes from the chart card, not from dashboard.tsx.
  expect(item('dashboard').dependencies).toContain('lucide-react')
  // A block's parts keep their block's type, so they land beside it and `./kpi-card` resolves.
  for (const file of item('dashboard').files) expect(file.type).toBe('registry:block')
})
