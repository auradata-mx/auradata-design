---
"@auradata/tokens": minor
---

Remove the global compact density and the print styles: `--aura-density-compact` and the `data-density` rules are gone (the AuraData data table keeps its own row density), and `tokens.css`, `shadcn.css` and `shadcn-theme.json` no longer carry `@media print` (the light values on paper, hidden navigation, page breaks, link URLs, `data-print="hide"` and `data-print="only"`).
