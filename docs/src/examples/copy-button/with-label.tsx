'use client';

import { CopyButton } from '@/components/ui/copy-button';

export default function CopyButtonWithLabel() {
  return (
    <CopyButton
      value="https://bi.auradata.mx/informes/ventas-2026"
      variant="outline"
      size="sm"
    >
      Copiar enlace
    </CopyButton>
  );
}
