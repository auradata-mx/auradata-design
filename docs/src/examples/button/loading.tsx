'use client';
import { Button } from '@/components/ui/button';

export default function ButtonLoading() {
  return (
    <>
      <Button loading>Guardando…</Button>
      <Button disabled variant="outline">
        Deshabilitado
      </Button>
    </>
  );
}
