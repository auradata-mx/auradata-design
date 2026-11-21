# AuraData design system bootstrap

Objective: one private repo with the AuraData brand tokens, a shadcn registry on Base UI and a Storybook catalog.
Branch: main (new repo). Delivery: ask-on-risk. Test runner: vitest (tokens), `shadcn build` and `tsc` (registry), `storybook build`.

## Specs

- S1: A repo outside Superset, `/Volumes/Data/programming/personal/auradata-design`, a sibling of `superset/` and `auradata-mx/`.
- S2: `@auradata/tokens`: one source of the brand (colors light and dark, fonts, radii, shadows, motion, chart palette) built with Style Dictionary into CSS variables, a Tailwind 4 `@theme`, shadcn semantic variables, Infima (Docusaurus) variables and an antd theme. Values match the current `THEME_DEFAULT`/`THEME_DARK` of `superset/auradata_config.py` and the `@theme` of `auradata-mx/src/styles/global.css`.
- S3: A shadcn registry with the latest stack: shadcn CLI v4 with `--base base` (Base UI), Tailwind 4, themed by `@auradata/tokens`, served from a private GitHub repo ("Private GitHub Registries", shadcn changelog Aug 2026).
- S4: Storybook as the workshop and catalog of the registry components.
- S5: UI SDK (vercel-labs/ui) stays out while it is in beta.

## Tasks

| ID | Specs | Route | Status | Evidence |
| --- | --- | --- | --- | --- |
| T1 | S1 | inline | done | repo created, `shadcn init -t vite -b base -p nova` |
| T2 | S2 | inline | done | RED (no build.mjs) → GREEN 6/6 vitest; values copied from auradata_config.py |
| T3 | S3 | inline | done | `shadcn build` 5 items; fresh `shadcn init -b base` app installed theme + button, `--primary: #2563EB`, build OK |
| T4 | S4 | inline | done | `storybook build` OK, lint and `tsc -b` clean |
| T5 | S3 | human | pending | create the private GitHub repo and push (needs the user's go-ahead) |

## Log

- L1 (2026-11-20, user): "¿Y cómo haríamos el kit? ¿Sería un nuevo proyecto? ¿Sería simplemente un proyecto de React?" … "me gustaría que checaras por favor en Chat CN porque ya lo bueno ya no es Radix, ya es base UI … hay que utilizar lo más actual posible." … "Ok, perfecto, entonces hacemos una carpeta fuera de este superset, ¿verdad?" … "si empecemos"
- L2: Verified shadcn 4.23.0 `init --base <base|radix|aria>`; Base UI default since July 2026. Versions: style-dictionary 5.8.0, storybook 10.6.8, @base-ui/react 1.9.0, tailwindcss 4.3.5.
- L3: Tokens build emits tokens.css, shadcn.css, shadcn-theme.json, tailwind.css, infima.css, antd.json. Registry items come from `registry/scripts/registry.mjs` (theme from tokens, one item per `src/components/ui/*.tsx`).
- L4: Open for T5: check whether a private GitHub registry reads `registry.json` from the repo or needs the built `public/r` committed (ignored for now).
- Next: T5 (GitHub repo, user's go-ahead); then adopt the tokens in auradata-mx, docs/site and auradata_config.py, one product at a time.
