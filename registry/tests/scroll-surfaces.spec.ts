import { expect, test, type Locator, type Page } from "@playwright/test"

const slot = (name: string) => `[data-slot="${name}"]`
const edge = (frame: Locator, side: string) =>
  frame.locator(`${slot("progressive-blur")}[data-side="${side}"]`)

async function story(page: Page, id: string, theme = "light") {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`)
  await expect(page.locator("#storybook-root > *").first()).toBeVisible()
}

async function checkEdge(frame: Locator, side: string, shown: boolean) {
  const blur = edge(frame, side)
  await expect(blur).toHaveCSS("opacity", shown ? "1" : "0")
  await expect(blur).toHaveCSS("pointer-events", "none")
  await expect(blur).toHaveAttribute("aria-hidden", "true")
}

async function waitForPhase(page: Page) {
  await page.waitForFunction(() => {
    const preview = (window as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } })
      .__STORYBOOK_PREVIEW__
    return preview?.currentRender?.phase === "finished"
  })
}

test("carousel updates logical blur edges with its keyboard controls", async ({ page }) => {
  await story(page, "components-carousel--screenshots")
  const frame = page.locator(slot("carousel"))
  await checkEdge(frame, "left", false)
  await checkEdge(frame, "right", true)
  const next = page.getByRole("button", { name: "Captura siguiente" })
  await next.focus()
  await next.press("ArrowRight")
  await checkEdge(frame, "left", true)
  await checkEdge(frame, "right", true)
  await next.press("ArrowRight")
  await checkEdge(frame, "right", false)
  await expect(next).toBeDisabled()
})

test("message scroller follows new messages at the end without moving the jump button under the blur", async ({ page }) => {
  await story(page, "auradata-message-scroller--append")
  const frame = page.locator(slot("message-scroller"))
  const viewport = frame.locator(slot("message-scroller-viewport"))
  const append = page.getByRole("button", { name: "Add update" })
  await checkEdge(frame, "top", false)
  await checkEdge(frame, "bottom", false)
  for (let i = 0; i < 6; i++) await append.click()
  await checkEdge(frame, "top", true)
  await checkEdge(frame, "bottom", false)
  await viewport.press("Home")
  await checkEdge(frame, "top", false)
  await checkEdge(frame, "bottom", true)
  await append.click()
  await checkEdge(frame, "bottom", true)
  await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBe(0)
  await page.getByRole("button", { name: "Ir al final" }).click()
  await checkEdge(frame, "bottom", false)
  await checkEdge(frame, "top", true)
})

const nativeSurfaces = [
  { id: "components-combobox--open", viewport: "combobox-list", frame: "combobox-content" },
  { id: "components-command--default", viewport: "command-list", frame: "command" },
  { id: "components-dropdown-menu--open", viewport: "dropdown-menu-content", frame: null },
  { id: "components-context-menu--open", viewport: "context-menu-content", frame: null },
  { id: "components-scroll-area--default", viewport: "scroll-area-viewport", frame: "scroll-area" },
  { id: "auradata-notification-center--open", viewport: "notification-list-viewport", frame: "popover-content" },
  { id: "auradata-shortcuts-dialog--open", viewport: "shortcuts-list-viewport", frame: "dialog-content" },
] as const

for (const surface of nativeSurfaces) {
  test(`${surface.viewport} shows blur only where native overflow remains`, async ({ page }) => {
    await story(page, surface.id)
    await waitForPhase(page)
    const viewport = page.locator(slot(surface.viewport))
    const frame = surface.frame ? page.locator(slot(surface.frame)) : viewport.locator("..")
    await expect(viewport).toBeVisible()
    // Resize the real viewport; keep the original component's nodes and event handlers.
    await viewport.evaluate((element) => {
      element.style.maxHeight = "48px"
      element.scrollTop = 0
    })
    await checkEdge(frame, "top", false)
    await checkEdge(frame, "bottom", true)
    await viewport.evaluate((element) => { element.scrollTop = element.scrollHeight })
    await checkEdge(frame, "top", true)
    await checkEdge(frame, "bottom", false)
  })
}

test("horizontal ScrollArea edges follow RTL and leave keyboard scrolling native", async ({ page }) => {
  await story(page, "components-scroll-area--horizontal")
  const frame = page.locator(slot("scroll-area"))
  const viewport = frame.locator(slot("scroll-area-viewport"))
  await frame.evaluate((element) => { element.dir = "rtl" })
  await viewport.evaluate((element) => { element.scrollLeft = 0 })
  await checkEdge(frame, "right", false)
  await checkEdge(frame, "left", true)
  await viewport.press("ArrowLeft")
  await checkEdge(frame, "right", true)
  await viewport.evaluate((element) => { element.scrollLeft = -element.scrollWidth })
  await checkEdge(frame, "right", true)
  await checkEdge(frame, "left", false)
})

test("select's native arrows mark remaining options without replacing its listbox", async ({ page }) => {
  await story(page, "components-select--overflow")
  const listbox = page.getByRole("listbox")
  const popup = page.locator(slot("select-content"))
  await expect(listbox.getByRole("option", { name: "Period 1", exact: true })).toBeVisible()
  await expect(edge(popup, "bottom")).toBeVisible()
  await expect(edge(popup, "top")).toHaveCount(0)
  await listbox.evaluate((element) => { element.scrollTop = element.scrollHeight })
  await expect(edge(popup, "top")).toBeVisible()
  await expect(edge(popup, "bottom")).toHaveCount(0)
  await page.keyboard.press("Escape")
  await expect(listbox).toBeHidden()
  await expect(page.getByRole("combobox", { name: "Period" })).toBeFocused()
})

async function checkGlass(page: Page, popup: Locator) {
  await expect(popup).toBeVisible()
  await expect(popup).toHaveCSS("backdrop-filter", "blur(18px) saturate(1.35)")
  await page.emulateMedia({ forcedColors: "active" })
  await expect(popup).toHaveCSS("backdrop-filter", "none")
}

for (const theme of ["light", "dark"]) {
  test(`navigation popup uses shared glass with a forced-colors fallback (${theme})`, async ({ page }) => {
    await story(page, "components-navigation-menu--default", theme)
    await page.getByRole("button", { name: "Docs" }).hover()
    await checkGlass(page, page.locator(slot("navigation-menu-popup")))
  })

  test(`tour popup uses shared glass with a forced-colors fallback (${theme})`, async ({ page }) => {
    await story(page, "auradata-tour--default", theme)
    await checkGlass(page, page.getByRole("dialog", { name: "Crea un informe" }))
  })
}
