'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';

export default function ButtongroupWithInput() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');

  return (
    <form
      className="w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault();
        setResult(query.trim() ? `Búsqueda: «${query.trim()}».` : 'Escribe el nombre de un informe.');
      }}
    >
      <ButtonGroup aria-label="Buscar informes">
        <Input
          aria-label="Nombre del informe"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit" variant="outline">
          Buscar
        </Button>
      </ButtonGroup>
      <p role="status" className="mt-2 text-sm">
        {result}
      </p>
    </form>
  );
}
