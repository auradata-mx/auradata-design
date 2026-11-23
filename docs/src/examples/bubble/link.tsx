'use client';

import { Bubble, BubbleContent } from '@/components/ui/bubble';

export default function BubbleLink() {
  return (
    <Bubble variant="outline">
      <BubbleContent render={<a href="/docs/components/message-scroller/" />}>
        Ver cómo mostrar el historial
      </BubbleContent>
    </Bubble>
  );
}
