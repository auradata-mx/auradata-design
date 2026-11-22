import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import { shortcutLabel } from '@/components/ui/search-command'

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
