'use client';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { FileTextIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function EmptyDemo() {
  const [created, setCreated] = useState(false);

  return created ? (
    <p role="status" className="text-sm">
      Se creó el borrador «Ventas por región».
    </p>
  ) : (
    <Empty className="w-full max-w-lg border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileTextIcon aria-hidden />
        </EmptyMedia>
        <EmptyTitle>Aún no hay informes</EmptyTitle>
        <EmptyDescription>Crea el primero desde un dataset.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => setCreated(true)}>Crear informe</Button>
      </EmptyContent>
    </Empty>
  );
}
