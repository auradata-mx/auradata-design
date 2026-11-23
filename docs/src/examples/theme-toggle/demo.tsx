'use client';

import { useTheme } from 'next-themes';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function ThemetoggleDemo() {
  const { theme, setTheme } = useTheme();
  const current = theme === 'light' || theme === 'dark' ? theme : 'system';

  return <ThemeToggle theme={current} onThemeChange={setTheme} />;
}
