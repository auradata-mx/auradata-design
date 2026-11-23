'use client';

import { useState } from 'react';
import { Login } from '@/components/blocks/login';

export default function LoginExample() {
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState('');

  return (
    <div onClick={(event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a');
      if (link?.getAttribute('href') === '#') {
        event.preventDefault();
        setNotice('La recuperación de contraseña se conecta en tu aplicación.');
      }
    }}>
      <Login
        product="BI"
        error={error}
        onSubmit={(event) => {
          event.preventDefault();
          setNotice('');
          setError('Este es un ejemplo. No se inició sesión ni se enviaron tus datos.');
        }}
      />
      {notice && (
        <p role="status" className="fixed inset-x-4 bottom-3 mx-auto max-w-sm rounded-md border bg-background p-3 text-sm">
          {notice}
        </p>
      )}
    </div>
  );
}
