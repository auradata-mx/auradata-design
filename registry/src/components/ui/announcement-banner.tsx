// registry: auradata (an announcement banner pinned at the top of the app: status tint, icon, one action and a close button; the action drops under the text on a phone)
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  CircleCheckIcon,
  InfoIcon,
  MegaphoneIcon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

// T59's status scale: the opaque 50 tint (the page scrolls under the pinned banner), the 200 border and the 700
// icon, which reads at least 3:1 in light and dark. In dark, an outline action takes a lighter edge (--input), as in
// the alert, so it does not melt into the tint.
const announcementBannerVariants = cva(
  "@container/banner top-0 z-40 w-full border-b text-sm text-foreground dark:[--input:color-mix(in_oklab,var(--foreground)_22%,transparent)]",
  {
    variants: {
      variant: {
        default: "bg-muted",
        info: "border-info-200 bg-info-50",
        success: "border-success-200 bg-success-50",
        warning: "border-warning-200 bg-warning-50",
        destructive: "border-destructive-200 bg-destructive-50",
      },
    },
    defaultVariants: { variant: "info" },
  }
)

const ICONS = {
  default: { icon: MegaphoneIcon, className: "text-foreground" },
  info: { icon: InfoIcon, className: "text-info-700" },
  success: { icon: CircleCheckIcon, className: "text-success-700" },
  warning: { icon: TriangleAlertIcon, className: "text-warning-700" },
  destructive: { icon: OctagonXIcon, className: "text-destructive-700" },
}

type AnnouncementBannerProps = Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof announcementBannerVariants> & {
    title: React.ReactNode
    description?: React.ReactNode
    /** Replaces the status icon (it takes the status color). */
    icon?: React.ReactNode
    /** One button, such as «Recargar»: `size="sm"`. */
    action?: React.ReactNode
    /** Shows «Cerrar aviso»; the banner hides and the app remembers it. */
    onDismiss?: () => void
    dismissLabel?: string
    /** Pinned to the top of its scrolling container (default), or in the flow. */
    sticky?: boolean
  }

/** A notice for the whole app, such as «Nueva versión disponible» or «Mantenimiento programado», above the page. */
function AnnouncementBanner({
  variant = "info",
  title,
  description,
  icon,
  action,
  onDismiss,
  dismissLabel = "Cerrar aviso",
  sticky = true,
  className,
  "aria-label": ariaLabel,
  ...props
}: AnnouncementBannerProps) {
  const [open, setOpen] = React.useState(true)
  if (!open) return null

  const status = ICONS[variant ?? "info"]
  const Icon = status.icon
  // Everything sits on the first line of the text: the 16 px icon 2 px down, the 28 px buttons 4 px up.
  // Narrow: icon | text | close, the action under the text. From 36rem: icon | text | action | close. The 24 px
  // sides match the app shell's top bar, so the icon lines up with the page content.
  const wideColumns = action && onDismiss ? "@xl/banner:grid-cols-[auto_minmax(0,1fr)_auto_auto]" : "@xl/banner:grid-cols-[auto_minmax(0,1fr)_auto]"

  return (
    <div
      data-slot="announcement-banner"
      data-variant={variant}
      role="region"
      aria-label={ariaLabel ?? (typeof title === "string" ? title : "Anuncio")}
      className={cn(announcementBannerVariants({ variant }), sticky && "sticky", className)}
      {...props}
    >
      <div
        className={cn(
          "grid items-start gap-x-3 gap-y-2 px-6 py-3",
          onDismiss ? "grid-cols-[auto_minmax(0,1fr)_auto]" : "grid-cols-[auto_minmax(0,1fr)]",
          wideColumns
        )}
      >
        <span
          data-slot="announcement-banner-icon"
          aria-hidden
          className={cn("col-start-1 row-start-1 mt-0.5 flex [&_svg]:size-4 [&_svg]:shrink-0", status.className)}
        >
          {icon ?? <Icon />}
        </span>
        <p data-slot="announcement-banner-content" className="col-start-2 row-start-1 min-w-0 text-pretty wrap-break-word">
          <span data-slot="announcement-banner-title" className="font-medium">
            {title}
          </span>
          {/* Wide, the description follows the title on its line; narrow, it takes its own line. */}
          {description && (
            <>
              {" "}
              <span data-slot="announcement-banner-description" className="text-muted-foreground @max-xl/banner:mt-0.5 @max-xl/banner:block">
                {description}
              </span>
            </>
          )}
        </p>
        {action && (
          <div
            data-slot="announcement-banner-action"
            className="col-start-2 row-start-2 flex justify-self-start @xl/banner:col-start-3 @xl/banner:row-start-1 @xl/banner:-my-1"
          >
            {action}
          </div>
        )}
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={dismissLabel}
            className={cn(
              "col-start-3 row-start-1 -my-1 -mr-1.5 hover:bg-foreground/10",
              action && "@xl/banner:col-start-4"
            )}
            onClick={() => {
              setOpen(false)
              onDismiss()
            }}
          >
            <XIcon />
          </Button>
        )}
      </div>
    </div>
  )
}

export { AnnouncementBanner, announcementBannerVariants }
