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
import { Kbd } from "@/components/ui/kbd"
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

const subscribeNoop = () => () => {}

/** "⌘K" on Apple devices, "Ctrl K" elsewhere: also for the shortcuts of the items. */
function shortcutLabel(hotkey: string) {
  const apple =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.userAgent)
  return apple ? `⌘${hotkey.toUpperCase()}` : `Ctrl ${hotkey.toUpperCase()}`
}

function useShortcutLabel(hotkey: string | null | undefined) {
  return React.useSyncExternalStore(
    subscribeNoop,
    () => (hotkey ? shortcutLabel(hotkey) : ""),
    () => (hotkey ? `Ctrl ${hotkey.toUpperCase()}` : "")
  )
}

/**
 * The list of matches, hidden while nothing matches: an empty listbox fails axe
 * (aria-required-children), so «Sin resultados» shows outside it. Items stay mounted for cmdk to filter.
 */
function Results({ children }: { children: React.ReactNode }) {
  const matches = useCommandState((state) => state.filtered.count)
  return (
    // Under half the screen: on a phone the keyboard takes the other half.
    <CommandList hidden={matches === 0} className="max-h-[min(26rem,45dvh)]">
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
  const shortcut = useShortcutLabel(hotkey)
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
          // Phones have no keyboard shortcut to show.
          <Kbd className="ml-auto max-sm:hidden">{shortcut}</Kbd>
        )}
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Buscar"
        description={placeholder}
        // Near the top on a phone, so the results stay above the keyboard; wider on a desktop.
        className="top-3 sm:top-1/3 sm:max-w-lg"
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
              // A hairline, not a CommandSeparator: a listbox may not hold role=separator (axe). Inset 4px,
              // as wide as the rows.
              <CommandGroup
                key={group.heading}
                heading={group.heading}
                className="relative not-first:before:absolute not-first:before:inset-x-1 not-first:before:top-0 not-first:before:h-px not-first:before:bg-border"
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
                      <CommandShortcut className="tracking-normal max-sm:hidden">{item.shortcut}</CommandShortcut>
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
  shortcutLabel,
  type SearchCommandGroup,
  type SearchCommandItem,
  type SearchCommandProps,
}
