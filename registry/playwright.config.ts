import { defineConfig, devices } from "@playwright/test"

/**
 * Visual regression of every story, light and dark, against the built Storybook.
 * Baselines are Linux screenshots: take them with `npm run test:visual:docker`, as CI does.
 * `desktop` runs every story and the docs at 1024×640; `mobile` runs the stories tagged `mobile` at 390×844.
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
  use: { baseURL: "http://127.0.0.1:6008" },
  projects: [
    {
      name: "desktop",
      grepInvert: /@mobile/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 640 },
      },
    },
    {
      name: "mobile",
      grep: /@mobile/,
      // A phone in Chromium: touch, mobile meta viewport; scale 1 keeps the baselines small.
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
      },
    },
  ],
  webServer: {
    command: "node tests/serve.mjs 6008",
    url: "http://127.0.0.1:6008/index.json",
    reuseExistingServer: !process.env.CI,
  },
})
