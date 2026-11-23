'use client';

import { AuraBackground } from '@/components/ui/aura-background';

export default function AurabackgroundBand() {
  return (
    <div className="relative isolate grid min-h-40 w-full place-items-center rounded-xl text-center">
      <AuraBackground variant="band" />
      <p className="px-6 text-xl font-semibold">Conecta tu primer dataset</p>
    </div>
  );
}
