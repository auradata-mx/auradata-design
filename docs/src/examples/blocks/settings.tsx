'use client';

import { useState } from 'react';
import { Settings } from '@/components/blocks/settings';

export default function SettingsExample() {
  const [saved, setSaved] = useState(false);

  return (
    <div
      className="p-4 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
      onChange={() => setSaved(false)}
    >
      <Settings />
      {saved && <p role="status" className="mt-4 text-sm">Los cambios se aplicaron solo a esta vista.</p>}
    </div>
  );
}
