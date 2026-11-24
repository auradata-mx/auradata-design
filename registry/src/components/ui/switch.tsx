// registry: auradata (shadcn switch whose unchecked track reads at 3:1 against the page, light and dark; a white thumb on the checked track in dark with tactile press stretch and control elevation; the brand focus outline alone)
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-colors duration-200 ease-(--ease-fluid) outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/25 data-checked:bg-primary data-unchecked:bg-muted-foreground/80 dark:data-unchecked:bg-muted-foreground/60 data-disabled:cursor-not-allowed data-disabled:opacity-50 motion-reduce:transition-none",
        "h-[18.4px] w-[32px] [--switch-travel:14px] [--switch-stretch:1.1875] [--switch-shift:1.5px]",
        "data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-[size=sm]:[--switch-travel:10px] data-[size=sm]:[--switch-stretch:1.166667] data-[size=sm]:[--switch-shift:1px]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-[16px] shrink-0 rounded-full bg-background shadow-(--elevation-control) ring-0 group-data-[size=sm]/switch:size-[12px] dark:data-checked:bg-white dark:data-unchecked:bg-foreground",
          // Move by half the added width so the outer edge stays anchored while pressed.
          "[transform:translateX(calc(var(--thumb-direction,1)*var(--thumb-offset,0px)))_scaleX(var(--thumb-scale,1))] data-checked:[--thumb-offset:var(--switch-travel)] rtl:[--thumb-direction:-1]",
          "motion-safe:group-active/switch:group-not-data-disabled/switch:[--thumb-scale:var(--switch-stretch)] motion-safe:group-active/switch:group-not-data-disabled/switch:[--thumb-offset:var(--switch-shift)] motion-safe:group-active/switch:group-not-data-disabled/switch:data-checked:[--thumb-offset:calc(var(--switch-travel)-var(--switch-shift))]",
          "transition-transform duration-250 ease-[cubic-bezier(0.2,0.85,0.35,1)] group-active/switch:duration-120 group-active/switch:ease-out motion-reduce:transition-none"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
