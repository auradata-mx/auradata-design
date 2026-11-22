import { useLayoutEffect, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DownloadIcon, FileChartColumnIcon, FilterIcon, SearchIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'

/**
 * Compact density is the theme, not a component: `data-density="compact"` on <html> or on a section scales
 * Tailwind's spacing step, so every shadcn control, table row and menu item under it shrinks.
 */
const meta = {
  title: 'AuraData/Density',
  parameters: { layout: 'fullscreen', themeFrame: { padded: true } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const PERIODS = [
  { value: 'mes', label: 'Este mes' },
  { value: 'trimestre', label: 'Este trimestre' },
]

const SALES = [
  { region: 'Norte', store: 'Monterrey Centro', total: 1284500 },
  { region: 'Centro', store: 'Querétaro Juriquilla', total: 2031200 },
  { region: 'Occidente', store: 'Guadalajara Andares', total: 1764900 },
  { region: 'Sur', store: 'Mérida Altabrisa', total: 846300 },
  { region: 'Bajío', store: 'León Plaza Mayor', total: 1120750 },
]

/** One BI panel: a toolbar, a table and a menu list, the three things density shrinks. */
function Panel({ title, density }: { title: string; density: 'normal' | 'compact' }) {
  return (
    <section
      data-density={density}
      aria-label={title}
      className="grid min-w-0 content-start gap-4 rounded-xl border bg-card p-4 text-card-foreground"
    >
      <h2 className="text-sm font-medium">{title}</h2>
      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="w-full sm:w-48">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Buscar sucursal" aria-label={`Buscar sucursal, ${title}`} />
        </InputGroup>
        <Select items={PERIODS} defaultValue="mes">
          <SelectTrigger aria-label={`Periodo, ${title}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">
          <FilterIcon data-icon="inline-start" /> Filtros
        </Button>
        <Button variant="outline" size="icon" aria-label={`Descargar, ${title}`}>
          <DownloadIcon />
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Región</TableHead>
              <TableHead>Sucursal</TableHead>
              <TableHead className="text-right">Ventas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SALES.map((row) => (
              <TableRow key={row.store}>
                <TableCell>{row.region}</TableCell>
                <TableCell>{row.store}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(row.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Command className="rounded-lg border" aria-label={`Informes, ${title}`}>
        <CommandList>
          <CommandGroup heading="Informes recientes">
            <CommandItem>
              <FileChartColumnIcon /> Ventas por región
            </CommandItem>
            <CommandItem>
              <FileChartColumnIcon /> Margen por producto
            </CommandItem>
            <CommandItem>
              <FileChartColumnIcon /> Inventario por sucursal
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </section>
  )
}

const heightOf = (element: Element) => element.getBoundingClientRect().height

/** Normal beside compact: the same markup, only `data-density` changes. */
export const Comparison: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Normal" density="normal" />
      <Panel title="Compacta" density="compact" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [normal, compact] = ['Normal', 'Compacta'].map((name) =>
      within(within(canvasElement).getByRole('region', { name }))
    )
    // Controls: the default button is 32px, 28px when compact; the type does not shrink.
    const button = (panel: typeof normal) => panel.getByRole('button', { name: 'Filtros' })
    await expect(heightOf(button(normal))).toBe(32)
    await expect(heightOf(button(compact))).toBe(28)
    await expect(getComputedStyle(button(compact)).fontSize).toBe(getComputedStyle(button(normal)).fontSize)
    // Table rows and menu items.
    const row = (panel: typeof normal) => panel.getByRole('row', { name: /Monterrey Centro/ })
    await expect(heightOf(row(compact))).toBeLessThan(heightOf(row(normal)))
    const item = (panel: typeof normal) => panel.getByRole('option', { name: 'Ventas por región' })
    await expect(heightOf(item(compact))).toBeLessThan(heightOf(item(normal)))
  },
}

/** Puts `data-density="compact"` on <html>, as an app does, so menus opened in a portal are compact too. */
function CompactApp({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    document.documentElement.dataset.density = 'compact'
    return () => {
      delete document.documentElement.dataset.density
    }
  }, [])
  return children
}

/** The whole app compact: a menu opened from it is compact too, though it opens under <body>. */
export const CompactMenu: Story = {
  decorators: [
    (Story) => (
      <CompactApp>
        <div className="min-h-72">
          <Story />
        </div>
      </CompactApp>
    ),
  ],
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Acciones</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Informe</DropdownMenuLabel>
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Duplicar</DropdownMenuItem>
          <DropdownMenuItem>Descargar como PDF</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async () => {
    const menu = within(document.body).getByRole('menu')
    const item = within(menu).getByRole('menuitem', { name: 'Editar' })
    const compact = heightOf(item)
    // The same item with <html> back at the normal step.
    document.documentElement.dataset.density = 'normal'
    const normal = heightOf(item)
    document.documentElement.dataset.density = 'compact'
    await expect(compact).toBeLessThan(normal)
  },
}
