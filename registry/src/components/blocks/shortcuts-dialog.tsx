// Internal part of the app-shell block: the keyboard shortcuts of the app, grouped, opened with «?».
"use client"

import * as React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ViewportScrollBlur, useScrollBlurViewport } from "@/components/ui/progressive-blur"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { shortcutLabel } from "@/components/ui/command"

type Shortcut = {
  label: string
  /**
   * The keys: `mod+k` (⌘K on Apple, Ctrl K elsewhere, as the search), `shift+d`, `esc`, `?`,
   * and a space between the steps of a sequence: `g i` reads «G luego I».
   */
  keys: string
}

type ShortcutGroup = { heading: string; shortcuts: Shortcut[] }

type ShortcutsDialogProps = {
  groups: ShortcutGroup[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** The key that opens the dialog from anywhere but a text field. Pass `null` for none. */
  hotkey?: string | null
}

const NAMES: Record<string, string> = {
  shift: "Shift",
  alt: "Alt",
  ctrl: "Ctrl",
  esc: "Esc",
  enter: "Enter",
  tab: "Tab",
  space: "Espacio",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
}

/** One step of a shortcut: «mod+k» → one key as the search shows it; «shift+d» → Shift, D. */
function Chord({ chord }: { chord: string }) {
  const parts = chord.split("+")
  if (parts[0] === "mod" && parts.length === 2) return <Kbd>{shortcutLabel(parts[1])}</Kbd>
  return (
    <>
      {parts.map((part, index) => (
        <Kbd key={index}>{NAMES[part.toLowerCase()] ?? part.toUpperCase()}</Kbd>
      ))}
    </>
  )
}

function Keys({ keys }: { keys: string }) {
  const steps = keys.trim().split(/\s+/)
  return (
    <KbdGroup className="shrink-0">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Inside a <kbd> group: without font-sans the word would take the monospace face. */}
          {index > 0 && <span className="font-sans text-xs text-muted-foreground">luego</span>}
          <Chord chord={step} />
        </React.Fragment>
      ))}
    </KbdGroup>
  )
}

/** Typing in a field: «?» is a character there, not a shortcut. */
function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
}

/** A dialog with every shortcut of the app, grouped («Navegación», «Informes»…), each key in a `Kbd`. */
function ShortcutsDialog({ groups, open: openProp, defaultOpen = false, onOpenChange, hotkey = "?" }: ShortcutsDialogProps) {
  const [viewport, viewportRef] = useScrollBlurViewport()
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  React.useEffect(() => {
    if (!hotkey) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== hotkey || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.defaultPrevented || isTyping(event.target)) return
      event.preventDefault()
      setOpen(true)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [hotkey, setOpen])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-6 sm:max-w-2xl sm:p-6">
        <DialogHeader>
          <DialogTitle>Atajos de teclado</DialogTitle>
          <DialogDescription>
            {hotkey ? (
              <>
                Pulsa <Kbd>{hotkey}</Kbd> en cualquier momento para ver esta lista.
              </>
            ) : (
              "Lo que puedes hacer sin el mouse."
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="relative -mx-4 sm:-mx-6">
          <div ref={viewportRef} data-slot="shortcuts-list-viewport" className="grid max-h-[min(32rem,70svh)] gap-6 overflow-y-auto px-4 sm:grid-cols-2 sm:gap-x-8 sm:px-6">
            {groups.map((group) => (
              <section key={group.heading} className="grid content-start gap-2">
                <h3 className="text-xs font-medium text-muted-foreground">{group.heading}</h3>
                <ul className="grid">
                  {group.shortcuts.map((shortcut) => (
                    <li
                      key={shortcut.label}
                      className="flex min-h-9 items-center justify-between gap-4 border-b py-1.5 last:border-b-0"
                    >
                      <span>{shortcut.label}</span>
                      <Keys keys={shortcut.keys} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <ViewportScrollBlur viewport={viewport} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ShortcutsDialog, type Shortcut, type ShortcutGroup, type ShortcutsDialogProps }
