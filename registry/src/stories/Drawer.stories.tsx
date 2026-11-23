import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

const ON_PHONE = { viewport: { value: 'mobile', isRotated: false } }

/** The open panel: the drawer is a dialog named by its title. */
const panel = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body).findByRole('dialog', { name: 'Filtrar informe' })

/**
 * The report's filters in a drawer. On a wide screen it slides in from the side of `swipeDirection` (the right by
 * default); on a phone (under 768 px) it always slides up from the bottom, with a grab handle.
 */
export const Default: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger render={<Button variant="outline" />}>Filtros</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filtrar informe</DrawerTitle>
            <DrawerDescription>Elige el periodo de «Ventas 2026».</DrawerDescription>
          </DrawerHeader>
          <RadioGroup defaultValue="trimestre" className="gap-3 px-4 py-4" aria-label="Periodo">
            {[
              ['mes', 'Este mes'],
              ['trimestre', 'Este trimestre'],
              ['anio', 'Este año'],
            ].map(([value, label]) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem id={`periodo-${value}`} value={value} />
                <Label htmlFor={`periodo-${value}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
          <DrawerFooter>
            <Button>Aplicar</Button>
            <DrawerClose render={<Button variant="outline" />}>Cancelar</DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
}

/** Open on a wide screen: from the right, with the close button. For the visual tests and to see the overlay. */
export const Open: Story = {
  ...Default,
  args: { ...Default.args, defaultOpen: true },
  play: async ({ canvasElement }) => {
    const drawer = await panel(canvasElement)
    await expect(drawer).toHaveAttribute('data-swipe-direction', 'right')
    await expect(within(drawer).getByRole('button', { name: 'Cerrar' })).toBeVisible()
  },
}

/** `swipeDirection="left"` on a wide screen: from the left. */
export const OpenLeft: Story = {
  ...Default,
  args: { ...Default.args, defaultOpen: true, swipeDirection: 'left' },
  play: async ({ canvasElement }) => {
    await expect(await panel(canvasElement)).toHaveAttribute('data-swipe-direction', 'left')
  },
}

/** On a phone every drawer comes up from the bottom, even one set to the left, and shows its grab handle. */
export const OpenOnPhone: Story = {
  ...Default,
  tags: ['mobile'],
  globals: ON_PHONE,
  args: { ...Default.args, defaultOpen: true, swipeDirection: 'left' },
  play: async ({ canvasElement }) => {
    const drawer = await panel(canvasElement)
    await expect(drawer).toHaveAttribute('data-swipe-direction', 'down')
    await expect(drawer.querySelector('[data-slot="drawer-swipe-handle"]')).not.toBeNull()
  },
}
