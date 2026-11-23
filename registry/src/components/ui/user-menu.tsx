// registry: auradata (the account menu of an AuraData app: account, workspace, theme, language, help and «Cerrar sesión»)
"use client"

import * as React from "react"
import {
  BuildingIcon,
  ChevronsUpDownIcon,
  CircleHelpIcon,
  KeyboardIcon,
  LanguagesIcon,
  LogOutIcon,
  PaletteIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { themeOptions, transitionTheme, type Theme } from "@/components/ui/theme-toggle"
import type { Workspace } from "@/components/ui/workspace-switcher"
import { initials } from "@/lib/initials"

type UserMenuUser = { name: string; email: string; avatarUrl?: string }

type UserMenuProps = {
  user: UserMenuUser
  /** `avatar`: a round avatar button, for a top bar. `full`: the avatar with the name and email, for a sidebar. */
  variant?: "avatar" | "full"
  /** The trigger element, such as the sidebar's `SidebarMenuButton`. Its content comes from `variant`. */
  trigger?: React.ReactElement
  /** «Espacio de trabajo»: the user's workspaces, the current one checked. */
  workspaces?: { workspaces: Workspace[]; current: string; onSelect?: (id: string) => void }
  /** «Tema»: claro, oscuro o sistema. The app owns it, as in `ThemeToggle`. */
  theme?: { theme: Theme; onThemeChange: (theme: Theme) => void }
  /** «Idioma». The labels go in their own language. */
  language?: { value: string; onValueChange: (value: string) => void; languages?: { value: string; label: string }[] }
  /** «Mi cuenta», shown when given. */
  onAccount?: () => void
  onSettings?: () => void
  /** «Ayuda y documentación», shown when given. */
  onHelp?: () => void
  /** «Atajos de teclado» with its «?», shown when given: open the `ShortcutsDialog`. */
  onShortcuts?: () => void
  onSignOut?: () => void
  /** Where the menu opens. The sidebar opens it upward. */
  side?: "top" | "bottom" | "right"
  align?: "start" | "end"
  /** Opens the menu on mount, for the catalog and the visual tests. */
  defaultOpen?: boolean
}

const LANGUAGES = [
  { value: "es-MX", label: "Español (México)" },
  { value: "en", label: "English" },
]

function UserAvatar({ user, className }: { user: UserMenuUser; className?: string }) {
  return (
    <Avatar className={cn("size-8 rounded-lg after:rounded-lg", className)}>
      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
      <AvatarFallback className="rounded-lg">{initials(user.name)}</AvatarFallback>
    </Avatar>
  )
}

/**
 * The account menu: the name and email on top; «Mi cuenta» and «Ajustes»; the workspace, theme and
 * language in submenus; help and shortcuts; «Cerrar sesión» last. Sections show when the app passes them.
 */
function UserMenu({
  user,
  variant = "avatar",
  trigger,
  workspaces,
  theme,
  language,
  onAccount,
  onSettings,
  onHelp,
  onShortcuts,
  onSignOut,
  side = "bottom",
  align = "end",
  defaultOpen,
}: UserMenuProps) {
  const label = `Cuenta de ${user.name}`
  const languages = language?.languages ?? LANGUAGES
  const current = workspaces?.workspaces.find((workspace) => workspace.id === workspaces.current)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      {variant === "full" ? (
        <DropdownMenuTrigger
          ref={triggerRef}
          render={trigger ?? <Button variant="ghost" className="h-auto w-full justify-start gap-2 p-2 text-left" />}
        >
          {/* Named by its visible text (name and email): an aria-label would not match it. */}
          <UserAvatar user={user} />
          <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </span>
          <ChevronsUpDownIcon aria-hidden className="ml-auto size-4" />
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger
          ref={triggerRef}
          render={trigger ?? <Button variant="ghost" size="icon" className="rounded-full" />}
        >
          {/* Named by sr-only text, not aria-label: the initials would not match it (label-content-name-mismatch). */}
          <span aria-hidden className="contents">
            <UserAvatar user={user} className="size-7 rounded-full after:rounded-full *:rounded-full" />
          </span>
          <span className="sr-only">{label}</span>
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent side={side} align={align} className="w-(--anchor-width) min-w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 py-1.5 font-normal">
            <UserAvatar user={user} />
            <span className="grid min-w-0 text-sm leading-tight">
              <span className="truncate font-medium text-foreground">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </span>
          </DropdownMenuLabel>
          {onAccount && (
            <DropdownMenuItem onClick={onAccount}>
              <UserIcon />
              Mi cuenta
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onSettings}>
            <SettingsIcon />
            Ajustes
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {(workspaces || theme || language) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {workspaces && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <BuildingIcon />
                    Espacio de trabajo
                    {current && <span className="ml-auto truncate pl-2 text-xs text-muted-foreground">{current.name}</span>}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-44">
                    <DropdownMenuRadioGroup
                      value={workspaces.current}
                      onValueChange={(value) => workspaces.onSelect?.(value as string)}
                    >
                      {workspaces.workspaces.map((workspace) => (
                        <DropdownMenuRadioItem key={workspace.id} value={workspace.id} closeOnClick>
                          {workspace.name}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              {theme && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <PaletteIcon />
                    Tema
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent aria-label="Tema" className="min-w-36">
                    <DropdownMenuRadioGroup
                      value={theme.theme}
                      onValueChange={(value) => {
                        const next = value as Theme
                        if (next === theme.theme) return
                        transitionTheme(() => theme.onThemeChange(next), triggerRef.current)
                      }}
                    >
                      {themeOptions.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick>
                          <option.icon />
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              {language && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <LanguagesIcon />
                    Idioma
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent aria-label="Idioma" className="min-w-44">
                    <DropdownMenuRadioGroup
                      value={language.value}
                      onValueChange={(value) => language.onValueChange(value as string)}
                    >
                      {languages.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value} lang={option.value} closeOnClick>
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
            </DropdownMenuGroup>
          </>
        )}
        {(onHelp || onShortcuts) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {onHelp && (
                <DropdownMenuItem onClick={onHelp}>
                  <CircleHelpIcon />
                  Ayuda y documentación
                </DropdownMenuItem>
              )}
              {onShortcuts && (
                <DropdownMenuItem onClick={onShortcuts}>
                  <KeyboardIcon />
                  Atajos de teclado
                  <DropdownMenuShortcut aria-hidden>?</DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOutIcon />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { UserMenu, type UserMenuProps, type UserMenuUser }
