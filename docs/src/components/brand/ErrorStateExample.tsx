'use client';

import { EmptyError } from '@/components/ui/empty'

export function ErrorStateExample() {
  return (
    <EmptyError title="No pudimos cargar la gráfica" onRetry={() => {}} detail="timeout after 30s (query 8f2c)" />
  );
}
