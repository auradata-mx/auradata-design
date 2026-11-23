'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AvatarDemo() {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="lg" aria-hidden>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <span className="text-sm">Ana López</span>
    </div>
  );
}
