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
  for (const name of ['login', 'app-shell', 'dashboard', 'chat', 'not-found']) {
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

test('installs the workspace switcher and the theme toggle with the app shell', () => {
  expect(item('app-shell').registryDependencies).toEqual(
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/workspace-switcher',
      'cristianruben-dev/auradata-design/theme-toggle',
    ]),
  )
  expect(item('workspace-switcher').registryDependencies).toContain('cristianruben-dev/auradata-design/initials')
})

// No marketing blocks (hero, pricing, FAQ…) and no spotlight card, gradient border or text reveal: the effects
// that stay are components of their own.
test('publishes the effects without the marketing blocks', () => {
  const ours = (name) => `cristianruben-dev/auradata-design/${name}`
  const names = registry.items.map((entry) => entry.name)
  const removed = ['hero', 'logo-cloud', 'benefits-grid', 'feature-tabs', 'testimonials', 'pricing', 'plan-comparison',
    'faq', 'changelog', 'cta-band', 'site-footer', 'spotlight-card', 'gradient-border', 'text-reveal']
  for (const name of removed) expect(names).not.toContain(name)
  for (const name of ['progressive-blur', 'marquee', 'number-ticker', 'shimmer-button', 'aura-background', 'eyebrow', 'gradient-heading', 'section-header']) {
    expect(item(name)?.type).toBe('registry:ui')
  }
  // Effects that wrap a component take ours (button); the ticker writes with lib/format.
  expect(item('shimmer-button').registryDependencies).toEqual([ours('button')])
  expect(item('number-ticker').registryDependencies).toEqual([ours('format')])
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
  expect(item('sidebar').registryDependencies).toContain('cristianruben-dev/auradata-design/drawer')
  expect(item('drawer').registryDependencies).toEqual(
    expect.arrayContaining(['cristianruben-dev/auradata-design/button', 'cristianruben-dev/auradata-design/use-mobile']),
  )
})

// T60: notifications.
test('publishes the announcement banner and the notification center, and gives the app shell the bell', () => {
  expect(item('announcement-banner').registryDependencies).toEqual(['cristianruben-dev/auradata-design/button'])
  expect(item('notification-center').registryDependencies).toEqual(
    expect.arrayContaining([
      'cristianruben-dev/auradata-design/button',
      'cristianruben-dev/auradata-design/empty',
      'popover',
      'cristianruben-dev/auradata-design/drawer',
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
// No segmented control: it looked like the tabs; one choice among views takes tabs or a toggle group.
test('publishes tabs with counts and no segmented control', () => {
  expect(registry.items.map((entry) => entry.name)).not.toContain('segmented-control')
  expect(item('tabs').registryDependencies).toEqual(expect.arrayContaining(['cristianruben-dev/auradata-design/format']))
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
    'cristianruben-dev/auradata-design/progressive-blur',
  ])
})

// No dashboard-grid component: the dashboard block lays itself out with a container-query grid.
test('publishes the dashboard block without a dashboard grid', () => {
  expect(registry.items.map((entry) => entry.name)).not.toContain('dashboard-grid')
  expect(item('dashboard').type).toBe('registry:block')
  expect(item('dashboard').registryDependencies).toEqual(
    expect.arrayContaining([
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
    'attachment', 'carousel', 'chart-card', 'code-block', 'combobox', 'command', 'context-menu',
    'data-table', 'dialog', 'drawer', 'dropdown-menu', 'error-state', 'heatmap', 'message-scroller',
    'notification-center', 'page-header', 'scroll-area', 'select', 'shortcuts-dialog', 'sidebar',
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
