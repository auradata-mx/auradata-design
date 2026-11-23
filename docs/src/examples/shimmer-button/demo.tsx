'use client';

import { useState } from 'react';
import { ShimmerButton } from '@/components/ui/shimmer-button';

export default function ShimmerbuttonDemo() {
  const [requested, setRequested] = useState(false);

  return (
    <div className="grid justify-items-start gap-2">
      <ShimmerButton onClick={() => setRequested(true)}>Solicitar una demo</ShimmerButton>
      <p role="status" className="text-sm">
        {requested ? 'Solicitud enviada.' : ''}
      </p>
    </div>
  );
}
