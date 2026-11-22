// registry: auradata (the shell of every AuraData app: sidebar and top bar)
import { ChevronsUpDownIcon, LogOutIcon, type LucideIcon, SettingsIcon } from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo, ProductTag } from "@/components/ui/logo"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { WorkspaceSwitcher } from "@/components/ui/workspace-switcher"
import { initials } from "@/lib/initials"

export type NavItem = { title: string; href: string; icon: LucideIcon; active?: boolean }
export type NavGroup = { label: string; items: NavItem[] }
export type User = { name: string; email: string }

type AppShellProps = {
  /** The product next to the logo, such as "BI". */
  product?: string
  nav: NavGroup[]
  user: User
  /** Where the page sits, from the section to the page itself. */
  breadcrumbs?: string[]
  /** Buttons on the right of the top bar. */
  actions?: React.ReactNode
  /** The workspaces of the user: a switcher at the top of the sidebar. */
  workspaces?: React.ComponentProps<typeof WorkspaceSwitcher>
  /** The app theme: a light, dark or system menu at the right of the top bar. */
  theme?: React.ComponentProps<typeof ThemeToggle>
  children: React.ReactNode
}

function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<SidebarMenuButton size="lg" className="data-popup-open:bg-sidebar-accent" />}
      >
        <Avatar className="size-8 rounded-lg">
          <AvatarFallback className="rounded-lg">{initials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
        </div>
        <ChevronsUpDownIcon className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-(--anchor-width) min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuItem>
            <SettingsIcon />
            Ajustes
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** The sidebar with the logo, the sections and the user; the top bar with where you are and the page actions. */
export function AppShell({
  product,
  nav,
  user,
  breadcrumbs = [],
  actions,
  workspaces,
  theme,
  children,
}: AppShellProps) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-14 flex-row items-center gap-3 px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <Logo className="h-6 group-data-[collapsible=icon]:hidden" />
          <Logo layout="mark" className="hidden h-5 group-data-[collapsible=icon]:block" />
          {product && <ProductTag className="group-data-[collapsible=icon]:hidden">{product}</ProductTag>}
        </SidebarHeader>
        <SidebarContent>
          {workspaces && (
            <SidebarGroup className="pb-0">
              <WorkspaceSwitcher {...workspaces} />
            </SidebarGroup>
          )}
          {nav.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton isActive={item.active} tooltip={item.title} render={<a href={item.href} />}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <UserMenu user={user} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        {/* The trigger's icon starts on the content's 24px edge, and the theme toggle's icon ends on it: the
            negative margins take back the buttons' inner space around their 16px icons. */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-1.5" />
          {breadcrumbs.length > 0 && (
            <>
              <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-center" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <BreadcrumbItem key={crumb}>
                      {index > 0 && <BreadcrumbSeparator />}
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb}</BreadcrumbPage>
                      ) : (
                        <span className="text-muted-foreground">{crumb}</span>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </>
          )}
          {(actions || theme) && (
            <div className={cn("ml-auto flex items-center gap-2", theme && "-mr-2")}>
              {actions}
              {theme && <ThemeToggle {...theme} />}
            </div>
          )}
        </header>
        {/* SidebarInset is the <main> landmark already. */}
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
