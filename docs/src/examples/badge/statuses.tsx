'use client';

import { Badge } from '@/components/ui/badge';

export default function BadgeStatuses() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">Borrador</Badge>
      <Badge variant="info">En revisión</Badge>
      <Badge variant="warning">Sin actualizar</Badge>
      <Badge variant="destructive">Error de carga</Badge>
    </div>
  );
}
