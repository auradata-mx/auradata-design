'use client';
import { RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Actualizar datos" />}>
          <RefreshCwIcon aria-hidden />
        </TooltipTrigger>
        <TooltipContent>Actualizar datos</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
