'use client';

import { useState } from 'react';
import { ThemeToggle, type Theme } from '@/components/ui/theme-toggle';

export default function ThemetoggleControlled() {
  const [theme, setTheme] = useState<Theme>('system');
  const labels = { light: 'Claro', dark: 'Oscuro', system: 'Sistema' };

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle theme={theme} onThemeChange={setTheme} />
      <p role="status" className="text-sm">
        Tema elegido: {labels[theme]}
      </p>
    </div>
  );
}
