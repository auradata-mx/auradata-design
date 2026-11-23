'use client';

import { EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, Empty } from '@/components/ui/empty';
import { EmptyIllustration } from '@/components/ui/empty-illustration';

export default function EmptyillustrationDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <EmptyIllustration name="reports" />
        </EmptyMedia>
        <EmptyTitle>Aún no hay informes</EmptyTitle>
        <EmptyDescription>Crea el primero desde un dataset.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
