# AuraData data visualization

Source: https://design.auradata.mx/docs/brand/visualizacion-de-datos and the Gráficas pages. A chart answers one question: pick the shape by the question; sometimes the answer is a number or a table.

## Which chart

| Question | Shape | Component (item) |
| --- | --- | --- |
| How much now, and how is it going? | The number, its change and its trend | `KpiCard` with `trend` (`dashboard` block) |
| How far toward the goal or the limit? | Ring or half gauge | `Gauge` (`thresholds` for a limit) (`gauge`) |
| How does it change over time? | Lines; the previous period dashed | `LineChart` with `previousKey` (`cartesian-chart`) |
| How much accumulates over time? | Area; stacked for a total and its parts | `AreaChart` (`stacked`) (`cartesian-chart`) |
| Which is bigger? | Bars, largest to smallest; horizontal for long names | `BarChart` (`horizontal`) (`cartesian-chart`) |
| How does each part compare, period by period? | Grouped bars | `BarChart` (`cartesian-chart`) |
| How is the total made up? | Stacked bars | `BarChart` (`stacked`) (`cartesian-chart`) |
| Are we on target? | Bars and a line of the same unit, one axis | `ComboChart` (`cartesian-chart`) |
| What share of the whole is each? | Donut with the total in the center, up to six parts; pie with two or three | `DonutChart` (`donut-chart`) |
| Where do people drop off? | Funnel with each step's conversion | `FunnelChart` (`funnel-chart`) |
| How much, in two dimensions? | Sequential heatmap | `Heatmap` (`heatmap`) |
| Which side of the goal, in two dimensions? | Diverging heatmap | `Heatmap` diverging (`heatmap`) |
| How does it spread over the year, day by day? | Calendar | `CalendarHeatmap` (`heatmap`) |
| How is it going, in a row or a text? | Sparkline next to its number | `Sparkline` (`sparkline`) |
| What is the detail? | Table | `DataTable` (`data-table`) |
| None of the above | Your own Recharts chart | `chart` with `chartConfig()` |

All of them take the palette in order, format axes and tooltips with `lib/format`, and work in light, dark and phone. Pass only the data:

```tsx
<LineChart data={ventas} index="mes" series={{ norte: 'Norte', sur: 'Sur' }} valueFormatter={formatCurrency} />
```

## Rules that do not change

- **One value axis.** Two measures of different units go in two charts; never a second axis.
- **Bars and areas start at zero.** A line may fit its axis to the data (`startAtZero={false}`) when change matters more than size.
- **Six parts at most in a donut**; the rest goes into «Otros», last. With more parts, or to compare them, use bars.
- **One series has no legend** (the title says what it is). Two or more always have one.
- No 3D, no pies with more than three parts.
- **Color is never the only signal:** each series has a legend or label; a change has an arrow and a sign; the tooltip repeats the formatted value. Good or bad depends on the metric: higher costs are bad (`goodDirection="down"`).

## Palettes

- **Categorical** (who each series is): `--chart-1` (Azul Aura) to `--chart-8`, always in order; never skip or pick by taste. `chartConfig()` from `lib/chart-palette` assigns them. More than eight series do not read: group the rest into «Otros».
- **Sequential** (how much, zero to max): `--sequential-1` (near zero) to `--sequential-9`, one hue.
- **Diverging** (which side of the goal, zero or average): `--diverging-*`, 5 is the center, 1–4 red below, 6–9 blue above (red and blue, readable with color blindness).
- `sequentialFill(value, [min, max])` and `divergingFill(value, limit, center = 0)` pick the step and an AA text color on it. In Tailwind: `bg-sequential-3`, `bg-diverging-8`.
- Write the number in the cell or the tooltip: color shows the pattern, the number gives the value.
- Never paint categories with the sequential palette, magnitudes with the categorical one, or data with status colors (`success`, `warning`…).

## Legend, tooltip, card

- The legend hides and shows series; a hidden series keeps its color. `useChartSeries` (in `chart`) does it for your own charts.
- The tooltip shows the value first, then the name. `showPercent` adds the share of the total; `previousKey` and `comparison` add the change with `Delta`.
- What the tooltip says is also available without the mouse: «Ver datos» on the card, or a table.
- Each chart goes in a `ChartCard` (from the `dashboard` block): a title that says what is shown («Ventas por canal»), a description with unit and period («Miles de pesos, julio a octubre»), a filter only if it changes that chart, a menu with «Exportar PNG» and «Ver datos», and states `loading`, `refreshing`, `empty` and `error` with «Reintentar».
- Page-wide filters go in one row above the grid, date range first.

## Numbers and dates

Always `lib/format` (es-MX); figures in tables and KPI with `tabular-nums`.

| What | Function | Result |
| --- | --- | --- |
| Money | `formatCurrency(1284500)` | $1,284,500 |
| Short money, in KPI | `formatCompact(4160000, { currency: 'MXN' })` | $4.16 M |
| Short count | `formatCompact(1284)` | 1.28 K |
| Percent | `formatPercent(0.124)` | 12.4 % |
| Change | `formatPercent(0.062, { signDisplay: 'exceptZero' })` | +6.2 % |
| Day | `formatDate('2026-11-21')` | 21 nov 2026 |

## ECharts (AuraData BI)

Use the theme from `@auradata/tokens/echarts.json` (`echarts.registerTheme('auradata', theme.light)`, `'auradata-dark'` for dark). Never write colors in a chart's options; format with `Intl.NumberFormat('es-MX', …)` in `tooltip.valueFormatter` and `axisLabel.formatter`. A combo chart keeps both series on `yAxisIndex: 0`: never a second `yAxis`.
