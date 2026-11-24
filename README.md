# AuraData design

The AuraData brand for every product, in one repository.

| Part | What it is | Who uses it |
| --- | --- | --- |
| `packages/tokens` (`@auradata/tokens` on npm) | The brand as data (colors light and dark, fonts, radii, shadows, motion, chart palette), built by Style Dictionary | Every product |
| `registry` | A shadcn registry: components on Base UI and Tailwind 4, themed by the tokens | New React apps, React islands of auradata.mx |
| `registry` (Storybook) | The workbench: every state of every component and block, with the visual and accessibility tests. The brand guide and usage live in `docs` | People building components |
| `docs` | The public docs site (Fumadocs on Next.js, a static export): install, brand guide, components, blocks | People adopting AuraData |

## What each product reads

| Product | File |
| --- | --- |
| Any CSS | `@auradata/tokens/tokens.css` (`--aura-*`, light on `:root`, dark on `.dark`): colors, `space-*`, `font-size-*`, `font-weight-*`, `line-height-*`, `z-index-*`, `focus-*`, the elevation scale `shadow-{raised,control,pressed,sunken,overlay,modal}` and `surface-{raised,filled,grain}` |
| shadcn apps | `shadcn.css`, or the `auradata-theme` item of the registry; adds `success`, `warning`, `info` and their `-foreground`, a 50-900 scale of each status (`success-50` … `destructive-900`: tint 50, border 200, text 700), the data palettes `sequential-1..9` (one hue, magnitude) and `diverging-1..9` (red, neutral 5, blue) beside the categorical `chart-1..8`, the focus halo on every component (a 1px Azul Aura edge inside a soft 3px glow; a focused field turns its own border blue; red when invalid), `field-border`, the soft edge of fields, and `control-border`, the 3:1 edge of unchecked checkboxes and radios, and depth: `--elevation-*` and `--surface-*` (used as `shadow-(--elevation-raised)`), the stock `Card` raised from the theme, an outline on elevated surfaces in forced colors |
| Tailwind 4 sites | `tailwind.css` (`@theme` with `--color-aura-*`, fonts, radii, ease) |
| Docusaurus | `infima.css` (light and `[data-theme='dark']`) |
| AuraData BI (antd) | `antd.json` (`light` and `dark`, the shape of `THEME_DEFAULT` and `THEME_DARK`) |
| ECharts (AuraData BI charts) | `echarts.json` (`light` and `dark` ECharts themes); register with `echarts.registerTheme('auradata', theme.light)` |
| Logos and icons | `assets/continua/`: `{horizontal,vertical}-{color,negro,blanco,texto-degradado}.svg`, `isotipo-{color,negro,blanco}.svg`, `favicon-{16,32,48,180,192,512}.png`. `blanco` goes on dark backgrounds |

The brand gradient, `--aura-gradient-brand`, is only a headline accent: the product tag ("BI") or one word of a title.

The logo SVGs embed the mark as a PNG and draw the name with Outfit outlines: fine for screens, not a vector master for print.

## Installing the tokens

A public package on npm, under the `auradata` organization. No token is needed:

```bash
npm install @auradata/tokens
```

## Releasing the tokens

A change products will see needs a changeset: `npx changeset`, pick the bump (patch for a fix, minor for a new token,
major for a renamed or removed one) and write one line. The release workflow opens a "Version packages" pull request on
`main`; merging it publishes the version to npm with its `CHANGELOG.md`. The workflow publishes through npm trusted
publishing: no npm token is stored, the package trusts `release.yml` of this repository (npmjs.com, package settings).

## Commands

```bash
npm install
npm test                                # tokens tests
npm run build                           # tokens, registry app, registry items (/registry.json, registry/public/r) and docs
npm run storybook -w registry           # catalog on http://localhost:6006
npm run dev -w docs                     # docs site on http://localhost:3000
npm run build -w docs                   # docs as static files in docs/out
```

The docs render the registry components themselves: in `docs`, `@/` resolves to `registry/src` (the docs' own code uses
`@docs/`), and the docs stylesheet imports `registry/src/index.css`, so the site wears the same tokens.

## The hosted site

https://design.auradata.mx is one image, deployed by Coolify from `storybook.Dockerfile` (nginx, unprivileged, port 8080,
health check on `/healthz`; nginx config in `registry/deploy/nginx.conf`):

| Path | What it serves |
| --- | --- |
| `/` | The docs site (`docs/out`) |
| `/storybook/` | The Storybook workbench (`registry/storybook-static`) |
| `/r/` | The registry items as JSON: `npx shadcn add https://design.auradata.mx/r/filter.json` |

Links from before the docs site (`/?path=/story/...`, `/iframe.html?id=...`) redirect under `/storybook/` with the same
query. Try the image locally:

```bash
docker build -f storybook.Dockerfile -t auradata-site . && docker run --rm -p 8080:8080 auradata-site
```

## Changing the brand

Edit `packages/tokens/src/tokens` (`brand.json`, `light.json`, `dark.json`) and rebuild. Never write a color in a component
or a product: read it from a token.

## What the registry publishes

The theme and these items, listed in `/registry.json`:

| Kind | Items |
| --- | --- |
| AuraData components | `page-header`, `data-table` (loading; opt-in row selection with bulk actions, toolbar slots, compact rows, header menus to pin, move and hide columns, resizable widths, filters per column (values with counts, number ranges, periods), an advanced Y/O filter and chips, row details, editing in place, CSV and Excel export, virtualization for thousands of rows, saved views, a totals row, heatmap cells and data bars, a `view` state to control or share) (its selection bar and saved views menu are internal parts); the filter system, also for dashboards: `filter` (`type` `select` for values, `range` for a number range, `date` for a period), `filter-chips`, `filter-builder`; `theme-toggle`, `copy-button`, `announcement-banner` (status tint, action, close; pinned at the top); app patterns: `tour`; AI: `message-feedback`; effects (each still with reduced motion, decorative layers hidden from screen readers): `progressive-blur` (and `ScrollBlur`), `marquee`, `number-ticker`, `aura-background`, `eyebrow`, `gradient-heading`; charts: `cartesian-chart` (`LineChart`, `AreaChart`, `BarChart` grouped, stacked or horizontal, `ComboChart` on one axis; legend that hides series, the previous period), `donut-chart` (donut and pie, «Otros» past six parts), `funnel-chart`, `heatmap` (`Heatmap` sequential or diverging, `CalendarHeatmap`), `gauge`, `sparkline`, `delta` (the arrow and signed change of the KPI card and the tooltip); form controls: `number-input` (− and + on Base UI NumberField), `date-picker` (and `DateTimePicker`), `time-picker` (24-hour list), `password-input` (show it, and a strength meter), `file-dropzone` (drop or choose, file list with progress and per-file errors), `stepper` (horizontal or vertical, done, current, with errors) |
| Helpers | `format` (es-MX currency, compact, percent, number, date), `filter-conditions` (Y/O conditions and their evaluator), `table-export` (CSV and .xlsx), `chart-palette`, `chart-export` (a chart card as a PNG), `initials`, the `use-mobile`, `use-data-table-url-state` (a table's view in the URL) and `use-saved-views` hooks; for forms: `amount-input`, `phone`, `date-time`, `password-strength`, `file-upload` (size, type and size checks, CSV reader) |
| Blocks | `login` (error, pending), `app-shell` (parts: the user menu with its workspace switcher, the notification center, the shortcuts dialog with `shortcuts`; optional announcement banner), `not-found`, `dashboard` (parts: the KPI card and the chart card with «Exportar PNG», «Ver datos» and its states; period filter, charts and a table in a grid that follows its own width), `chat` (ask your data on shadcn's `message`, `bubble`, `message-scroller`, `code-block`, `trace`: KPI, chart and finding answers (parts: the KPI card and the insight card), files, streamed answers, 👍/👎 with a reason, the datasets and reports cited, the SQL it ran, failed answer with retry) |
| shadcn components AuraData changed | `button` (solid destructive, `loading`, `shimmer` for the one main call to action, filled and outline the same height), `badge` (`success`, `warning`, `info`; a long label ends in «…»), `alert` (`success`, `warning`, `info`; the action drops under the text when the alert is narrow), `switch`, `checkbox`, `radio-group`, `label`, `slider`, `toggle`, `toggle-group` (readable tracks, borders and disabled states), `input`, `textarea`, `native-select`, `select`, `input-group`, `field` (a soft border that turns Azul Aura on focus, the value stays in the text color when invalid), `sonner` (`richColors` tinted on the status tokens, `toastProgress` with a bar, icons on the title's first line), `command` (and `CommandSearch`, the ⌘K search of an app), `combobox` (with `multiple`: chips that read 3:1 and say «Quitar <chip>»), `input-otp` (40 px boxes, the brand outline on the active one), `calendar` (Spanish for screen readers too, arrow keys between days), `dropdown-menu`, `context-menu`, `navigation-menu` (a highlighted row that reads in dark), and the rest of the catalog with Spanish copy, aligned close buttons and phone layouts: `accordion`, `alert-dialog`, `attachment`, `avatar`, `breadcrumb`, `button-group`, `carousel`, `chart`, `dialog`, `drawer` (responsive: from the bottom on a phone, from a side on a wide screen; there is no `sheet`), `empty` (and `EmptyError`, with a retry and the technical detail), `hover-card`, `item`, `kbd`, `pagination`, `progress`, `resizable`, `scroll-area`, `sidebar` (a drawer from the bottom on a phone), `tabs` (with counts), `tooltip`, and the chat primitives `bubble`, `message-scroller`, `code-block`, `trace` |

The rest (`card`, `popover`, `separator`, `skeleton`, `table`, `spinner`, `message`, `collapsible`) comes
straight from shadcn: the theme already gives it the brand. Storybook shows them all, so the brand can be seen on each one.

A file is published when it says so on a line of its own: `// registry: auradata (<why>)`. A file without that line that another file imports
relatively (`./kpi-card`) is an internal part: it ships inside every item that imports it and lands beside it.

## Adding a component

```bash
cd registry
npx shadcn add <component>              # from shadcn, on Base UI: a story shows it with the brand
npm run registry                        # regenerates /registry.json and registry/public/r
```

Add a story in `registry/src/stories/`. To publish a new or changed component, add the `// registry: auradata` line:
`scripts/registry.mjs` lists those files of `src/components/ui`, `src/hooks` and `src/lib` with the packages and registry
items they import, so `registry.json` is never edited by hand.

## Checks

```bash
npm test                                # tokens: values, contrast, assets
npm run test:unit -w registry           # the registry generator and the helpers of src/lib
npm run test:stories -w registry        # every story renders and passes axe (light)
npm run build-storybook -w registry && npm run test:visual:docker -w registry   # screenshots and axe (dark), as CI
```

Screenshot baselines live in `registry/tests/__screenshots__` and are Linux only: update them with
`npm run test:visual:docker -w registry -- --update-snapshots`, then look at the changed images before committing.

## Installing from an app

The repository is the registry: the shadcn CLI reads the `registry.json` at its root straight from GitHub. The
repository is public, so no token is needed.

```bash
npx shadcn init -b base                                          # Base UI, as this registry
npx shadcn add auradata-mx/auradata-design/auradata-theme  # the brand
npx shadcn add dialog select tabs                                 # straight from shadcn: the theme gives them the brand
npx shadcn add auradata-mx/auradata-design/filter          # an AuraData component
npx shadcn add auradata-mx/auradata-design/logo            # also copies the Continua SVGs into public/brand/continua
```

Pin a release with `#<tag or commit>`: `auradata-mx/auradata-design/filter#v0.1.0`.

## For AI agents

The docs section `/docs/ia` covers the four pieces; in short:

```bash
npx shadcn registry add "@auradata=https://design.auradata.mx/r/{name}.json"  # items by name: @auradata/filter
npx shadcn mcp init --client claude      # the shadcn MCP server searches and installs @auradata items
npx skills add auradata-mx/auradata-design   # the skill in skills/auradata: which item to use and the brand rules
```

The whole docs site is also Markdown at `/llms.txt` and `/llms-full.txt`. `npm test -w docs` checks that the skill's
catalog (`skills/auradata/references/catalog.md`) lists exactly the items of `registry.json`.

## License

MIT for the code, the tokens and the docs (`LICENSE`). The AuraData name and logos are trademarks, not under MIT: see
`TRADEMARKS.md`. Outfit is under the SIL Open Font License 1.1.
