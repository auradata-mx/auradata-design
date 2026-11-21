import type { Meta, StoryObj } from '@storybook/react-vite'

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

/** On a phone, the report's filters slide up from the bottom. */
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
          <RadioGroup defaultValue="trimestre" className="gap-3 px-4 py-2" aria-label="Periodo">
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

/** Open, for the visual tests and to see the overlay. */
export const Open: Story = { ...Default, args: { ...Default.args, defaultOpen: true } }
