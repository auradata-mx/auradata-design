'use client';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

export default function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-48 w-full max-w-80 items-center justify-center rounded-lg border border-dashed px-6 text-center text-sm text-balance text-muted-foreground">
        Haz clic derecho o mantén presionada la gráfica
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuGroup>
          <ContextMenuItem>
            Editar gráfica <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>Ver como tabla</ContextMenuItem>
          <ContextMenuItem>Descargar CSV</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Quitar del informe</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
