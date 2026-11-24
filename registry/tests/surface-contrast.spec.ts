import { expect, test, type Locator } from "@playwright/test"

async function contrast(
  surface: Locator,
  backdrop: string,
  textColor = "color",
) {
  return surface.evaluate(
    (element, { backdrop, textColor }) => {
      const style = getComputedStyle(element)
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext("2d")!
      const paint = (color: string) => {
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 1, 1)
      }
      const luminance = () => {
        const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data, (v) => {
          const c = v / 255
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }
      paint(backdrop)
      paint(style.backgroundColor)
      const fill = luminance()
      paint(style.getPropertyValue(textColor))
      const text = luminance()
      return (Math.max(fill, text) + 0.05) / (Math.min(fill, text) + 0.05)
    },
    { backdrop, textColor },
  )
}

for (const theme of ["light", "dark"] as const) {
  test(`glass keeps muted labels readable over an extreme backdrop (${theme})`, async ({ page }) => {
    await page.goto(`/iframe.html?id=components-popover--open&viewMode=story&globals=theme:${theme}`)
    const popup = page.locator('[data-slot="popover-content"]')
    await expect(popup).toBeVisible()
    await expect(popup).toHaveCSS("backdrop-filter", "blur(18px) saturate(1.35)")
    const backdrop = theme === "light" ? "#000" : "#fff"
    expect(await contrast(popup, backdrop, "--muted-foreground")).toBeGreaterThanOrEqual(4.5)
  })

  test(`status badges retain readable text when hovered as links (${theme})`, async ({ page }) => {
    await page.goto(`/iframe.html?id=components-badge--status&viewMode=story&args=asLinks:true&globals=theme:${theme}`)
    for (const variant of ["success", "warning", "info", "destructive"]) {
      const badge = page.locator(`a[data-slot="badge"][data-variant="${variant}"]`)
      await expect(badge).toBeVisible()
      for (const backdrop of ["#000", "#fff"]) {
        expect(await contrast(badge, backdrop), variant).toBeGreaterThanOrEqual(4.5)
      }
      await badge.hover()
      await badge.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
      for (const backdrop of ["#000", "#fff"]) {
        expect(await contrast(badge, backdrop), variant).toBeGreaterThanOrEqual(4.5)
      }
    }
  })
}
