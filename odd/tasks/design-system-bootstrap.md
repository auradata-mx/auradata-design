# AuraData design system

Objective: one private repo with the AuraData brand (tokens), a shadcn registry on Base UI and a Storybook catalog, adopted by every AuraData product.
Branch: main, then one branch per phase. Delivery: ask-on-risk. Test runner: vitest (tokens), `shadcn build` and `tsc -b` (registry), `storybook build`.

## Specs

- S1: A repo outside Superset, `/Volumes/Data/programming/personal/auradata-design`, a sibling of `superset/` and `auradata-mx/`.
- S2: `@auradata/tokens`: one source of the brand (colors light and dark, fonts, radii, shadows, motion, chart palette) built with Style Dictionary into CSS variables, a Tailwind 4 `@theme`, shadcn semantic variables, Infima (Docusaurus) variables and an antd theme. Values match the current `THEME_DEFAULT`/`THEME_DARK` of `superset/auradata_config.py` and the `@theme` of `auradata-mx/src/styles/global.css`.
- S3: A shadcn registry with the latest stack: shadcn CLI v4 with `--base base` (Base UI), Tailwind 4, themed by `@auradata/tokens`, served from a private GitHub repo ("Private GitHub Registries", shadcn changelog Aug 2026).
- S4: Storybook as the workshop and catalog of the registry components.
- S5: UI SDK (vercel-labs/ui) stays out while it is in beta.
- S6 (user, 2026-11-20): "hay que hacer un plan completito de todo lo que tenemos que hacer": the plan below covers publishing, completing the tokens, adopting them in each product, growing the registry, quality and brand docs.

## Tasks

| ID | Phase | Specs | Route | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| T1 | 0 Bootstrap | S1 | inline | done | repo created, `shadcn init -t vite -b base -p nova` |
| T2 | 0 Bootstrap | S2 | inline | done | RED (no build.mjs) → GREEN 6/6 vitest; commit afb1e1b |
| T3 | 0 Bootstrap | S3 | inline | done | `shadcn build` 5 items; fresh app installed theme + button, `--primary: #2563EB`, build OK |
| T4 | 0 Bootstrap | S4 | inline | done | `storybook build` OK, lint and `tsc -b` clean |
| T5 | 1 Publish | S3 | inline | done | Private repo `cristianruben-dev/auradata-design`, `origin` = `git@github-personal:cristianruben-dev/auradata-design.git`, `main` pushed |
| T6 | 1 Publish | S3 | inline | pending | Prove a private GitHub registry install from a fresh app (`components.json` `registries`, `GH_TOKEN`); decide whether `registry/public/r` must be committed |
| T7 | 1 Publish | S2 | inline | pending | Distribute `@auradata/tokens`: GitHub Packages (npm) or a git dependency; Changesets for versions and changelog |
| T8 | 1 Publish | S2-S4 | inline | pending | CI on GitHub Actions: `npm test`, `npm run build`, lint, `build-storybook`; registry and tokens outputs built in CI |
| T9 | 1 Publish | S4 | inline | pending | Host Storybook privately (decide: Chromatic, Vercel with protection, or none) |
| T10 | 2 Tokens | S2 | inline | done | RED 4 tests → GREEN 10/10 vitest; `npm run build` and lint clean |
| T11 | 2 Tokens | S2 | inline | done | `test/contrast.test.mjs`: RED 3 pairs → user chose fixes → GREEN 53/53 vitest; `npm run build` OK |
| T12 | 2 Tokens | S2 | inline | pending | Brand assets: logos (Continua, dark variant), icons and the "BI" `ProductTag`, from `superset-frontend/src/assets/images/auradata/` |
| T13 | 3 Adoption | S2 | inline | pending | auradata-mx: replace its hand-written `@theme` with `@auradata/tokens/tailwind.css`, rename `--color-accent`… to the token names, compare screenshots before/after |
| T14 | 3 Adoption | S2 | inline | pending | docs/site (Superset repo): import `infima.css`, drop its own brand variables |
| T15 | 3 Adoption | S2 | inline | pending | AuraData BI: `auradata_config.py` builds `THEME_DEFAULT`/`THEME_DARK` from a vendored `antd.json`, with a test that fails when it drifts from the package; brings `colorTextTertiary` #737373 → #6E6E6E (L9) |
| T16 | 4 Registry | S3 | inline | pending | Components for the first new app: dialog, dropdown-menu, select, tabs, table, tooltip, sonner (toast), sidebar, field/label/textarea/checkbox/switch, skeleton |
| T17 | 4 Registry | S3 | inline | pending | AuraData components: Logo + ProductTag, KPI card, chart (palette from tokens), empty state, page header |
| T18 | 4 Registry | S3 | inline | pending | Blocks: login, app shell (sidebar + top bar), settings page; shadcn AI Elements (Oct 2026) for chat UIs |
| T19 | 5 Quality | S4 | inline | pending | Storybook: a11y addon, interaction tests with the Vitest addon, run in CI |
| T20 | 5 Quality | S4 | inline | pending | Visual regression of stories (Chromatic or Playwright screenshots) |
| T21 | 5 Quality | S1 | inline | pending | Renovate/Dependabot; watch shadcn, Base UI and UI SDK (S5) releases |
| T22 | 6 Docs | S4 | inline | pending | Brand guide in Storybook: logo use, the 100° gradient only as a headline accent, voice (Spanish first, "tú", «»), how to add a component |

## Log

- L1 (2026-11-20, user): "¿Y cómo haríamos el kit? ¿Sería un nuevo proyecto? ¿Sería simplemente un proyecto de React?" … "me gustaría que checaras por favor en Chat CN porque ya lo bueno ya no es Radix, ya es base UI … hay que utilizar lo más actual posible." … "Ok, perfecto, entonces hacemos una carpeta fuera de este superset, ¿verdad?" … "si empecemos"
- L2: Verified shadcn 4.23.0 `init --base <base|radix|aria>`; Base UI default since July 2026. Versions: style-dictionary 5.8.0, storybook 10.6.8, @base-ui/react 1.9.0, tailwindcss 4.3.5.
- L3: Tokens build emits tokens.css, shadcn.css, shadcn-theme.json, tailwind.css, infima.css, antd.json. Registry items come from `registry/scripts/registry.mjs` (theme from tokens, one item per `src/components/ui/*.tsx`).
- L4: Open for T6: whether a private GitHub registry reads `registry.json` from the repo or needs the built `public/r` committed (ignored for now).
- L5 (2026-11-20, user): "podemos hacer que este chat se vaya como al proyecto de Aura Data Design … hay que hacer un plan completito de todo lo que tenemos que hacer". Registered the T3 Code project `auradata-design`; a thread cannot change its workspace, so work continues from a thread of that project.
- L6: The personal repos (superset, seseq-administration) live on `cristianruben-dev` (`github-personal` SSH host), while `gh` is logged in as `cristianruben-softoil`: T5 waits on which account owns the repo.
- L7 (2026-11-21, user): "pregúntame en qué cuenta de GitHub va el repo privado (T5)" … "Mientras tanto, avanza con lo que no depende de esas decisiones, en orden: T10, T11, T12 (tokens), luego T16 y T17 (registry). Una rama por fase a partir de `main`, un commit por tarea". Answer: `cristianruben-dev`. Created the private repo with that account's `gh` token (`GH_TOKEN=$(gh auth token --user cristianruben-dev)`, the active account stays `cristianruben-softoil`) and pushed `main` over `github-personal`.
- L8 (T10): Added `space` (4px grid), `font-size` (the antd scale: 12, 14, 16, 20, 24, 30, 38), `font-weight`, `line-height`, `z-index` (antd popups from 1000), `focus` (2px, offset 2px) and themed `focus-ring` (#181818 light, as auradata.mx; #F5F5F7 dark). shadcn gains `success`, `warning`, `info` and `destructive-foreground` with foregrounds that read AA on their fill (night on green and amber); the registry theme item maps them into Tailwind. `ring` now points at `focus-ring` instead of `primary`. antd gets `fontSize*`, `fontSizeHeading1-5`, `fontWeightStrong`, `lineHeight`, `zIndexPopupBase`. Tailwind `@theme` keeps its own spacing and type scale so auradata.mx does not shift.
- L9 (T11): The contrast test checks text, text-secondary, text-tertiary and link on bg-layout, bg-container, bg-elevated and fill-secondary, and each `*-foreground` on its fill, at 4.5:1 in light and dark. Status colors used as text are out: antd derives `colorSuccessText` and the like itself. RED on 3 pairs: light text-tertiary #737373 on #F5F5F5 (4.35:1), dark white on #3B82F6 (3.68:1). User (2026-11-21) chose "Texto oscuro en dark (Recommended)": text-tertiary #6E6E6E (4.68:1), dark `primary-foreground` night #0A0A0F (5.37:1); antd `colorPrimary` unchanged. AuraData BI still has #737373 until T15.
- Next: T10-T12 on `feat/tokens-phase-2`, then T16-T17 on a registry branch; T6-T9 after (T7 and T9 wait on user decisions).
