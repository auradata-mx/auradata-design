'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function CarouselTwoPerView() {
  const views = ['Ventas', 'Finanzas', 'Operaciones'];

  return (
    <Carousel
      aria-label="Espacios de trabajo"
      className="w-full max-w-lg"
      opts={{ align: 'start', breakpoints: { '(prefers-reduced-motion: reduce)': { duration: 0 } } }}
    >
      <CarouselContent>
        {views.map((view, index) => (
          <CarouselItem key={view} aria-label={`${index + 1} de ${views.length}`} className="md:basis-1/2">
            <div className="rounded-lg border bg-card p-4 text-card-foreground">{view}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-3 flex justify-end gap-2">
        <CarouselPrevious className="static" />
        <CarouselNext className="static" />
      </div>
    </Carousel>
  );
}
