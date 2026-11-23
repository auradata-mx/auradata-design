'use client';
import { ChevronRightIcon, DatabaseIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export default function ItemVariants() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <Item>
        <ItemMedia variant="icon">
          <DatabaseIcon aria-hidden />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Pedidos 2026</ItemTitle>
          <ItemDescription>PostgreSQL · 1.2 M filas</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Ventas 2026</ItemTitle>
          <ItemDescription>Lo editó Ana López hace 2 horas.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Abrir
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm" render={<a href="#nuevo-espacio" />}>
        <ItemContent>
          <ItemTitle>Crea un espacio de trabajo</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon aria-hidden className="size-4" />
        </ItemActions>
      </Item>
    </div>
  );
}
