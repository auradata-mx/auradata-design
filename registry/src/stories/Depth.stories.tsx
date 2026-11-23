import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/format'

/**
 * Depth is the theme, not a component: the elevation scale (`shadow-(--elevation-raised)`, `shadow-(--elevation-control)`, `shadow-(--elevation-sunken)`,
 * `shadow-(--elevation-overlay)`, `shadow-(--elevation-modal)`) gives each surface a top-edge highlight, a contact and an ambient shadow.
 * Level 0 stays flat (rows, list items, charts inside a card), cards and buttons sit at 1, menus and popovers
 * float at 2, dialogs and sheets at 3. Buttons lift on hover, sink when pressed and go flat when disabled.
 */
const meta = {
  title: 'AuraData/Depth',
  parameters: { layout: 'fullscreen', themeFrame: { padded: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** A KPI card with its actions and a search field: the three depths of a BI screen at rest. */
function Panel() {
  return (
    <div className="grid max-w-sm gap-4">
      <Card data-testid="card">
        <CardHeader>
          <CardDescription>Ingresos del mes</CardDescription>
          <CardTitle className="text-2xl tabular-nums">{formatCurrency(1284500)}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm font-medium text-success">▲ 12.4 % vs. mes anterior</CardContent>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button>Guardar</Button>
        <Button variant="outline">Cancelar</Button>
        <Button variant="ghost">Descartar</Button>
        <Button disabled>Publicar</Button>
      </div>
      <div className="relative">
        <SearchIcon aria-hidden className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input aria-label="Buscar informe" placeholder="Buscar informe…" className="pl-8" />
      </div>
    </div>
  )
}

/** Elevation 1 (card, filled and outline buttons), sunken fields, flat ghost and disabled buttons. */
export const Levels: Story = {
  render: () => <Panel />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const shadow = (element: Element) => getComputedStyle(element).boxShadow
    // A lit top edge (an inset highlight) above a contact and an ambient shadow.
    await expect(shadow(canvas.getByTestId('card'))).toMatch(/inset.*,.*,/)
    await expect(getComputedStyle(canvas.getByTestId('card')).backgroundImage).toMatch(/linear-gradient/)
    await expect(shadow(canvas.getByRole('button', { name: 'Guardar' }))).toMatch(/inset/)
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Guardar' })).backgroundImage).toMatch(/linear-gradient/)
    await expect(shadow(canvas.getByRole('button', { name: 'Cancelar' }))).toMatch(/inset/)
    // The field sits below the surface: an inset shadow and nothing outside it.
    const field = shadow(canvas.getByRole('textbox', { name: 'Buscar informe' }))
    await expect(field).toMatch(/inset/)
    await expect(field.split('), ').every((layer) => layer.includes('inset') || /0px 0px 0px 0px/.test(layer))).toBe(true)
    // Level 0 and disabled are flat.
    await expect(shadow(canvas.getByRole('button', { name: 'Descartar' }))).not.toMatch(/inset/)
    await expect(shadow(canvas.getByRole('button', { name: 'Publicar' }))).not.toMatch(/inset/)
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Publicar' })).backgroundImage).toBe('none')
  },
}

/** The :hover rules that apply to a button, from the page's stylesheets (CSS :hover can't be triggered from a play function). */
function hoverRules(element: Element) {
  const rules: string[] = []
  const matches = (selector: string) => {
    try {
      return element.matches(selector.replaceAll(':hover', ''))
    } catch {
      return false
    }
  }
  // Tailwind nests `&:hover` inside the utility's rule and an @media (hover: hover).
  const walk = (list: CSSRuleList, parent = '') => {
    for (const rule of Array.from(list)) {
      if (rule instanceof CSSStyleRule) {
        const selector = rule.selectorText.replaceAll('&', parent)
        if (selector.includes(':hover') && matches(selector)) rules.push(rule.cssText)
        if (rule.cssRules.length) walk(rule.cssRules, selector)
      } else if ('cssRules' in rule) walk((rule as CSSGroupingRule).cssRules, parent)
    }
  }
  for (const sheet of Array.from(document.styleSheets)) walk(sheet.cssRules)
  return rules.join('\n')
}

/** Under the pointer a button lifts: its ambient shadow grows and it moves 1px up. Ghost buttons stay flat. */
export const Hover: Story = {
  render: () => <Panel />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const lift = hoverRules(canvas.getByRole('button', { name: 'Guardar' }))
    await expect(lift).toMatch(/--tw-shadow: var\(--elevation-control-hover\)/)
    await expect(lift).toMatch(/--tw-translate-y: -1px|--tw-translate-y: calc\(var\(--spacing\) \* -0\.25\)|-1px/)
    await expect(hoverRules(canvas.getByRole('button', { name: 'Descartar' }))).not.toMatch(/--elevation/)
  },
}
