# Data table pro and filter system (T61)

Objective: grow the published `data-table` into a pro table (toolbar, selection, column tools, rows, formatting, export, virtualization, URL state, saved views) and add a filter system usable outside the table, all opt-in.
Branch: `feat/data-table-pro` from `origin/main`, merged to `main` in three parts (A: DT1-DT3, B: DT4-DT7, C: DT8-DT13). Delivery: ask-on-risk, direct pushes to `main` as the coordinator authorized. Test runner: vitest (unit, stories with axe light), Playwright (visual + axe dark, `mobile` 390 px), `tsc -b`, eslint.

## Specs

Data table (`registry/src/components/ui/data-table.tsx`, TanStack Table v9):

- S1: «Toolbar con búsqueda, filtros, columnas, densidad y exportar.»
- S2: «Selección de filas con barra flotante de acciones masivas («3 seleccionados · Mover · Eliminar»).»
- S3: «Mostrar u ocultar columnas, fijarlas (pin), redimensionarlas y reordenarlas.»
- S4: «Filas expandibles con detalle, y edición en línea.»
- S5: «Fila de totales y formato condicional: celdas con mapa de calor y mini barras.» The heatmap cells use «la paleta secuencial y las escalas de estado» of T59, after T59 is on `main` (rebase first).
- S6: «Exportar a CSV y Excel.»
- S7: «Virtualización para miles de filas.»
- S8: «Estado (filtros, orden, página, columnas) en la URL, para poder compartir la vista.»
- S9: «Vistas guardadas.»
- S10: «Todo opcional y componible, sin romper el uso actual.» Every existing prop, story and play test keeps working unchanged.

Filter system, «reutilizable fuera de la tabla (por ejemplo en dashboards)»:

- S11: «Filtro por columna: popover con búsqueda, checkboxes y conteo por opción.»
- S12: «Filtro de rango numérico: slider más inputs.»
- S13: «Fechas, reutilizando `date-range-filter`.»
- S14: «Chips de filtros activos con «Limpiar todo».»
- S15: «Constructor de filtros avanzado con condiciones Y/O.»

Quality and repo rules (from the coordinator's brief):

- S16: tests first (RED → GREEN; play tests of selection, filters, sorting, export, URL); one commit per task of about 400 lines, Conventional Commits, no AI attribution.
- S17: every story passes axe light (`test:stories`) and dark with a screenshot (`test:visual:docker`); every new or changed screenshot is looked at before committing; «La tabla tiene que verse impecable en un teléfono de 390 px»: stories that change on a phone carry the literal `mobile` tag; the audit spec (`registry/.audit/`, git-excluded) checks the touched stories at 390 and 1280 px, light and dark.
- S18: UI copy in Spanish (tú, «», sentence case), numbers and dates through `lib/format` (es-MX); code, comments and commits in English; helpers as `registry:lib` in `src/lib`, hooks in `src/hooks`; only files with `// registry: auradata (<what changed>)` publish; `/registry.json` only from `npm run registry -w registry`. Standing decisions: theme focus outline (never `focus-visible:border-ring`), text controls on `--control-border`, `--accent` distinct from popovers, `data-disabled:` on Base UI checkbox/radio/switch.

## Tasks

| ID | Specs | Route | Status | Evidence |
| --- | --- | --- | --- | --- |
| DT1 | S2, S10 | inline | pending | Row selection: checkbox column (page and row, indeterminate), `getRowId`, controlled/uncontrolled selection, floating bulk bar «N seleccionados» with action slot and «Quitar selección» |
| DT2 | S1, S10 | inline | pending | Toolbar: slots for filters and actions, density (normal, compacta), export slot; the existing search and «Columnas» stay |
| DT3 | S3, S10 | inline | pending | Columns: pin left/right (sticky), resize (pointer and keyboard), reorder (column menu), visibility kept |
| DT4 | S11, S14, S16 | inline | pending | `faceted-filter` (standalone popover: search, checkboxes, counts) and `filter-chips` («Limpiar todo»); table wiring through column `meta` |
| DT5 | S12, S13 | inline | pending | `range-filter` (slider + inputs); dates through `date-range-filter`; table wiring (number and date ranges) |
| DT6 | S15 | inline | pending | `filter-builder` (Y/O groups) and a pure evaluator in `src/lib` |
| DT7 | S11-S15 | inline | pending | Merge part B prep: filters in a dashboard story, docs, README row |
| DT8 | S4 | inline | pending | Expandable rows with a detail panel; inline edit (text, number, select) with `onCellEdit` |
| DT9 | S6 | inline | pending | Export CSV and Excel (`src/lib`), visible or all rows, toolbar menu |
| DT10 | S7 | inline | pending | Virtualized body for thousands of rows |
| DT11 | S8 | inline | pending | URL state hook (filters, sort, page, columns) |
| DT12 | S9 | inline | pending | Saved views (save, apply, delete; storage injectable) |
| DT13 | S5 | inline | pending | Totals row and conditional formatting (heatmap on T59's sequential palette and status scales, mini bars); waits for T59 on `main` |

## Log

- L1 (2026-11-21, coordinator thread, the user's words): «La data table, creo que hay que agregarle muchas más cosas. Creo que a lo mejor tenemos que agregar por ahí componentes de filtros», and then: «vamos a hacer por favor todo eso … en chats separados». Brief: the data table and filter lists of S1-S15; «Todo opcional y componible, sin romper el uso actual»; heatmap on T59's palettes after rebasing on `main`; tasks of ~400 lines, one commit each; merge to `main` in parts (toolbar, selection and columns; then filters; then the rest).
- L2 (plan): TanStack Table 9.3.1 ships every feature needed (`rowSelectionFeature`, `columnPinningFeature`, `columnResizingFeature`, `columnOrderingFeature`, `rowExpandingFeature`, `columnFacetingFeature` with `createFacetedUniqueValues`/`createFacetedMinMaxValues`, `filterFn_arrIncludesSome`/`inNumberRange`/`inDateRange`). Current API (`columns`, `data`, `filterPlaceholder`, `emptyMessage`, `pageSize`, `pageSizeOptions`, `defaultColumnsOpen`, `loading`) stays; every new capability is a prop that defaults to today's behavior. Filters are standalone components (value + `onValueChange`, no TanStack import) so a dashboard can use them; the table only adapts its columns to them. Delegation: none: the user asked for chats, not subagents, because context gets lost.
