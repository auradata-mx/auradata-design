'use client';

import { ErrorState } from '@/components/ui/error-state'

export function ErrorStateExample() {
  return (
    <ErrorState title="No pudimos cargar la gráfica" onRetry={() => {}} detail="timeout after 30s (query 8f2c)" />
  );
}
