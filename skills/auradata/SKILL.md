---
name: auradata
description: "Trigger: building or editing UI in a React app that uses AuraData, the @auradata shadcn registry or the AuraData brand. Install, pick and use AuraData components with its brand rules."
license: MIT
metadata:
  author: "auradata-mx"
  version: "1.0"
---

## Activation Contract

Load this skill when you build or change UI in a React app that installs items from the AuraData registry (`@auradata/<item>`, `https://design.auradata.mx/r/<item>.json`, `auradata-mx/auradata-design/<item>`) or must follow the AuraData brand: screens, forms, reports, dashboards, charts, empty/error states, UI copy.

## Hard Rules

- Never invent a component, prop, token or registry item. Check [references/catalog.md](references/catalog.md), then `npx shadcn view @auradata/<item>` or the item's page in `https://design.auradata.mx/llms-full.txt` before using a prop.
- Install AuraData items with the shadcn CLI; never hand-copy or rewrite them. Unchanged shadcn components (`card`, `popover`, `separator`, `skeleton`, `table`…) come from shadcn itself: `npx shadcn add card`. The theme brands them.
- Colors by function, never by value: `primary`, `muted-foreground`, `destructive`, `success-700`… Never write a hex, an `rgb()` or a radius/shadow value by hand.
- Color is never the only signal: a status carries an icon or a word; a change carries an arrow and a sign.
- UI copy in Spanish (Mexico), `tú`, «» quotes, sentence case, verbs on buttons («Guardar cambios», «Eliminar»; never «Aceptar» or «OK»). Numbers, money and dates only through `lib/format` (es-MX): `$1,284,500 · 12.4 % · 21 nov 2026`.
- Every control has a visible name or `aria-label`; decorative icons get `aria-hidden`. Keep Base UI keyboard behavior; never replace a control with a `div` with `onClick`.
- Block parts (`KpiCard`, `ChartCard`, `InsightCard`, `UserMenu`, `NotificationCenter`, `WorkspaceSwitcher`, `ShortcutsDialog`) are not registry items: they ship inside their block. Install the block to get them.
- In the app nothing moves by itself; every animation respects `prefers-reduced-motion`.

## Decision Gates

| Project state | Do |
| --- | --- |
| No `components.json` | `npx shadcn init -b base`, then continue as below |
| `components.json` with a `style` that is not Base UI (`base-*`, e.g. `base-nova`) | Stop and tell the user: the registry is built on Base UI, so the app must be too. Do not migrate on your own |
| No `@auradata` entry in `registries` | Add it (below) |
| `auradata-theme` not installed (no `--chart-1`, `--success-700` in the app CSS) | `npx shadcn add @auradata/auradata-theme` before any item |

```json
{ "registries": { "@auradata": "https://design.auradata.mx/r/{name}.json" } }
```

| Need | Where to look |
| --- | --- |
| Which component fits a need, and its alternative | [references/catalog.md](references/catalog.md) |
| Voice, color, states, layout, spacing, icons, forms | [references/brand.md](references/brand.md) |
| Which chart for which question, chart rules | [references/data-viz.md](references/data-viz.md) |
| A full screen (shell, dashboard, chat, login, 404) | Install the block, then change its data |

## Execution Steps

1. Read `components.json` (style, aliases, `registries`) and apply the setup gate above.
2. Map each need to an item in [references/catalog.md](references/catalog.md); prefer a block when the screen matches one.
3. Look it up: `npx shadcn search @auradata -q <term>`, `npx shadcn view @auradata/<item>`; read its full page in `https://design.auradata.mx/llms-full.txt` (index: `https://design.auradata.mx/llms.txt`).
4. Install: `npx shadcn add @auradata/<item>` (registry dependencies such as `format` come with it). Import through the project's aliases (`@/components/ui/<item>`, `@/lib/format`).
5. Build with [references/brand.md](references/brand.md) and, for charts, [references/data-viz.md](references/data-viz.md).
6. Cover every state of each block: loading (`Skeleton` with the content's shape), empty (`Empty`), error (`EmptyError` with «Reintentar»), disabled, invalid, focus.
7. Run the checklist below before you finish.

## Output Contract

Before reporting done, confirm each item and say which ones you could not check:

- [ ] Light and dark both read: text passes WCAG AA (4.5:1); no hard-coded colors, only tokens and their Tailwind classes.
- [ ] Keyboard: everything works with `Tab`, `Enter`, `Espacio`, arrows and `Esc`; the focus ring is visible, never removed.
- [ ] Every control is named (`FieldLabel`, `Label` or `aria-label`); icon-only buttons have `aria-label` plus a `Tooltip` with the same text.
- [ ] Copy: Spanish, «», sentence case, verbs on buttons; errors say what happened and what to do, without blame or exclamations.
- [ ] Numbers and dates through `lib/format`; figures in tables and KPI with `tabular-nums`.
- [ ] Loading, empty and error states exist wherever content loads.
- [ ] Each item came from the registry or from shadcn; nothing was invented or hand-copied.

## References

- [references/catalog.md](references/catalog.md) — every registry item by layer: install name, use, when not.
- [references/brand.md](references/brand.md) — voice, color, states, layout, spacing, icons, forms.
- [references/data-viz.md](references/data-viz.md) — chart choice, palettes, chart rules, number formats.
