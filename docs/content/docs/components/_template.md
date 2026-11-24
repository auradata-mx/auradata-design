# How to add a component page

Every registry `ui` item has one page in this folder, and every page follows the same order, so the ~50 pages read
alike. The pilots are `button.mdx`, `input.mdx`, `select.mdx`, `dialog.mdx` and `data-table.mdx`: copy the closest one.
This file starts with `_`, so the site does not publish it.

## Recipe

1. **Find the item.** Its `name` in `registry.json` (`date-picker`), its source in `registry/src/components/ui/<name>.tsx`,
   its stories in `registry/src/stories/<Name>.stories.tsx` and the guidance in `registry/src/stories/brand/*.mdx`
   (Patterns, States, Voice, Spacing, DataViz, Layout).
2. **Write the examples** in `docs/src/examples/<name>/`, one file each:
   - `demo.tsx` is the first preview; then one file per variant or state (`sizes.tsx`, `invalid.tsx`, `loading.tsx`).
   - The first line is `'use client';`. The default export is the example, a function named `<Component><Example>`.
   - Import the real components from `@/components/ui/<name>` (never a copy). Self-contained: data inline, no
     imports from other examples, so the code tab is the whole thing a reader copies.
   - Spanish copy in the brand voice: verbs in buttons, «» quotes, es-MX numbers and dates, names from AuraData BI
     (informes, espacios, periodos). Take the content from the stories when there is one.
   - Every control has a name: a `FieldLabel` or an `aria-label`; icons beside text are `aria-hidden`.
3. **Write the page** `docs/content/docs/components/<name>.mdx`, in this order:

   ````mdx
   ---
   title: Date picker
   description: "One line: what it is for." # quoted: a colon in it breaks the YAML
   ---

   One paragraph: what AuraData adds to the base component (from the comment on line 1 of the registry file).

   <ComponentPreview name="date-picker/demo" />

   ## Instalación

   <ComponentInstall item="date-picker" />

   ## Uso

   ```tsx
   import { DatePicker } from '@/components/ui/date-picker';

   <DatePicker … />;
   ```

   ## Ejemplos

   ### <Variant or state>

   One or two sentences, then:

   <ComponentPreview name="date-picker/<example>" />

   ## Props

   <ComponentProps file="date-picker" name="DatePickerProps" />

   ## Cuándo usarlo

   - Bullets taken from the brand guide and the story docs. Never a rule that contradicts them.

   ## Cuándo no

   - The alternative component for each case («Varios valores: `Combobox`»).

   <StorybookLink stories="DatePicker" story="Default" />
   ````

4. **Props.** `file` is the file under `registry/src/components/ui` without `.tsx`. Then either:
   - `name="DataTableProps"` when the file exports the props type; or
   - `type="Pick<React.ComponentProps<typeof Button>, 'variant' | 'size' | 'loading'>"` when it does not. The type is
     resolved inside that file, so its imports (`React`, the component) are in scope.
   - When the props come from Base UI, `Pick` only the AuraData props and the few a reader needs, and pass
     `baseUi="<base-ui page>"` (`button`, `select`, `dialog`…, the slug of `https://base-ui.com/react/components/<slug>`).
   - A compound component (Select, Dialog) gets one `### Part` heading and one `ComponentProps` per part with props.
5. **One page may cover several items** (a component and a helper item it documents): add one
   `<ComponentInstall item="…" />` per item. That is what `npm run pages:missing -w docs` counts.
6. **Check it:**
   - `npm run build -w docs`: a wrong item, story, example name or type fails the build with its name.
   - `npm run pages:missing -w docs`: the item is no longer listed.
   - `npm run dev -w docs`, open `/docs/components/<name>/`: each preview renders in light and dark, the code tab is
     the example file, the copy button copies the command, the props table is there and «Ver en Storybook» opens the
     story.

## The kit

`docs/src/components/component-docs.tsx` (registered in `docs/src/components/mdx.tsx`, so pages use it without imports):

| Component | Props | What it does |
| --- | --- | --- |
| `ComponentPreview` | `name`, `align?: 'center' \| 'start'` | Tabs «Vista previa» / «Código»: renders `src/examples/<name>.tsx` and shows its source. `align="start"` for tall examples (tables) |
| `ComponentInstall` | `item` | `npx shadcn add https://design.auradata.mx/r/<item>.json` with a copy button; the item must exist in `registry.json` |
| `ComponentProps` | `file`, `name?`, `type?`, `baseUi?` | The props table from the TypeScript types (`fumadocs-typescript`) |
| `StorybookLink` | `stories`, `story = 'Default'` | «Ver en Storybook»; the story must exist in `registry/src/stories/<stories>.stories.tsx` |

The Storybook base is `storybookUrl` in `docs/src/lib/shared.ts`, the only place to change when Storybook moves.
