---
"@cristianruben-dev/auradata-tokens": minor
---

Add print styles for reports to `shadcn.css` and the `css` of the registry theme item, and the light values of the dark theme under `@media print` in `tokens.css`: paper is light (dark mode prints with the light values, backgrounds kept), drop shadows, animations and transitions go (card rings stay), navigation goes (`nav`, the sidebar and the app bar, toasts, `data-print="hide"`), headings stay with what follows, cards, charts, KPI cards and table rows are not split, table headers repeat, scrolling tables print whole, external links print their URL, and `data-print="only"` shows something only on paper.
