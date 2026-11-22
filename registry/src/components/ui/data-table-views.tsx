// registry: auradata (a «Vistas» menu: apply a saved view, save the current one under a name, delete the applied one)
import * as React from "react"
import { BookmarkIcon, BookmarkPlusIcon, Trash2Icon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type DataTableViewsProps = Omit<React.ComponentProps<typeof Button>, "onSelect"> & {
  views: { id: string; name: string }[]
  /** The view applied now; the button shows its name. */
  activeId?: string | null
  onApply: (id: string) => void
  /** Saves what is on screen under a name; the same name replaces that view. */
  onSave: (name: string) => void
  onDelete: (id: string) => void
}

/**
 * The saved views of a table or a dashboard: the button names the applied view, the menu applies another, saves
 * the current one (a dialog asks for its name) and deletes the applied one. Pure UI: `useSavedViews` keeps the
 * list, and `DataTable` makes one with `savedViews`.
 */
function DataTableViews({ views, activeId, onApply, onSave, onDelete, className, ...props }: DataTableViewsProps) {
  const [saving, setSaving] = React.useState(false)
  const [name, setName] = React.useState("")
  const active = views.find((view) => view.id === activeId)
  const nameId = React.useId()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" className={cn("max-w-56", className)} {...props} />}>
          <BookmarkIcon data-icon="inline-start" aria-hidden />
          {active ? (
            <span className="truncate">
              <span className="sr-only">Vista: </span>
              {active.name}
            </span>
          ) : (
            "Vistas"
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Vistas guardadas</DropdownMenuLabel>
            {views.length ? (
              <DropdownMenuRadioGroup value={activeId ?? ""} onValueChange={(id) => onApply(String(id))}>
                {views.map((view) => (
                  <DropdownMenuRadioItem key={view.id} value={view.id} closeOnClick>
                    <span className="truncate">{view.name}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            ) : (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">Aún no hay vistas guardadas.</p>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setName(active?.name ?? "")
                setSaving(true)
              }}
            >
              <BookmarkPlusIcon aria-hidden />
              Guardar vista actual…
            </DropdownMenuItem>
            {active && (
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(active.id)}>
                <Trash2Icon aria-hidden />
                {`Eliminar «${active.name}»`}
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={saving} onOpenChange={setSaving}>
        <DialogContent className="sm:max-w-sm">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              if (!name.trim()) return
              onSave(name.trim())
              setSaving(false)
            }}
          >
            <DialogHeader>
              <DialogTitle>Guardar vista</DialogTitle>
              <DialogDescription>El orden, los filtros y las columnas que ves ahora. Un nombre que ya existe la reemplaza.</DialogDescription>
            </DialogHeader>
            <Field>
              <FieldLabel htmlFor={nameId}>Nombre de la vista</FieldLabel>
              <Input
                id={nameId}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Borradores de ventas"
                autoComplete="off"
                required
              />
            </Field>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>Cancelar</DialogClose>
              <Button type="submit" disabled={!name.trim()}>
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { DataTableViews, type DataTableViewsProps }
