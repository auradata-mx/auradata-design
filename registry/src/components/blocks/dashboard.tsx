// registry: auradata (a sales dashboard block: period filter, KPI row, trend against last year, channel mix, best sellers, funnel and top customers in a grid that follows its own width, not the screen's)
"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"

import { BarChart, LineChart } from "@/components/ui/cartesian-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartCard } from "@/components/ui/chart-card"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { DateRangeFilter, presetRange } from "@/components/ui/date-range-filter"
import { Delta } from "@/components/ui/delta"
import { DonutChart } from "@/components/ui/donut-chart"
import { FunnelChart } from "@/components/ui/funnel-chart"
import { KpiCard } from "@/components/ui/kpi-card"
import { PageHeader } from "@/components/ui/page-header"
import { formatCompact, formatCurrency } from "@/lib/format"

type DashboardKpi = Omit<React.ComponentProps<typeof KpiCard>, "loading">

type DashboardCustomer = { cliente: string; region: string; ventas: number; cambio: number }

type DashboardProps = {
  title?: string
  description?: string
  /** The period; this month by default. Every number below follows it. */
  range?: DateRange
  onRangeChange?: (range: DateRange | undefined) => void
  /** The day the presets count from; now by default. */
  today?: Date
  kpis: DashboardKpi[]
  /** Sales by month in pesos, with the same month a year before. */
  monthly: { mes: string; ventas: number; ventasAnterior?: number }[]
  /** Sales by channel in pesos. */
  channels: { canal: string; ventas: number }[]
  /** Best-selling products in pesos, largest first. */
  products: { producto: string; ventas: number }[]
  /** People at each stage, first to last. */
  funnel: { etapa: string; personas: number }[]
  customers: DashboardCustomer[]
  /** The first load: every piece shows its skeleton at its own size. */
  loading?: boolean
  /** Animates the charts in; `false` in stories and screenshots. */
  animate?: boolean
}

const pesos = (value: number) => formatCurrency(value)
const pesosShort = (value: number) => formatCompact(value, { currency: "MXN" })

const CUSTOMER_COLUMNS: DataTableColumn<DashboardCustomer, unknown>[] = [
  {
    accessorKey: "cliente",
    header: "Cliente",
    size: 260,
    cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span>,
  },
  { accessorKey: "region", header: "Región", size: 140 },
  {
    accessorKey: "ventas",
    header: "Ventas",
    size: 140,
    cell: ({ getValue }) => <span className="tabular-nums">{pesos(getValue() as number)}</span>,
  },
  {
    accessorKey: "cambio",
    header: "Contra el mes anterior",
    size: 200,
    cell: ({ getValue }) => <Delta change={getValue() as number} />,
  },
]

/**
 * A whole dashboard, on our pieces: the period above everything it scopes, then the KPIs, the charts in their cards and
 * the detail in a table. Copy it and change the data; the layout and the states come with it.
 */
function Dashboard({
  title = "Ventas",
  description = "Cómo van las ventas del periodo, contra el año anterior.",
  range,
  onRangeChange,
  today,
  kpis,
  monthly,
  channels,
  products,
  funnel,
  customers,
  loading = false,
  animate,
}: DashboardProps) {
  const [ownRange, setOwnRange] = React.useState<DateRange | undefined>(() => presetRange("this-month", today))
  const period = range ?? ownRange

  return (
    <div data-slot="dashboard" className="grid gap-6 p-4 md:p-6">
      <PageHeader title={title} description={description} />
      {/* One row of filters, above everything they scope. */}
      <div data-slot="dashboard-filters" className="flex flex-wrap items-center gap-2">
        <DateRangeFilter
          value={period}
          onValueChange={(next) => {
            setOwnRange(next)
            onRangeChange?.(next)
          }}
          today={today}
        />
      </div>
      <div className="@container/dashboard">
        <div className="grid grid-cols-1 gap-4 @xl/dashboard:grid-cols-6 @3xl/dashboard:grid-cols-12">
        {kpis.map((kpi, index) => (
          <div key={index} className="min-w-0 *:h-full @xl/dashboard:col-span-3 @3xl/dashboard:col-span-3">
            <KpiCard {...kpi} loading={loading} />
          </div>
        ))}
        <div className="min-w-0 *:h-full @xl/dashboard:col-span-6 @3xl/dashboard:col-span-8">
          <ChartCard
            title="Ventas por mes"
            description="Este año contra el anterior"
            data={monthly}
            columns={[
              { key: "mes", label: "Mes" },
              { key: "ventas", label: "Ventas", format: (value) => pesos(value as number) },
              { key: "ventasAnterior", label: "Año anterior", format: (value) => pesos(value as number) },
            ]}
            loading={loading}
          >
            <LineChart
              data={monthly}
              index="mes"
              series={{ ventas: "Ventas" }}
              previousKey={(key) => `${key}Anterior`}
              comparison="vs. año anterior"
              startAtZero={false}
              valueFormatter={pesos}
              axisFormatter={pesosShort}
              animate={animate}
            />
          </ChartCard>
        </div>
        <div className="min-w-0 *:h-full @xl/dashboard:col-span-6 @3xl/dashboard:col-span-4">
          <ChartCard
            title="Ventas por canal"
            description="Del periodo"
            data={channels}
            columns={[
              { key: "canal", label: "Canal" },
              { key: "ventas", label: "Ventas", format: (value) => pesos(value as number) },
            ]}
            loading={loading}
          >
            <DonutChart
              data={channels}
              index="canal"
              value="ventas"
              valueFormatter={pesos}
              centerFormatter={pesosShort}
              animate={animate}
            />
          </ChartCard>
        </div>
        <div className="min-w-0 *:h-full @xl/dashboard:col-span-6 @3xl/dashboard:col-span-6">
          <ChartCard
            title="Productos más vendidos"
            description="Ventas del periodo"
            data={products}
            columns={[
              { key: "producto", label: "Producto" },
              { key: "ventas", label: "Ventas", format: (value) => pesos(value as number) },
            ]}
            height={280}
            loading={loading}
          >
            <BarChart
              data={products}
              index="producto"
              series={{ ventas: "Ventas" }}
              horizontal
              valueFormatter={pesos}
              axisFormatter={pesosShort}
              animate={animate}
            />
          </ChartCard>
        </div>
        <div className="min-w-0 *:h-full @xl/dashboard:col-span-6 @3xl/dashboard:col-span-6">
          <ChartCard
            title="Embudo de conversión"
            description="De la visita al pago"
            data={funnel}
            columns={[
              { key: "etapa", label: "Etapa" },
              { key: "personas", label: "Personas" },
            ]}
            height="auto"
            loading={loading}
          >
            <FunnelChart data={funnel} index="etapa" value="personas" />
          </ChartCard>
        </div>
        <div className="min-w-0 *:h-full @xl/dashboard:col-span-6 @3xl/dashboard:col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Clientes principales</CardTitle>
              <CardDescription>Los que más compraron en el periodo</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={CUSTOMER_COLUMNS}
                data={customers}
                filterPlaceholder="Buscar clientes…"
                pageSize={5}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  )
}

export { Dashboard }
export type { DashboardKpi, DashboardProps }
