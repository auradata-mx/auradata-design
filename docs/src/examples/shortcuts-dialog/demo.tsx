'use client';
import { useState } from 'react';
import { KeyboardIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShortcutsDialog, type ShortcutGroup } from '@/components/ui/shortcuts-dialog';

const groups: ShortcutGroup[] = [
  {
    heading: 'Navegación',
    shortcuts: [
      { label: 'Buscar', keys: 'mod+k' },
      { label: 'Ir a informes', keys: 'g i' },
      { label: 'Ir a datasets', keys: 'g d' },
    ],
  },
  {
    heading: 'Informes',
    shortcuts: [
      { label: 'Nuevo informe', keys: 'n' },
      { label: 'Guardar cambios', keys: 'mod+s' },
      { label: 'Duplicar la gráfica', keys: 'shift+d' },
    ],
  },
  {
    heading: 'General',
    shortcuts: [
      { label: 'Ver los atajos', keys: '?' },
      { label: 'Cerrar un diálogo', keys: 'esc' },
    ],
  },
];

export default function ShortcutsDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <KeyboardIcon data-icon="inline-start" aria-hidden />
        Ver atajos
      </Button>
      <ShortcutsDialog groups={groups} open={open} onOpenChange={setOpen} />
    </>
  );
}
