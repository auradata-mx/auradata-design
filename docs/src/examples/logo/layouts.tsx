'use client';

import { Logo } from '@/components/ui/logo';

export default function LogoLayouts() {
  return (
    <div className="flex flex-wrap items-center gap-12">
      <Logo layout="vertical" alt="AuraData, composición vertical" className="h-20 w-auto" />
      <Logo layout="mark" alt="AuraData, isotipo" className="h-12 w-auto" />
    </div>
  );
}
