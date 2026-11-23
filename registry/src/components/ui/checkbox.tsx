// registry: auradata (shadcn checkbox whose indeterminate state is filled and draws a dash, not the check; tactile press and stroke-drawn check; it dims when disabled (Base UI marks data-disabled); the brand focus outline alone; a full destructive border when invalid)
"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "cn"
import { CheckIcon, MinusIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-[background-color,border-color,transform] duration-150 ease-(--ease-fluid) outline-none active:not-data-disabled:scale-[0.93] motion-reduce:transition-none group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:ring-destructive/25 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-[:focus-visible]/field-label:data-checked:border-primary dark:data-checked:bg-primary data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground dark:data-indeterminate:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current [&>svg]:size-3.5"
      >
        {/* AuraData: Base UI marks the indicator data-indeterminate; stock drew the check for it too. */}
        <CheckIcon className="in-data-indeterminate:hidden [&_path]:[stroke-dasharray:24] [&_path]:animate-[aura-check-draw_180ms_var(--ease-fluid)_both] motion-reduce:[&_path]:animate-none" />
        <MinusIcon className="hidden animate-in fade-in-0 zoom-in-75 duration-150 ease-(--ease-fluid) motion-reduce:animate-none in-data-indeterminate:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
