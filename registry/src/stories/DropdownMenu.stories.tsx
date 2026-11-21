import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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

/** «Exportar» opens a submenu to its side; the destructive item stays last. */
export const Submenu: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <div className="min-h-64">
      <DropdownMenu {...args}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>Acciones</DropdownMenuTrigger>
        <DropdownMenuContent className="w-52">
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Duplicar</DropdownMenuItem>
          <DropdownMenuSub defaultOpen>
            <DropdownMenuSubTrigger>Exportar</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-44">
              <DropdownMenuItem>Como PDF</DropdownMenuItem>
              <DropdownMenuItem>Como Excel</DropdownMenuItem>
              <DropdownMenuItem>Como imagen</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Como Excel' })).toBeVisible())
  },
}

/** Items that do not apply are disabled: dimmed, skipped by the arrow keys. */
export const DisabledItems: Story = {
  name: 'Disabled items',
  args: { defaultOpen: true },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Acciones</DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuItem>Editar</DropdownMenuItem>
        <DropdownMenuItem disabled>Publicar</DropdownMenuItem>
        <DropdownMenuItem disabled>Programar envío</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled>
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

function KeyboardMenu({ onSelect }: { onSelect: (item: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Acciones</DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        {['Editar', 'Duplicar', 'Descargar como PDF'].map((item) => (
          <DropdownMenuItem key={item} onClick={() => onSelect(item)}>
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** With the keyboard only: Enter opens the menu, ArrowDown moves to the next item, Enter picks it. */
export const Keyboard: StoryObj<typeof KeyboardMenu> = {
  args: { onSelect: fn() },
  render: (args) => <KeyboardMenu {...args} />,
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const trigger = within(canvasElement).getByRole('button', { name: 'Acciones' })
    await userEvent.tab()
    await expect(document.activeElement).toBe(trigger)
    await userEvent.keyboard('{Enter}')
    await body.findByRole('menu')
    await waitFor(() => expect(document.activeElement).toHaveAttribute('role', 'menuitem'))
    const items = body.getAllByRole('menuitem')
    const from = items.indexOf(document.activeElement as HTMLElement)
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(document.activeElement).toBe(items[from + 1]))
    const picked = items[from + 1].textContent!
    await userEvent.keyboard('{Enter}')
    await expect(args.onSelect).toHaveBeenCalledWith(picked)
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}
