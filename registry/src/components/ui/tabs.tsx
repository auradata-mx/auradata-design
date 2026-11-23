// registry: auradata (shadcn tabs: sliding `Tabs.Indicator` for pill and line variants, concentric inner corners, line tabs flush with content, vertical panel lined up with the first tab, only the brand focus outline shows, and `TabsCount` counts what a tab holds)
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { formatNumber } from "@/lib/format"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent p-0 group-data-horizontal/tabs:gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-0 left-0 z-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top) transition-[translate,width,height] duration-200 ease-(--ease-fluid) data-[activation-direction=none]:transition-none motion-reduce:transition-none",
          "group-data-[variant=default]/tabs-list:rounded-[calc(var(--radius)-3px)] group-data-[variant=default]/tabs-list:bg-background group-data-[variant=default]/tabs-list:shadow-(--elevation-control) dark:group-data-[variant=default]/tabs-list:border dark:group-data-[variant=default]/tabs-list:border-input dark:group-data-[variant=default]/tabs-list:bg-input/30",
          "group-data-[variant=line]/tabs-list:rounded-full group-data-[variant=line]/tabs-list:bg-foreground",
          "group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:top-auto group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:-bottom-px group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:h-0.5 group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:translate-y-0",
          "group-data-vertical/tabs:group-data-[variant=line]/tabs-list:left-auto group-data-vertical/tabs:group-data-[variant=line]/tabs-list:-right-1 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:w-0.5 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:translate-x-0"
        )}
      />
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-[1] inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-[calc(var(--radius)-3px)] border border-transparent px-2.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-colors group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:border-0 group-data-[variant=line]/tabs-list:px-0 group-data-[variant=line]/tabs-list:bg-transparent",
        "data-active:text-foreground dark:data-active:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none group-data-vertical/tabs:pt-1.5", className)}
      {...props}
    />
  )
}

/**
 * How many things a tab holds, after its label: es-MX thousands («1,284») and «99+» past `max`.
 * It is part of the tab's name («Informes 12»), so screen readers hear it too.
 */
function TabsCount({
  value,
  max,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { value: number; max?: number }) {
  const text = max !== undefined && value > max ? `${formatNumber(max)}+` : formatNumber(value)
  return (
    <span
      data-slot="tabs-count"
      className={cn(
        // On the muted list the pill is the page's color; on the chosen (light) tab and on line tabs it is muted.
        "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1.5 text-xs font-medium tabular-nums",
        "group-data-[variant=line]/tabs-list:bg-muted in-data-active:bg-muted dark:bg-foreground/10 dark:in-data-active:bg-foreground/10",
        className
      )}
      {...props}
    >
      {text}
    </span>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsCount, tabsListVariants }
