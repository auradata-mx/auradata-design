'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function ErrorstateDetail() {
  return (
    <ErrorState
      className="w-full max-w-lg"
      title="No se pudo consultar el dataset"
      description="Revisa la conexión en Ajustes."
      detail="QUERY_TIMEOUT"
    />
  );
}
