import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartColumnIcon, DatabaseIcon, FilePlusIcon, SettingsIcon, UserPlusIcon } from 'lucide-react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSearch,
  CommandShortcut,
  shortcutLabel,
  type CommandSearchGroup,
} from '@/components/ui/command'

const meta = {
  title: 'Components/Command',
  component: Command,
  args: { className: 'max-w-sm rounded-lg border' },
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Command {...args}>
      <CommandInput placeholder="Busca un informe…" />
      <CommandList>
        <CommandEmpty>Sin resultados</CommandEmpty>
        <CommandGroup heading="Informes">
          <CommandItem>Ventas por región</CommandItem>
          <CommandItem>Margen por producto</CommandItem>
        </CommandGroup>
        {/* A hairline as wide as the rows: a CommandSeparator may not sit in the listbox (axe). */}
        <CommandGroup
          heading="Acciones"
          className="relative before:absolute before:inset-x-1 before:top-0 before:h-px before:bg-border"
        >
          <CommandItem>
            Crear informe <CommandShortcut>{shortcutLabel('n')}</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  play: async ({ canvasElement }) => {
    // The whole search box takes the tap, not a 20px line inside it.
    const input = within(canvasElement).getByRole('combobox')
    await expect(input.getBoundingClientRect().height).toBeGreaterThanOrEqual(28)
  },
}

/** Moving down with the keyboard slides the active row highlight to the next item. */
export const Navigation: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox')
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="command-active-indicator"]')).not.toBeNull())
    const indicator = canvasElement.querySelector<HTMLElement>('[data-slot="command-active-indicator"]')!
    const firstTop = indicator.getBoundingClientRect().top
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() =>
      expect(canvas.getByRole('option', { name: 'Margen por producto' })).toHaveAttribute('data-selected', 'true')
    )
    await waitFor(() => expect(indicator.getBoundingClientRect().top).toBeGreaterThan(firstTop))
    input.blur()
  },
}

const GROUPS: CommandSearchGroup[] = [
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

type SearchStory = StoryObj<typeof CommandSearch>

/** `CommandSearch` takes none of the `Command` args above: the meta's className is for the bare command. */
const renderSearch: SearchStory['render'] = (args) => <CommandSearch {...args} className={undefined} />

/** `CommandSearch`: the button; ⌘K (macOS) or Ctrl+K opens it from anywhere on the page. */
export const Search: SearchStory = { args: { groups: GROUPS }, render: renderSearch }

/** Open, for the visual tests and to see the groups. */
export const SearchOpen: SearchStory = { args: { groups: GROUPS, defaultOpen: true }, render: renderSearch }

/** Ctrl+K opens the search, and a word nothing matches says «Sin resultados». */
export const SearchNoResults: SearchStory = {
  args: { groups: GROUPS },
  render: renderSearch,
  play: async () => {
    await userEvent.keyboard('{Control>}k{/Control}')
    const input = await screen.findByPlaceholderText('Busca informes, datasets o acciones…')
    await userEvent.type(input, 'nómina')
    await waitFor(() => expect(screen.getByText('Sin resultados')).toBeVisible())
  },
}

/** Open while the results load: «Buscando…» with a spinner, announced as a status, instead of «Sin resultados». */
export const SearchLoading: SearchStory = {
  args: { groups: GROUPS, defaultOpen: true, loading: true },
  render: renderSearch,
  play: async () => {
    const input = await screen.findByPlaceholderText('Busca informes, datasets o acciones…')
    await userEvent.type(input, 'nómina')
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Buscando…'))
    await expect(screen.queryByText('Sin resultados')).toBeNull()
  },
}
