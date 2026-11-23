'use client';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** A shell command with a copy button: the registry `Button`, rendered by the docs as the registry ships it. */
export function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex w-full max-w-2xl items-center gap-2 rounded-xl border bg-card py-1.5 pr-1.5 pl-4 font-mono text-sm text-card-foreground">
      <code className="min-w-0 flex-1 truncate">{command}</code>
      <Button variant="ghost" size="icon-sm" onClick={copy} aria-label={copied ? 'Copiado' : 'Copiar comando'}>
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
}
