'use client';

import { CopyButton } from '@/components/ui/copy-button';

export default function CopyButtonDemo() {
  return (
    <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs">
      <span>https://bi.auradata.mx/informes/ventas-2026</span>
      <CopyButton value="https://bi.auradata.mx/informes/ventas-2026" />
    </div>
  );
}
