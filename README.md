# AuraData design

The AuraData brand for every product, in one private repository.

| Part | What it is | Who uses it |
| --- | --- | --- |
| `packages/tokens` (`@auradata/tokens`, published as `@cristianruben-dev/auradata-tokens`) | The brand as data (colors light and dark, fonts, radii, shadows, motion, chart palette), built by Style Dictionary | Every product |
| `registry` | A shadcn registry: components on Base UI and Tailwind 4, themed by the tokens | New React apps, React islands of auradata.mx |
| `registry` (Storybook) | The workshop and catalog of the registry components | People building components |

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

They are a private package on GitHub Packages. GitHub only takes packages under the owner's scope, so the package is
`@cristianruben-dev/auradata-tokens`; products install it under the alias `@auradata/tokens`, so every import reads
`@auradata/tokens/...`.

```ini
# .npmrc of the product
@cristianruben-dev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
export GITHUB_TOKEN=$(gh auth token --user cristianruben-dev)   # or a classic token with read:packages
pnpm add @auradata/tokens@npm:@cristianruben-dev/auradata-tokens  # npm install works the same
```

In CI, `GITHUB_TOKEN` needs `read:packages` on this repository's package: a token of another repository's workflow only
reads it once the package grants that repository access (package settings, "Manage Actions access").

## Releasing the tokens

A change products will see needs a changeset: `npx changeset`, pick the bump (patch for a fix, minor for a new token,
major for a renamed or removed one) and write one line. The release workflow opens a "Version packages" pull request on
`main`; merging it publishes the version with its `CHANGELOG.md`.

## Commands

```bash
npm install
npm test                                # tokens tests
npm run build                           # tokens, registry app and registry items (/registry.json, registry/public/r)
npm run storybook -w registry           # catalog on http://localhost:6006
```

## The hosted Storybook

The catalog and brand guide are public at https://design.auradata.mx, deployed by Coolify from `storybook.Dockerfile`
(nginx, unprivileged, port 8080, health check on `/healthz`). The same site serves the registry items as JSON under
`/r/`: `npx shadcn add https://design.auradata.mx/r/kpi-card.json`. Try the image locally:

```bash
docker build -f storybook.Dockerfile -t auradata-storybook . && docker run --rm -p 6006:8080 auradata-storybook
```

## Changing the brand

Edit `packages/tokens/src/tokens` (`brand.json`, `light.json`, `dark.json`) and rebuild. Never write a color in a component
or a product: read it from a token.

## What the registry publishes

The theme and these items, listed in `/registry.json`:

| Kind | Items |
| --- | --- |
| AuraData components | `logo` (and `ProductTag`), `kpi-card` (optional sparkline, loading, no data), `page-header`, `data-table` (loading; opt-in row selection with bulk actions, toolbar slots, compact rows, header menus to pin, move and hide columns, resizable widths, filters per column (values with counts, number ranges, periods), an advanced Y/O filter and chips, row details, editing in place, CSV and Excel export, virtualization for thousands of rows, saved views, a totals row, heatmap cells and data bars, a `view` state to control or share), `data-table-selection-bar`, `data-table-views`; the filter system, also for dashboards: `faceted-filter`, `range-filter`, `filter-chips`, `filter-builder`, `date-range-filter`, `search-command` (loading), `workspace-switcher`, `theme-toggle`, `error-state`, `eyebrow`, `gradient-heading`, `aura-background`, `section-header`, `announcement-banner` (status tint, action, close; pinned at the top), `notification-center` (bell with the unread count; popover, a drawer from the bottom on a phone); app patterns: `segmented-control`, `master-detail`, `onboarding-checklist`, `tour`, `shortcuts-dialog` (opens with «?»), `user-menu` (account, workspace, theme, language, help), `empty-illustration`; AI: `insight-card`, `message-feedback`; effects (each still with reduced motion, decorative layers hidden from screen readers): `progressive-blur` (and `ScrollBlur`), `marquee`, `number-ticker`, `shimmer-button`, charts: `cartesian-chart` (`LineChart`, `AreaChart`, `BarChart` grouped, stacked or horizontal, `ComboChart` on one axis; legend that hides series, the previous period), `donut-chart` (donut and pie, «Otros» past six parts), `funnel-chart`, `heatmap` (`Heatmap` sequential or diverging, `CalendarHeatmap`), `gauge`, `sparkline`, `delta` (the arrow and signed change of the KPI card and the tooltip), `chart-card` (filter slot, «Exportar PNG», «Ver datos», loading, refreshing, empty, error); form controls: `number-input` (− and + on Base UI NumberField), `currency-input` (MXN, thousands grouped while typing), `phone-input` (Mexican, 10 digits, +52 optional), `date-picker` (and `DateTimePicker`), `time-picker` (24-hour list), `password-input` (show it, and a strength meter), `file-dropzone` (drop or choose, file list with progress and per-file errors), `csv-preview` (first rows of a CSV), `stepper` (horizontal or vertical, done, current, with errors) |
| Helpers | `format` (es-MX currency, compact, percent, number, date), `filter-conditions` (Y/O conditions and their evaluator), `table-export` (CSV and .xlsx), `chart-palette`, `chart-export` (a chart card as a PNG), `initials`, the `use-mobile`, `use-data-table-url-state` (a table's view in the URL) and `use-saved-views` hooks; for forms: `amount-input`, `phone`, `date-time`, `password-strength`, `file-upload` (size, type and size checks, CSV reader) |
| Blocks | `login` (error, pending), `app-shell` (the user menu; optional notification center and announcement banner), `settings` (field errors, saving), `not-found`, `dashboard` (period filter, KPIs, charts and a table in a grid that follows its own width), `chat` (ask your data on shadcn's `message`, `bubble`, `message-scroller`, `code-block`, `trace`: KPI, chart and finding answers, files, streamed answers, 👍/👎 with a reason, the datasets and reports cited, the SQL it ran, failed answer with retry); `connection-form` («Nueva conexión» on react-hook-form and zod: Spanish errors on blur and submit, server errors) |
| shadcn components AuraData changed | `button` (solid destructive, `loading`, filled and outline the same height), `badge` (`success`, `warning`, `info`; a long label ends in «…»), `alert` (`success`, `warning`, `info`; the action drops under the text when the alert is narrow), `switch`, `checkbox`, `radio-group`, `label`, `slider`, `toggle`, `toggle-group` (readable tracks, borders and disabled states), `input`, `textarea`, `native-select`, `select`, `input-group`, `field` (a soft border that turns Azul Aura on focus, the value stays in the text color when invalid), `sonner` (`richColors` tinted on the status tokens, `toastProgress` with a bar, icons on the title's first line), `command`, `combobox` (with `multiple`: chips that read 3:1 and say «Quitar <chip>»), `input-otp` (40 px boxes, the brand outline on the active one), `calendar` (Spanish for screen readers too, arrow keys between days), `dropdown-menu`, `context-menu`, `navigation-menu` (a highlighted row that reads in dark), and the rest of the catalog with Spanish copy, aligned close buttons and phone layouts: `accordion`, `alert-dialog`, `attachment`, `avatar`, `breadcrumb`, `button-group`, `carousel`, `chart`, `dialog`, `drawer` (responsive: from the bottom on a phone, from a side on a wide screen; there is no `sheet`), `empty`, `hover-card`, `item`, `kbd`, `pagination`, `progress`, `resizable`, `scroll-area`, `sidebar` (a drawer from the bottom on a phone), `tabs` (with counts), `tooltip`, and the chat primitives `bubble`, `message-scroller`, `code-block`, `trace` |

The rest (`card`, `popover`, `separator`, `skeleton`, `table`, `spinner`, `message`, `aspect-ratio`, `collapsible`) comes
straight from shadcn: the theme already gives it the brand. Storybook shows them all, so the brand can be seen on each one.

A file is published when it says so on a line of its own: `// registry: auradata (<why>)`.

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
npx shadcn add cristianruben-dev/auradata-design/auradata-theme  # the brand
npx shadcn add dialog select tabs                                 # straight from shadcn: the theme gives them the brand
npx shadcn add cristianruben-dev/auradata-design/kpi-card        # an AuraData component
npx shadcn add cristianruben-dev/auradata-design/logo            # also copies the Continua SVGs into public/brand/continua
```

Pin a release with `#<tag or commit>`: `cristianruben-dev/auradata-design/kpi-card#v0.1.0`.

## License

MIT for the code, the tokens and the docs (`LICENSE`). The AuraData name and logos are trademarks, not under MIT: see
`TRADEMARKS.md`. Outfit is under the SIL Open Font License 1.1.
