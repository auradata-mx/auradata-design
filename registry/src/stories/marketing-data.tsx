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
