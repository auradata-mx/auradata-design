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

test('points at shadcn for stock dependencies and at @auradata for ours', () => {
  expect(item('kpi-card').registryDependencies).toEqual(['card'])
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
  expect(item('login').registryDependencies).toEqual(expect.arrayContaining(['@auradata/button', '@auradata/logo', 'card', 'field', 'input']))
  expect(item('app-shell').registryDependencies).toEqual(expect.arrayContaining(['@auradata/logo', 'sidebar', 'avatar']))
})
