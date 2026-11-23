'use client';

import { Heatmap } from '@/components/ui/heatmap';
import { formatPercent } from '@/lib/format';

export default function HeatmapDiverging() {
  return (
    <Heatmap
      className="w-full"
      rows={['Norte', 'Centro', 'Sur']}
      columns={['Ago', 'Sep', 'Oct']}
      caption="Ventas respecto a la meta por región"
      showCaption
      values={[[-0.08, 0.02, 0.12], [0.04, 0, 0.06], [-0.12, -0.05, null]]}
      scale="diverging"
      limit={0.15}
      valueFormatter={(value) => formatPercent(value, { signDisplay: 'exceptZero' })}
    />
  );
}
