'use client';

import { useState } from 'react';
import { ErrorState } from '@/components/ui/error-state';

export default function ErrorstateDemo() {
  const [retried, setRetried] = useState(false);

  return retried ? (
    <p role="status">Se cargó el informe «Ventas por región».</p>
  ) : (
    <ErrorState
      className="w-full max-w-lg"
      title="No se pudo cargar el informe"
      description="La consulta tardó demasiado. Inténtalo de nuevo."
      onRetry={() => setRetried(true)}
    />
  );
}
