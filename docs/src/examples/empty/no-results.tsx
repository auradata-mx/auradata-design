'use client';

import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

export default function EmptyNoResults() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No encontramos resultados</EmptyTitle>
        <EmptyDescription>Prueba con otra palabra o quita los filtros.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
