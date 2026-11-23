// registry: auradata (light, dark or system theme, in the AuraData top bar; expands with a circular View Transition from the button unless reduced motion is set; its options shared with the user menu)
import * as React from "react"
import { flushSync } from "react-dom"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Theme = "light" | "dark" | "system"

/** The three themes, in menu order: shared with the user menu. */
const themeOptions: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Claro", icon: SunIcon },
  { value: "dark", label: "Oscuro", icon: MoonIcon },
  { value: "system", label: "Sistema", icon: MonitorIcon },
]

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>
    finished: Promise<void>
  }
}

/**
 * Runs a theme switch inside a circular View Transition expanding from `origin` (typically the toggle button).
 * Falls back to an immediate switch when the API is unavailable, the user prefers reduced motion, or the
 * document is embedded in an iframe (Chromium's compositor can crash running root View Transitions with
 * composited popups inside a sub-frame).
 */
function transitionTheme(apply: () => void, origin?: HTMLElement | null) {
  const doc = typeof document !== "undefined" ? (document as ViewTransitionDocument) : undefined
  const embedded = typeof window !== "undefined" && window.self !== window.top
  const reduced =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (!doc?.startViewTransition || embedded || reduced) {
    apply()
    return
  }

  const rect = origin?.getBoundingClientRect()
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  const root = doc.documentElement
  root.dataset.themeTransition = ""
  const transition = doc.startViewTransition(() => {
    flushSync(apply)
  })
  transition.ready
    .then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 420,
          easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    })
    .catch(() => {})
  transition.finished
    .finally(() => {
      delete root.dataset.themeTransition
    })
    .catch(() => {})
}

type ThemeToggleProps = {
  /** The chosen theme. The app owns it (next-themes, its own provider…) and puts `.dark` on the document. */
  theme: Theme
  onThemeChange: (theme: Theme) => void
  /** Opens the menu on mount, for the catalog and the visual tests. */
  defaultOpen?: boolean
}

/** A button that opens the theme menu: claro, oscuro o sistema. */
function ThemeToggle({ theme, onThemeChange, defaultOpen }: ThemeToggleProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger
        render={<Button ref={triggerRef} variant="ghost" size="icon" aria-label="Cambiar tema" />}
      >
        <SunIcon className="dark:hidden" />
        <MoonIcon className="hidden dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Tema</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(value) => {
              const next = value as Theme
              if (next === theme) return
              transitionTheme(() => onThemeChange(next), triggerRef.current)
            }}
          >
            {themeOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                <option.icon />
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ThemeToggle, themeOptions, transitionTheme }
