// registry: auradata (a notification center: a bell with the unread count that opens the list, unread and read, in a popover or, on a phone, a drawer from the bottom)
"use client"

import * as React from "react"
import { BellIcon, BellOffIcon, CheckCheckIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"

export type Notification = {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  /** When it happened, already written for people: «Hace 5 min», «Ayer», «12 nov». */
  time: string
  /** The same moment as an ISO date, for the `<time>` element. */
  dateTime?: string
  read?: boolean
  /** A 16 px icon for the kind of notification (shared, export, dataset…). */
  icon?: React.ReactNode
}

type NotificationCenterProps = {
  notifications: Notification[]
  loading?: boolean
  /** Shows «Marcar todas como leídas» while something is unread; the app marks them and passes the new list. */
  onMarkAllRead?: () => void
  /** A row was chosen: the app opens what it points to and marks it read. */
  onSelect?: (notification: Notification) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  emptyTitle?: React.ReactNode
  emptyDescription?: React.ReactNode
  /** Under the list, such as a «Ver todas» link. */
  footer?: React.ReactNode
  className?: string
}

/** The bell of the top bar: the unread count, and the notifications in a popover (a bottom sheet on a phone). */
function NotificationCenter({
  notifications,
  loading = false,
  onMarkAllRead,
  onSelect,
  open,
  defaultOpen,
  onOpenChange,
  title = "Notificaciones",
  emptyTitle = "No tienes notificaciones",
  emptyDescription = "Aquí verás cuando alguien comparta un informe contigo o termine una exportación.",
  footer,
  className,
}: NotificationCenterProps) {
  const isMobile = useIsMobile()
  const unread = loading ? 0 : notifications.filter((item) => !item.read).length
  const state = { open, defaultOpen, onOpenChange }

  const trigger = (
    <Button
      variant="ghost"
      size="icon"
      // The exact count is in the name: «Notificaciones, 12 sin leer».
      aria-label={unread > 0 ? `${title}, ${unread} sin leer` : title}
    >
      <BellIcon />
    </Button>
  )
  // The badge sits beside the button, not in it: «9+» is not in the button's name, so inside it would break
  // WCAG 2.5.3 (label in name). A ring of the page color keeps it apart from the bell it overlaps.
  const count = unread > 0 && (
    <span
      data-slot="notification-count"
      aria-hidden
      className="pointer-events-none absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[0.625rem] leading-none font-semibold text-destructive-foreground tabular-nums ring-2 ring-background"
    >
      {unread > 9 ? "9+" : unread}
    </span>
  )

  const markAll = onMarkAllRead && unread > 0 && (
    <Button variant="ghost" size="sm" className="-my-1 -mr-1.5 text-muted-foreground" onClick={onMarkAllRead}>
      <CheckCheckIcon data-icon="inline-start" aria-hidden />
      Marcar todas como leídas
    </Button>
  )

  const body = (
    <NotificationList
      notifications={notifications}
      loading={loading}
      onSelect={onSelect}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  )

  if (isMobile) {
    return (
      <Drawer {...state}>
        <span data-slot="notification-center" className={cn("relative inline-flex", className)}>
          <DrawerTrigger render={trigger} />
          {count}
        </span>
        <DrawerContent className="max-h-[85dvh]">
          <DrawerHeader className="flex-row items-center justify-between gap-3 border-b py-3 pr-14">
            <DrawerTitle>{title}</DrawerTitle>
            {markAll}
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto">{body}</div>
          {footer && <div className="border-t p-2">{footer}</div>}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover {...state}>
      <span data-slot="notification-center" className={cn("relative inline-flex", className)}>
        <PopoverTrigger render={trigger} />
        {count}
      </span>
      <PopoverContent align="end" sideOffset={8} className="w-96 max-w-[calc(100vw-2rem)] gap-0 p-0">
        <div className="flex min-h-12 items-center justify-between gap-3 border-b px-4 py-2">
          <PopoverTitle className="text-sm">{title}</PopoverTitle>
          {markAll}
        </div>
        <div className="max-h-[min(28rem,60vh)] overflow-y-auto">{body}</div>
        {footer && <div className="border-t p-1.5">{footer}</div>}
      </PopoverContent>
    </Popover>
  )
}

function NotificationList({
  notifications,
  loading,
  onSelect,
  emptyTitle,
  emptyDescription,
}: Pick<NotificationCenterProps, "notifications" | "loading" | "onSelect" | "emptyTitle" | "emptyDescription">) {
  const titleId = React.useId()

  if (loading) {
    return (
      <div aria-busy="true" className="grid gap-1 p-2">
        <span className="sr-only">Cargando notificaciones</span>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex gap-3 px-2 py-2.5">
            <Skeleton className="size-8 shrink-0 rounded-md" />
            <div className="grid flex-1 gap-2 py-0.5">
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <Empty className="gap-4 px-6 py-10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BellOffIcon aria-hidden />
          </EmptyMedia>
          {/* Under the panel's 14 px title, the empty title stays a step above it, not the page-sized 18 px. */}
          <EmptyTitle className="text-base sm:text-base">{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const groups = [
    { key: "unread", label: "Sin leer", items: notifications.filter((item) => !item.read) },
    { key: "read", label: "Leídas", items: notifications.filter((item) => item.read) },
  ].filter((group) => group.items.length > 0)

  return (
    <div className="grid gap-1 p-2">
      {groups.map((group) => (
        <section key={group.key} className="grid gap-0.5">
          <h3 id={`${titleId}-${group.key}`} className="px-2 pt-1.5 pb-1 text-xs font-medium text-muted-foreground">
            {group.label}
          </h3>
          <ul aria-labelledby={`${titleId}-${group.key}`} className="grid gap-0.5">
            {group.items.map((item) => (
              <li key={item.id}>
                <NotificationRow notification={item} onSelect={onSelect} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function NotificationRow({
  notification,
  onSelect,
}: {
  notification: Notification
  onSelect?: (notification: Notification) => void
}) {
  const { title, description, time, dateTime, read, icon } = notification
  const content = (
    <>
      {icon && (
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4"
        >
          {icon}
        </span>
      )}
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className={cn("text-sm text-pretty wrap-break-word", !read && "font-medium")}>{title}</span>
        {description && <span className="line-clamp-2 text-sm text-muted-foreground">{description}</span>}
        <time dateTime={dateTime} className="text-xs text-muted-foreground">
          {time}
        </time>
      </span>
      {/* Unread rows carry a brand dot; the «Sin leer» heading already says it to a screen reader. */}
      {!read && <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
    </>
  )
  const row = "flex w-full items-start gap-3 rounded-md px-2 py-2.5 text-left"

  if (!onSelect) return <div className={row}>{content}</div>
  return (
    <button
      type="button"
      // The theme's brand outline marks keyboard focus; the list's 8 px padding keeps it unclipped.
      className={cn(row, "transition-colors hover:bg-accent")}
      onClick={() => onSelect(notification)}
    >
      {content}
    </button>
  )
}

export { NotificationCenter }
