'use client';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const sides = [
  ['top', 'Arriba'],
  ['right', 'Derecha'],
  ['bottom', 'Abajo'],
  ['left', 'Izquierda'],
] as const;

export default function TooltipSides() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap justify-center gap-3">
        {sides.map(([side, label]) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" />}>{label}</TooltipTrigger>
            <TooltipContent side={side}>Vuelve a leer los datos</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
