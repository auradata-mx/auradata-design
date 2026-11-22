import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartColumnIcon, LightbulbIcon, LayersIcon, WorkflowIcon } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { BenefitsGrid, type Benefit } from '@/components/blocks/benefits-grid'
import { CtaBand } from '@/components/blocks/cta-band'
import { Faq, type FaqItem } from '@/components/blocks/faq'
import { Hero } from '@/components/blocks/hero'
import { PlanComparison } from '@/components/blocks/plan-comparison'
import { Pricing, type PricingPlan } from '@/components/blocks/pricing'
import { SiteFooter, type FooterColumn } from '@/components/blocks/site-footer'
import { Button } from '@/components/ui/button'
import { formatPercent } from '@/lib/format'
import { COMPARISON, PLANS } from './marketing-data'

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

const PRICING_PLANS: PricingPlan[] = PLANS.map((plan) => ({
  ...plan,
  cta: (
    <Button
      size="lg"
      variant={plan.featured ? 'default' : 'outline'}
      className="w-full"
      render={<a href={plan.price ? '#registro' : '#contacto'} />}
      nativeButton={false}
    >
      {plan.price ? `Empezar con ${plan.name}` : 'Hablar con ventas'}
    </Button>
  ),
}))

const onBillingChange = fn()

const pricing = (props: Partial<React.ComponentProps<typeof Pricing>> = {}) => (
  <Pricing
    id="precios"
    eyebrow="Precios"
    title="Un plan para cada"
    highlight="etapa de tu equipo"
    description="Precios en pesos mexicanos, más IVA. Cambia de plan o cancela cuando quieras."
    plans={PRICING_PLANS}
    annualNote={`Ahorra ${formatPercent(0.2)}`}
    {...props}
  />
)

const comparison = (
  <PlanComparison
    eyebrow="Compara"
    title="Todo lo que incluye cada plan"
    plans={PLANS.map(({ name, featured }) => ({ name, featured }))}
    groups={COMPARISON}
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
    // And leave no focus ring on it.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

export const Cta: Story = { tags: ['mobile'], globals: ON_PHONE, name: 'CTA band', render: () => cta }

/** On a phone every link is a 40px tall row, easy to tap; the columns sit two by two under the logo. */
export const Footer: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  render: () => footer,
  play: async ({ canvasElement }) => {
    if (window.innerWidth >= 640) return
    const links = canvasElement.querySelectorAll<HTMLElement>('nav a')
    await expect(links.length).toBeGreaterThan(0)
    for (const link of links) await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(40)
  },
}

/**
 * Plans in MXN with a monthly/annual switch: the annual price is per month, with the yearly total under
 * it. The recommended plan carries the brand gradient border.
 */
export const PricingSection: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'Pricing',
  render: () => pricing({ onBillingChange }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const monthly = canvas.getByRole('button', { name: 'Mensual' })
    const annual = canvas.getByRole('button', { name: /^Anual/ })
    await expect(canvas.getByRole('group', { name: 'Periodo de facturación' })).toBeInTheDocument()
    await expect(monthly).toHaveAttribute('aria-pressed', 'true')
    const team = canvas.getByRole('article', { name: 'Equipo' })
    await expect(within(team).getByText('$3,990')).toBeInTheDocument()
    await expect(within(team).getByText('Facturado cada mes')).toBeInTheDocument()

    await userEvent.click(annual)
    await expect(annual).toHaveAttribute('aria-pressed', 'true')
    await expect(monthly).toHaveAttribute('aria-pressed', 'false')
    await expect(onBillingChange).toHaveBeenCalledWith('annual')
    await expect(within(team).getByText('$3,190')).toBeInTheDocument()
    await expect(within(team).getByText('$38,280 al año')).toBeInTheDocument()
    // The plan without a price keeps its label either way.
    await expect(within(canvas.getByRole('article', { name: 'Empresa' })).getByText('A la medida')).toBeInTheDocument()
    // Clicking the pressed period again keeps it: one is always chosen.
    await userEvent.click(annual)
    await expect(annual).toHaveAttribute('aria-pressed', 'true')

    // From md the cards share rows: every button and every heading lines up, whatever the text above.
    if (window.innerWidth >= 768) {
      const tops = (selector: string) =>
        new Set([...canvasElement.querySelectorAll('article')].map((plan) => plan.querySelector(selector)!.getBoundingClientRect().top))
      await expect(tops('h3').size).toBe(1)
      await expect(tops('a').size).toBe(1)
    }

    // Back to monthly for the screenshot, without a focus ring.
    await userEvent.click(monthly)
    await expect(within(team).getByText('$3,990')).toBeInTheDocument()
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/**
 * Every plan side by side. On a phone the table scrolls sideways inside its frame while the feature
 * names stay put; a check or a dash reads «Incluido» or «No incluido» to screen readers.
 */
export const Comparison: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'Plan comparison',
  render: () => comparison,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table', { name: 'Comparación de planes' })
    const columns = within(table).getAllByRole('columnheader')
    await expect(columns.map((header) => header.textContent)).toEqual(['Función', 'Inicial', 'RecomendadoEquipo', 'Empresa'])
    // Each group heads its rows; each feature heads its row.
    await expect(within(table).getByRole('rowheader', { name: 'Seguridad y soporte' })).toHaveAttribute('scope', 'rowgroup')
    const sso = within(table).getByRole('rowheader', { name: 'Inicio de sesión único (SSO)' }).closest('tr')!
    const cells = within(sso).getAllByRole('cell').map((cell) => cell.textContent)
    await expect(cells).toEqual(['No incluido', 'No incluido', 'Incluido'])
    // The recommended plan's column says so in words, not only with its tint.
    await expect(within(table).getByRole('columnheader', { name: 'Recomendado Equipo' })).toBeInTheDocument()
    // The frame scrolls with the keyboard too, and nothing in it widens the page.
    await expect(canvas.getByRole('region', { name: 'Comparación de planes' })).toHaveAttribute('tabindex', '0')
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth)
  },
}

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
