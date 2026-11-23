'use client';

import { Bubble, BubbleContent, BubbleGroup } from '@/components/ui/bubble';

export default function BubbleDemo() {
  return (
    <BubbleGroup className="w-full max-w-lg">
      <Bubble align="end">
        <BubbleContent>
          <span className="sr-only">Tú: </span>¿Cómo van las ventas de este mes?
        </BubbleContent>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>
          <span className="sr-only">Asistente: </span>Las ventas subieron 12.4 % frente al mes anterior.
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  );
}
