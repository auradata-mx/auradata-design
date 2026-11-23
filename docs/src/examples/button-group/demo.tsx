'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group';

export default function ButtongroupDemo() {
  const [result, setResult] = useState('');

  return (
    <div className="grid justify-items-start gap-2">
      <ButtonGroup aria-label="Acciones del informe">
        <Button onClick={() => setResult('Informe publicado.')}>Publicar</Button>
        <ButtonGroupSeparator />
        <Button onClick={() => setResult('El enlace ya está listo para compartir.')}>Compartir</Button>
      </ButtonGroup>
      <p role="status" className="text-sm">
        {result}
      </p>
    </div>
  );
}
