'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller';

export default function MessagescrollerAppend() {
  const [count, setCount] = useState(1);

  return (
    <div className="grid w-full max-w-lg justify-items-start gap-3">
      <MessageScrollerProvider>
        <MessageScroller className="h-36 rounded-lg border">
          <MessageScrollerViewport aria-label="Actualizaciones del informe">
            <MessageScrollerContent aria-live="polite" className="gap-2 p-4">
              {Array.from({ length: count }, (_, index) => (
                <MessageScrollerItem
                  key={index}
                  messageId={String(index)}
                  className="rounded-lg bg-muted p-2 text-sm"
                >
                  {index === 0
                    ? 'El informe se publicó.'
                    : `Actualización ${index}: los datos ya están al día.`}
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton behavior="instant" className="motion-reduce:transition-none" />
        </MessageScroller>
      </MessageScrollerProvider>
      <Button variant="outline" onClick={() => setCount((current) => current + 1)}>
        Agregar actualización
      </Button>
    </div>
  );
}
