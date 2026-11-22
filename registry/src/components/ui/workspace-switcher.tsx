// registry: auradata (the workspace picker at the top of the AuraData sidebar)
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { initials } from "@/lib/initials"

export type Workspace = {
  id: string
  name: string
  /** A second line under the name, such as the plan or the number of members. */
  description?: string
}

type WorkspaceSwitcherProps = {
  workspaces: Workspace[]
  /** The id of the current workspace. */
  current: string
  onSelect?: (id: string) => void
  /** Shows «Nuevo espacio» at the end of the list. */
  onCreate?: () => void
  /** Opens the menu on mount, for the catalog and the visual tests. */
  defaultOpen?: boolean
}

function WorkspaceAvatar({ name }: { name: string }) {
  return (
    <Avatar className="size-8 rounded-lg after:rounded-lg">
      <AvatarFallback className="rounded-lg bg-primary text-xs font-medium text-primary-foreground">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}

/** The current workspace (espacio de trabajo) and a menu to change it or create one. Goes inside a Sidebar. */
function WorkspaceSwitcher({ workspaces, current, onSelect, onCreate, defaultOpen }: WorkspaceSwitcherProps) {
  const active = workspaces.find((workspace) => workspace.id === current) ?? workspaces[0]
  if (!active) return null
  return (
    <SidebarMenu data-slot="workspace-switcher">
      <SidebarMenuItem>
        <DropdownMenu defaultOpen={defaultOpen}>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" title={active.name} className="data-popup-open:bg-sidebar-accent" />}
          >
            <WorkspaceAvatar name={active.name} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{active.name}</span>
              {active.description && (
                <span className="truncate text-xs text-muted-foreground">{active.description}</span>
              )}
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-(--anchor-width) min-w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Espacios de trabajo</DropdownMenuLabel>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => onSelect?.(workspace.id)}
                  title={workspace.name}
                  className="gap-2 p-2"
                >
                  {/* The current workspace's tile looks as in the trigger: primary; the others muted. */}
                  <Avatar className="size-7 rounded-md after:rounded-md">
                    <AvatarFallback
                      className={cn(
                        "rounded-md text-[0.6875rem] font-medium",
                        workspace.id === active.id && "bg-primary text-primary-foreground"
                      )}
                    >
                      {initials(workspace.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 truncate">{workspace.name}</span>
                  {workspace.id === active.id && <CheckIcon aria-label="Actual" className="ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {onCreate && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onCreate} className="gap-2 p-2">
                  <span className="flex size-7 items-center justify-center rounded-md border text-muted-foreground">
                    <PlusIcon className="size-4" />
                  </span>
                  Nuevo espacio
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { WorkspaceSwitcher }
