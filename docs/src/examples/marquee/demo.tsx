'use client';

import { Marquee } from '@/components/ui/marquee';

export default function MarqueeDemo() {
  const teams = ['Ventas', 'Finanzas', 'Operaciones', 'Datos', 'Soporte'];

  return (
    <Marquee
      className="w-full max-w-lg"
      label="Espacios de trabajo"
      items={teams.map((team) => (
        <span key={team} className="rounded-lg border bg-card px-3 py-2">
          {team}
        </span>
      ))}
    />
  );
}
