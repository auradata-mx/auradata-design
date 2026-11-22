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

/** A client's wordmark: its icon and name, in the muted text color, as logos sit on a page. */
export function ClientMark({ name, icon: Icon }: { name: string; icon: LucideIcon }) {
  return (
    <span className="flex items-center gap-2 text-lg font-semibold tracking-tight whitespace-nowrap text-muted-foreground">
      <Icon aria-hidden className="size-6" />
      {name}
    </span>
  )
}
