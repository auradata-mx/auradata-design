'use client';

import { Sparkline } from '@/components/ui/sparkline';
import { formatNumber } from '@/lib/format';

export default function SparklineDemo() {
  return (
    <div className="flex items-center gap-3">
      <span className="tabular-nums">{formatNumber(1284)} consultas</span>
      <Sparkline values={[1080, 1210, 1150, 1284]} label="Las consultas subieron entre julio y octubre" />
    </div>
  );
}
