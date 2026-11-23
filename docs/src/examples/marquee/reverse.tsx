'use client';

import { Marquee } from '@/components/ui/marquee';

export default function MarqueeReverse() {
  return (
    <Marquee
      className="w-full max-w-lg"
      label="Informes de ejemplo"
      gap="2rem"
      duration={60}
      reverse
      items={['Ventas por región', 'Pedidos 2026', 'Costos por sucursal']}
    />
  );
}
