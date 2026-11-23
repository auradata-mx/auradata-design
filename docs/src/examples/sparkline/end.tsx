'use client';

import { Sparkline } from '@/components/ui/sparkline';

export default function SparklineEnd() {
  return (
    <Sparkline
      values={[1080, 1210, 1150, 1284]}
      area
      showEnd
      label="Las consultas subieron entre julio y octubre"
    />
  );
}
