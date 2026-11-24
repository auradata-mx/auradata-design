import { expect, test, type Locator, type Page } from "@playwright/test"

const slot = (name: string) => `[data-slot="${name}"]`

async function story(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`)
  await page.waitForFunction(() => {
    const preview = (window as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } })
      .__STORYBOOK_PREVIEW__
    return preview?.currentRender?.phase === "finished"
  })
}

async function checkEdges(viewport: Locator, start: string, end: string, shown: "none" | "start" | "end" | "both") {
  const frame = viewport.locator("..")
  const edge = (side: string) => frame.locator(`:scope > [aria-hidden="true"] > ${slot("progressive-blur")}[data-side="${side}"]`)
  await expect(edge(start)).toHaveCSS("opacity", shown === "both" || shown === "start" ? "1" : "0")
  await expect(edge(end)).toHaveCSS("opacity", shown === "both" || shown === "end" ? "1" : "0")
  await expect(edge(end)).toHaveCSS("pointer-events", "none")
  await expect(edge(end)).toHaveAttribute("aria-hidden", "true")
}

async function scrollTo(viewport: Locator, fraction: number, axis: "x" | "y", rtl = false) {
  const { target } = await viewport.evaluate((element, { fraction, axis, rtl }) => {
    const max = axis === "x" ? element.scrollWidth - element.clientWidth : element.scrollHeight - element.clientHeight
    const target = Math.round(max * fraction) * (rtl ? -1 : 1)
    if (axis === "x") element.scrollLeft = target
    else element.scrollTop = target
    return { target }
  }, { fraction, axis, rtl })
  await expect.poll(() => viewport.evaluate((element, axis) => axis === "x" ? element.scrollLeft : element.scrollTop, axis))
    .toBe(target)
}

test("attachment overflow follows RTL without taking the remove button's focus or snap behavior", async ({ page }) => {
  await story(page, "components-attachment--default")
  const viewport = page.locator(slot("attachment-group"))
  await checkEdges(viewport, "left", "right", "none")
  await page.setViewportSize({ width: 176, height: 640 })
  await viewport.evaluate((element) => {
    element.ownerDocument.documentElement.dir = "rtl"
    element.scrollLeft = 0
  })
  await expect(viewport).toHaveCSS("scroll-snap-type", "x mandatory")
  await checkEdges(viewport, "right", "left", "end")

  // Keep an exact intermediate native offset rather than letting two attachment cards snap there.
  await viewport.evaluate((element) => { element.style.scrollSnapType = "none" })
  await scrollTo(viewport, 0.5, "x", true)
  await checkEdges(viewport, "right", "left", "both")
  await scrollTo(viewport, 1, "x", true)
  await checkEdges(viewport, "right", "left", "start")
  const remove = viewport.getByRole("button", { name: "Quitar ventas.xlsx" })
  await remove.focus()
  await expect(remove).toBeFocused()
  await remove.click()
})

for (const mobile of [false, true]) {
  test(`sidebar content keeps its native buttons and scroll edges (${mobile ? "mobile drawer" : "desktop"})`, async ({ page }) => {
    if (mobile) await page.setViewportSize({ width: 390, height: 844 })
    await story(page, `components-sidebar--${mobile ? "mobile" : "default"}`)
    const viewport = page.locator(slot("sidebar-content"))
    if (mobile) await expect(page.getByRole("dialog", { name: "Barra lateral" })).toBeVisible()
    await expect(viewport.getByRole("button", { name: "Informes" })).toBeVisible()
    await viewport.locator(slot("sidebar-group")).evaluate((element) => { element.style.minHeight = "1200px" })
    await scrollTo(viewport, 0, "y")
    await checkEdges(viewport, "top", "bottom", "end")
    await scrollTo(viewport, 0.5, "y")
    await checkEdges(viewport, "top", "bottom", "both")
    await scrollTo(viewport, 1, "y")
    await checkEdges(viewport, "top", "bottom", "start")
  })
}

test("calendar heatmap starts at the latest week and keeps the keyboard scroll target", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await story(page, "auradata-heatmap--calendar")
  const viewport = page.getByRole("img", { name: /^Consultas por día en 2026/ })
  await expect.poll(() => viewport.evaluate((element) =>
    element.scrollWidth - element.clientWidth - element.scrollLeft)).toBe(0)
  await checkEdges(viewport, "left", "right", "start")
  await viewport.press("ArrowLeft")
  await expect(viewport).toBeFocused()
  await checkEdges(viewport, "left", "right", "both")
  await scrollTo(viewport, 0, "x")
  await checkEdges(viewport, "left", "right", "end")
})

test("heatmap values stay in the named table while its own viewport scrolls", async ({ page }) => {
  await page.setViewportSize({ width: 350, height: 620 })
  await story(page, "auradata-heatmap--sequential")
  const viewport = page.getByRole("region", { name: "Consultas por día y hora" })
  await expect(viewport.getByRole("table", { name: "Consultas por día y hora" })).toBeVisible()
  await checkEdges(viewport, "left", "right", "end")
  await scrollTo(viewport, 0.5, "x")
  await checkEdges(viewport, "left", "right", "both")
  await scrollTo(viewport, 1, "x")
  await checkEdges(viewport, "left", "right", "start")
})

test("chart data still scrolls inside the dialog without replacing its table", async ({ page }) => {
  await story(page, "auradata-chart-card--data-open")
  const dialog = page.getByRole("dialog", { name: "Ventas por región" })
  const table = dialog.getByRole("table")
  await expect(table.getByRole("row")).toHaveCount(5)
  const viewport = table.locator("../..")
  await table.evaluate((element) => { element.style.minWidth = "900px" })
  await checkEdges(viewport, "left", "right", "end")
  await scrollTo(viewport, 1, "x")
  await checkEdges(viewport, "left", "right", "start")
  await viewport.evaluate((element) => { element.style.maxHeight = "64px" })
  await scrollTo(viewport, 0, "y")
  await checkEdges(viewport, "top", "bottom", "end")
  await scrollTo(viewport, 0.5, "y")
  await checkEdges(viewport, "top", "bottom", "both")
  await scrollTo(viewport, 1, "y")
  await checkEdges(viewport, "top", "bottom", "start")
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(page.getByRole("button", { name: "Opciones de la gráfica" })).toBeFocused()
})

test("code block scrolls natively with its preformatted keyboard target intact", async ({ page }) => {
  await story(page, "components-code-block--highlighted-sql")
  const code = page.locator('pre[aria-label="SQL: ventas por región"]')
  await code.evaluate((element) => {
    element.style.maxHeight = "64px"
    element.style.maxWidth = "160px"
  })
  await code.focus()
  await expect(code).toBeFocused()
  await expect(page.locator(slot("code-block"))).not.toHaveCSS("box-shadow", "none")
  await scrollTo(code, 0, "x")
  await checkEdges(code, "left", "right", "end")
  await scrollTo(code, 0.5, "x")
  await checkEdges(code, "left", "right", "both")
  await scrollTo(code, 1, "x")
  await checkEdges(code, "left", "right", "start")
})

test("long error details keep native disclosure and scroll boundaries", async ({ page }) => {
  await story(page, "auradata-error-state--with-detail")
  const accordion = page.locator("details")
  const detail = accordion.locator("pre")
  await expect(detail).toBeHidden()
  await accordion.locator("summary").press("Enter")
  await expect(detail).toBeVisible()
  await detail.evaluate((element) => { element.style.maxHeight = "32px" })
  await scrollTo(detail, 0, "y")
  await checkEdges(detail, "top", "bottom", "end")
  await scrollTo(detail, 0.5, "y")
  await checkEdges(detail, "top", "bottom", "both")
  await scrollTo(detail, 1, "y")
  await checkEdges(detail, "top", "bottom", "start")
})

test("empty chat suggestions scroll before the composer without moving the composer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 320 })
  await story(page, "blocks-app--chat-empty")
  const chat = page.locator(slot("chat"))
  const viewport = chat.getByRole("list", { name: "Sugerencias" }).locator("../..")
  await chat.evaluate((element) => { element.style.height = "160px" })
  const composer = chat.getByRole("textbox", { name: "Mensaje" })
  const y = (await composer.boundingBox())?.y
  await scrollTo(viewport, 0, "y")
  await checkEdges(viewport, "top", "bottom", "end")
  await scrollTo(viewport, 1, "y")
  await checkEdges(viewport, "top", "bottom", "start")
  expect((await composer.boundingBox())?.y).toBe(y)
})
