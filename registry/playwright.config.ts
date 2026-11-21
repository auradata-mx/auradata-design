import { defineConfig, devices } from "@playwright/test"

/**
 * Visual regression of every story, light and dark, against the built Storybook.
 * Baselines are Linux screenshots: take them with `npm run test:visual:docker`, as CI does.
 */
export default defineConfig({
  testDir: "tests",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled" },
  },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:6008",
    viewport: { width: 1024, height: 640 },
  },
  webServer: {
    command: "node tests/serve.mjs 6008",
    url: "http://127.0.0.1:6008/index.json",
    reuseExistingServer: !process.env.CI,
  },
})
