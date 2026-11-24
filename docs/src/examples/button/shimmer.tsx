'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ButtonShimmer() {
  const [requested, setRequested] = useState(false);

  return (
    <div className="grid justify-items-start gap-2">
      <Button shimmer onClick={() => setRequested(true)}>
        Solicitar una demo
      </Button>
      <p role="status" className="text-sm">
        {requested ? 'Solicitud enviada.' : ''}
      </p>
    </div>
  );
}
