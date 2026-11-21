import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
