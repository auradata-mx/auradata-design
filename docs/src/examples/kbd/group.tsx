'use client';

import { Kbd, KbdGroup } from '@/components/ui/kbd';

export default function KbdKeys() {
  return (
    <p className="text-sm text-muted-foreground">
      Ejecuta la consulta con{' '}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>Enter</Kbd>
      </KbdGroup>.
    </p>
  );
}
