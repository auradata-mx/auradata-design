---
"@cristianruben-dev/auradata-tokens": minor
---

Add an elevation scale with depth, light and dark: `--aura-shadow-{raised,raised-hover,control,control-hover,pressed,sunken,overlay,modal}` (a top-edge highlight, a contact and an ambient shadow; `pressed` and `sunken` are inset) and the surface gradients `--aura-surface-{raised,filled}`, plus an opt-in dark grain, `--aura-surface-grain` (`none` in light). `shadcn.css` and `shadcn-theme.json` map them to `--elevation-*` and `--surface-*`, and the registry theme gives Tailwind `shadow-raised`, `shadow-overlay`, `shadow-modal` and the rest. In forced colors, elements with `shadow-raised`, `shadow-overlay` or `shadow-modal` get a 1px `CanvasText` outline, since shadows vanish there. `shadow-card` and `shadow-float` keep their values, so AuraData BI (`antd.json`) does not change.
