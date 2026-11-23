'use client';
import { Button } from '@/components/ui/button';

export default function ButtonVariants() {
  return (
    <>
      <Button>Principal</Button>
      <Button variant="outline">Contorno</Button>
      <Button variant="secondary">Secundario</Button>
      <Button variant="ghost">Fantasma</Button>
      <Button variant="destructive">Destructivo</Button>
      <Button variant="link">Enlace</Button>
    </>
  );
}
