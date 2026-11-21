import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

const meta = {
  title: 'Components/Context menu',
  component: ContextMenu,
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

/** Right-click a chart (or long-press on a phone) for its actions. */
export const Default: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-48 w-80 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Haz clic derecho en la gráfica
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuGroup>
          <ContextMenuItem>
            Editar gráfica <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>Ver como tabla</ContextMenuItem>
          <ContextMenuItem>Descargar CSV</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Quitar del informe</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = {
  ...Default,
  args: { ...Default.args, defaultOpen: true },
  // Opened without a click, the menu sits at the page's corner: move the area aside so both show.
  decorators: [(Story) => <div className="pl-64"><Story /></div>],
}
