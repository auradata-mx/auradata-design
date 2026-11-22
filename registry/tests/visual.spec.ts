import { readFileSync } from "node:fs"
import { join } from "node:path"
import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

type Entry = {
  id: string
  type: "story" | "docs"
  title: string
  name: string
  tags?: string[]
}

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

/**
 * Stories tagged `mobile` run again in the `mobile` project (390×844): the Playwright tag `@mobile`
 * selects them there, and their baselines live under `mobile-light`/`mobile-dark`.
 */
const mobile = stories.filter((story) => story.tags?.includes("mobile"))

for (const theme of ["light", "dark"] as const) {
  test.describe(theme, () => {
    for (const story of stories) {
      test(`${story.title} / ${story.name}`, async ({ page }) => {
        await checkStory(page, story, theme, `${theme}/${story.id}.png`)
      })
    }
  })
  test.describe(`mobile ${theme}`, () => {
    for (const story of mobile) {
      test(
        `${story.title} / ${story.name}`,
        { tag: "@mobile" },
        async ({ page }) => {
          await checkStory(
            page,
            story,
            theme,
            `mobile-${theme}/${story.id}.png`
          )
        }
      )
    }
  })
}

/**
 * WCAG A and AA violations of the page. The Storybook a11y addon runs its own axe after a play
 * function; when the two overlap, axe refuses with "Axe is already running": wait and run again.
 */
async function axe(page: Page) {
  for (let attempt = 1; ; attempt++) {
    try {
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
      return violations
    } catch (error) {
      if (attempt === 5 || !String(error).includes("Axe is already running"))
        throw error
      await page.waitForTimeout(500)
    }
  }
}

/** Renders one story in a theme, runs axe and compares the full-page screenshot. */
async function checkStory(
  page: Page,
  story: Entry,
  theme: "light" | "dark",
  screenshot: string
) {
  await page.goto(
    `/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`
  )
  await page.locator("#storybook-root > *").first().waitFor()
  // A play function opens menus and dialogs on the way: axe and the screenshot wait for it to finish.
  await page.waitForFunction(() => {
    const phase = (
      window as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } }
    ).__STORYBOOK_PREVIEW__?.currentRender?.phase
    return phase === "finished" || phase === "errored" || phase === "aborted"
  })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForLoadState("networkidle")
  // A play may open and close menus or dialogs: axe and the screenshot wait for it to finish, or they
  // catch it halfway (T65). Storybook's render ends in "finished" (or "errored"/"aborted").
  await page.waitForFunction(() => {
    const preview = (window as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } })
      .__STORYBOOK_PREVIEW__
    const phase = preview?.currentRender?.phase
    return phase === undefined || ["finished", "errored", "aborted"].includes(phase)
  })

  // WCAG A and AA, as the Storybook a11y tests check in light; this pass covers dark too.
  const violations = await axe(page)
  expect(
    violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`
    )
  ).toEqual([])

  await expect(page).toHaveScreenshot(screenshot, {
    fullPage: true,
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
      const violations = await axe(browser)
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
