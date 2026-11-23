'use client';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const periods = [
  ['mes', 'Este mes'],
  ['trimestre', 'Este trimestre'],
  ['anio', 'Este año'],
];

export default function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>Filtros</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filtrar informe</DrawerTitle>
            <DrawerDescription>Elige el periodo de «Ventas 2026».</DrawerDescription>
          </DrawerHeader>
          <RadioGroup defaultValue="trimestre" className="gap-3 px-4 py-4" aria-label="Periodo">
            {periods.map(([value, label]) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem id={`drawer-periodo-${value}`} value={value} />
                <Label htmlFor={`drawer-periodo-${value}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
          <DrawerFooter>
            <DrawerClose render={<Button />}>Aplicar</DrawerClose>
            <DrawerClose render={<Button variant="outline" />}>Cancelar</DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
