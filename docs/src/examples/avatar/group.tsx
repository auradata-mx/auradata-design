'use client';

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';

export default function AvatarGroupDemo() {
  return (
    <AvatarGroup role="group" aria-label="Miembros del espacio Ventas">
      <Avatar role="img" aria-label="Ana López">
        <AvatarFallback aria-hidden>AL</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Jorge Ramírez">
        <AvatarFallback aria-hidden>JR</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>
        <span aria-hidden>+3</span>
        <span className="sr-only">3 miembros más</span>
      </AvatarGroupCount>
    </AvatarGroup>
  );
}
