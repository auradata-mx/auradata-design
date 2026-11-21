import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <TooltipProvider>
      <Tooltip {...args}>
        <TooltipTrigger render={<Button variant="outline" />}>Actualizar</TooltipTrigger>
        <TooltipContent>Vuelve a leer los datos de la fuente</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = { ...Default, args: { ...Default.args, defaultOpen: true } }

/** Each side, all open at once around their buttons. One provider each: a shared provider shows one tooltip at a time. */
export const Sides: Story = {
  render: () => (
    <div className="grid min-h-72 place-content-center">
      <div className="grid grid-cols-2 gap-x-48 gap-y-20">
        {(
          [
            ['top', 'Arriba'],
            ['bottom', 'Abajo'],
            ['left', 'Izquierda'],
            ['right', 'Derecha'],
          ] as const
        ).map(([side, label]) => (
          <TooltipProvider key={side}>
            <Tooltip defaultOpen>
              <TooltipTrigger render={<Button variant="outline" />}>{label}</TooltipTrigger>
              <TooltipContent side={side}>Vuelve a leer los datos</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  ),
}

/** A long hint wraps at the tooltip's maximum width (`max-w-xs`). */
export const LongContent: Story = {
  name: 'Long content',
  render: () => (
    <TooltipProvider>
      <div className="min-h-40 pt-24">
        <Tooltip defaultOpen>
          <TooltipTrigger render={<Button variant="outline" />}>Actualizar</TooltipTrigger>
          <TooltipContent>
            Vuelve a leer los datos de la fuente. Con «Pedidos 2026» puede tardar hasta dos minutos; mientras tanto ves la última carga.
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}
