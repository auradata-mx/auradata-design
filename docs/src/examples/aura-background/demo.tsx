'use client';

import { AuraBackground } from '@/components/ui/aura-background';

export default function AurabackgroundDemo() {
  return (
    <div className="relative isolate grid min-h-56 w-full place-items-center rounded-xl text-center">
      <AuraBackground grid />
      <p className="px-6 text-2xl font-semibold">Tus datos, en un solo lugar</p>
    </div>
  );
}
