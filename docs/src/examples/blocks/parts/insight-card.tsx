'use client';

import { useState } from 'react';
import { InsightCard } from '@/components/blocks/insight-card';
import { formatCompact } from '@/lib/format';

export default function InsightCardDemo() {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="grid w-full max-w-md gap-3">
      <InsightCard
        title="El Norte creció más que ninguna región"
        value={formatCompact(1390000, { currency: 'MXN' })}
        change={0.094}
        comparison="vs. octubre"
        description="Monterrey Centro aportó la mayor parte del crecimiento."
        action={{ label: showDetail ? 'Ocultar detalle' : 'Ver detalle', onClick: () => setShowDetail(!showDetail) }}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {showDetail ? 'Monterrey Centro registró 312 ventas en noviembre.' : ''}
      </p>
    </div>
  );
}
