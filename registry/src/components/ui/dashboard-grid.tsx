// registry: auradata (the dashboard grid of the brand: KPIs, charts and tables laid out for the room the grid has, not the screen)
import { cn } from "cn"

/**
 * How wide an item is: `kpi` a quarter, `third`, `half`, `two-thirds` and `full`. Below 36rem every item takes the
 * row; up to 48rem KPIs go two by two and the rest take the row; from 48rem the grid has twelve columns.
 */
type DashboardSpan = "kpi" | "third" | "half" | "two-thirds" | "full"

const SPANS: Record<DashboardSpan, string> = {
  kpi: "@xl/dashboard:col-span-3 @3xl/dashboard:col-span-3",
  third: "@xl/dashboard:col-span-6 @3xl/dashboard:col-span-4",
  half: "@xl/dashboard:col-span-6 @3xl/dashboard:col-span-6",
  "two-thirds": "@xl/dashboard:col-span-6 @3xl/dashboard:col-span-8",
  full: "@xl/dashboard:col-span-6 @3xl/dashboard:col-span-12",
}

/** The grid of a dashboard: it reads its own width (a container), so beside a sidebar it lays out for what is left. */
function DashboardGrid({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dashboard-grid" className={cn("@container/dashboard", className)} {...props}>
      <div className="grid grid-cols-1 gap-4 @xl/dashboard:grid-cols-6 @3xl/dashboard:grid-cols-12">{children}</div>
    </div>
  )
}

/** One tile of the grid. Its child fills it, so the cards of a row line up at the bottom. */
function DashboardGridItem({
  span = "half",
  className,
  ...props
}: React.ComponentProps<"div"> & { span?: DashboardSpan }) {
  return (
    <div
      data-slot="dashboard-grid-item"
      data-span={span}
      className={cn("min-w-0 *:h-full", SPANS[span], className)}
      {...props}
    />
  )
}

export { DashboardGrid, DashboardGridItem }
export type { DashboardSpan }
