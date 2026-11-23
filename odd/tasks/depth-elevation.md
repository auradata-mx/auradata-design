# Depth and elevation (T66)

Objective: give AuraData components the layered depth of the Kepler kiosk app (top-edge highlight, layered contact and ambient shadows, subtle surface gradient) as an elevation scale in `@auradata/tokens`, applied to the registry components with interactive states, and show the before/after.
Branch: `feat/depth-elevation` from `main` (0e257fd). Delivery: work-unit commits on the branch; push, PR and merge are the user's call. Test runner: vitest (tokens, registry unit and stories), Playwright in Docker (visual).

## Specs

Requirements come from the proposal the user accepted on 2026-11-23 («a ver vamos a implementar todo ello y me meustras la difrenecia porfvaor»). The quoted lines are that proposal.

- S1 (elevation tokens): «Lo correcto es agregarlo como **tokens de elevación** (`elevation-1..4` con su sombra, highlight y superficie para light y dark) y que los componentes los consuman.» Dark follows Kepler: translucent lit surfaces and a 10–12 % white top hairline; light gets a very soft white-to-gray surface gradient, an 80 % white inset highlight and stronger contact and ambient shadows. Assumption: the existing `shadow-card` and `shadow-float` keep their values, because AuraData BI reads them through `antd.json` (a contract others consume); the new scale is added beside them.
- S2 (hierarchy): «Jerarquía de elevación, no profundidad en todo… Nivel 0 (plano): filas de tabla, items de lista y gráficos dentro de una card. Nivel 1: cards y botones. Nivel 2: dropdowns, popovers y tooltips. Nivel 3: modales y sheets, con la sombra grande y el overlay oscuro de Kepler.»
- S3 (interactive states): «En hover, el elemento sube: la sombra de ambiente crece y se mueve 1px hacia arriba. En active, se hunde: el highlight se convierte en una sombra `inset` y baja 1px… En disabled, pierde la profundidad y queda plano.» Inputs read as sunken («El input hundido con un `inset` interno»). The primary button keeps its shadow subtle: «la dejaría solo en el primario y en estado normal, y la quitaría en hover o disabled» applies to any colored glow; this implementation uses neutral shadows only.
- S4 (focus ring): «Focus ring que respete la profundidad… un anillo separado por un hueco del color de fondo». Finding: the theme already draws the focus as a 2px outline 2px away from the element (`brand.json` `focus`, `build.mjs` `focusCss`), which is that gap ring; S4 is kept as a check that the new shadows do not cover or replace it.
- S5 (accessibility): «Con `prefers-reduced-motion`, sin animaciones de elevación. Con `forced-colors`, se mantienen los bordes, porque ahí las sombras desaparecen.»
- S6 (grain): «Textura de grano en dark: ruido al 2–3 % sobre el fondo… lo dejaría **opcional**». Opt-in, never applied by default.
- S7 (show the difference): «me muestras la diferencia». A before/after of the same components in light and dark, shown to the user; the brand guide documents the scale. A token change carries a changeset; every story passes axe light and dark; changed screenshots are looked at before committing.

## Tasks

| ID | Specs | Route | Status | Evidence |
| --- | --- | --- | --- | --- |
| D1 | S1, S5, S6 | inline | done (this commit) | RED: tokens 3 failing (scale, shadcn mapping, forced colors) → GREEN tokens 146/146. `shadow-card`/`float` unchanged (antd) |
| D2 | S2, S3, S4, S5 | inline | done (this commit) | Story AuraData/Depth: RED with the old button (Levels, Hover) → GREEN; tokens 147/147, unit 216/216, stories 491/491 (axe light and dark), lint, typecheck. Level 1 buttons (`shadow-(--elevation-control)`, hover lift, pressed inset, disabled flat), tabs/segments; sunken fields; level 2 menus, selects, popups, chart tooltips, tour, selection bar; level 3 dialog, alert dialog, drawer; blocks on `--elevation-*` |
| D3 | S7 (docs, story) | inline | pending | |
| D4 | S7 (verification, before/after) | inline; visual suite in a per-action worker | pending | |

Route evidence: D2 depends on D1's tokens and D3 on D2, so no unit is independent; no Writer trigger reason, the parent writes inline.

## Log

- L1 (2026-11-23, user): «a ver vamos a implementar todo ello y me meustras la difrenecia porfvaor»
- L2: Map (explorer): shadows exist only as `--aura-shadow-*` vars; blocks use `shadow-(--aura-shadow-card)`, core components use stock `shadow-md`/`shadow-lg`/`ring-1`. `card`, `popover`, `sheet` and `sidebar` are stock (no `// registry: auradata` marker). About 1,160 Linux baselines; update in Docker. Forecast: about 450 authored lines plus regenerated baselines.
- L3: D1 done (b274650).
- L4: `cn` (tailwind-merge) keeps both `shadow-raised` and a later `shadow-none` (unknown names), and Tailwind sorts `shadow-none` before `shadow-raised`, so overrides would lose. The arbitrary-variable form `shadow-(--elevation-raised)` merges with `shadow-none` (checked), so components use it and the theme exposes no `shadow-*` utilities.
- L5: `card`, `popover`, `sheet` are stock and asserted unpublished (`registry.test.mjs:21`); edits there would reach Storybook only. The theme raises `[data-slot="card"]` from the base layer through `--tw-shadow` (a `shadow-none` still wins); popover and sheet keep their stock shadow. Story `:hover` can't be triggered by `userEvent.hover` (synthetic events), so the Hover story checks the generated `:hover` rules.
- Next: D3.
