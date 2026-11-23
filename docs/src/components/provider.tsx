'use client';
import SearchDialog from '@docs/components/search';
import { translations } from '@docs/lib/translations';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }} i18n={{ locale: 'es', translations }}>
      {children}
    </RootProvider>
  );
}
