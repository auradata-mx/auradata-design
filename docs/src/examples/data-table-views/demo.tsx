'use client';

import { useState } from 'react';
import { DataTableViews } from '@/components/ui/data-table-views';

export default function DataTableViewsDemo() {
  const [views, setViews] = useState([] as { id: string; name: string }[]);
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <DataTableViews
      views={views}
      activeId={activeId}
      onApply={setActiveId}
      onSave={(name) => {
        const existing = views.find((view) => view.name === name);
        const id = existing?.id ?? crypto.randomUUID();
        if (!existing) setViews((current) => [...current, { id, name }]);
        setActiveId(id);
      }}
      onDelete={(id) => {
        setViews((current) => current.filter((view) => view.id !== id));
        setActiveId(null);
      }}
    />
  );
}
