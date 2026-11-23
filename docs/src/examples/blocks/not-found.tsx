'use client';

import { useState } from 'react';
import { NotFound } from '@/components/blocks/not-found';
import { Button } from '@/components/ui/button';

export default function NotFoundExample() {
  const [home, setHome] = useState(false);

  if (home) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-xl font-semibold">Inicio de ejemplo</h1>
        <Button variant="outline" onClick={() => setHome(false)}>Volver al ejemplo 404</Button>
      </div>
    );
  }

  return (
    <div onClick={(event) => {
      if (event.target instanceof Element && event.target.closest('a[href="#inicio"]')) {
        event.preventDefault();
        setHome(true);
      }
    }}>
      <NotFound homeHref="#inicio" />
    </div>
  );
}
