# Forms advanced (T63)

Objective: the advanced form controls and the validated-form pattern of S11 block «Formularios», published through the registry. Branch: `feat/forms-advanced` from `origin/main`, merged to `main` by rebase + push (coordinator procedure). Delivery: ask-on-risk, one commit per task. Test runner: vitest `unit` (lib helpers), vitest `storybook` (render, plays, axe light), Playwright visual (axe dark + screenshots, desktop and `mobile`).

## Specs

Quoted from the coordinator brief of the user's request (S11 of `design-system-bootstrap.md`).

- S1: «**Multiselect / tags input:** con búsqueda, chips que se quitan y teclado completo. Revisa primero si el `combobox` de shadcn con `multiple` lo resuelve; si sí, solo stories y ajustes.»
- S2: «**Number input** con stepper, y **input de moneda MXN** con formato al escribir (con `lib/format`).»
- S3: «**Teléfono MX:** formato y validación a 10 dígitos, con lada opcional.»
- S4: «**Subida de archivos con arrastrar y soltar:** pensado para importar CSV. Lleva lista de archivos, progreso, error por tipo o tamaño y una vista previa de las primeras filas del CSV. Reutiliza el `attachment` de shadcn si conviene.»
- S5: «**Selectores de fecha y hora:** date picker simple, time picker y fecha con hora (sobre nuestro `calendar` en español; ya tenemos el de rango).»
- S6: «**Código OTP** para 2FA (`input-otp` de shadcn; solo se publica si lo cambiamos).»
- S7: «**Indicador de fuerza de contraseña.**»
- S8: «**Wizard por pasos (stepper):** horizontal y vertical, con el paso activo, los completados y los que tienen error.»
- S9: «**Formularios con validación:** el patrón de react-hook-form + zod sobre nuestros `field` (Base UI), con errores en español y un bloque de ejemplo (por ejemplo, «Nueva conexión» o «Invitar a tu equipo»). Actualiza Brand/11 Patrones.»
- S10 (repo rules, every task): focus = the theme's 2px outline with 2px offset, never `focus-visible:border-ring`; text controls use `border-[color:var(--control-border,var(--input))]`; invalid keeps the value in the text color with a crisp red border; Base UI checkbox/radio/switch use `data-disabled:`; UI copy in Spanish (tú, «», sentence case), code/comments/commits in English; only files with `// registry: auradata (<qué cambió>)` publish; `/registry.json` is generated; every story passes axe light (`test:stories`) and dark with a screenshot (`test:visual:docker`); each new or changed screenshot is looked at, phone and desktop; stories that change on a phone carry the literal `mobile` tag.

## Tasks

| ID | Specs | Route | Status | Evidence |
| --- | --- | --- | --- | --- |
| F1 | S1, S10 | inline | done (this commit) | Base UI `multiple` solves it: `combobox` chips field takes the 3:1 control border, keeps it on focus (brand outline alone), crisp red when invalid, disabled fill; chip remove says «Quitar <chip>»; chip text truncates; chips input 16 px on phones. Stories Multiple, Multiple many (`mobile`), Multiple open, invalid, disabled, Multiple keyboard (type, Enter, Backspace, ArrowLeft, Delete), Tags (creatable «Crear «…»»). RED: axe `button-name` on the remove button, dark invalid border at 50 % → GREEN 14/14; new `play-helpers.ts` (border 3:1, destructive border, blur) |
| F2 | S2, S10 | inline | pending | `number-input` on Base UI `NumberField` (stepper), `currency-input` (MXN, as-you-type with `lib/format`), `lib/number-input` unit tests |
| F3 | S3, S10 | inline | pending | `phone-input` (MX, 10 digits, optional +52), `lib/phone` unit tests |
| F4 | S4, S10 | inline | pending | `file-dropzone` (drop/browse, list, progress, type/size errors) and CSV preview, `lib/csv` unit tests |
| F5 | S5, S10 | inline | pending | `date-picker` (date, date with time) and `time-picker` on our `calendar`, Spanish |
| F6 | S6, S10 | inline | pending | shadcn `input-otp`, adjusted to the brand → published |
| F7 | S7, S10 | inline | pending | `password-input` (show/hide) + strength meter, `lib/password-strength` unit tests |
| F8 | S8, S10 | inline | pending | `stepper` horizontal and vertical (current, complete, error) |
| F9 | S9, S10 | inline | pending | react-hook-form + zod on `field`, block «Invitar a tu equipo», wizard «Nueva conexión» story, Brand/11 Patrones |
| F10 | S10 | inline | pending | rebase, registry.json, generator tests, README, baselines, all checks, push to `main`, CI and Coolify |

## Log

- L1 (2026-11-22, user, via the coordinator thread): «vamos a hacer por favor todo eso … en chats separados», about the S11 list; this thread owns T63, Formularios avanzados (S1-S9 above).
- L2 (exploration): shadcn's `@shadcn` registry has no date picker, time picker, number field, stepper or dropzone; it has `input-otp` (lib `input-otp`; slots use `border-input` and `data-[active=true]:border-ring`, so it needs the brand rules → published) and `questionnaire` (one question per page, not a stepper). Our `combobox` already ships Base UI `multiple` with `ComboboxChips`/`ComboboxChip`/`ComboboxChipsInput`, but the chips box uses `border-input` and `focus-within:border-ring` and its remove button has no name → S1 is stories plus adjustments. Base UI 1.9 has `NumberField` (stepper buttons, `format`, `locale`) and `Meter`; NumberField formats on blur only, so the MXN input that formats while typing is our own on `input-group`. Versions: react-hook-form 7.92.0, zod 4.6.7, @hookform/resolvers 7.0.8, input-otp 1.5.0. Route: inline, sequential (shared package.json, lock, registry.json; the user prefers one thread over subagents).
- L3 (F1): While the list is open, Base UI's focus manager hides everything outside the field (`aria-hidden`), the `FieldLabel` too, so axe failed `label` on the chips input and `aria-input-field-name` on the multiselectable listbox; the single-value Open story passes only because its list renders outside the checked region. The multiple stories name the input and the list with `aria-labelledby` (a hidden label still names through it); the story comment says so for apps. Tags are a story pattern, not a component: a «Crear «…»» option appears for a word not on the list and Enter turns it into a tag. Screenshots (audit 390/1280, light|dark; Docker baselines 16 new) looked at: chips wrap on a phone, disabled chips fade with the field.
