# AuraData design

The AuraData brand for every product, in one private repository.

| Part | What it is | Who uses it |
| --- | --- | --- |
| `packages/tokens` (`@auradata/tokens`) | The brand as data (colors light and dark, fonts, radii, shadows, motion, chart palette), built by Style Dictionary | Every product |
| `registry` | A shadcn registry: components on Base UI and Tailwind 4, themed by the tokens | New React apps, React islands of auradata.mx |
| `registry` (Storybook) | The workshop and catalog of the registry components | People building components |

## What each product reads

| Product | File |
| --- | --- |
| Any CSS | `@auradata/tokens/tokens.css` (`--aura-*`, light on `:root`, dark on `.dark`): colors, `space-*`, `font-size-*`, `font-weight-*`, `line-height-*`, `z-index-*`, `focus-*` |
| shadcn apps | `shadcn.css`, or the `auradata-theme` item of the registry; adds `success`, `warning`, `info` and their `-foreground` |
| Tailwind 4 sites | `tailwind.css` (`@theme` with `--color-aura-*`, fonts, radii, ease) |
| Docusaurus | `infima.css` (light and `[data-theme='dark']`) |
| AuraData BI (antd) | `antd.json` (`light` and `dark`, the shape of `THEME_DEFAULT` and `THEME_DARK`) |
| Logos and icons | `assets/continua/`: `{horizontal,vertical}-{color,negro,blanco,texto-degradado}.svg`, `isotipo-{color,negro,blanco}.svg`, `favicon-{16,32,48,180,192,512}.png`. `blanco` goes on dark backgrounds |

The brand gradient, `--aura-gradient-brand`, is only a headline accent: the product tag ("BI") or one word of a title.

The logo SVGs embed the mark as a PNG and draw the name with Outfit outlines: fine for screens, not a vector master for print.

## Commands

```bash
npm install
npm test                                # tokens tests
npm run build                           # tokens, registry app and registry items (registry/public/r)
npm run storybook -w registry           # catalog on http://localhost:6006
```

## Changing the brand

Edit `packages/tokens/src/tokens` (`brand.json`, `light.json`, `dark.json`) and rebuild. Never write a color in a component
or a product: read it from a token.

## Adding a component

```bash
cd registry
npx shadcn add <component>              # from shadcn, on Base UI
npm run registry                        # regenerates registry.json and public/r
```

Add a story in `registry/src/stories/`. `scripts/registry.mjs` lists every file of `src/components/ui` and `src/hooks` with
the packages and registry items it imports, so `registry.json` is never edited by hand.

## Installing from an app

Once the repository is on GitHub (private), add the registry to the app's `components.json` and install:

```bash
npx shadcn add @auradata/auradata-theme @auradata/button
npx shadcn add @auradata/logo           # also copies the Continua SVGs into public/brand/continua
```

The shadcn CLI reads private GitHub registries with `gh` or `GITHUB_TOKEN`.
