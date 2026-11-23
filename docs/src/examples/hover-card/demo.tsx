'use client';
import { DatabaseIcon } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export default function HoverCardDemo() {
  return (
    <p className="text-sm">
      Este informe lee{' '}
      <HoverCard>
        <HoverCardTrigger href="#pedidos-2026" className="font-medium text-primary underline underline-offset-4">
          Pedidos 2026
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted dark:bg-foreground/10">
              <DatabaseIcon aria-hidden className="size-4" />
            </span>
            <div className="grid gap-1">
              <p className="font-medium">Pedidos 2026</p>
              <p className="text-muted-foreground">PostgreSQL · ventas.pedidos</p>
              <p className="text-muted-foreground">1.2&nbsp;M filas</p>
              <p className="text-xs text-muted-foreground">Se actualizó hoy a las 9:00</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  );
}
