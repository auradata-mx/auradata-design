'use client';

import { ProgressiveBlur } from '@/components/ui/progressive-blur';

export default function ProgressiveblurDemo() {
  return (
    <div className="relative h-32 w-full max-w-md overflow-hidden rounded-lg border">
      <div className="grid size-full grid-cols-8 grid-rows-4" aria-hidden>
        {Array.from({ length: 32 }, (_, index) => (
          <div key={index} className={(index + Math.floor(index / 8)) % 2 ? 'bg-chart-1' : 'bg-chart-3'} />
        ))}
      </div>
      <ProgressiveBlur side="bottom" tint />
    </div>
  );
}
