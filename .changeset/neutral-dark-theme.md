---
"@auradata/tokens": minor
---

Make the dark theme neutral and softer: the backgrounds, borders and fills drop their blue tint (page `#141414`, container `#1A1A1A`, elevated `#222222`, border `#2E2E2E`) and the text eases from `#F5F5F7` to `#F0F0F0`, keeping every pair at WCAG AA. Floating glass surfaces are more translucent so the blur reads over content: `--surface-glass` goes to 55% white in light and 58% neutral night in dark. The tour card leaves the glass layer and stays solid, since it sits over its own scrim.
