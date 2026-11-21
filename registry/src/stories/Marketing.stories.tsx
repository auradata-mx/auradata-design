import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartColumnIcon, LightbulbIcon, LayersIcon, WorkflowIcon } from 'lucide-react'
import { expect, userEvent, within } from 'storybook/test'

import { BenefitsGrid, type Benefit } from '@/components/blocks/benefits-grid'
import { CtaBand } from '@/components/blocks/cta-band'
import { Faq, type FaqItem } from '@/components/blocks/faq'
import { Hero } from '@/components/blocks/hero'
import { SiteFooter, type FooterColumn } from '@/components/blocks/site-footer'
import { Button } from '@/components/ui/button'

const BENEFITS: Benefit[] = [
  {
    icon: LightbulbIcon,
    title: 'Claridad desde el día uno',
    description: 'Definimos el problema antes de escribir código, para que cada decisión tenga un propósito claro.',
  },
  {
    icon: WorkflowIcon,
    title: 'Menos trabajo manual',
    description: 'Automatizamos procesos repetitivos para que tu equipo se enfoque en lo que genera valor.',
  },
  {
    icon: ChartColumnIcon,
    title: 'Sistemas que crecen contigo',
    description: 'Arquitecturas pensadas para escalar sin rehacer todo cuando el negocio crece.',
  },
  {
    icon: LayersIcon,
    title: 'Tecnología alineada al negocio',
    description: 'Cada módulo responde a un objetivo concreto, no a una moda tecnológica.',
  },
]

const FAQS: FaqItem[] = [
  {
    question: '¿Qué necesito para iniciar?',
    answer:
      'Una idea clara del problema que quieres resolver y disponibilidad para una primera conversación. Nosotros ayudamos a traducir eso en alcance, prioridades y plan de trabajo.',
  },
  {
    question: '¿Construyen solo productos nuevos?',
    answer: 'No. También hacemos consultoría, integraciones entre sistemas existentes y automatización de procesos operativos.',
  },
  {
    question: '¿Pueden mantener o mejorar un sistema que ya tenemos?',
    answer:
      'Sí. Revisamos el estado actual, documentamos riesgos y proponemos un plan de estabilización o evolución sin frenar la operación.',
  },
  {
    question: '¿Trabajan con empresas fuera de su ciudad?',
    answer:
      'Sí. Trabajamos de forma remota con empresas de todo México, con reuniones por videollamada y avances visibles cada semana.',
  },
]

const COLUMNS: FooterColumn[] = [
  {
    title: 'Productos',
    links: [
      { label: 'AuraData BI', href: '#bi' },
      { label: 'Precios', href: '#precios' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Proceso', href: '#proceso' },
      { label: 'Nosotros', href: '#nosotros' },
      { label: 'Guía de marca', href: '#marca' },
      { label: 'Contacto', href: '#contacto' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Términos y condiciones', href: '#terminos' },
      { label: 'Aviso de privacidad', href: '#privacidad' },
    ],
  },
]

const hero = (
  <Hero
    eyebrow="Software a la medida · Hecho en México"
    title="Claramente imaginado."
    highlight="Precisamente construido."
    description="Diseñamos y desarrollamos software con claridad, propósito y precisión para impulsar tu negocio."
    actions={
      <>
        <Button size="lg" render={<a href="#contacto" />} nativeButton={false}>
          Iniciar proyecto
        </Button>
        <Button size="lg" variant="outline" render={<a href="#proceso" />} nativeButton={false}>
          Ver el proceso
        </Button>
      </>
    }
  />
)

const benefits = (
  <BenefitsGrid
    eyebrow="Por qué AuraData"
    title="Lo que ganas al"
    highlight="trabajar con nosotros"
    description="Cuatro razones por las que los equipos nos eligen para construir su software."
    items={BENEFITS}
  />
)

const faq = <Faq eyebrow="Preguntas frecuentes" title="Antes de empezar" items={FAQS} />

const cta = (
  <CtaBand
    eyebrow="Hablemos"
    title="¿Listo para construir con claridad?"
    description="Cuéntanos sobre tu proyecto. Te respondemos en menos de 48 horas con los siguientes pasos."
    actions={
      <>
        <Button size="lg" render={<a href="#contacto" />} nativeButton={false}>
          Iniciar proyecto
        </Button>
        <Button size="lg" variant="outline" render={<a href="mailto:contacto@auradata.mx" />} nativeButton={false}>
          contacto@auradata.mx
        </Button>
      </>
    }
  />
)

const footer = (
  <SiteFooter
    tagline="Software con claridad, propósito y precisión para impulsar tu negocio."
    columns={COLUMNS}
    copyright="© 2026 AuraData. Todos los derechos reservados."
  />
)

const meta = {
  title: 'Blocks/Marketing',
  // Blocks are whole sections: no padding around them.
  parameters: { layout: 'fullscreen', themeFrame: { padded: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * Pages that must hold on a phone: stories tagged `mobile` open at 390×844 and the `mobile` Playwright
 * project checks them there. The tag stays literal on each story: Storybook's indexer reads it statically.
 */
const ON_PHONE = { viewport: { value: 'mobile', isRotated: false } }

export const HeroSection: Story = { tags: ['mobile'], globals: ON_PHONE, name: 'Hero', render: () => hero }

export const Benefits: Story = { tags: ['mobile'], globals: ON_PHONE, render: () => benefits }

/** The first question starts open; a click opens another. */
export const FaqSection: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'FAQ',
  render: () => faq,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('button', { name: '¿Qué necesito para iniciar?' })
    const second = canvas.getByRole('button', { name: '¿Construyen solo productos nuevos?' })
    await expect(first).toHaveAttribute('aria-expanded', 'true')
    await expect(second).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(second)
    await expect(second).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText(/También hacemos consultoría/)).toBeVisible()
    // Put it back, so the screenshot shows the first answer.
    await userEvent.click(second)
    await expect(second).toHaveAttribute('aria-expanded', 'false')
  },
}

export const Cta: Story = { tags: ['mobile'], globals: ON_PHONE, name: 'CTA band', render: () => cta }

export const Footer: Story = { tags: ['mobile'], globals: ON_PHONE, render: () => footer }

/** A whole page of auradata.mx: hero, benefits, FAQ, call to action and footer. */
export const Landing: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  render: () => (
    <>
      <main>
        {hero}
        {benefits}
        {faq}
        {cta}
      </main>
      {footer}
    </>
  ),
}
