import { expect, test } from "@playwright/test"

test("navigation submenu opens on hover and avoids motion when requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/iframe.html?id=components-navigation-menu--default&viewMode=story")
  const trigger = page.getByRole("button", { name: "Docs", exact: true })
  await trigger.hover()
  const link = page.getByRole("link", { name: /SQL Lab/ })
  await expect(link).toBeVisible()
  const popup = link.locator("xpath=ancestor::*[contains(@class,'origin-(--transform-origin)')][1]")
  await expect(popup).toHaveCSS("transition-duration", "0s", { timeout: 1500 })
  await trigger.focus()
  await page.keyboard.press("Escape")
  await expect(link).toBeHidden()
})
