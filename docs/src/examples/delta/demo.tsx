'use client';

import { Delta } from '@/components/ui/delta';

export default function DeltaDemo() {
  return (
    <Delta change={0.062} comparison="vs. septiembre" />
  );
}
