'use client';

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceTitle,
  TraceLine,
} from '@/components/ui/trace';

export default function TraceDemo() {
  return (
    <Trace>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceTitle>Ver consulta SQL</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <code>SELECT region, SUM(ventas) FROM pedidos GROUP BY region;</code>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
