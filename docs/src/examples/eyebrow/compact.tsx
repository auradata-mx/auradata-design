'use client';

import { Eyebrow } from '@/components/ui/eyebrow';

export default function EyebrowCompact() {
  return (
    <div className="grid justify-items-center gap-2 text-center">
      <Eyebrow>Conexiones</Eyebrow>
      <h3 className="text-2xl font-semibold">Trae tus datos a AuraData BI</h3>
    </div>
  );
}
