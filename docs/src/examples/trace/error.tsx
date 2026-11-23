'use client';

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceLine,
  TraceTitle,
} from '@/components/ui/trace';

export default function TraceError() {
  return (
    <Trace>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceTitle>No se pudo consultar Ventas</TraceTitle>
            <TraceDescription>Falló</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          La conexión no respondió. Revisa su estado y vuelve a intentar.
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
