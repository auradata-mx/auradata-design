import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Tabs, TabsContent, TabsCount, TabsList, TabsTrigger } from '@/components/ui/tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { defaultValue: 'summary' },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Tabs className="max-w-md" {...args}>
      <TabsList>
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="regions">Regiones</TabsTrigger>
        <TabsTrigger value="products">Productos</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">Las ventas crecieron 6 % contra septiembre.</TabsContent>
      <TabsContent value="regions">El Centro concentra la mitad de las ventas.</TabsContent>
      <TabsContent value="products">Tres productos suman el 70 %.</TabsContent>
    </Tabs>
  ),
}

/** Reached with the keyboard (Tab): `:focus-visible` shows the focus ring, as in the screenshot. */
export const Focus: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(document.activeElement).toBe(within(canvasElement).getByRole('tab', { name: 'Resumen' }))
  },
}

/** The `line` list: no track, the active tab is underlined. */
export const Line: Story = {
  render: (args) => (
    <Tabs className="max-w-md" {...args}>
      <TabsList variant="line">
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="regions">Regiones</TabsTrigger>
        <TabsTrigger value="products">Productos</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">Las ventas crecieron 6 % contra septiembre.</TabsContent>
      <TabsContent value="regions">El Centro concentra la mitad de las ventas.</TabsContent>
      <TabsContent value="products">Tres productos suman el 70 %.</TabsContent>
    </Tabs>
  ),
}

/** A tab that cannot open yet: dimmed and skipped by the arrow keys. */
export const DisabledTab: Story = {
  name: 'Disabled tab',
  render: (args) => (
    <Tabs className="max-w-md" {...args}>
      <TabsList>
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="regions">Regiones</TabsTrigger>
        <TabsTrigger value="forecast" disabled>
          Pronóstico
        </TabsTrigger>
      </TabsList>
      <TabsContent value="summary">Las ventas crecieron 6 % contra septiembre.</TabsContent>
      <TabsContent value="regions">El Centro concentra la mitad de las ventas.</TabsContent>
      <TabsContent value="forecast">El pronóstico estará listo con 12 meses de datos.</TabsContent>
    </Tabs>
  ),
}

/** Tabs stacked on the left of their panel. */
export const Vertical: Story = {
  render: (args) => (
    <Tabs className="max-w-lg" orientation="vertical" {...args}>
      <TabsList>
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="regions">Regiones</TabsTrigger>
        <TabsTrigger value="products">Productos</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">Las ventas crecieron 6 % contra septiembre.</TabsContent>
      <TabsContent value="regions">El Centro concentra la mitad de las ventas.</TabsContent>
      <TabsContent value="products">Tres productos suman el 70 %.</TabsContent>
    </Tabs>
  ),
}

/** A click shows the tab's panel; ArrowRight moves to the next tab and Enter shows its panel. */
export const Switching: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Regiones' }))
    await expect(canvas.getByRole('tab', { name: 'Regiones' })).toHaveAttribute('aria-selected', 'true')
    // The old panel stays in the DOM while it fades out: wait for one panel.
    await waitFor(() => expect(canvas.getByRole('tabpanel')).toHaveTextContent('El Centro concentra la mitad de las ventas.'))
    await userEvent.keyboard('{ArrowRight}')
    await expect(document.activeElement).toBe(canvas.getByRole('tab', { name: 'Productos' }))
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Productos' })).toHaveAttribute('aria-selected', 'true'))
    await waitFor(() => expect(canvas.getByRole('tabpanel')).toHaveTextContent('Tres productos suman el 70 %.'))
    await expect(canvasElement.querySelector('[data-slot="tabs-indicator"]')).not.toBeNull()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Tabs that count what they hold: the number is part of the tab's name and caps at `max`. */
export const WithCounts: Story = {
  args: { defaultValue: 'all' },
  render: (args) => (
    <Tabs {...args} className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="all">
          Todos <TabsCount value={1284} />
        </TabsTrigger>
        <TabsTrigger value="mine">
          Míos <TabsCount value={12} />
        </TabsTrigger>
        <TabsTrigger value="shared">
          Compartidos <TabsCount value={140} max={99} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">Todos los informes del espacio.</TabsContent>
      <TabsContent value="mine">Los informes que creaste.</TabsContent>
      <TabsContent value="shared">Los informes que te compartieron.</TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // es-MX thousands, and «99+» past the cap.
    await expect(canvas.getByRole('tab', { name: 'Todos 1,284' })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tab', { name: 'Compartidos 99+' })).toBeVisible()
    await userEvent.click(canvas.getByRole('tab', { name: 'Míos 12' }))
    await waitFor(() => expect(canvas.getByRole('tabpanel')).toHaveTextContent('Los informes que creaste.'))
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Line tabs with counts, as a page's sections. */
export const LineWithCounts: Story = {
  args: { defaultValue: 'open' },
  render: (args) => (
    <Tabs {...args} className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="open">
          Abiertas <TabsCount value={8} />
        </TabsTrigger>
        <TabsTrigger value="closed">
          Cerradas <TabsCount value={0} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="open">Ocho alertas abiertas.</TabsContent>
      <TabsContent value="closed">Sin alertas cerradas.</TabsContent>
    </Tabs>
  ),
}
