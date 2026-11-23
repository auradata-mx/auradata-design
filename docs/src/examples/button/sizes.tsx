'use client';
import { Button } from '@/components/ui/button';

export default function ButtonSizes() {
  return (
    <>
      <Button size="xs">Extra chico</Button>
      <Button size="sm">Chico</Button>
      <Button>Normal</Button>
      <Button size="lg">Grande</Button>
    </>
  );
}
