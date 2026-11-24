---
"@auradata/tokens": minor
---

A softer focus and softer fields. `color-focus-ring` is Azul Aura (#2563EB light, 5.2:1; #60A5FA dark, 7.4:1) instead of near-black and near-white, and the theme draws focus as a halo: a 1px edge of `--ring` inside a 3px glow of it at 25 %, composed with the elevation shadow, with a transparent outline left for forced colors. A focused field (input, textarea, select trigger, native select, input group, combobox chips) turns its own border `--ring` and only glows; an invalid one glows `--destructive`. New `color-border-field` (#C4C4CC light, #3B3B47 dark; shadcn `--field-border`) is the soft edge of fields; `color-border-control` keeps 3:1 for checkboxes, radios and steps. Plain elements (links) keep a 2px outline, now blue.
