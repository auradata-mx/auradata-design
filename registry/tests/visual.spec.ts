import { readFileSync } from "node:fs"
import { join } from "node:path"
import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

type Entry = { id: string; type: "story" | "docs"; title: string; name: string }

/** The stories of the built Storybook: build it first (`npm run build-storybook`). */
const index = JSON.parse(
  readFileSync(
    join(import.meta.dirname, "../storybook-static/index.json"),
    "utf8"
  )
) as {
  entries: Record<string, Entry>
}
const stories = Object.values(index.entries).filter(
  (entry) => entry.type === "story"
)
/** "brand-03-tipografía" → "brand-03-tipografia": file names stay ASCII on every OS. */
const ascii = (id: string) =>
  id.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
const docs = Object.values(index.entries).filter(
  (entry) => entry.type === "docs"
)

for (const theme of ["light", "dark"] as const) {
  test.describe(theme, () => {
    for (const story of stories) {
      test(`${story.title} / ${story.name}`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`
        )
        await page.locator("#storybook-root > *").first().waitFor()
        await page.evaluate(() => document.fonts.ready)
        await page.waitForLoadState("networkidle")

        // WCAG A and AA, as the Storybook a11y tests check in light; this pass covers dark too.
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze()
        expect(
          violations.map(
            (v) =>
              `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`
          )
        ).toEqual([])

        await expect(page).toHaveScreenshot(`${theme}/${story.id}.png`, {
          fullPage: true,
        })
      })
    }
  })
}

// The brand guide and the other docs pages: Storybook renders them light only.
test.describe("docs", () => {
  for (const page of docs) {
    test(page.title, async ({ page: browser }) => {
      await browser.goto(`/iframe.html?id=${page.id}&viewMode=docs`)
      await browser.locator(".sbdocs-content").first().waitFor()
      await browser.evaluate(() => document.fonts.ready)
      await browser.waitForLoadState("networkidle")
      const { violations } = await new AxeBuilder({ page: browser })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
      expect(
        violations.map(
          (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`
        )
      ).toEqual([])
      await expect(browser).toHaveScreenshot(`docs/${ascii(page.id)}.png`, {
        fullPage: true,
      })
    })
  }
})
