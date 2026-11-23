'use client';

import { useState } from 'react';
import { ConnectionForm } from '@/components/blocks/connection-form';

export default function ConnectionFormExample() {
  const [notice, setNotice] = useState('');

  return (
    <div className="p-4 sm:p-8">
      <ConnectionForm
        onSubmit={() => {
          setNotice('El formulario es válido. No se creó ninguna conexión.');
        }}
        onCancel={() => setNotice('Se canceló la conexión de ejemplo.')}
      />
      {notice && <p role="status" className="mt-4 text-sm">{notice}</p>}
    </div>
  );
}
