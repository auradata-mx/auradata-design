import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { FilterBuilder } from '@/components/ui/filter-builder'
import type { FilterField, FilterGroup } from '@/lib/filter-conditions'

const FIELDS: FilterField[] = [
  { id: 'sucursal', label: 'Sucursal', type: 'text' },
  {
    id: 'region',
    label: 'Región',
    type: 'select',
    options: [{ value: 'Norte' }, { value: 'Centro' }, { value: 'Bajío' }, { value: 'Occidente' }, { value: 'Sur' }],
  },
  { id: 'ventas', label: 'Ventas', type: 'number' },
  { id: 'fecha', label: 'Fecha', type: 'date' },
]

const EXAMPLE: FilterGroup = {
  id: 'root',
  combinator: 'and',
  conditions: [
    { id: 'c1', field: 'ventas', operator: 'gte', value: 100000 },
    {
      id: 'g1',
      combinator: 'or',
      conditions: [
        { id: 'c2', field: 'region', operator: 'equals', value: 'Norte' },
        { id: 'c3', field: 'region', operator: 'equals', value: 'Sur' },
      ],
    },
    { id: 'c4', field: 'fecha', operator: 'after', value: '2026-10-31' },
  ],
}

const meta = {
  title: 'AuraData/Filter builder',
  component: FilterBuilder,
  args: { fields: FIELDS, onValueChange: fn() },
} satisfies Meta<typeof FilterBuilder>

export default meta
type Story = StoryObj<typeof meta>

/** Ventas ≥ $100,000 Y (Norte O Sur) Y después del 31 oct 2026: conditions and a nested group. On a phone each row stacks. */
export const Default: Story = { tags: ['mobile'], args: { defaultValue: EXAMPLE } }

/** No conditions yet: what to do first. */
export const Empty: Story = {}

/** Building a filter from nothing: add, write, join with O, change a field, remove, group, clear. */
export const Building: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const last = () => (args.onValueChange as ReturnType<typeof fn>).mock.lastCall?.[0] as FilterGroup
    await expect(canvas.getByText('Sin condiciones. Agrega una para filtrar.')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Agregar condición' }))
    let rows = canvas.getAllByRole('group', { name: /^Condición/ })
    await expect(rows).toHaveLength(1)
    await expect(within(rows[0]).getByRole('combobox', { name: 'Campo' })).toHaveValue('sucursal')
    await expect(within(rows[0]).getByRole('combobox', { name: 'Operador' })).toHaveValue('contains')
    await userEvent.type(within(rows[0]).getByRole('textbox', { name: 'Valor' }), 'monte')
    await expect(last().conditions[0]).toMatchObject({ field: 'sucursal', operator: 'contains', value: 'monte' })

    await userEvent.click(canvas.getByRole('button', { name: 'Agregar condición' }))
    rows = canvas.getAllByRole('group', { name: /^Condición/ })
    await userEvent.selectOptions(within(rows[1]).getByRole('combobox', { name: 'Unir condiciones' }), 'or')
    await expect(last().combinator).toBe('or')
    // A new field brings its own operators: a number starts at «es igual a».
    await userEvent.selectOptions(within(rows[1]).getByRole('combobox', { name: 'Campo' }), 'ventas')
    await expect(within(rows[1]).getByRole('combobox', { name: 'Operador' })).toHaveValue('equals')
    await userEvent.selectOptions(within(rows[1]).getByRole('combobox', { name: 'Operador' }), 'gt')
    await userEvent.type(within(rows[1]).getByRole('spinbutton', { name: 'Valor' }), '300000')
    await expect(last().conditions[1]).toMatchObject({ field: 'ventas', operator: 'gt', value: 300000 })

    await userEvent.click(within(rows[0]).getByRole('button', { name: 'Quitar condición' }))
    await expect(canvas.getAllByRole('group', { name: /^Condición/ })).toHaveLength(1)
    await expect(last().conditions).toHaveLength(1)

    await userEvent.click(canvas.getByRole('button', { name: 'Agregar grupo' }))
    const nested = canvas.getByRole('group', { name: 'Grupo 2' })
    await expect(within(nested).getAllByRole('group', { name: /^Condición/ })).toHaveLength(1)
    await expect(last().conditions[1]).toMatchObject({ combinator: 'and' })

    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar' }))
    await expect(last().conditions).toHaveLength(0)
    await expect(canvas.getByText('Sin condiciones. Agrega una para filtrar.')).toBeInTheDocument()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
