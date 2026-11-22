---
"@cristianruben-dev/auradata-tokens": minor
---

Add compact density: `data-density="compact"` on `<html>` or a section scales Tailwind's `--spacing` by `--aura-density-compact` (0.875), so shadcn controls, table rows and menu items shrink (a 32px button becomes 28px) while the type stays; `data-density="normal"` restores it inside a compact section. It ships in `shadcn.css` and the `css` of the registry theme item.
