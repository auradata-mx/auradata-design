'use client';
import { UserMenu } from '@/components/ui/user-menu';

export default function UserMenuFull() {
  return (
    <div className="w-64 rounded-xl border p-2">
      <UserMenu variant="full" side="top" align="start" user={{ name: 'Ana López', email: 'ana@empresa.mx' }} />
    </div>
  );
}
