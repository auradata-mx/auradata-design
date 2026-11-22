"use client"
// registry: auradata (shadcn sonner in the brand font, with the brand buttons, status-colored icons and richColors on the status tokens)

import { useTheme } from "next-themes"
import { Toaster as Sonner, toast, type ExternalToast, type ToasterProps } from "sonner"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { Progress, ProgressValue } from "@/components/ui/progress"
import { formatPercent } from "@/lib/format"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

/** Sonner's rich color variables for one toast type, on our tokens. */
function richColors(type: "success" | "info" | "warning" | "error", color: string) {
  return {
    [`--${type}-bg`]: `color-mix(in oklab, ${color} var(--toast-tint, 12%), var(--popover))`,
    [`--${type}-border`]: `color-mix(in oklab, ${color} 45%, var(--popover))`,
    [`--${type}-text`]: "var(--popover-foreground)",
  }
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      // AuraData: the rich color tint is 12% in light; a dark popover needs 20% to read as the status hue.
      className="toaster group [--toast-tint:12%] dark:[--toast-tint:20%]"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-success" />
        ),
        info: (
          <InfoIcon className="size-4 text-info" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-warning" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-destructive" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin motion-reduce:animate-none" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          // AuraData: `richColors` (on the Toaster or on one toast) tints the toast like the `alert`: an
          // opaque mix of the status color over the popover (it floats over content), a stronger border and
          // the status icon, while the text keeps the popover foreground so it reads AA in light and dark.
          ...richColors("success", "var(--success)"),
          ...richColors("info", "var(--info)"),
          ...richColors("warning", "var(--warning)"),
          ...richColors("error", "var(--destructive)"),
          // AuraData: sonner's own CSS sets a system font stack on the toaster; the brand font wins here.
          fontFamily: "var(--font-sans)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          // AuraData: the icon sits on the title's first line, as in the alert (sonner centers it on the toast).
          icon: "self-start! mt-0.5!",
          title: "text-pretty",
          description: "text-pretty text-muted-foreground!",
          // AuraData: the toast's buttons are the brand's, not sonner's stock pill. Sonner's CSS is
          // unlayered and beats utilities, so the properties it sets are forced.
          actionButton: cn(
            buttonVariants({ size: "sm" }),
            "h-7! rounded-[min(var(--radius-md),12px)]! border-transparent! bg-primary! px-2.5! text-[0.8rem]! text-primary-foreground! hover:bg-primary/80!"
          ),
          cancelButton: cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-7! rounded-[min(var(--radius-md),12px)]! border! border-border! bg-background! px-2.5! text-[0.8rem]! text-foreground! hover:bg-muted! dark:border-input! dark:bg-input/30! dark:hover:bg-input/50!"
          ),
        },
      }}
      {...props}
    />
  )
}

/** The bar of a progress toast, with its value as «40 %». The bar is named after the task (its toast title). */
function ToastProgress({ value, label }: { value: number; label: string }) {
  const percent = (current: number | null) => formatPercent((current ?? 0) / 100, { maximumFractionDigits: 0 })
  return (
    <Progress
      value={value}
      aria-label={label}
      getAriaValueText={(_formatted, current) => percent(current)}
      data-slot="toast-progress"
      className="mt-1.5 flex-nowrap items-center gap-3"
    >
      {/* The toast sits in a live region: the bar's value is announced by the progressbar, not this text. */}
      <ProgressValue aria-hidden className="order-last w-10 shrink-0 text-right text-xs">
        {(_formatted, current) => percent(current)}
      </ProgressValue>
    </Progress>
  )
}

/**
 * A toast for a long task, such as an export: a spinner, its title and a bar that `update(percent)` moves.
 * `success` and `error` end it in place (the bar goes), usually with «Descargar» or «Reintentar» as the action.
 */
function toastProgress(message: string, data?: ExternalToast) {
  const id = toast.loading(message, { ...data, description: <ToastProgress value={0} label={message} /> })
  return {
    id,
    update(percent: number, title: string = message) {
      const value = Math.min(100, Math.max(0, percent))
      toast.loading(title, { ...data, id, description: <ToastProgress value={value} label={title} /> })
    },
    success(title: React.ReactNode, result?: ExternalToast) {
      toast.success(title, { ...data, description: undefined, ...result, id })
    },
    error(title: React.ReactNode, result?: ExternalToast) {
      toast.error(title, { ...data, description: undefined, ...result, id })
    },
    dismiss() {
      toast.dismiss(id)
    },
  }
}

export { Toaster, ToastProgress, toastProgress }
