'use client';

import { Logo, ProductTag } from '@/components/ui/logo';

export default function LogoDemo() {
  return (
    <div className="flex items-center gap-2">
      <Logo className="h-8 w-auto" />
      <ProductTag>BI</ProductTag>
    </div>
  );
}
