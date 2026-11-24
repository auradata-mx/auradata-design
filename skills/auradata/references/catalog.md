# AuraData registry catalog

Every item of the registry, by layer. Install each with `npx shadcn add @auradata/<item>`; the backticked name is the install name. Format: what it is for. **Not for:** the case and the item to use instead.

Not in the registry, install from shadcn and let the theme brand them: `card`, `popover`, `separator`, `skeleton`, `table`, `collapsible`. Block parts (`KpiCard`, `ChartCard`, `InsightCard`, `UserMenu`, `NotificationCenter`, `WorkspaceSwitcher`, `ShortcutsDialog`) ship only inside their block.

## Brand

Install `auradata-theme` first, before any other item.

- `auradata-theme` — The brand as a shadcn theme: color tokens in light and dark, Outfit and Geist Mono, radii, elevation and the focus ring. **Not for:** a non-React product: use the `@auradata/tokens` package (`tokens.css`, `tailwind.css`, `antd.json`, `echarts.json`).
- `logo` — `Logo` and `ProductTag`, the brand mark and the product tag; also copies the Continua SVGs to `public/brand/continua`. **Not for:** a decorative accent: the gradient goes on the product tag or one headline word, never as a text background.

## Base

shadcn components on Base UI with AuraData changes: states, contrast, Spanish copy and phone layout.

- `accordion` — FAQ and help, details not everyone needs; each question is the button's name. **Not for:** one section shown or hidden → `Collapsible`; sections to compare or jump between → `tabs`; what everyone must read → leave it visible.
- `alert` — A notice that stays relevant to the page until its cause changes. **Not for:** an app-wide notice → `announcement-banner`; confirming an action → a `sonner` toast.
- `alert-dialog` — Confirm something that cannot be undone; the title asks («¿Eliminar informe?») and the description names the object and the consequence. **Not for:** a short task → `dialog`; reporting success → a `sonner` toast.
- `attachment` — Name, state and actions of each file already selected. **Not for:** picking or dropping files → `file-dropzone`.
- `avatar` — Identify a person by photo or initials. **Not for:** a report's status → `badge` with text.
- `badge` — A short status or category label next to a name. **Not for:** explaining what happened and what to do → `alert`; starting an action → `button`.
- `breadcrumb` — Where the page sits in the workspace, in the top bar, for pages two or more levels deep. **Not for:** process steps → `stepper`; the app's main sections → `sidebar`; a top-level page → its `page-header` title.
- `bubble` — One message in a conversation. **Not for:** scrolling the whole history → `message-scroller`.
- `button` — An action (save, share, delete), with variants, sizes and a loading state; one primary per view. **Not for:** navigation → a link (`buttonVariants` on the `Link`); choosing one option → `tabs` or `toggle-group`; deleting directly → the `destructive` button opens an `alert-dialog`.
- `button-group` — Closely related actions, or a field and its action. **Not for:** choosing a view or a persistent value → `tabs` or `toggle-group`.
- `calendar` — An always-visible Spanish calendar for a day or a range. **Not for:** a day in a form → `date-picker`; a day and a time → `DateTimePicker` (in `date-picker`); a report period → `filter` with `type="date"`.
- `carousel` — Step through related screenshots or testimonials with arrows or keyboard. **Not for:** comparing data rows → `data-table`.
- `checkbox` — An option confirmed on submit, or several options of a short list. **Not for:** a setting applied instantly → `switch`; one of several → `radio-group`; many values of a long list → `combobox` with `multiple`.
- `code-block` — A SQL query or multi-line snippet with a copy control. **Not for:** a key or shortcut → `kbd`; editing a query → a field or an editor.
- `combobox` — Search and pick from a long list; `multiple` for several values as chips; free tags. **Not for:** a short list → `select`; few options worth seeing → `radio-group` or `checkbox`; app-wide search → `CommandSearch` (in `command`).
- `command` — A list filtered as you type, to pick an object or run an action; `CommandSearch` is the single ⌘K app search. **Not for:** filtering a table → the `data-table` search; a form value → `combobox`; a few object actions → `dropdown-menu`.
- `context-menu` — Right-click shortcut to an area's actions. **Not for:** the only path to an action → also put it in a `dropdown-menu`; a button with options → `dropdown-menu`.
- `dialog` — A short task over the page: rename, share, edit a detail; always with title and description. **Not for:** destructive confirmation → `alert-dialog`; success → a `sonner` toast; a long form → `stepper`.
- `drawer` — A side panel (bottom sheet on the phone) for filters and details without leaving the page. **Not for:** a short task needing full attention → `dialog`; destructive confirmation → `alert-dialog`; app navigation → `sidebar`.
- `dropdown-menu` — An object's actions behind a button, verbs on items, destructive last. **Not for:** a form value → `select`; the user's account → `UserMenu` (in `app-shell`); many searchable actions → `command`.
- `empty` — What is missing and the first step; `EmptyError` where content failed to load. **Not for:** loading → `Skeleton` with the content's shape; a notice beside content still available → `alert`.
- `field` — Label, control, help and error of each form datum (`Field`, `FieldLabel`, `FieldError`). **Not for:** a loose control outside a form → `label`; a control with text or buttons inside → `input-group` inside the `Field`.
- `hover-card` — A glimpse of what is behind a link to an object. **Not for:** naming an icon-only button → `tooltip`; content with controls → `Popover`; the only explanation on a phone → leave it visible.
- `input` — Short text: a name, an email, a search; always named. **Not for:** stepped numbers → `number-input`; money or phone → `input-group`; new password → `password-input`; codes → `input-otp`; dates → `date-picker`, `time-picker`; long text → `textarea`.
- `input-group` — A field with something attached: a search icon, a currency, a copy button; also money and Mexican phone numbers. **Not for:** stepped numbers → `number-input`; passwords → `password-input`; plain short text → `input`.
- `input-otp` — A six-digit verification code, one box per digit. **Not for:** a password → `password-input`; any number → `input` or `number-input`.
- `item` — A row with media, title, description and actions for a list of objects. **Not for:** data compared by columns → `data-table`; a block with more content → `Card`.
- `kbd` — The key or combination that triggers a shortcut. **Not for:** something clicked → `button`.
- `label` — The visible name of a loose control, joined with `htmlFor`. **Not for:** inside a form → `FieldLabel` in a `field`; a group of options → `FieldLegend` in a `FieldSet`; no room for text → `aria-label`.
- `message-scroller` — Keeps a chat history navigable while answers arrive. **Not for:** a plain scrollable region → `scroll-area`; one turn's content → `bubble`.
- `native-select` — The browser select styled for AuraData; best on the phone and with `register`. **Not for:** desktop with long labels or icons → `select`; many values or search → `combobox`.
- `navigation-menu` — A site's main navigation with link submenus (marketing header). **Not for:** app navigation → `sidebar`; object actions → `dropdown-menu`; sections of one page → `tabs`.
- `pagination` — Pages of a long list with the range in view («Informes 21–40 de 236»). **Not for:** table rows → `data-table`; process steps → `stepper`.
- `progress` — Progress of a measurable task. **Not for:** unknown progress → the button's loading state, or `Skeleton` for content.
- `radio-group` — One option of 2 to 5, all visible, in a `FieldSet`. **Not for:** a long list → `select`; switching views → `tabs` or `toggle-group`; several options → `checkbox`; on/off → `switch`.
- `resizable` — Panels that share space with a draggable divider (editor and results). **Not for:** the phone → stack the areas.
- `scroll-area` — A fixed-size box with its own scrollbar. **Not for:** the whole page → let the browser scroll; a data table → `data-table`.
- `select` — One value from a short known list. **Not for:** many values or search → `combobox`; the phone → `native-select`; switching between few views → `tabs` or `toggle-group`.
- `sidebar` — App navigation: logo, workspace, sections and user, collapsible to icons. **Not for:** a marketing site → `navigation-menu`; sections of one page → `tabs`; a temporary panel → `drawer`.
- `slider` — An approximate number or range on a scale, with the value visible. **Not for:** an exact figure → `number-input`; an amount range in a filter bar → `filter` with `type="range"`.
- `sonner` — A temporary toast with the result of an action; `toastProgress` for long tasks. **Not for:** the only needed action → never in a toast; a persistent notice → `alert`; failed content → `EmptyError`.
- `switch` — A setting applied instantly. **Not for:** an option confirmed on submit → `checkbox`; more than two options → `radio-group` or `toggle-group`; a pressed toolbar button → `toggle`.
- `tabs` — Sections of one page, one at a time; `TabsCount` adds a count («Míos 12»). **Not for:** toolbar options → `toggle-group`; ordered steps → `stepper`; going to another page → links in `sidebar` or `navigation-menu`.
- `textarea` — Multi-line text: a description, a note, a comment. **Not for:** short text → `input`; a message to the AI with attachments → the `chat` block.
- `toggle` — A button that stays pressed: favorite, bold. **Not for:** a form setting → `switch`; several related toggles → `toggle-group`; an action → `button`.
- `toggle-group` — Toolbar options, one or several: chart type, alignment, visible series. **Not for:** sections with their own content → `tabs`; a form option → `radio-group` or `select`.
- `tooltip` — The name of an icon-only button or a one-line hint, on hover or keyboard focus. **Not for:** the only explanation (phones have no mouse); content with links or controls → `Popover`; a link summary → `hover-card`; a chart value → the `chart` tooltip.
- `trace` — One step of an operation with its detail on demand. **Not for:** code without a step → `code-block`; a whole view that failed → `EmptyError`.

## AuraData

Built by AuraData, not in shadcn: the data table and its filter system, advanced form controls and app patterns.

- `announcement-banner` — An app-wide change: maintenance, a new version; dismissal saved through `onDismiss`. **Not for:** a one-page notice → `alert`; news that arrived while away → `NotificationCenter` (in `app-shell`).
- `copy-button` — Copy text to the clipboard (links, IDs, API keys, code). **Not for:** duplicating a record («Duplicar informe») → a `button` or menu item.
- `data-table` — A report's detail: rows that sort, filter, select and export; last on a dashboard. **Not for:** a list of things to open → links or cards; a trend or comparison → a chart.
- `date-picker` — One day from a form field; `DateTimePicker` for a day with its time. **Not for:** only a time → `time-picker`; a report period → `filter` with `type="date"`; an always-visible calendar → `calendar`.
- `delta` — The change against another period: arrow and signed percent; pass a fraction (`0.062` is +6.2 %). **Not for:** no comparison period → show only the figure; never a zero change for missing data.
- `file-dropzone` — Drag or pick a file to import, with each file's state and a one-sentence error. **Not for:** attaching a file to a chat message → `attachment`.
- `filter` — One filter: values of a field (`type="select"`), a number range (`type="range"`) or a period (`type="date"`); the period goes first. **Not for:** AND/OR across fields → `filter-builder`; a number in a form → `number-input`; a day in a form → `date-picker`.
- `filter-builder` — Conditions over different fields joined with Y, O and nested groups. **Not for:** values of one field → `filter` with `type="select"`; showing active filters → `filter-chips`.
- `filter-chips` — Which filters are active, each removable, with «Limpiar todo». **Not for:** adding options to a filter → `filter`.
- `message-feedback` — Rate an assistant answer and explain a critique. **Not for:** a general survey or required data; re-running a failed query → «Reintentar».
- `number-input` — A number with − and + and keyboard arrows: a port, rows per page, a quantity. **Not for:** money → `input-group`; an approximate value → `slider`; codes or folios → `input`.
- `page-header` — The page title, a line about it and its main actions; one per page. **Not for:** a marketing section → `gradient-heading` with `eyebrow`; a card title → the `Card` header.
- `password-input` — A password with show/hide; with `PasswordStrength` (lib `password-strength`) when choosing one. **Not for:** a verification code → `input-otp`; a copyable API key → `input-group` with a copy button.
- `stepper` — Where the person is in a multi-step wizard; few fields per step. **Not for:** sections in any order → `tabs`; a short form → one page.
- `theme-toggle` — Switch the app theme: light, dark or system. **Not for:** changing how a report looks → `tabs` or `toggle-group`.
- `time-picker` — A time from a list: 24 h, every 30 minutes. **Not for:** day and time → `DateTimePicker` (in `date-picker`); a duration → `number-input`.
- `tour` — Introduce a new screen in three to five steps, always skippable, never reopening by itself. **Not for:** explaining one control → its `tooltip` or `field` description; what must be read to use the screen.

## Charts

The brand's charts. Choose by the question: see [data-viz.md](data-viz.md).

- `cartesian-chart` — `LineChart`, `AreaChart`, `BarChart` and `ComboChart`: compare categories and periods. **Not for:** two different units → two charts, never two axes.
- `chart` — Build your own Recharts chart with AuraData colors, legend and tooltip (`chartConfig()`). **Not for:** common lines, areas or bars → `cartesian-chart`.
- `donut-chart` — How a total splits into up to six parts, total in the center. **Not for:** close values or more than six parts → sorted bars.
- `funnel-chart` — Where people drop between ordered steps. **Not for:** independent categories → horizontal bars.
- `gauge` — Progress toward a goal or closeness to a limit (`thresholds`). **Not for:** how you got there → a line; several categories → bars.
- `heatmap` — `Heatmap` for values in two dimensions (sequential or diverging) and `CalendarHeatmap` for day-by-day activity. **Not for:** change over time of one series → a line; plain categories → labels.
- `sparkline` — The shape of a trend next to its figure, in a row or a KPI. **Not for:** reading each value or comparing series → `LineChart`.

## Effects

Motion and decoration for marketing pages and scrolling surfaces; all respect reduced motion. One effect per section.

- `aura-background` — A decorative brand-color background behind a hero or a CTA band. **Not for:** states or categories in a report → text and status tokens.
- `eyebrow` — A short label above a section heading («Conexiones»). **Not for:** replacing the heading; a product status → `badge`.
- `gradient-heading` — Highlight a few headline words with the brand gradient; `as` by hierarchy. **Not for:** body text, control labels or states.
- `marquee` — A continuous, pausable row of logos or cards. **Not for:** content read card by card → `carousel`; essential information → a static list.
- `number-ticker` — Animate a figure on entering view or on value change, formatted with `lib/format`. **Not for:** the change against another period → `delta`.
- `progressive-blur` — Soften the edge of a sticky header or a scrolling list. **Not for:** the only scroll cue, or over text that must always be read.

## Blocks

Full screens with their internal parts. Install the block, then change its data.

- `app-shell` — The app frame: `Sidebar`, top bar with `Breadcrumb` and actions; parts `WorkspaceSwitcher`, `UserMenu`, `NotificationCenter`, `ShortcutsDialog`. **Not for:** a marketing site → `navigation-menu`.
- `chat` — Ask about your data; answers carry charts, KPIs, sources or the SQL run; parts `KpiCard`, `InsightCard`.
- `dashboard` — KPIs, charts and detail in one place, period first; parts `KpiCard`, `ChartCard`.
- `login` — Email and password sign-in with pending and error states. **Not for:** a verification step alone → `input-otp`.
- `not-found` — The 404 page with a way home (`homeHref`). **Not for:** a temporary failure → `EmptyError` with «Reintentar».

## Hooks

- `use-data-table-url-state` — Keep a `data-table` view (search, sort, page, columns, filters) in the URL. **Not for:** named saved views → `use-saved-views`.
- `use-mobile` — `useIsMobile()`: true below 768 px.
- `use-saved-views` — Named views kept in `localStorage` or a custom storage. **Not for:** shareable state → `use-data-table-url-state`.

## Libraries

- `amount-input` — Format a money amount while typing and on blur, keeping the caret. **Not for:** display → `format`.
- `chart-export` — Export a chart as PNG (`exportChartPng`), as the `ChartCard` menu does. **Not for:** table data → `table-export`.
- `chart-palette` — `chartConfig()`, `sequentialFill`, `divergingFill`: brand palettes without writing a color. **Not for:** status colors.
- `date-time` — Time options, the 24 h time of a date, a day at a time. **Not for:** display of a day → `formatDate` in `format`.
- `file-upload` — File size, brand-voice file errors, CSV parsing for previews. Reads text in memory; it does not stream a large file.
- `filter-conditions` — Field types, operators and evaluation behind `filter-builder`.
- `format` — es-MX numbers: `formatCurrency`, `formatCompact`, `formatNumber`, `formatPercent`, `formatDate`. **Not for:** hand-written `toLocaleString` or `Intl` calls.
- `initials` — "Ana López" → "AL", for `avatar`.
- `password-strength` — A password's level and the plain rules behind it.
- `phone` — Mexican phone numbers: normalize, format while typing, validate, E.164.
- `table-export` — Rows to CSV (CSV-injection safe) or .xlsx, and download. **Not for:** chart images → `chart-export`.
