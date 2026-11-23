'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NumberTicker } from '@/components/ui/number-ticker';
import { formatCurrency } from '@/lib/format';

export default function NumberTickerUpdate() {
  const [value, setValue] = useState(3890000);

  return (
    <div className="grid justify-items-center gap-3">
      <p className="text-2xl"><NumberTicker value={value} format={(amount) => formatCurrency(amount)} /></p>
      <Button
        variant="outline"
        onClick={() => setValue((current) => current === 3890000 ? 4030000 : 3890000)}
      >
        Cambiar periodo
      </Button>
    </div>
  );
}
