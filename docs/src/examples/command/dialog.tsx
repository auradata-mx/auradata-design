'use client';
import { useState } from 'react';
import { ChartColumnIcon, DatabaseIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export default function CommandDialogExample() {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);

  const choose = (name: string) => {
    setChosen(name);
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Abrir un informe
      </Button>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {chosen ? `Elegiste «${chosen}».` : 'Ningún informe elegido.'}
      </p>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Abrir un informe"
        description="Busca un informe o un dataset por su nombre."
      >
        <Command>
          <CommandInput placeholder="Busca por nombre…" aria-label="Buscar informes y datasets" />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup heading="Informes">
              {['Ventas por región', 'Margen por producto', 'Clientes activos'].map((name) => (
                <CommandItem key={name} onSelect={() => choose(name)}>
                  <ChartColumnIcon aria-hidden />
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup
              heading="Datasets"
              className="relative before:absolute before:inset-x-1 before:top-0 before:h-px before:bg-border"
            >
              {['Pedidos 2026', 'Catálogo de productos'].map((name) => (
                <CommandItem key={name} onSelect={() => choose(name)}>
                  <DatabaseIcon aria-hidden />
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
