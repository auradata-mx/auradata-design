import type { LucideIcon } from 'lucide-react'
import { Building2Icon, CoffeeIcon, HammerIcon, MountainIcon, ShirtIcon, StethoscopeIcon, TruckIcon, WheatIcon } from 'lucide-react'

/** Made-up clients of AuraData, drawn as wordmarks: the stories have no real logos to show. */
export const CLIENTS: { name: string; icon: LucideIcon }[] = [
  { name: 'Grupo Norteño', icon: MountainIcon },
  { name: 'Ferretera del Bajío', icon: HammerIcon },
  { name: 'Logística Pacífico', icon: TruckIcon },
  { name: 'Clínica Santa Fe', icon: StethoscopeIcon },
  { name: 'Agrícola Sonora', icon: WheatIcon },
  { name: 'Constructora Altiplano', icon: Building2Icon },
  { name: 'Café Chiapas', icon: CoffeeIcon },
  { name: 'Textiles Puebla', icon: ShirtIcon },
]

/**
 * A client's wordmark: its icon and name, in the muted text color, as logos sit on a page. `compact`
 * for a grid cell on a phone: smaller, and the name may wrap.
 */
export function ClientMark({ name, icon: Icon, compact = false }: { name: string; icon: LucideIcon; compact?: boolean }) {
  return (
    <span
      className={
        compact
          ? 'flex items-center gap-2 text-sm leading-tight font-semibold tracking-tight text-muted-foreground sm:text-base'
          : 'flex items-center gap-2 text-lg font-semibold tracking-tight whitespace-nowrap text-muted-foreground'
      }
    >
      <Icon aria-hidden className={compact ? 'size-5 shrink-0' : 'size-6'} />
      {name}
    </span>
  )
}

/** AuraData BI plans, in MXN before tax; `annual` is the monthly price when paid for a year. */
export const PLANS = [
  {
    name: 'Inicial',
    description: 'Para empezar a ver tus números en un solo lugar.',
    price: { monthly: 1490, annual: 1190 },
    features: ['Hasta 5 usuarios', '10 tableros', 'Excel y Google Sheets', 'Soporte por correo'],
  },
  {
    name: 'Equipo',
    description: 'Para áreas que comparten tableros todos los días.',
    price: { monthly: 3990, annual: 3190 },
    features: [
      'Hasta 25 usuarios',
      'Tableros ilimitados',
      'Bases de datos y sistemas contables',
      'Pregúntale a tus datos con IA',
      'Soporte prioritario',
    ],
    featured: true,
    badge: 'Más popular',
  },
  {
    name: 'Empresa',
    description: 'Para toda la organización, con implementación a la medida.',
    price: null,
    priceLabel: 'A la medida',
    features: ['Usuarios ilimitados', 'Inicio de sesión único (SSO)', 'Implementación a la medida', 'Un consultor asignado'],
  },
]

/** What each plan includes, row by row, for the comparison table: `true`/`false` or a short value. */
export const COMPARISON = [
  {
    name: 'Datos',
    rows: [
      { feature: 'Usuarios', values: ['5', '25', 'Ilimitados'] },
      { feature: 'Tableros', values: ['10', 'Ilimitados', 'Ilimitados'] },
      { feature: 'Excel y Google Sheets', values: [true, true, true] },
      { feature: 'Bases de datos y sistemas contables', values: [false, true, true] },
    ],
  },
  {
    name: 'Inteligencia',
    rows: [
      { feature: 'Pregúntale a tus datos con IA', values: [false, true, true] },
      { feature: 'Alertas por correo', values: [true, true, true] },
    ],
  },
  {
    name: 'Seguridad y soporte',
    rows: [
      { feature: 'Inicio de sesión único (SSO)', values: [false, false, true] },
      { feature: 'Bitácora de auditoría', values: [false, true, true] },
      { feature: 'Soporte', values: ['Correo', 'Prioritario', 'Consultor asignado'] },
    ],
  },
]

/** Made-up quotes from the made-up clients above. */
export const TESTIMONIALS = [
  {
    quote:
      'Pasamos de juntar cinco hojas de cálculo cada lunes a abrir un tablero. La junta de ventas ahora empieza por las decisiones.',
    name: 'Mariana López',
    role: 'Directora comercial',
    company: 'Ferretera del Bajío',
  },
  {
    quote: 'En dos semanas teníamos el inventario de los tres almacenes en un solo lugar.',
    name: 'Jorge Ramírez',
    role: 'Gerente de operaciones',
    company: 'Logística Pacífico',
  },
  {
    quote: 'Lo que más valoro es que el equipo entendió nuestro negocio antes de proponer tecnología.',
    name: 'Ana Sofía Treviño',
    role: 'Directora general',
    company: 'Grupo Norteño',
  },
  {
    quote:
      'Preguntarle a los datos en español cambió cómo trabaja la dirección: ya no esperamos el reporte de fin de mes.',
    name: 'Luis Hernández',
    role: 'Director de finanzas',
    company: 'Clínica Santa Fe',
  },
  {
    quote: 'La implementación fue ordenada, con avances visibles cada semana.',
    name: 'Paola Mendoza',
    role: 'Coordinadora de TI',
    company: 'Agrícola Sonora',
  },
]
