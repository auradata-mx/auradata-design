# AuraData brand rules for UI

Sources: the Marca pages of https://design.auradata.mx/docs/brand (voz, color, tokens, estados, layout, espaciado, iconografia, patrones). Spanish strings are quoted verbatim; use them as written.

## Voice and UI copy

Clear, close and precise: someone who knows the subject and explains it without detours.

| Rule | Yes | No |
| --- | --- | --- |
| Spanish first, from Mexico | Informes, gráficas, conexiones | Reports, charts |
| Use `tú` | Crea tu primer informe | Cree su primer informe |
| Latin quotes | ¿Eliminar «Ventas 2026»? | ¿Eliminar "Ventas 2026"? |
| Capital only at the start | Nuevo informe | Nuevo Informe |
| Brand name | AuraData, AuraData BI | Auradata, Aura Data |
| Verbs on buttons | Guardar cambios, Eliminar | Aceptar, OK |
| Mexican numbers | $1,284,500 · 12.4 % | $1.284.500 |

Messages:

- **Errors:** what happened and what to do. «No se pudo conectar con la base de datos. Revisa la conexión en Ajustes.»
- **Delete confirmations:** name the object and the consequence. «Se borran sus gráficas y filtros. No se puede deshacer.»
- **Empty states:** what is missing and the first step. «Aún no hay informes. Crea el primero desde un dataset.»
- **No blame, no exclamations:** «El correo no es válido», not «¡Escribiste mal tu correo!».
- **Field errors say how to fix:** «Escribe un correo completo, como ana@empresa.mx.», not «Correo inválido»; «El nombre ya existe. Prueba con otro.», not «¡Error! Nombre duplicado».
- **Product terms** (AuraData BI): espacio de trabajo, informe (not dashboard), página, gráfica, dataset, conexión.
- **Labels** name the datum, sentence case, no colon: «Nombre del informe». A placeholder is an example, never the label.

## Color

- Use colors by function, never by value: `primary`, `muted-foreground`, `destructive`… Every value comes from `@auradata/tokens`; never write a color in a component.
- Brand colors: Azul Aura (primary), Violeta Aura, Verde Aura, Noche (dark background).
- The gradient (`--aura-gradient-brand`, `bg-(image:--gradient-brand)`) is only an accent: the product tag, one headline word, or the thin `gradient-border` of the single recommended element. Never as a text-block background, never on buttons.
- Status colors: `success`, `warning`, `info`, `destructive`, each with a 50–900 scale for tints:

| Use | Class |
| --- | --- |
| Faint background | `bg-success-50` |
| Hover or selected background | `bg-success-100` |
| Border | `border-success-200`, or `-300` for more strength |
| Text and icon | `text-success-700` on 50, 100 and any surface; `text-success-800` on 200 |

- One class works in both themes (the scale inverts in dark). The base status color (`success`, `warning`…) as text does not always pass AA: use it on icons or as a fill with its `-foreground` on top.
- Status scales are for states, not data; charts use the data-viz palettes ([data-viz.md](data-viz.md)). Never paint data with status colors.
- Color is never the only signal: a status carries an icon or a word. All text passes WCAG AA (4.5:1) in light and dark; state icons and borders 3:1.

## States and accessibility

A component is not finished until it covers loading, empty, error, disabled, invalid and focus, by sight, keyboard and screen reader.

| State | Looks | Announced |
| --- | --- | --- |
| Focus | Visible ring on keyboard use (`focus-visible`), never removed | Browser focus |
| Disabled | Low opacity, flat, no pointer | Native `disabled` |
| Invalid | `destructive` border and text | `aria-invalid` and the `FieldError` text |
| Loading content | `Skeleton` with the content's shape | The region has `aria-busy` |
| Loading an action | Spinner in the button, disabled, text changes («Guardando…») | `aria-busy` on the button |
| Empty | `Empty`: what is missing and the first step | Plain text |
| Error | `EmptyError` with «Reintentar» | `role="alert"` |
| Confirmation | `Sonner` toast | The toast's live region |

Which notice:

| Message | Component |
| --- | --- |
| Result of an action («Informe publicado») | Toast (`toast.success`, `toast.error`); never holds the only thing to do |
| A long task («Exportando…») | `toastProgress` or `toast.promise`, ending in «Listo» with «Descargar» or the error with «Reintentar» |
| Affects the page | `Alert`, until the cause changes |
| Affects the whole app | `AnnouncementBanner` |
| Happened while away | `NotificationCenter` |
| Blocks the content | `EmptyError`, in place of the failed content |

- Keyboard: everything done with the mouse works with `Tab`, `Enter`, `Espacio`, arrows and `Esc`. Do not replace Base UI components with a `div` with `onClick`.
- Live regions: `role="alert"` for errors, `role="status"` or `aria-live="polite"` for results and counts.
- Names: every control has a visible name or `aria-label`; decorative icons have `aria-hidden`.

## Forms

- `FieldGroup` with one `Field` per field; `FieldSet` and `FieldLegend` to group. Help in `FieldDescription`, one line. Error: `aria-invalid` on the control, `data-invalid` on the `Field`, `FieldError` saying how to fix it.
- Validate on blur (format) and on submit (everything, focus the first error); never while typing. react-hook-form with zod and `mode: "onTouched"`.
- Base UI controls (`Select`, `NumberInput`, `Switch`, date pickers) go through `Controller` (`value` and `onValueChange`), not `register`; pass `ref` (`SelectTrigger`, `Switch`) or `inputRef` (`NumberInput`) so focus reaches the first error.
- Server errors on a field with `setError("name", …)`; others with `setError("root.server", …)` in an `Alert` above the form.
- Submitting: spinner and «Guardando…», disabled with `aria-busy`, fields stay visible; success is a toast («Cambios guardados»); failure stays in the form, not a toast.
- Buttons at the end, primary first, with a verb.

## Layout

- Mobile first, Tailwind breakpoints only (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). No custom breakpoints.
- Containers by content: `max-w-6xl` marketing sections, `max-w-3xl` settings and chat, `max-w-md` 404, `max-w-sm` sign-in; AuraData BI pages use the full width. Long text ≤ ~70 characters (`max-w-140`).
- An AuraData BI page, top to bottom: `AppShell` (sidebar collapsible to icons, 56 px top bar, content `p-6`) → `PageHeader` (one title, actions right) → `Filter` row (period first) and `FilterChips` → 3 to 4 `KpiCard` in a row (`gap-4`) → charts, two per row from `lg`, trend first → `DataTable` last.
- Between blocks `gap-6`; inside a row `gap-4`. Each block loads, fails or empties on its own: an `EmptyError` never takes down the page.

## Spacing, radius, elevation, motion

- 4 px grid, Tailwind steps: icon and text inside a control `space-1`–`space-2`; form fields and cards in a row `space-4`; page blocks `space-6`; marketing sections `space-16`, `py-24` from `md`.
- Never write a radius: `rounded-lg` (buttons, fields, menus), `rounded-xl` (cards, dialogs); `--radius` decides. Nested elements use concentric radii.
- Elevation by level with `shadow-(--elevation-*)`: flat (table rows, list items, charts in a card, `ghost` buttons), raised (`--elevation-raised` cards, `--elevation-control` buttons), overlay (`--elevation-overlay` menus, popovers), modal (`--elevation-modal`), sunken fields (`--elevation-sunken`). If everything floats, nothing floats. Do not copy shadcn's `Card`: the theme raises it.
- Motion explains a change; otherwise remove it. In the app nothing moves by itself (no icons, gradients or numbers). Every animation has `motion-reduce:animate-none` or `motion-reduce:transition-none`. Durations: `duration-100`–`duration-200` for controls and menus.
- Marketing: one effect per section; `Button` with `shimmer` once per page, never in menus, forms or tables.

## Icons

- Lucide (`lucide-react`), with the `Icon` suffix (`DownloadIcon`). Choose by action, not shape; one icon per action everywhere (`Trash2Icon` delete, `PencilIcon` edit).
- Sizes: `size-4` dense UI (buttons, menus, fields, tables, sidebar), `size-5` a standalone icon, `size-6` empty and error states. Inside a `Button` set no size.
- 2 px stroke, never changed. Color from text (`currentColor`, `text-foreground`, `text-muted-foreground`), never a hex. Status colors (`text-success`, `text-warning`, `text-destructive`) only on status icons, always with a word.
- Icon next to text: `aria-hidden`. Icon-only button: `aria-label` («Editar informe») and a `Tooltip` with the same text.
