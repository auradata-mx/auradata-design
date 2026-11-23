'use client';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const sections = ['Inicio', 'Informes', 'Datasets', 'Conexiones', 'Configuración'];

export default function DrawerLeft() {
  return (
    <Drawer swipeDirection="left">
      <DrawerTrigger render={<Button variant="outline" />}>Abrir navegación</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Operaciones Norte</DrawerTitle>
          <DrawerDescription>Las secciones de tu espacio.</DrawerDescription>
        </DrawerHeader>
        <nav aria-label="Secciones" className="grid gap-1 p-4">
          {sections.map((section) => (
            <a key={section} href="#" className="rounded-md px-2 py-1.5 text-sm hover:bg-muted">
              {section}
            </a>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
