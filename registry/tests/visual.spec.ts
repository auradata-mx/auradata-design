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
