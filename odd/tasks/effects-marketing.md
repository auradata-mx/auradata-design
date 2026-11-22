# AuraData effects and marketing blocks (T64)

Objective: premium effects for auradata.mx and the app, and the missing marketing blocks, published through the registry; the «Landing» story uses them.
Branch: feat/effects-marketing (from origin/main), merged to main by rebase. Delivery: ask-on-risk, one commit per task. Test runner: vitest (`test:unit`, `test:stories` with axe light), Playwright in Docker (`test:visual:docker`, axe dark + screenshots), `tsc -b`, eslint.

## Specs

- S0 (user, via the coordinator, S11 of `design-system-bootstrap.md`): «tenemos que ir agregando también componentes que nosotros mismos necesitemos utilizar … blur progresivo, cositas así», then «vamos a hacer por favor todo eso … en chats separados». Every effect respects `prefers-reduced-motion`, is `aria-hidden` when decorative and does not hurt performance on a phone.
- S1: «Blur progresivo: el desenfoque gradual en headers fijos y en los bordes de listas con scroll (capas con `backdrop-filter` y máscaras), con arriba, abajo, izquierda y derecha.»
- S2: «Marquee de logos de clientes (pausa con hover o foco, sin saltos en el loop).»
- S3: «Contador animado de números, con `lib/format`.»
- S4: «Tarjeta con brillo que sigue al cursor (spotlight).»
- S5: «Borde con gradiente animado, con el gradiente de marca `--aura-gradient-brand`.»
- S6: «Botón con shimmer.»
- S7: «Aparición de texto al hacer scroll.»
- S8: «Precios con toggle mensual/anual (en MXN con `lib/format`, plan destacado).»
- S9: «Tabla comparativa de planes.»
- S10: «Testimonios.»
- S11: «Features en tabs.»
- S12: «Logo cloud.»
- S13: «Changelog o novedades.»
- S14: «Actualiza la story «Landing» para que use los nuevos bloques.»
- S15 (repo rules): blocks in `src/components/blocks` as `registry:block`; a published file has its own `// registry: auradata (<what changed>)` line; `/registry.json` only from `npm run registry -w registry`; UI copy in Spanish (tú, «», sentence case); focus ring = the theme's 2px outline with 2px offset (never `focus-visible:border-ring`); the brand gradient is a headline accent; `lg` buttons h-10 px-4. Play tests for `aria-hidden`, the pricing toggle and the marquee pause. Every story passes axe light and dark with a deterministic screenshot (animations disabled), each new or changed screenshot is looked at; marketing block stories carry the literal tag `mobile`.

## Tasks

| ID | Specs | Route | Status | Evidence |
| --- | --- | --- | --- | --- |
| E1 | S0, S1 | inline | done (this commit) | `progressive-blur`: `ProgressiveBlur` (side top/bottom/left/right, `size`, `blur` 16, 5 `backdrop-filter` layers each masked nearer the edge and twice as blurred, optional background `tint`, `aria-hidden`, no pointer events) and `ScrollBlur` (focusable region whose edges blur only while there is more, `data-more` none/start/end/both). RED (story file: module missing) → GREEN 4/4 plays (aria-hidden + pointer-events on 4 sides, 16px at the edge layer, `data-more` end → both → start → end while scrolling, horizontal row); 10 screenshots looked at (Sides re-shot on a checkerboard: vertical stripes hid left/right) |
| E2 | S0, S2 | inline | pending | `marquee` |
| E3 | S0, S3 | inline | pending | `number-ticker` |
| E4 | S0, S4-S6 | inline | pending | `spotlight-card`, `gradient-border`, `shimmer-button` |
| E5 | S0, S7 | inline | pending | `text-reveal` |
| E6 | S8, S15 | inline | pending | block `pricing` |
| E7 | S9, S15 | inline | pending | block `plan-comparison` |
| E8 | S10, S12, S15 | inline | pending | blocks `testimonials`, `logo-cloud` |
| E9 | S11, S13, S15 | inline | pending | blocks `feature-tabs`, `changelog` |
| E10 | S14, S15 | inline | pending | Landing story, brand motion/color rules, README, registry.json |
| E11 | S15 | inline | pending | rebase on origin/main, all checks, push to main, CI and Coolify |

Route evidence: one writer (the parent) works inline, task by task; no Writer trigger reason (the effects are small, sequential units; the blocks reuse the effects).

## Log

- L1 (2026-11-21, coordinator thread, verbatim excerpt): «Continuamos el design system de AuraData … Este chat se encarga de la **T64, Efectos premium y bloques de marketing** … Lo que pidió, literal: «tenemos que ir agregando también componentes que nosotros mismos necesitemos utilizar … blur progresivo, cositas así», y después: «vamos a hacer por favor todo eso … en chats separados». … Actualiza la story «Landing» para que use los nuevos bloques.» (full brief in the T3 thread; the items are S1-S14 verbatim).
- L2 (decisions): Brand/07 said «`aura-background` es la única animación ambiental. Nada más se mueve solo: ni íconos, ni degradados, ni números», and Brand/04 keeps the brand gradient «solo como acento». The user asked for the marquee, the ticker, the animated gradient border and the shimmer (L44 of the bootstrap plan), so E10 rewrites those rules instead of breaking them silently: ambient motion is allowed for these opt-in marketing effects, one per view, always stopped by reduced motion; the gradient may also be the thin border of the one highlighted element of a view (the recommended plan), never a fill or a button.
