import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { FilterChips } from '@/components/ui/filter-chips'

const meta = {
  title: 'AuraData/Filter chips',
  component: FilterChips,
  args: {
    chips: [
      { id: 'region', label: 'Región', value: 'Norte, Bajío' },
      { id: 'estado', label: 'Estado', value: 'Publicado' },
      { id: 'ventas', label: 'Ventas', value: '$10,000 – $250,000' },
      { id: 'periodo', label: 'Periodo', value: '1 nov 2026 – 21 nov 2026' },
    ],
    onRemove: fn(),
    onClearAll: fn(),
  },
} satisfies Meta<typeof FilterChips>

export default meta
type Story = StoryObj<typeof meta>

/** The active filters of a page, each with its own «×», and «Limpiar todo». On a phone they wrap. */
export const Default: Story = { tags: ['mobile'] }

/** No active filter: nothing renders. */
export const Empty: Story = {
  args: { chips: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="filter-chips"]')).toBeNull()
  },
}

/** «×» removes one filter by its id; «Limpiar todo» all of them. */
export const Removing: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('group', { name: 'Filtros activos' })).toHaveTextContent('Región: Norte, Bajío')
    await userEvent.click(canvas.getByRole('button', { name: 'Quitar el filtro «Estado»' }))
    await expect(args.onRemove).toHaveBeenLastCalledWith('estado')
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar todo' }))
    await expect(args.onClearAll).toHaveBeenCalledOnce()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
