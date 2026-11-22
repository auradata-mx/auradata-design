"use client"
// registry: auradata (shadcn sonner in the brand font, with the brand buttons, status-colored icons and richColors on the status tokens)

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
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
          <Loader2Icon className="size-4 animate-spin" />
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
          description: "text-muted-foreground!",
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

export { Toaster }
