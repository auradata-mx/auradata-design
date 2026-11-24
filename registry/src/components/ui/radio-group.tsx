// registry: auradata (shadcn radio group whose items dim when disabled (Base UI marks data-disabled), with tactile press and spring-in dot; the brand focus outline alone; a full destructive border when invalid)
"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "cn"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative grid aspect-square size-4 shrink-0 place-items-center rounded-full border border-input transition-[background-color,border-color,scale] duration-150 ease-(--ease-fluid) outline-none motion-safe:active:not-data-disabled:scale-[0.93] motion-reduce:transition-none group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:ring-destructive/25 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-[:focus-visible]/field-label:data-checked:border-primary dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        keepMounted
        aria-hidden
        data-slot="radio-group-indicator"
        className="pointer-events-none size-2 scale-0 rounded-full bg-primary-foreground opacity-0 transition-[scale,opacity] duration-200 ease-(--ease-fluid) data-checked:scale-100 data-checked:opacity-100 data-unchecked:duration-100 motion-reduce:transition-none"
      />
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
