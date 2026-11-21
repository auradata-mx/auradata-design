import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const meta = {
  title: 'Components/Dropdown menu',
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Acciones</DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Informe</DropdownMenuLabel>
          <DropdownMenuItem>
            Editar <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Duplicar</DropdownMenuItem>
          <DropdownMenuItem>Descargar como PDF</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Eliminar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = { ...Default, args: { ...Default.args, defaultOpen: true } }

/** Reached with the keyboard (Tab): `:focus-visible` shows the focus ring, as in the screenshot. */
export const Focus: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(document.activeElement).toBe(within(canvasElement).getByRole('button', { name: 'Acciones' }))
  },
}
