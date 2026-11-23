'use client';

import { Heatmap } from '@/components/ui/heatmap';

export default function HeatmapDemo() {
  return (
    <Heatmap
      className="w-full"
      rows={['Norte', 'Centro', 'Sur']}
      columns={['Ago', 'Sep', 'Oct']}
      caption="Consultas por región y mes"
      showCaption
      values={[[1210, 1150, 1284], [1980, 2010, 2031], [820, 870, null]]}
    />
  );
}
