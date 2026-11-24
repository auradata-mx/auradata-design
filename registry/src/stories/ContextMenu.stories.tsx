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
import { shortcutLabel } from '@/components/ui/command'

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
      <ContextMenuTrigger className="flex h-48 w-full max-w-80 items-center justify-center rounded-lg border border-dashed px-6 text-center text-sm text-balance text-muted-foreground">
        Haz clic derecho o mantén presionada la gráfica
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuGroup>
          <ContextMenuItem>
            Editar gráfica <ContextMenuShortcut>{shortcutLabel('e')}</ContextMenuShortcut>
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
  // Opened without a click, the menu sits at the page's corner: move the area aside (below it on a phone) so
  // both show.
  decorators: [(Story) => <div className="pt-48 sm:pt-0 sm:pl-64"><Story /></div>],
}
