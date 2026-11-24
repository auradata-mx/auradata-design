'use client';

import { Eyebrow } from '@/components/ui/eyebrow';
import { GradientHeading } from '@/components/ui/gradient-heading';

// The opening of a marketing section: eyebrow, title with its gradient highlight, and a lead.
export default function GradientheadingSectionHeader() {
  return (
    <div className="flex max-w-170 flex-col gap-5">
      <Eyebrow>Por qué AuraData</Eyebrow>
      <GradientHeading as="h2" highlight="trabajar con nosotros" inline>
        Lo que ganas al
      </GradientHeading>
      <p className="text-lg text-pretty text-muted-foreground">
        Software con claridad, propósito y precisión para impulsar tu negocio.
      </p>
    </div>
  );
}
