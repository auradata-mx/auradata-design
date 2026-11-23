'use client';

import { EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, Empty } from '@/components/ui/empty';
import { EmptyIllustration } from '@/components/ui/empty-illustration';

export default function EmptyillustrationSmall() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <EmptyIllustration name="results" size="sm" />
        </EmptyMedia>
        <EmptyTitle>No encontramos resultados</EmptyTitle>
        <EmptyDescription>Prueba con otra palabra o quita los filtros.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
