# Foundations v2 (T59)

Objective: data palettes, status color scales, compact density and print styles in `@auradata/tokens` and the `auradata-theme`, documented in the brand guide.
Branch: `feat/foundations-v2` from `origin/main`; merge to `main` once S1-S2 are green (T61 and T62 wait on them), then S3-S4 on the same branch. Delivery: push to `main` (coordinator's plan, L44 of `design-system-bootstrap.md`). Test runner: vitest (tokens, registry unit and stories), Playwright (visual, print).

## Specs

- S1 (data palettes): «una paleta secuencial (de un solo tono, para mapas de calor y celdas) y otra divergente (negativo, neutro y positivo), en claro y oscuro. Exponerlas como tokens y como variables del tema shadcn. Mantener la paleta categórica `chart-1..8`.»
- S2 (status scales): «success, warning, info y destructive en tonos 50–900, o los que hagan falta para tintes de fondo, bordes y texto. Las usarán los toasts de color, las celdas condicionales y los badges suaves. Validar contraste AA donde se use como texto. Ya existe un test de contraste en tokens.»
- S3 (compact density): «Densidad compacta para BI: un modo `data-density="compact"` (o equivalente) que reduzca la altura de controles, filas de tabla e items de menú sin copiar componentes, vía el tema y tokens. Hacer una story que compare normal contra compacto.»
- S4 (print): «Estilos de impresión para reportes, en el tema: `@media print` con fondos claros, sin sombras ni animaciones, sin elementos de navegación, saltos de página razonables y URL de los links.»
- S5 (docs): «Documentar todo en la guía de marca de Storybook: Brand/04 Color, Brand/07 y Brand/10.»
- S6 (delivery): «mergea a `main` en cuanto 1 y 2 estén listos y verdes, aunque 3 y 4 sigan después en la misma rama.» A token change products see carries a changeset; every story passes axe light and dark; new or changed screenshots are looked at before committing.

## Tasks

| ID | Specs | Route | Status | Evidence |
| --- | --- | --- | --- | --- |
| F1 | S1 | inline | pending | Sequential and diverging tokens, shadcn variables, Tailwind colors, `chart-palette` helpers |
| F2 | S2 | inline | pending | Status scales 50-900, light and dark, AA where used as text |
| F3 | S5 | inline | pending | Brand/04 (status scales) and Brand/10 (data palettes) |
| F4 | S6 | inline | pending | First merge to `main`: rebase, regenerate, all checks, push, CI and Coolify |
| F5 | S3, S5 | inline | pending | `data-density="compact"`, comparison story, Brand/07 |
| F6 | S4, S5 | inline | pending | `@media print` in the theme, print test, Brand/10 |
| F7 | S6 | inline | pending | Second merge to `main` |

## Log

- L1 (2026-11-21, user, via the coordinator): «vamos a hacer por favor todo eso. Hay que hacerlo en chats separados». This thread's part: foundations (S1-S5), merging S1-S2 first (S6).
- L2 (decisions, F1-F2): the method of the `dataviz` skill: sequential is one hue light to dark that flips its anchor in dark (the lowest step sits near the surface), diverging is two hues with a neutral gray midpoint and equal steps per arm. AuraData's status and brand colors are Tailwind's palettes (`success` = emerald-600, `warning` = amber-600, `info` = `primary` = blue-600, `error` = red-600), so the ramps come from those palettes, not new hues.
  - Sequential: Azul Aura, 9 steps. Light: blue-100 … blue-900; dark: blue-950 … blue-200. Text on a cell: steps 1-5 take `foreground`, 6-9 take `background` (≥ 4.75:1 in both themes).
  - Diverging: red (negative, 1-4), gray (5), blue (positive, 6-9), blue/red rather than red/green so it survives red-green color blindness. Light: red-800, red-600, red-400, red-200, #E5E5E5, blue-200, blue-400, blue-600, blue-800; dark: red-300, red-500, red-700, red-900, #2E2E38, blue-900, blue-700, blue-500, blue-300. Text: steps 3-7 take `foreground`, 1, 2, 8 and 9 take `background` (≥ 4.83:1).
  - Status scales 50-900: light = Tailwind's 50-900; dark inverts them so the same class works in both themes (50 is the faintest tint: 950 mixed 50 % with #111117, then 950, 900 … 200). Text: 700 on 50, 100 and every surface (≥ 4.51:1), 800 on 200; borders 200-300.
  - Names: tokens `--aura-color-sequential-N`, `--aura-color-diverging-N`, `--aura-color-{success,warning,info,error}-{50…900}`; shadcn `--sequential-N`, `--diverging-N`, `--{success,warning,info,destructive}-{50…900}`, Tailwind `bg-sequential-3`, `text-success-700`.
