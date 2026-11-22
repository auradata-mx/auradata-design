// registry: auradata (a list on the left and the chosen item on the right; on a phone, list → detail with a back button)
"use client"

import * as React from "react"
import { ChevronLeftIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

/** Below `md` (768 px) one pane shows at a time. */
const PHONE = "(max-width: 767.98px)"

const MasterDetailContext = React.createContext<{ showDetail: boolean }>({ showDetail: false })

/**
 * Two panes. The app owns the selection: `showDetail` is true while an item is open. From `md` both panes
 * show; below it the detail replaces the list, the focus moves to the detail and, back in the list, to the
 * row that opened it.
 */
function MasterDetail({
  showDetail,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { showDetail: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const previous = React.useRef(showDetail)
  // The row that opened the detail: going back usually clears the selection, so it cannot be found by state.
  const opener = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const changed = previous.current !== showDetail
    previous.current = showDetail
    if (!changed || !ref.current || !window.matchMedia(PHONE).matches) return
    // The pane that just appeared takes the focus, so the keyboard and screen readers follow the swap.
    if (showDetail) {
      const active = document.activeElement
      opener.current = active instanceof HTMLElement && ref.current.contains(active) ? active : null
      ref.current.querySelector<HTMLElement>("[data-slot=master-detail-pane]")?.focus()
    } else {
      const row = opener.current?.isConnected
        ? opener.current
        : ref.current.querySelector<HTMLElement>("[data-slot=master-detail-item][aria-current=true]")
      row?.focus()
    }
  }, [showDetail])

  return (
    <MasterDetailContext.Provider value={{ showDetail }}>
      <div
        ref={ref}
        data-slot="master-detail"
        data-show-detail={showDetail}
        className={cn(
          "group/master-detail grid min-h-0 overflow-hidden bg-background md:grid-cols-[minmax(15rem,20rem)_minmax(0,1fr)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </MasterDetailContext.Provider>
  )
}

/** The list pane: a named region (`aria-label`) holding `MasterDetailItem`s. */
function MasterDetailList({ className, children, ...props }: React.ComponentProps<"section">) {
  const { showDetail } = React.useContext(MasterDetailContext)
  return (
    <section
      data-slot="master-detail-list"
      className={cn(
        "min-h-0 overflow-y-auto md:border-r",
        showDetail && "max-md:hidden",
        className
      )}
      {...props}
    >
      <ul className="grid gap-1 p-2">{children}</ul>
    </section>
  )
}

/** One row. `active` marks the open item (`aria-current`). */
function MasterDetailItem({
  active = false,
  className,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <li className="min-w-0">
      <button
        type="button"
        data-slot="master-detail-item"
        aria-current={active || undefined}
        data-active={active || undefined}
        className={cn(
          "grid min-h-11 w-full min-w-0 gap-0.5 rounded-lg px-3 py-2.5 text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 data-active:bg-accent motion-reduce:transition-none",
          className
        )}
        {...props}
      />
    </li>
  )
}

/** The detail pane: a named region that takes the focus when it replaces the list on a phone. */
function MasterDetailPane({ className, ...props }: React.ComponentProps<"section">) {
  const { showDetail } = React.useContext(MasterDetailContext)
  return (
    <section
      data-slot="master-detail-pane"
      tabIndex={-1}
      className={cn("min-h-0 overflow-y-auto outline-none", !showDetail && "max-md:hidden", className)}
      {...props}
    />
  )
}

/** Back to the list, only on a phone. Its text names the list: «Informes». */
function MasterDetailBack({ className, children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="sm"
      data-slot="master-detail-back"
      className={cn("-ml-2 w-fit md:hidden", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" aria-hidden />
      {children}
    </Button>
  )
}

export { MasterDetail, MasterDetailBack, MasterDetailItem, MasterDetailList, MasterDetailPane }
