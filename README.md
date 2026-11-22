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
| Any CSS | `@auradata/tokens/tokens.css` (`--aura-*`, light on `:root`, dark on `.dark`): colors, `space-*`, `font-size-*`, `font-weight-*`, `line-height-*`, `z-index-*`, `focus-*` |
| shadcn apps | `shadcn.css`, or the `auradata-theme` item of the registry; adds `success`, `warning`, `info` and their `-foreground`, a 50-900 scale of each status (`success-50` … `destructive-900`: tint 50, border 200, text 700), the data palettes `sequential-1..9` (one hue, magnitude) and `diverging-1..9` (red, neutral 5, blue) beside the categorical `chart-1..8`, the brand focus ring (2px of `--ring`, 2px away) on every component, and `control-border`, the 3:1 edge of unchecked checkboxes and radios |
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

The catalog and brand guide live at https://design.auradata.mx, deployed by Coolify from `storybook.Dockerfile`. They are
private: open the URL, type the team password on the AuraData sign-in page and press «Entrar». The session lasts 30 days
in that browser. Ask whoever administers AuraData for the password; it is never written in the repository.

The image runs `registry/server/index.mjs` (Node, no dependencies): it serves the built Storybook only with a signed
session cookie, and without it only the sign-in page (`registry/login`), `/robots.txt` and `/healthz`. Ten wrong
passwords from one address (Cloudflare's `cf-connecting-ip`, else the last `x-forwarded-for` entry) lock it out for 15
minutes, and 100 across all addresses lock the sign-in for everyone for 15 minutes. The container runs as the `node` user
on port 8080, so Coolify's exposed port is 8080. Set two variables in Coolify:

| Variable | What it is |
| --- | --- |
| `SITE_PASSWORD` | The team password. Changing it does not sign anyone out. |
| `SESSION_SECRET` | 32 or more random characters (`openssl rand -base64 48`) that sign the cookie. Changing it signs everyone out. |

To revoke access after rotating the password, change `SESSION_SECRET` too. Try it locally:

```bash
npm run build-storybook -w registry && npm run build:login -w registry
SITE_PASSWORD=<a test password> SESSION_SECRET=$(openssl rand -base64 48) PORT=6006 npm run serve:storybook -w registry
```

## Changing the brand

Edit `packages/tokens/src/tokens` (`brand.json`, `light.json`, `dark.json`) and rebuild. Never write a color in a component
or a product: read it from a token.

## What the registry publishes

The theme and these items, listed in `/registry.json`:

| Kind | Items |
| --- | --- |
| AuraData components | `logo` (and `ProductTag`), `kpi-card` (optional sparkline, loading, no data), `page-header`, `data-table` (loading), `date-range-filter`, `search-command` (loading), `workspace-switcher`, `theme-toggle`, `error-state`, `eyebrow`, `gradient-heading`, `aura-background`, `section-header` |
| Helpers | `format` (es-MX currency, compact, percent, number, date), `chart-palette`, `initials`, the `use-mobile` hook |
| Blocks | `login` (error, pending), `app-shell`, `settings` (field errors, saving), `not-found`, `chat` (ask your data on shadcn's `message`, `bubble`, `message-scroller`, `code-block`, `trace`: KPI and chart answers, the SQL it ran, failed answer with retry); marketing: `hero`, `cta-band`, `benefits-grid`, `faq`, `site-footer` |
| shadcn components AuraData changed | `button` (solid destructive, `loading`, filled and outline the same height), `badge` (`success`, `warning`, `info`; a long label ends in «…»), `alert` (`success`, `warning`, `info`; the action drops under the text when the alert is narrow), `switch`, `checkbox`, `radio-group`, `label`, `slider`, `toggle`, `toggle-group` (readable tracks, borders and disabled states), `input`, `textarea`, `native-select`, `select`, `input-group`, `field` (a 3:1 border, the value stays in the text color when invalid), `command`, `combobox`, `dropdown-menu`, `context-menu`, `navigation-menu` (a highlighted row that reads in dark), and the rest of the catalog with Spanish copy, aligned close buttons and phone layouts: `accordion`, `alert-dialog`, `attachment`, `avatar`, `breadcrumb`, `button-group`, `calendar`, `carousel`, `chart`, `dialog`, `drawer`, `empty`, `hover-card`, `item`, `kbd`, `pagination`, `progress`, `resizable`, `scroll-area`, `sheet`, `sidebar`, `sonner`, `tabs`, `tooltip`, and the chat primitives `bubble`, `message-scroller`, `code-block`, `trace` |

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
npm run test:unit -w registry           # the registry generator and the sign-in server
npm run test:stories -w registry        # every story renders and passes axe (light)
npm run build-storybook -w registry && npm run test:visual:docker -w registry   # screenshots and axe (dark), as CI
```

Screenshot baselines live in `registry/tests/__screenshots__` and are Linux only: update them with
`npm run test:visual:docker -w registry -- --update-snapshots`, then look at the changed images before committing.

## Installing from an app

The repository is the registry: the shadcn CLI reads the `registry.json` at its root straight from GitHub. It is
private, so the CLI needs read access to `cristianruben-dev/auradata-design`:

- locally, `gh` logged in with an account that can read it. When the active `gh` account is another one, pass its token:
  `GH_TOKEN=$(gh auth token --user cristianruben-dev) npx shadcn add ...`;
- in CI, `GH_TOKEN` with a fine-grained token of this repository, **Contents: Read-only**.

```bash
npx shadcn init -b base                                          # Base UI, as this registry
npx shadcn add cristianruben-dev/auradata-design/auradata-theme  # the brand
npx shadcn add dialog select tabs                                 # straight from shadcn: the theme gives them the brand
npx shadcn add cristianruben-dev/auradata-design/kpi-card        # an AuraData component
npx shadcn add cristianruben-dev/auradata-design/logo            # also copies the Continua SVGs into public/brand/continua
```

Pin a release with `#<tag or commit>`: `cristianruben-dev/auradata-design/kpi-card#v0.1.0`.
