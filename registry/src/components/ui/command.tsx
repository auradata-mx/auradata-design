// registry: auradata (shadcn command: sliding active highlight in the list, the highlighted item takes --accent apart from the popover, concentric item corners, the whole search box takes the tap, the empty message is muted, a separator as wide as the rows)
import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "cn"
import { ViewportScrollBlur, useScrollBlurViewport } from "@/components/ui/progressive-blur"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { SearchIcon, CheckIcon } from "lucide-react"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0",
          className
        )}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="p-1 pb-0">
      <InputGroup className="h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "h-full w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <InputGroupAddon>
          <SearchIcon className="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function CommandList({
  className,
  children,
  ref,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  const [list, setRef] = useScrollBlurViewport(ref)
  const hasMeasured = React.useRef(false)
  const [indicator, setIndicator] = React.useState<{
    top: number
    left: number
    width: number
    height: number
    animate: boolean
  } | null>(null)

  React.useLayoutEffect(() => {
    if (!list) return
    const measure = () => {
      const selected = list.querySelector<HTMLElement>(
        '[data-slot="command-item"][data-selected="true"]'
      )
      if (!selected) {
        setIndicator(null)
        return
      }
      const listRect = list.getBoundingClientRect()
      const itemRect = selected.getBoundingClientRect()
      if (itemRect.width === 0 || itemRect.height === 0) {
        setIndicator(null)
        return
      }
      const next = {
        top: Math.round((itemRect.top - listRect.top + list.scrollTop) * 10) / 10,
        left: Math.round((itemRect.left - listRect.left + list.scrollLeft) * 10) / 10,
        width: Math.round(itemRect.width * 10) / 10,
        height: Math.round(itemRect.height * 10) / 10,
        animate: hasMeasured.current,
      }
      hasMeasured.current = true
      setIndicator((current) =>
        current &&
        current.top === next.top &&
        current.left === next.left &&
        current.width === next.width &&
        current.height === next.height
          ? current
          : next
      )
    }
    measure()
    const mutations = new MutationObserver(measure)
    mutations.observe(list, {
      attributes: true,
      attributeFilter: ["data-selected", "hidden"],
      childList: true,
      subtree: true,
    })
    const resize = new ResizeObserver(measure)
    resize.observe(list)
    return () => {
      mutations.disconnect()
      resize.disconnect()
    }
  }, [list])

  return (
    <div className="relative min-h-0">
      <CommandPrimitive.List
        ref={setRef}
        data-slot="command-list"
        data-indicator-ready={indicator ? "true" : undefined}
        className={cn(
          "group/command-list relative no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
          className
        )}
        {...props}
      >
        {indicator && (
          <div
            aria-hidden="true"
            role="presentation"
            data-slot="command-active-indicator"
            style={{
              transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
              width: indicator.width,
              height: indicator.height,
            }}
            className={cn(
              "pointer-events-none absolute top-0 left-0 z-0 rounded-[calc(var(--radius)-4px)] bg-accent in-data-[slot=dialog-content]:rounded-lg",
              indicator.animate &&
                "transition-[transform,width,height] duration-150 ease-(--ease-fluid) motion-reduce:transition-none"
            )}
          />
        )}
        {children}
      </CommandPrimitive.List>
      <ViewportScrollBlur viewport={list} />
    </div>
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("mx-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative z-[1] flex cursor-default items-center gap-2 rounded-[calc(var(--radius)-4px)] px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-accent group-data-[indicator-ready=true]/command-list:data-selected:bg-transparent data-selected:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      <CheckIcon className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
