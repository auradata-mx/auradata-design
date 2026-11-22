import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>Filtros</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>Se aplican a todas las gráficas de la página.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = {
  ...Default,
  args: { ...Default.args, defaultOpen: true },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const close = (await body.findByRole('button', { name: 'Cerrar' })).getBoundingClientRect()
    const title = body.getByRole('heading').getBoundingClientRect()
    await expect(Math.abs(close.top + close.height / 2 - (title.top + title.height / 2))).toBeLessThanOrEqual(1)
    const header = canvasElement.ownerDocument.querySelector('[data-slot="sheet-header"]')!
    await expect(header.getBoundingClientRect().right - parseFloat(getComputedStyle(header).paddingRight)).toBeLessThanOrEqual(close.left)
  },
}

function Side({ side, defaultOpen }: { side: 'top' | 'bottom' | 'left'; defaultOpen?: boolean }) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger render={<Button variant="outline" />}>Filtros</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>Se aplican a todas las gráficas de la página.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

/** From the top edge, open. */
export const OpenTop: Story = { name: 'Open top', render: () => <Side side="top" defaultOpen /> }

/** From the bottom edge, open. */
export const OpenBottom: Story = { name: 'Open bottom', render: () => <Side side="bottom" defaultOpen /> }

/** From the left edge, open, as the mobile navigation. */
export const OpenLeft: Story = { name: 'Open left', render: () => <Side side="left" defaultOpen /> }

/** No ✕ in the corner (`showCloseButton={false}`): the footer's buttons close it. */
export const WithoutCloseButton: Story = {
  name: 'Without close button',
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger render={<Button variant="outline" />}>Filtros</SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>Se aplican a todas las gráficas de la página.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Aplicar filtros</Button>
          <SheetClose render={<Button variant="outline" />}>Cancelar</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}
