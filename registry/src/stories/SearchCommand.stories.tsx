import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartColumnIcon, DatabaseIcon, FilePlusIcon, SettingsIcon, UserPlusIcon } from 'lucide-react'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

import { SearchCommand, shortcutLabel, type SearchCommandGroup } from '@/components/ui/search-command'

const GROUPS: SearchCommandGroup[] = [
  {
    heading: 'Informes',
    items: [
      { id: 'ventas-por-region', label: 'Ventas por región', icon: <ChartColumnIcon />, keywords: ['Ventas'] },
      { id: 'margen-por-producto', label: 'Margen por producto', icon: <ChartColumnIcon />, keywords: ['Finanzas'] },
      { id: 'clientes-activos', label: 'Clientes activos', icon: <ChartColumnIcon />, keywords: ['Marketing'] },
    ],
  },
  {
    heading: 'Datasets',
    items: [
      { id: 'pedidos-2026', label: 'Pedidos 2026', icon: <DatabaseIcon /> },
      { id: 'catalogo-de-productos', label: 'Catálogo de productos', icon: <DatabaseIcon /> },
    ],
  },
  {
    heading: 'Acciones',
    items: [
      { id: 'nuevo-informe', label: 'Crear informe', icon: <FilePlusIcon />, shortcut: shortcutLabel('n') },
      { id: 'invitar', label: 'Invitar a tu equipo', icon: <UserPlusIcon /> },
      { id: 'configuracion', label: 'Abrir configuración', icon: <SettingsIcon />, shortcut: shortcutLabel(',') },
    ],
  },
]

const meta = {
  title: 'AuraData/Search command',
  component: SearchCommand,
  args: { groups: GROUPS },
} satisfies Meta<typeof SearchCommand>

export default meta
type Story = StoryObj<typeof meta>

/** The button; ⌘K (macOS) or Ctrl+K opens it from anywhere on the page. */
export const Default: Story = {}

/** Open, for the visual tests and to see the groups. */
export const Open: Story = { args: { defaultOpen: true } }

/** Ctrl+K opens the search, and a word nothing matches says «Sin resultados». */
export const NoResults: Story = {
  play: async () => {
    await userEvent.keyboard('{Control>}k{/Control}')
    const input = await screen.findByPlaceholderText('Busca informes, datasets o acciones…')
    await userEvent.type(input, 'nómina')
    await waitFor(() => expect(screen.getByText('Sin resultados')).toBeVisible())
  },
}

/** Open while the results load: «Buscando…» with a spinner, announced as a status, instead of «Sin resultados». */
export const Loading: Story = {
  args: { defaultOpen: true, loading: true },
  play: async () => {
    const input = await screen.findByPlaceholderText('Busca informes, datasets o acciones…')
    await userEvent.type(input, 'nómina')
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Buscando…'))
    await expect(screen.queryByText('Sin resultados')).toBeNull()
  },
}
