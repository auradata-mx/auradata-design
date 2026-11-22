import { expect, test } from "@playwright/test"

/**
 * The theme's print styles (`@media print` in shadcn.css and the registry theme item) on a report in an app
 * shell, opened in dark mode: paper is light and flat, navigation goes, and links print their address.
 */
test.describe("print", () => {
  test.beforeEach(async ({ page }) => {
    // An A4 page at 96 dpi.
    await page.setViewportSize({ width: 794, height: 1123 })
    await page.goto("/iframe.html?id=auradata-print--report&viewMode=story&globals=theme:dark")
    await page.locator("#storybook-root > *").first().waitFor()
    await page.evaluate(() => document.fonts.ready)
  })

  test("a dark report prints light, flat and without navigation", async ({ page }) => {
    await page.emulateMedia({ media: "print" })
    await expect(page.locator("html")).toHaveClass(/dark/)
    const looks = await page.evaluate(() => {
      const style = (selector: string, pseudo?: string) => getComputedStyle(document.querySelector(`#storybook-root ${selector}`)!, pseudo)
      return {
        page: style("[data-slot=sidebar-inset]").backgroundColor,
        text: style("h1").color,
        card: style("[data-slot=card]").boxShadow,
        shadow: (() => {
          const probe = document.createElement("div")
          probe.className = "shadow-md"
          document.querySelector("#storybook-root")!.append(probe)
          const value = getComputedStyle(probe).boxShadow
          probe.remove()
          return value
        })(),
        sidebar: style("[data-slot=sidebar]").display,
        trigger: style("[data-slot=sidebar-trigger]").display,
        breadcrumb: style("nav[aria-label='Ruta de navegación']").display,
        hidden: [...document.querySelectorAll("#storybook-root [data-print=hide]")].map((element) => getComputedStyle(element).display),
        only: style("[data-print=only]").display,
        link: style("a[href^='https']", "::after").content,
        header: style("thead").display,
        row: style("[data-slot=table-row]").breakInside,
      }
    })
    expect(looks.page).toBe("rgb(255, 255, 255)")
    expect(looks.text).toBe("rgb(10, 10, 15)")
    // Drop shadows go; a card keeps its 1px ring, its edge on paper.
    expect(looks.shadow).not.toMatch(/\d+px \d+px [1-9]\d*px/)
    expect(looks.card).toMatch(/0px 0px 0px 1px/)
    expect(looks.sidebar).toBe("none")
    expect(looks.trigger).toBe("none")
    expect(looks.breadcrumb).toBe("none")
    expect(looks.hidden).toEqual(["none", "none"])
    expect(looks.only).not.toBe("none")
    expect(looks.link).toBe('" (https://auradata.mx/datos/ventas)"')
    expect(looks.header).toBe("table-header-group")
    expect(looks.row).toBe("avoid")
    await expect(page).toHaveScreenshot("print/report.png", { fullPage: true })
  })

  test("on screen the report keeps its navigation and hides the print-only line", async ({ page }) => {
    const looks = await page.evaluate(() => ({
      sidebar: getComputedStyle(document.querySelector("[data-slot=sidebar]")!).display,
      only: getComputedStyle(document.querySelector("[data-print=only]")!).display,
      link: getComputedStyle(document.querySelector("a[href^='https']")!, "::after").content,
    }))
    expect(looks.sidebar).not.toBe("none")
    expect(looks.only).toBe("none")
    expect(looks.link).toBe("none")
  })
})
