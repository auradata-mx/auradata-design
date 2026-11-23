'use client';
import { ChartColumnIcon, FilePlusIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';

export default function CommandDemo() {
  return (
    <Command className="max-w-sm rounded-lg border">
      <CommandInput placeholder="Busca un informe…" aria-label="Buscar informes y acciones" />
      <CommandList>
        <CommandEmpty>Sin resultados</CommandEmpty>
        <CommandGroup heading="Informes">
          <CommandItem>
            <ChartColumnIcon aria-hidden />
            Ventas por región
          </CommandItem>
          <CommandItem>
            <ChartColumnIcon aria-hidden />
            Margen por producto
          </CommandItem>
        </CommandGroup>
        {/* A hairline as wide as the rows: a CommandSeparator may not sit inside the listbox. */}
        <CommandGroup
          heading="Acciones"
          className="relative before:absolute before:inset-x-1 before:top-0 before:h-px before:bg-border"
        >
          <CommandItem>
            <FilePlusIcon aria-hidden />
            Crear informe
            <CommandShortcut>Ctrl N</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
