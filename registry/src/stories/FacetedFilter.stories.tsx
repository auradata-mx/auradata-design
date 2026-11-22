import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { FacetedFilter } from '@/components/ui/faceted-filter'

const REGIONES = [
  { value: 'norte', label: 'Norte', count: 128 },
  { value: 'centro', label: 'Centro', count: 2340 },
  { value: 'sur', label: 'Sur', count: 87 },
  { value: 'bajio', label: 'Bajío', count: 412 },
  { value: 'occidente', label: 'Occidente', count: 0 },
]

const meta = {
  title: 'AuraData/Faceted filter',
  component: FacetedFilter,
  args: { title: 'Región', options: REGIONES, onValueChange: fn() },
} satisfies Meta<typeof FacetedFilter>

export default meta
type Story = StoryObj<typeof meta>

/** Nothing chosen: a dashed button with the field's name. */
export const Default: Story = {}

/** Two values chosen show by name; three or more show as a count. */
export const Chosen: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <FacetedFilter {...args} defaultValue={['norte', 'bajio']} />
      <FacetedFilter {...args} defaultValue={['norte', 'centro', 'sur']} />
    </div>
  ),
}

/** Open: the search, a checkbox per value and its count, and «Limpiar filtro» once something is chosen. */
export const Open: Story = {
  tags: ['mobile'],
  args: { defaultOpen: true, defaultValue: ['centro'] },
}

/** Typing narrows the values; a click or Enter toggles one; «Limpiar filtro» empties it. */
export const Choosing: Story = {
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
