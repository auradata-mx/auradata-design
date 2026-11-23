'use client';

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller';

export default function MessagescrollerDemo() {
  const messages = [
    '¿Cuánto vendimos este mes?',
    'Las ventas sumaron $1,284,500.',
    '¿Qué región creció más?',
    'El Norte creció 12.4 % frente al mes anterior.',
    '¿Hay un informe para compartir?',
    'El informe «Ventas por región» está listo.',
  ];

  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <MessageScroller className="h-48 w-full max-w-lg rounded-lg border">
        <MessageScrollerViewport aria-label="Mensajes">
          <MessageScrollerContent aria-live="polite" className="gap-3 p-4">
            {messages.map((message, index) => (
              <MessageScrollerItem
                key={message}
                messageId={String(index)}
                className="rounded-lg bg-muted p-3 text-sm"
              >
                <strong>{index % 2 === 0 ? 'Tú: ' : 'Asistente: '}</strong>
                {message}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton direction="end" behavior="instant" className="motion-reduce:transition-none" />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
