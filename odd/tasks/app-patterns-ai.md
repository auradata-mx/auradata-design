# App patterns and AI chat (T65)

Objective: the app patterns AuraData BI and future apps need, and a richer `chat` block, published through the registry. Coordinator task T65 of `design-system-bootstrap.md` (S11).
Branch: `feat/app-patterns-ai` from `origin/main`, merged to `main` by rebase. Delivery: one commit per task, then `git push origin HEAD:main` (coordinator brief). Test runner: vitest (`test:unit`, `test:stories` with axe light), Playwright (`test:visual:docker`, axe dark + screenshots), `tsc -b`, eslint.

## Specs

User (via the coordinator, L1): «tenemos que ir agregando también componentes que nosotros mismos necesitemos utilizar», then «vamos a hacer por favor todo eso … en chats separados».

App patterns (AuraData BI and future apps):

- S1: «**Tabs con contador** y **control segmentado** (por ejemplo vista Tabla | Gráfica).»
- S2: «**Vista maestro-detalle:** lista a la izquierda y detalle a la derecha; en móvil, navegación lista → detalle.»
- S3: «**Checklist de onboarding** («Conecta tu primera base de datos», con progreso)».
- S4: «un **tour guiado** con pasos anclados a elementos, accesible y que se pueda saltar.»
- S5: «**Diálogo de atajos de teclado:** se abre con «?», agrupado y con `Kbd`. Reutiliza `shortcutLabel()` de search-command.»
- S6: «**Menú de usuario completo:** cuenta, espacio, tema, idioma, ayuda y «Cerrar sesión».»
- S7: «**Estados vacíos ilustrados:** ilustraciones SVG sobrias de la marca para «sin informes», «sin datos», «sin resultados» y «sin conexión», sobre `empty`.»

AI chat (the `chat` block on shadcn's chat primitives):

- S8: «Adjuntar archivos al preguntar (con `attachment`).»
- S9: «Texto que aparece en streaming, con cursor; respeta el movimiento reducido.»
- S10: «👍/👎 por respuesta, con un motivo opcional.»
- S11: «Citas de qué dataset o informe se usó (chips que enlazan).»
- S12: «Tarjeta de «insight»: un hallazgo con su métrica y la acción «Ver detalle».»
- S13: «Mantén los props y los play tests actuales del chat.»

Cross-cutting (coordinator rules):

- S14: Published only with its own `// registry: auradata (<qué cambió>)` line; `/registry.json` only from `npm run registry -w registry`.
- S15: UI copy in Spanish (tú, «», sentence case); code, comments and commits in English. Focus = the theme's 2px outline with 2px offset (never `focus-visible:border-ring`); text controls use `--control-border`; Base UI checkbox/radio/switch states via `data-disabled:`.
- S16: Tests first (RED → GREEN; play tests for keyboard, tour, feedback and attachments). Every story passes axe light (`test:stories`) and dark with a screenshot (`test:visual:docker`); each new or changed screenshot is looked at; stories that change on a phone carry a literal `mobile` tag; the `registry/.audit` audit (390 and 1280 px, light|dark, 2x) runs on the touched stories.

## Tasks

| ID | Specs | Route | Status | Evidence |
| --- | --- | --- | --- | --- |
| A1 | S1 | inline | done (de2bb0a) | `TabsCount` (es-MX thousands, «99+» past `max`, part of the tab name) in `tabs`; `segmented-control` on Base UI `RadioGroup`/`Radio` (`sm`, icon-only squares). RED unit + tsc → GREEN; plays: counts in the names, click, Tab + ArrowRight |
| A2 | S2 | inline | done (780be52) | `master-detail` (`MasterDetail`, `List`, `Item`, `Pane`, `Back`); CSS swap below `md`; focus to the pane on open and back to the row that opened it. RED unit + tsc → GREEN; Phone play RED (focus lost: «Volver» clears the selection) → the opener row is remembered |
| A3 | S3 | inline | done (441ee45) | `onboarding-checklist` (card, progress «1 de 4 pasos» as `aria-valuetext`, «(hecho)» for screen readers, next step primary, link steps, «Ocultar guía», «Todo listo» + «Listo»). Screenshot: link step lost its outline border → `cn(buttonVariants())`, pinned by a play (RED → GREEN) |
| A4 | S4 | inline | done (d5d1f24) | `tour` on the Base UI popover primitive: anchor resolved per step, scroll into view (instant with reduced motion), dimmed page with a brand outline on the target, non-modal dialog, focus on «Siguiente», Escape/«Saltar tour» → `onSkip(step)`, outside clicks ignored, «Terminar» → `onComplete`. 5 plays; screenshot: the ring vanished under the dimming box-shadow → outline (play asserts it) |
| A5 | S5 | inline | done (2dcedd7) | `shortcuts-dialog`: groups, keys in `Kbd`, `mod+k` through `shortcutLabel()`, sequences «G luego I», «?» from anywhere but text fields, Escape closes. Screenshot: «luego» in monospace inside the `<kbd>` group → `font-sans` (play pins the font); the «?» in the description is a `Kbd` |
| A6 | S6 | inline | done (3ea6163) | `user-menu` (`avatar` / `full`, account label, «Mi cuenta», «Ajustes», workspace/theme/language submenus with `closeOnClick`, help, «Atajos de teclado ?», «Cerrar sesión»); `theme-toggle` exports `themeOptions`; `app-shell` uses it and takes `userMenu`; shell baselines unchanged. axe RED `label-content-name-mismatch` (initials vs `aria-label`) → sr-only name. Visual spec: waits for the play to finish (L4) |
| A7 | S7 | inline | done (3c4c3d7) | `empty-illustration` (`reports`, `data`, `results`, `offline`; `sm`): line art in the theme colors with one primary accent, `aria-hidden`; stories with voice copy |
| A8 | S8, S13 | inline | done (bc86880) | Chat `attach` (accept, max 5): «Adjuntar archivo», chips with «Quitar …», a file alone can be sent, `onSend(text, files)` only when files; `ChatMessage.attachments` on sent questions. Screenshot: sent chips stopped 28 px short of the bubble (group scroll fade) → wrap and flush, play RED → GREEN |
| A9 | S9, S13 | inline | done (bc86880) | `ChatMessage.streaming`: cursor (`motion-reduce:animate-none`), `aria-busy` on the answer, new questions held, `onStop` → «Detener respuesta». Plays: static streaming, and a timed stream that ends without cursor or `aria-busy` |
| A10 | S10, S13 | inline | done (bc86880) | `message-feedback` (also published): «Útil»/«No útil» pressed state, taken back with `null`, «¿Qué falló?» reasons + optional comment, «Enviar»/«Omitir», «Gracias por tu opinión.» status; chat `onFeedback(id, value, details)` and `ChatMessage.feedback` |
| A11 | S11, S12, S13 | inline | done (bc86880) | `ChatMessage.sources` → «Fuentes» chips linking datasets/reports (kind read first); `insight-card` (also published) as a chat embed: «Hallazgo», finding, metric with the KPI card's change colors, «Ver detalle» (link or button) |
| A12 | S14 | inline | done (16460fd) | Brand/11 Patrones: «Patrones de app» and «Chat con IA» tables (phone: 3 columns overflowed → 2 columns); README published row; `registry.json` regenerated; generator tests 74/74 |
| A13 | all | inline | done (this commit, pushed to `main`) | Rebased on `origin/main` (T59, T60, T61 merged first): `app-shell` keeps the user menu and T60's notification center; generator tests, README rows and `registry.json` merged/regenerated (theme identical to main; 9 new items, `tabs`, `app-shell`, `chat` changed). Checks: tokens 143/143, unit 85/85, stories 324/324, visual 743/743, `tsc`, lint, `build`, `build:login` |

## Log

- L1 (2026-11-21, coordinator thread, quoting the user): «tenemos que ir agregando también componentes que nosotros mismos necesitemos utilizar», then «vamos a hacer por favor todo eso … en chats separados». Brief for T65: the 11 items above, keep the chat's props and play tests, own feature document, Engram topic `odd/app-patterns-ai/tasks`, merge by rebase and push to `main`.
- L2 (design decisions, taken without the user: none changes product scope):
  - Segmented control = Base UI `RadioGroup` + `Radio` (one choice, arrow keys, `role=radio`), not toggle-group (pressed buttons, no single-choice semantics) nor tabs (no panels).
  - Master-detail switches panes with CSS at `md` (no `useIsMobile`): the list hides on a phone once something is selected and «Volver» brings it back; focus moves to the detail when it opens.
  - Tour: Base UI `Popover` with `anchor` on the target element (stock `PopoverContent` does not pass `anchor`, so `tour.tsx` uses the primitive), non-modal; a highlight box with a dimming shadow over the target; «Saltar tour», Escape, «Anterior»/«Siguiente»/«Terminar», «Paso 1 de 3».
  - Shortcuts: `keys` strings such as `mod+k`, `shift+n`, `g i` (a sequence); `mod+<key>` renders through `shortcutLabel()`; «?» opens it unless focus is in a text field.
  - Chat: new props are optional, `onSend(text)` gains an optional second argument (the files), so existing callers and plays keep working.
- L3 (A1-A4): the copied audit config served another thread's Storybook (port 6009, `reuseExistingServer`): this worktree's scratch copy uses port 6165. Story tests run at the story's viewport (390 px for `ON_PHONE`), so phone plays exercise the CSS swap. jest-dom `toBeVisible` fails during a popup's fade-in: tour plays wait for it. Lint (`react-hooks/set-state-in-effect`) moved the tour to `useSyncExternalStore` for reduced motion, an anchor resolver function and rect updates from callbacks only. The tour's outline assertion was added after the fix (RED not observed; the ring version had no outline).
- L4 (A5-A12): `tests/visual.spec.ts` took axe and the screenshot without waiting for a story's play, so plays that open menus failed at random (half-faded menu): it now waits for Storybook's render phase (`__STORYBOOK_PREVIEW__.currentRender.phase` finished/errored/aborted); the full suite passed 621/621 with it, no baseline changed. The Docker VM (6 CPUs, 5.2 GB) is shared with the other threads' Playwright containers: the full suite crashed Chromium at the default workers, so it runs with `--workers=2`. Chat A8-A11 share one commit: `chat.tsx` carries all four and the generator tests tie the new components to the chat. Decisions: the user menu always shows «Ajustes» and «Cerrar sesión» (as the shell had), the rest when the app passes it; its radio items close the menu (Base UI keeps it open by default); a sent message's files wrap and end flush with the bubble; feedback reports `down` at once and again with the details. Existing chat plays and baselines unchanged.
- L5 (A13): commit hashes in the table are the rebased ones. During the rebase `registry.json` was regenerated from a stale tokens build (before T59), dropping T59's palettes from the theme; `npm run build` rebuilt the tokens and the regenerated file matches main's theme exactly (amended into A12). First `test:stories` after the rebase failed while collecting (known), the rerun passed 324/324. Full visual 742/743: Brand/10 crashed Chromium (shared Docker memory) and passed alone twice; no baseline changed, so none was refreshed (`--update-snapshots=all` would only churn antialiasing). Known, left: Base UI menu radio items elsewhere (`theme-toggle`) still stay open after a choice, as before.
