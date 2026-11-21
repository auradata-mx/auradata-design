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
| Any CSS | `@auradata/tokens/tokens.css` (`--aura-*`, light on `:root`, dark on `.dark`) |
| shadcn apps | `shadcn.css`, or the `auradata-theme` item of the registry |
| Tailwind 4 sites | `tailwind.css` (`@theme` with `--color-aura-*`, fonts, radii, ease) |
| Docusaurus | `infima.css` (light and `[data-theme='dark']`) |
| AuraData BI (antd) | `antd.json` (`light` and `dark`, the shape of `THEME_DEFAULT` and `THEME_DARK`) |

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

Add a story in `registry/src/stories/`. `scripts/registry.mjs` lists every file of `src/components/ui` with the packages
it imports, so `registry.json` is never edited by hand.

## Installing from an app

Once the repository is on GitHub (private), add the registry to the app's `components.json` and install:

```bash
npx shadcn add @auradata/auradata-theme @auradata/button
```

The shadcn CLI reads private GitHub registries with `gh` or `GITHUB_TOKEN`.
