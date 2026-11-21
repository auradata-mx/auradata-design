// registry: auradata (a ⌘K / Ctrl+K search over reports, datasets and actions, in Spanish, with a loading row)
import * as React from "react"
import { useCommandState } from "cmdk"
import { SearchIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Spinner } from "@/components/ui/spinner"

type SearchCommandItem = {
  id: string
  label: string
  icon?: React.ReactNode
  /** Other words that find this item, such as a workspace or an owner. */
  keywords?: string[]
  shortcut?: string
  onSelect?: () => void
}

type SearchCommandGroup = {
  /** The group's heading: Informes, Datasets, Acciones… */
  heading: string
  items: SearchCommandItem[]
}

type SearchCommandProps = Omit<
  React.ComponentProps<typeof Button>,
  "onSelect"
> & {
  groups: SearchCommandGroup[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  emptyText?: React.ReactNode
  /** The letter that opens the search with ⌘ (macOS) or Ctrl. Pass `null` for no shortcut. */
  hotkey?: string | null
  /** The results are loading (a search on the server): «Buscando…» instead of «Sin resultados». */
  loading?: boolean
  /** What the loading row says. */
  loadingText?: React.ReactNode
}

/** "⌘K" on Apple devices, "Ctrl K" elsewhere. */
function shortcutLabel(hotkey: string) {
  const apple =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.userAgent)
  return apple ? `⌘${hotkey.toUpperCase()}` : `Ctrl ${hotkey.toUpperCase()}`
}

/**
 * The list of matches, hidden while nothing matches: an empty listbox fails axe
 * (aria-required-children), so «Sin resultados» shows outside it. Items stay mounted for cmdk to filter.
 */
function Results({ children }: { children: React.ReactNode }) {
  const matches = useCommandState((state) => state.filtered.count)
  return (
    <CommandList hidden={matches === 0} className="max-h-[min(26rem,60vh)]">
      {children}
    </CommandList>
  )
}

/** A search button that opens a command palette, also with ⌘K / Ctrl+K from anywhere on the page. */
function SearchCommand({
  groups,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placeholder = "Busca informes, datasets o acciones…",
  emptyText = "Sin resultados",
  hotkey = "k",
  loading = false,
  loadingText = "Buscando…",
  className,
  children = "Buscar…",
  ...props
}: SearchCommandProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolled
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  React.useEffect(() => {
    if (!hotkey) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === hotkey.toLowerCase()
      ) {
        event.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [hotkey, open, setOpen])

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "w-full max-w-64 justify-start font-normal text-muted-foreground",
          className
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <SearchIcon data-icon="inline-start" aria-hidden />
        {children}
        {hotkey && (
          <kbd className="ml-auto rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
            {shortcutLabel(hotkey)}
          </kbd>
        )}
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Buscar"
        description={placeholder}
      >
        <Command>
          <CommandInput placeholder={placeholder} />
          {loading ? (
            <div
              role="status"
              className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground"
            >
              <Spinner aria-hidden className="motion-reduce:animate-none" />
              {loadingText}
            </div>
          ) : (
            <CommandEmpty>{emptyText}</CommandEmpty>
          )}
          <Results>
            {groups.map((group) => (
              // A border, not a CommandSeparator: a listbox may not hold role=separator (axe).
              <CommandGroup
                key={group.heading}
                heading={group.heading}
                className="not-first:border-t"
              >
                {group.items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.label} ${item.id}`}
                    keywords={item.keywords}
                    onSelect={() => {
                      item.onSelect?.()
                      setOpen(false)
                    }}
                  >
                    {item.icon}
                    {item.label}
                    {item.shortcut && (
                      <CommandShortcut>{item.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </Results>
        </Command>
      </CommandDialog>
    </>
  )
}

export {
  SearchCommand,
  type SearchCommandGroup,
  type SearchCommandItem,
  type SearchCommandProps,
}
