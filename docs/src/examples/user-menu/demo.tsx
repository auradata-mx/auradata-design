'use client';
import { useState } from 'react';
import type { Theme } from '@/components/ui/theme-toggle';
import { UserMenu } from '@/components/ui/user-menu';

const workspaces = [
  { id: 'ventas', name: 'Ventas' },
  { id: 'finanzas', name: 'Finanzas' },
];

export default function UserMenuDemo() {
  const [workspace, setWorkspace] = useState('ventas');
  const [theme, setTheme] = useState<Theme>('system');
  const [language, setLanguage] = useState('es-MX');
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <UserMenu
        user={{ name: 'Ana López', email: 'ana@empresa.mx' }}
        workspaces={{ workspaces, current: workspace, onSelect: setWorkspace }}
        theme={{ theme, onThemeChange: setTheme }}
        language={{ value: language, onValueChange: setLanguage }}
        onAccount={() => setLast('Mi cuenta')}
        onSettings={() => setLast('Ajustes')}
        onHelp={() => setLast('Ayuda y documentación')}
        onShortcuts={() => setLast('Atajos de teclado')}
        onSignOut={() => setLast('Cerrar sesión')}
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {last ? `Elegiste «${last}».` : 'Abre el menú de la cuenta.'}
      </p>
    </div>
  );
}
