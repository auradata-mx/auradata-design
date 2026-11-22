# @cristianruben-dev/auradata-tokens

## 0.3.0

### Minor Changes

- [`498abc1`](https://github.com/cristianruben-dev/auradata-design/commit/498abc10a32e6dd81b673242884d0fa6b218ea6f) Thanks [@cristianruben-dev](https://github.com/cristianruben-dev)! - `shadcn.css` and `shadcn-theme.json` (new `css` key, for the registry theme item) give every shadcn component the brand focus ring: 2px of `--ring`, 2px away, on `:focus-visible`, instead of shadcn's 3px ring at 50%.

- [`9d924ac`](https://github.com/cristianruben-dev/auradata-design/commit/9d924aca16cb8f36f52b21a4462a70de288b5a4e) Thanks [@cristianruben-dev](https://github.com/cristianruben-dev)! - Add compact density: `data-density="compact"` on `<html>` or a section scales Tailwind's `--spacing` by `--aura-density-compact` (0.875), so shadcn controls, table rows and menu items shrink (a 32px button becomes 28px) while the type stays; `data-density="normal"` restores it inside a compact section. It ships in `shadcn.css` and the `css` of the registry theme item.

- [`dc61472`](https://github.com/cristianruben-dev/auradata-design/commit/dc614727be819e5997ce56aebd2f5824c260a3c9) Thanks [@cristianruben-dev](https://github.com/cristianruben-dev)! - Add `color-border-control` ([#858585](https://github.com/cristianruben-dev/auradata-design/issues/858585) light, #6B6B76 dark; shadcn `--control-border`): unchecked checkboxes and radios take it as their `--input`, so their edge reads 3:1 on every surface (WCAG 1.4.11) instead of 1.26:1.

- [`7635e11`](https://github.com/cristianruben-dev/auradata-design/commit/7635e117e1c6388922c72a634500381cb2e8cb8e) Thanks [@cristianruben-dev](https://github.com/cristianruben-dev)! - Add the sequential (`--aura-color-sequential-1` … `-9`, Azul Aura) and diverging (`--aura-color-diverging-1` … `-9`, red, neutral, blue) data palettes in light and dark, and map them into shadcn as `--sequential-*` and `--diverging-*` (Tailwind `bg-sequential-3`). The categorical `chart-1` … `chart-8` stay as they were.

- [`92d339c`](https://github.com/cristianruben-dev/auradata-design/commit/92d339cedaadb435ebed5cacd126921987a9e6ec) Thanks [@cristianruben-dev](https://github.com/cristianruben-dev)! - The horizontal Continua logos (`horizontal-*.svg`) start at the mark: their `viewBox` is `23 0 634 144` (was `0 0 680 144`, with 23 px of empty space before the mark and 23 px after the wordmark), so a logo lines up with the text beside or under it. They are 634 × 144; at the same height a logo is about 7 % narrower.

- [`898d538`](https://github.com/cristianruben-dev/auradata-design/commit/898d538ac004e964a909efe20af21045ae564036) Thanks [@cristianruben-dev](https://github.com/cristianruben-dev)! - The vertical Continua logos (`vertical-*.svg`) are cropped to their artwork: their `viewBox` is `42 51 392 305` (was `0 0 480 420`, with about 42 px of empty space on the left, 47 px on the right, 51 px above the mark and 64 px under the wordmark), so a logo lines up with the text beside or under it. They are 392 × 305; at the same height the artwork draws about 38 % larger.

- [`b9a59e6`](https://github.com/cristianruben-dev/auradata-design/commit/b9a59e6aec319e14ed4db3bc4e5947a8a38a269b) Thanks [@cristianruben-dev](https://github.com/cristianruben-dev)! - Add `color-fill-accent` (#EFEFF2 light, #26262F dark) and map shadcn `--accent` to it instead of `color-fill-secondary`: the highlighted row of a menu, select or command palette now stands out from the popover (it was #1C1C24 on [#191921](https://github.com/cristianruben-dev/auradata-design/issues/191921) in dark, invisible). Text reads 17.2:1 and 13.8:1 on it.

- [`083c4ce`](https://github.com/cristianruben-dev/auradata-design/commit/083c4cec40fc2e910eb1f737986a8c79051b4dad) Thanks [@cristianruben-dev](https://github.com/cristianruben-dev)! - Add print styles for reports to `shadcn.css` and the `css` of the registry theme item, and the light values of the dark theme under `@media print` in `tokens.css`: paper is light (dark mode prints with the light values, backgrounds kept), drop shadows, animations and transitions go (card rings stay), navigation goes (`nav`, the sidebar and the app bar, toasts, `data-print="hide"`), headings stay with what follows, cards, charts, KPI cards and table rows are not split, table headers repeat, scrolling tables print whole, external links print their URL, and `data-print="only"` shows something only on paper.

- [`304e011`](https://github.com/cristianruben-dev/auradata-design/commit/304e011b367e598d2e6baedf817bbd2ba918b84a) Thanks [@cristianruben-dev](https://github.com/cristianruben-dev)! - Add a 50-900 scale of each status (`--aura-color-{success,warning,info,error}-{50…900}`), Tailwind's emerald, amber, blue and red in light and inverted in dark so 50 stays the faintest tint, and map them into shadcn as `--{success,warning,info,destructive}-{50…900}` (Tailwind `bg-success-50 text-success-700`). Text: 700 on 50, 100 and every surface, 800 on 200, all WCAG AA.

## 0.2.0

### Minor Changes

- [`c00e517`](https://github.com/cristianruben-dev/auradata-design/commit/c00e5175ffadf6f72e999824de9514e30f32bbeb) Thanks [@cristianruben-dev](https://github.com/cristianruben-dev)! - Add an ECharts theme (echarts.json), light and dark.
