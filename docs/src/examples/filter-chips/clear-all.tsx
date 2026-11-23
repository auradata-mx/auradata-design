'use client';

import { useState } from 'react';
import { FilterChips, type FilterChip } from '@/components/ui/filter-chips';
import { Button } from '@/components/ui/button';

const INITIAL: FilterChip[] = [
  { id: 'region', label: 'Región', value: 'Norte, Bajío' },
  { id: 'estado', label: 'Estado', value: 'Publicado' },
];

export default function FilterChipsClearAll() {
  const [chips, setChips] = useState(INITIAL);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.length > 0 ? (
        <FilterChips
          chips={chips}
          onRemove={(id) => setChips((current) => current.filter((chip) => chip.id !== id))}
          onClearAll={() => setChips([])}
        />
      ) : (
        <Button variant="outline" onClick={() => setChips(INITIAL)}>Restablecer filtros</Button>
      )}
    </div>
  );
}
