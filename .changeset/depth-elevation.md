---
"@auradata/tokens": minor
---

Add an elevation scale with depth, light and dark: `--aura-shadow-{raised,raised-hover,control,control-hover,pressed,sunken,overlay,modal}` (a top-edge highlight, a contact and an ambient shadow; `pressed` and `sunken` are inset) and the surface gradients `--aura-surface-{raised,filled}`, plus an opt-in dark grain, `--aura-surface-grain` (`none` in light). `shadcn.css` and `shadcn-theme.json` map them to `--elevation-*` and `--surface-*`, used as `shadow-(--elevation-raised)` and `bg-(image:--surface-raised)`. The theme raises the stock shadcn card (`[data-slot="card"]`) to `--elevation-raised` with `--surface-raised` from the base layer, so `shadow-none` on a card still wins. In forced colors, cards and elements with `shadow-(--elevation-raised)`, `-overlay` or `-modal` get a 1px `CanvasText` outline, since shadows vanish there. `shadow-card` and `shadow-float` keep their values, so AuraData BI (`antd.json`) does not change.
