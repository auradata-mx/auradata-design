import type { ReactNode } from 'react';

export function ColorPalette({ children }: { children: ReactNode }) {
  return <div className="not-prose my-6 grid gap-3">{children}</div>;
}

export function ColorItem({
  title,
  subtitle,
  colors,
}: {
  title: string;
  subtitle?: string;
  colors: Record<string, string> | string[];
}) {
  const swatches = Array.isArray(colors)
    ? colors.map((value) => ({ value, name: undefined }))
    : Object.entries(colors).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-3 rounded-xl border p-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(5rem,1fr))] gap-2">
        {swatches.map(({ name, value }, index) => (
          <li key={name ?? index} className="grid content-start gap-1">
            <div className="h-10 rounded-md border" style={{ background: value }} aria-hidden />
            {name && title !== `--${name}` && <span className="text-xs">{name}</span>}
            <code className="break-all font-mono text-xs text-muted-foreground">{value}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
