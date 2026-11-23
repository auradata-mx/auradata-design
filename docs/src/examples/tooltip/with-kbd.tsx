'use client';
import { SaveIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function TooltipWithKbd() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Guardar informe" />}>
          <SaveIcon aria-hidden />
        </TooltipTrigger>
        <TooltipContent>
          Guardar informe <Kbd>Ctrl S</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
