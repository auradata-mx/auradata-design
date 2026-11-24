import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Filter, presetRange, type FilterProps } from '@/components/ui/filter'
import { formatCurrency } from '@/lib/format'

type SelectArgs = Extract<FilterProps, { type: 'select' }>

const REGIONES = [
  { value: 'norte', label: 'Norte', count: 128 },
  { value: 'centro', label: 'Centro', count: 2340 },
  { value: 'sur', label: 'Sur', count: 87 },
  { value: 'bajio', label: 'Bajío', count: 412 },
  { value: 'occidente', label: 'Occidente', count: 0 },
]

/** A fixed day, so the presets and the screenshots do not move with the calendar. */
const TODAY = new Date(2026, 10, 21)

const SELECT = { type: 'select', title: 'Región', options: REGIONES } as const
const RANGE = {
  type: 'range',
  title: 'Ventas',
  min: 0,
  max: 500000,
  step: 1000,
  format: (value: number) => formatCurrency(value),
} as const
const DATE = { type: 'date', today: TODAY, defaultValue: presetRange('this-month', TODAY) } as const

const meta = {
  title: 'AuraData/Filter',
  component: Filter,
} satisfies Meta<typeof Filter>

export default meta
type Story = StoryObj<typeof Filter>

// `type: "select"`: the values of one field.

/** Nothing chosen: a dashed button with the field's name. */
export const SelectDefault: Story = { args: { ...SELECT, onValueChange: fn() } }

/** Two values chosen show by name; three or more show as a count. */
export const SelectChosen: Story = {
  args: { ...SELECT, onValueChange: fn() },
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Filter {...(args as SelectArgs)} defaultValue={['norte', 'bajio']} />
      <Filter {...(args as SelectArgs)} defaultValue={['norte', 'centro', 'sur']} />
    </div>
  ),
}

/** Open: the search, a checkbox per value and its count, and «Limpiar filtro» once something is chosen. */
export const SelectOpen: Story = {
  tags: ['mobile'],
  args: { ...SELECT, onValueChange: fn(), defaultOpen: true, defaultValue: ['centro'] },
}

/** Typing narrows the values; a click or Enter toggles one; «Limpiar filtro» empties it. */
export const SelectChoosing: Story = {
  args: { ...SELECT, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Región' }))
    const dialog = await page.findByRole('dialog', { name: 'Región' })
    await expect(within(dialog).getByRole('option', { name: /Centro/ })).toHaveTextContent('2,340')
    await userEvent.type(within(dialog).getByRole('combobox', { name: 'Buscar en «Región»' }), 'baj')
    await waitFor(() => expect(within(dialog).getAllByRole('option')).toHaveLength(1))
    await userEvent.keyboard('{Enter}')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['bajio'])
    await expect(within(dialog).getByRole('option', { name: /Bajío/ })).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(within(dialog).getByRole('option', { name: 'Limpiar filtro' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith([])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    await expect(canvas.getByRole('button', { name: 'Región' })).toHaveTextContent('Región')
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

// `type: "range"`: a number between two ends.

/** No range yet: a dashed button with the field's name. */
export const RangeDefault: Story = { args: { ...RANGE, onValueChange: fn() } }

/** A range chosen: the button writes it with the field's format. */
export const RangeChosen: Story = { args: { ...RANGE, onValueChange: fn(), defaultValue: [10000, 250000] } }

/** Open: a two-thumb slider over the field's whole span, and the two ends as numbers. */
export const RangeOpen: Story = {
  tags: ['mobile'],
  args: { ...RANGE, onValueChange: fn(), defaultOpen: true, defaultValue: [10000, 250000] },
}

/** Typing an end applies it on Enter or when the field loses focus; «Limpiar» drops the range. */
export const RangeTyping: Story = {
  args: { ...RANGE, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Ventas' }))
    const dialog = await page.findByRole('dialog', { name: 'Ventas' })
    const min = within(dialog).getByRole('spinbutton', { name: 'Mínimo' })
    await userEvent.clear(min)
    await userEvent.type(min, '20000{Enter}')
    await expect(args.onValueChange).toHaveBeenLastCalledWith([20000, 500000])
    const max = within(dialog).getByRole('spinbutton', { name: 'Máximo' })
    await userEvent.clear(max)
    await userEvent.type(max, '900000')
    await userEvent.tab()
    // An end past the span is held at it.
    await expect(args.onValueChange).toHaveBeenLastCalledWith([20000, 500000])
    await userEvent.clear(max)
    await userEvent.type(max, '120000{Enter}')
    await expect(args.onValueChange).toHaveBeenLastCalledWith([20000, 120000])
    await expect(within(dialog).getAllByRole('slider')[1]).toHaveAttribute('aria-valuenow', '120000')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Limpiar' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(undefined)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

// `type: "date"`: a period.

/** «Este mes»: from the 1st to today. */
export const DateDefault: Story = { args: DATE }

/** No range yet: the button asks for one. */
export const DateEmpty: Story = { args: { ...DATE, defaultValue: undefined } }

/** Open, for the visual tests and to see the presets and the calendar. */
export const DateOpen: Story = { args: { ...DATE, defaultOpen: true } }

/** Another day than the browser's, so the calendar's «today» must come from the `today` prop. */
const OTHER_TODAY = new Date(2026, 10, 18)

/**
 * A preset, then a custom range picked on the calendar: the button's label follows each choice. The
 * calendar marks the `today` it is given, not the browser's clock.
 */
export const DateChoosing: Story = {
  args: { type: 'date', onValueChange: fn(), today: OTHER_TODAY, defaultValue: presetRange('this-month', OTHER_TODAY) },
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const trigger = within(canvasElement).getByRole('button')
    await expect(trigger).toHaveTextContent('1 nov 2026 – 18 nov 2026')
    await userEvent.click(trigger)
    const dialog = await body.findByRole('dialog', { name: 'Periodo' })
    await expect(dialog.querySelector('[data-today]')).toHaveAttribute('data-day', '2026-11-18')
    // The pressed preset takes the first focus, not «Hoy» above it.
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Este mes' })).toHaveFocus())
    await userEvent.click(within(dialog).getByRole('button', { name: 'Últimos 7 días' }))
    await expect(trigger).toHaveTextContent('12 nov 2026 – 18 nov 2026')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Personalizado' }))
    await userEvent.click(dialog.querySelector<HTMLElement>('[data-day="2026-11-03"] button')!)
    await userEvent.click(dialog.querySelector<HTMLElement>('[data-day="2026-11-10"] button')!)
    await expect(trigger).toHaveTextContent('3 nov 2026 – 10 nov 2026')
    await expect(within(dialog).getByRole('button', { name: 'Personalizado' })).toHaveAttribute('aria-pressed', 'true')
    await expect(args.onValueChange).toHaveBeenCalled()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
