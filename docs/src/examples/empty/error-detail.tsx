'use client';

import { EmptyError } from '@/components/ui/empty';

export default function EmptyErrorDetail() {
  return (
    <EmptyError
      className="w-full max-w-lg"
      title="No se pudo consultar el dataset"
      description="Revisa la conexión en Ajustes."
      detail="QUERY_TIMEOUT"
    />
  );
}
