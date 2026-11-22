import type { Meta, StoryObj } from '@storybook/react-vite'
import { BellIcon, ChartColumnIcon, LightbulbIcon, LayersIcon, ShieldCheckIcon, SparklesIcon, WorkflowIcon } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { BenefitsGrid, type Benefit } from '@/components/blocks/benefits-grid'
import { Changelog } from '@/components/blocks/changelog'
import { CtaBand } from '@/components/blocks/cta-band'
import { Faq, type FaqItem } from '@/components/blocks/faq'
import { FeatureTabs, type Feature } from '@/components/blocks/feature-tabs'
import { Hero } from '@/components/blocks/hero'
import { LogoCloud } from '@/components/blocks/logo-cloud'
import { PlanComparison } from '@/components/blocks/plan-comparison'
import { Pricing, type PricingPlan } from '@/components/blocks/pricing'
import { SiteFooter, type FooterColumn } from '@/components/blocks/site-footer'
import { Testimonials } from '@/components/blocks/testimonials'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/ui/kpi-card'
import { Logo } from '@/components/ui/logo'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { TextReveal } from '@/components/ui/text-reveal'
import { formatPercent } from '@/lib/format'
import { CLIENTS, ClientMark, COMPARISON, PLANS, RELEASES, TESTIMONIALS } from './marketing-data'

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

const testimonials = (
  <Testimonials
    eyebrow="Testimonios"
    title="Equipos que ya deciden"
    highlight="con sus datos"
    items={TESTIMONIALS}
  />
)

const logoCloud = (variant: 'grid' | 'marquee') => (
  <LogoCloud
    title="Empresas de todo México ya ordenaron sus datos con AuraData"
    logos={CLIENTS.map((client) => ({
      name: client.name,
      logo: <ClientMark {...client} compact={variant === 'grid'} />,
    }))}
    variant={variant}
  />
)

/** A framed stand-in for a product screenshot, built from our own components. */
const Screen = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-3 rounded-(--aura-radius-card) border bg-muted/40 p-4 sm:p-6">{children}</div>
)

const FEATURES: Feature[] = [
  {
    value: 'tableros',
    label: 'Tableros',
    icon: ChartColumnIcon,
    title: 'Tus números clave, siempre al día',
    description: 'Conecta tus fuentes una vez y cada tablero se actualiza solo.',
    points: ['Ventas, inventario y finanzas en una vista', 'Compara contra el mes o el año anterior'],
    visual: (
      <Screen>
        <KpiCard label="Ventas del mes" value="$4.16 M" change={0.062} comparison="vs. octubre" trend={[3.1, 3.4, 3.2, 3.6, 3.5, 3.8, 3.7, 3.9, 4.0, 3.8, 3.92, 4.16]} />
        <KpiCard label="Clientes activos" value="1,284" change={-0.021} comparison="vs. octubre" />
      </Screen>
    ),
  },
  {
    value: 'ia',
    label: 'Pregúntale',
    icon: SparklesIcon,
    title: 'Pregunta en español, responde con datos',
    description: 'Escribe la pregunta como se la harías a tu analista.',
    points: ['Respuestas con su gráfica', 'La consulta que usó, para revisarla'],
    visual: (
      <Screen>
        <p className="self-end rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground">¿Qué región vendió más en octubre?</p>
        <KpiCard label="Bajío, octubre" value="$1.28 M" change={0.114} comparison="vs. septiembre" />
      </Screen>
    ),
  },
  {
    value: 'alertas',
    label: 'Alertas',
    icon: BellIcon,
    title: 'Entérate antes de que sea un problema',
    description: 'Define un umbral y te avisamos por correo cuando se cruza.',
    visual: (
      <Screen>
        <Alert variant="warning">
          <AlertTitle>Inventario bajo en Monterrey</AlertTitle>
          <AlertDescription>Quedan 3 días de existencia de tornillería.</AlertDescription>
        </Alert>
        <Alert variant="success">
          <AlertTitle>Meta de ventas cumplida</AlertTitle>
          <AlertDescription>El Bajío llegó al 104 % de su meta mensual.</AlertDescription>
        </Alert>
      </Screen>
    ),
  },
  {
    value: 'seguridad',
    label: 'Seguridad',
    icon: ShieldCheckIcon,
    title: 'Cada quien ve solo lo que le toca',
    description: 'Permisos por espacio de trabajo y por fila, con bitácora de accesos.',
    visual: (
      <Screen>
        {['Dirección: todo', 'Ventas Bajío: su región', 'Finanzas: estados financieros'].map((role) => (
          <div key={role} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm">
            {role}
            <Badge variant="secondary">Activo</Badge>
          </div>
        ))}
      </Screen>
    ),
  },
]

const featureTabs = (
  <FeatureTabs
    eyebrow="Producto"
    title="Todo tu negocio,"
    highlight="en un solo lugar"
    features={FEATURES}
  />
)

const changelog = (
  <Changelog eyebrow="Novedades" title="Lo nuevo en AuraData BI" entries={RELEASES} />
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

/** Quotes from clients in a grid: one column on a phone, two on a tablet, three on a desktop. */
export const TestimonialsSection: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'Testimonials',
  render: () => testimonials,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const quotes = canvas.getAllByRole('figure')
    await expect(quotes).toHaveLength(TESTIMONIALS.length)
    // Each one: the quote in «», then who said it; the initials are decoration beside the name.
    const first = quotes[0]
    await expect(first.querySelector('blockquote')).toHaveTextContent(/^«Pasamos de juntar.*decisiones\.»$/)
    await expect(first.querySelector('figcaption')).toHaveTextContent('Mariana LópezDirectora comercial · Ferretera del Bajío')
    await expect(first.querySelector('[data-slot=avatar]')).toHaveAttribute('aria-hidden', 'true')
    // In a row, the names sit at the bottom of the cards, level with each other.
    if (window.innerWidth >= 1024) {
      const bottoms = quotes.slice(0, 3).map((quote) => quote.querySelector('figcaption')!.getBoundingClientRect().bottom)
      await expect(new Set(bottoms).size).toBe(1)
    }
  },
}

/** Client logos in a still grid: two columns on a phone, four from sm. */
export const LogoCloudGrid: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'Logo cloud',
  render: () => logoCloud('grid'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const section = canvas.getByRole('region', { name: /ya ordenaron sus datos/ })
    const list = within(section).getByRole('list', { name: 'Clientes' })
    await expect(list.children).toHaveLength(CLIENTS.length)
    // No logo spills out of its cell, nor the page.
    for (const item of list.children) await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth)
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth)
  },
}

/** The same logos moving in a marquee: it stops on hover and focus, and its copies stay hidden. */
export const LogoCloudMarquee: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'Logo cloud marquee',
  render: () => logoCloud('marquee'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('list', { name: 'Clientes' })).toBeInTheDocument()
    const copies = canvasElement.querySelectorAll('[data-slot=marquee-track][aria-hidden=true]')
    await expect(copies.length).toBeGreaterThan(0)
  },
}

/** One feature at a time: tabs above, the explanation beside its screenshot. Arrow keys move between tabs. */
export const FeatureTabsSection: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'Feature tabs',
  render: () => featureTabs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('tablist', { name: 'Funciones' })
    await expect(within(list).getAllByRole('tab')).toHaveLength(FEATURES.length)
    await expect(canvas.getByRole('tab', { name: 'Tableros' })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel', { name: 'Tableros' })).toHaveTextContent('Tus números clave, siempre al día')

    await userEvent.click(canvas.getByRole('tab', { name: 'Alertas' }))
    await expect(canvas.getByRole('tabpanel', { name: 'Alertas' })).toHaveTextContent('Entérate antes de que sea un problema')
    await waitFor(() => expect(canvas.queryByRole('tabpanel', { name: 'Tableros' })).toBeNull())
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await expect(canvas.getByRole('tab', { name: 'Seguridad' })).toHaveAttribute('aria-selected', 'true')

    // Back to the first, without a focus ring, for the screenshot.
    await userEvent.click(canvas.getByRole('tab', { name: 'Tableros' }))
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

/** Releases, newest first: the date and version beside what changed, tagged new, improved or fixed. */
export const ChangelogSection: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  name: 'Changelog',
  render: () => changelog,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const entries = [...canvas.getByRole('list', { name: 'Versiones' }).children] as HTMLElement[]
    await expect(entries).toHaveLength(RELEASES.length)
    const time = entries[0].querySelector('time')!
    await expect(time).toHaveAttribute('datetime', '2026-11-18')
    await expect(time).toHaveTextContent('18 nov 2026')
    await expect(entries[0]).toHaveTextContent('Nuevo')
    await expect(entries[1]).toHaveTextContent('Mejora')
    await expect(entries[2]).toHaveTextContent('Corrección')
    await expect(within(entries[0]).getByRole('heading', { level: 3 })).toHaveTextContent('Pregúntale a tus datos, ahora con gráficas')
  },
}

/**
 * The bar of auradata.mx: it stays on top and the page blurs progressively as it scrolls under it.
 * `-mb-16` floats it over the hero, so the aura runs up to the top edge instead of starting under the bar.
 */
const siteHeader = (
  <header className="sticky top-0 z-20 isolate -mb-16 flex h-16 items-center justify-between gap-6 px-6 md:px-10">
    <ProgressiveBlur side="top" tint size="calc(100% + 1.5rem)" className="-z-10" />
    <a href="#inicio" aria-label="AuraData, inicio" className="rounded-sm">
      <Logo className="h-6" />
    </a>
    <nav aria-label="Principal" className="hidden items-center gap-2 text-sm font-medium text-muted-foreground md:flex">
      {['Producto', 'Clientes', 'Precios', 'Preguntas'].map((label) => (
        <a key={label} href={`#${label.toLowerCase()}`} className="rounded-md px-2 py-2 hover:text-foreground">
          {label}
        </a>
      ))}
    </nav>
    <Button size="sm" render={<a href="#contacto" />} nativeButton={false}>
      Iniciar proyecto
    </Button>
  </header>
)

/** The hero of the landing: its one shimmer button, the page's main call to action. */
const landingHero = (
  <Hero
    eyebrow="Software a la medida · Hecho en México"
    title="Claramente imaginado."
    highlight="Precisamente construido."
    description="Diseñamos y desarrollamos software con claridad, propósito y precisión para impulsar tu negocio."
    actions={
      <>
        <ShimmerButton size="lg" render={<a href="#contacto" />} nativeButton={false}>
          Iniciar proyecto
        </ShimmerButton>
        <Button size="lg" variant="outline" render={<a href="#producto" />} nativeButton={false}>
          Ver el producto
        </Button>
      </>
    }
  />
)

/** One sentence that lights up as it scrolls by, between two sections. */
const statement = (
  <section aria-label="Nuestra forma de trabajar" className="px-6 py-16 md:px-10 md:py-24">
    <TextReveal className="mx-auto max-w-4xl font-heading text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
      Dejamos de adivinar. Hoy cada área ve los mismos números, a la misma hora, y las juntas empiezan por la decisión.
    </TextReveal>
  </section>
)

/**
 * A whole page of auradata.mx: the sticky header, hero, client logos, benefits, a statement, the
 * product tour, testimonials, pricing, FAQ, call to action and footer. One effect per section.
 */
export const Landing: Story = {
  tags: ['mobile'],
  globals: ON_PHONE,
  render: () => (
    <>
      {siteHeader}
      <main id="inicio">
        {landingHero}
        {logoCloud('marquee')}
        {benefits}
        {statement}
        <div id="producto">{featureTabs}</div>
        <div id="clientes">{testimonials}</div>
        {pricing()}
        <div id="preguntas">{faq}</div>
        <div id="contacto">{cta}</div>
      </main>
      {footer}
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // One page, one main heading; every section is a named landmark.
    await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    for (const name of [/ya ordenaron sus datos/, 'Nuestra forma de trabajar', /Todo tu negocio/, /Equipos que ya deciden/, /Un plan para cada/]) {
      await expect(canvas.getByRole('region', { name })).toBeInTheDocument()
    }
    // The decorative layers stay out of the accessibility tree.
    for (const layer of canvasElement.querySelectorAll('[data-slot=progressive-blur], [data-slot=shimmer], [data-slot=gradient-border-ring], [data-slot=aura-background]')) {
      await expect(layer).toHaveAttribute('aria-hidden', 'true')
    }
    // The shimmer goes once per page.
    await expect(canvasElement.querySelectorAll('[data-slot=shimmer]')).toHaveLength(1)
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth)
  },
}
