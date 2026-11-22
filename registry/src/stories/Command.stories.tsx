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
        <CommandGroup heading="Acciones" className="border-t">
          <CommandItem>
            Crear informe <CommandShortcut>⌘N</CommandShortcut>
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
