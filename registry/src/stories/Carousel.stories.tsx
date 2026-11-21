import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const TESTIMONIALS = [
  {
    quote:
      "Cerramos el mes en dos días, no en una semana: el informe de ventas se arma solo.",
    name: "Ana López",
    role: "Directora de Finanzas, Grupo Bajío",
  },
  {
    quote:
      "Cada sucursal ve sus números a las 8:00, sin pedirle nada a sistemas.",
    name: "Jorge Ramírez",
    role: "Gerente de Operaciones, Farmacias del Norte",
  },
  {
    quote:
      "Pasamos de 40 hojas de cálculo a un solo tablero que todos entienden.",
    name: "Lucía Hernández",
    role: "Analista de datos, Comercial Occidente",
  },
]

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  args: { opts: { align: "start" } },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Testimonials for auradata.mx: one per view on a phone, two from `md`. The arrows sit under the
 * slides (not beside them), so they never leave a narrow screen; the arrow keys move too.
 */
export const Default: Story = {
  tags: ["mobile"],
  render: (args) => (
    <Carousel
      aria-label="Testimonios"
      className="mx-auto w-full max-w-3xl"
      {...args}
    >
      <CarouselContent>
        {TESTIMONIALS.map((testimonial, index) => (
          <CarouselItem
            key={testimonial.name}
            aria-label={`${index + 1} de ${TESTIMONIALS.length}`}
            className="md:basis-1/2"
          >
            {/* p-px: the card's ring is drawn outside it, and the carousel clips what overflows. */}
            <div className="h-full p-px">
              <Card className="h-full">
                <CardContent className="grid h-full content-between gap-4">
                  <blockquote className="text-pretty">
                    «{testimonial.quote}»
                  </blockquote>
                  <p className="text-sm">
                    <span className="font-medium">{testimonial.name}</span>
                    <br />
                    <span className="text-muted-foreground">
                      {testimonial.role}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex justify-end gap-2">
        <CarouselPrevious className="static" aria-label="Testimonio anterior" />
        <CarouselNext className="static" aria-label="Testimonio siguiente" />
      </div>
    </Carousel>
  ),
}

/** Product screenshots: placeholders in 16:9 until the real captures exist. */
export const Screenshots: Story = {
  render: (args) => (
    <Carousel
      aria-label="Capturas del producto"
      className="mx-auto w-full max-w-xl"
      {...args}
    >
      <CarouselContent>
        {["Tablero de ventas", "SQL Lab", "Informe en el teléfono"].map(
          (title, index) => (
            <CarouselItem key={title} aria-label={`${index + 1} de 3`}>
              <div className="flex aspect-video items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">
                {title}
              </div>
            </CarouselItem>
          )
        )}
      </CarouselContent>
      <div className="mt-4 flex justify-center gap-2">
        <CarouselPrevious className="static" aria-label="Captura anterior" />
        <CarouselNext className="static" aria-label="Captura siguiente" />
      </div>
    </Carousel>
  ),
}
