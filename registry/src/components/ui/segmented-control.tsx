// registry: auradata (one choice among a few views, such as Tabla | Gráfica: a radio group that looks like tabs)
"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "cn"

const SegmentedControlContext = React.createContext<VariantProps<typeof segmentedControlItemVariants>>({})

const segmentedControlItemVariants = cva(
  [
    "relative inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent font-medium whitespace-nowrap text-foreground/60 outline-none transition-[color,background-color,box-shadow] select-none hover:text-foreground motion-reduce:transition-none dark:text-muted-foreground dark:hover:text-foreground",
    // The brand outline comes from the theme on `focus-visible:ring-*`.
    "focus-visible:ring-3 focus-visible:ring-ring/50",
    "data-checked:bg-background data-checked:text-foreground data-checked:shadow-(--elevation-control) dark:data-checked:border-input dark:data-checked:bg-input/30 dark:data-checked:text-foreground",
    // Base UI radios are spans: `disabled:` never matches.
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    // An icon alone is a square.
    "has-[>svg:only-child]:aspect-square has-[>svg:only-child]:flex-none has-[>svg:only-child]:px-0",
  ],
  {
    variants: {
      size: {
        default: "h-7 px-3 text-sm has-[svg]:px-2.5",
        sm: "h-6 px-2 text-xs [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: { size: "default" },
  }
)

/** Name it with `aria-label` («Vista»), as any radio group. */
function SegmentedControl({
  className,
  size = "default",
  ...props
}: RadioGroupPrimitive.Props & VariantProps<typeof segmentedControlItemVariants>) {
  return (
    <SegmentedControlContext.Provider value={{ size }}>
      <RadioGroupPrimitive
        data-slot="segmented-control"
        data-size={size}
        className={cn(
          "inline-flex w-fit items-center rounded-lg bg-muted p-[3px] text-muted-foreground data-disabled:opacity-50",
          className
        )}
        {...props}
      />
    </SegmentedControlContext.Provider>
  )
}

/** One view. An item with only an icon needs `aria-label`. */
function SegmentedControlItem({ className, children, ...props }: RadioPrimitive.Root.Props) {
  const { size } = React.useContext(SegmentedControlContext)
  return (
    <RadioPrimitive.Root
      data-slot="segmented-control-item"
      className={cn(segmentedControlItemVariants({ size }), className)}
      {...props}
    >
      {children}
    </RadioPrimitive.Root>
  )
}

export { SegmentedControl, SegmentedControlItem, segmentedControlItemVariants }
