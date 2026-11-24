import { expect, test, type Locator, type Page } from "@playwright/test"

const story = (page: Page, id: string, theme = "light") =>
  page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`)

async function pauseTransition(element: Locator, property: string) {
  await element.evaluate((node, property) => {
    const pause = (event: Event) => {
      if (
        event.target !== node ||
        (event as TransitionEvent).propertyName !== property
      )
        return
      node
        .getAnimations()
        .find(
          (animation) =>
            "transitionProperty" in animation &&
            animation.transitionProperty === property
        )
        ?.pause()
      node.removeEventListener("transitionrun", pause)
    }
    node.addEventListener("transitionrun", pause)
  }, property)
}

async function sampleTransition(
  element: Locator,
  property: string,
  fractions: number[]
) {
  await expect
    .poll(() =>
      element.evaluate(
        (node, property) =>
          node
            .getAnimations()
            .some(
              (animation) =>
                "transitionProperty" in animation &&
                animation.transitionProperty === property &&
                animation.playState === "paused"
            ),
        property
      )
    )
    .toBe(true)

  return element.evaluate(
    (node, { property, fractions }) => {
      const animation = node
        .getAnimations()
        .find(
          (item) =>
            "transitionProperty" in item && item.transitionProperty === property
        )!
      const samples = fractions.map((fraction) => {
        animation.currentTime =
          Number(animation.effect!.getTiming().duration) * fraction
        return {
          value: parseFloat(getComputedStyle(node).getPropertyValue(property)),
          rect: node.getBoundingClientRect().toJSON() as DOMRect,
        }
      })
      animation.finish()
      return samples
    },
    { property, fractions }
  )
}

test("keyboard selection grows the radio dot from its center", async ({
  page,
}) => {
  await story(page, "components-radio-group--default", "dark")
  const selected = page.getByRole("radio").nth(1)
  const next = page.getByRole("radio").nth(2)
  const dot = next.locator('[data-slot="radio-group-indicator"]')

  await expect(selected).toBeChecked()
  await expect(dot).toHaveCSS("scale", "0")
  await pauseTransition(dot, "scale")
  await selected.press("ArrowRight")
  await expect(next).toBeChecked()
  await expect(next).toBeFocused()
  const [start, middle, end] = await sampleTransition(
    dot,
    "scale",
    [0, 0.25, 1]
  )
  const control = (await next.boundingBox())!
  expect(start.rect.width).toBe(0)
  expect(middle.rect.width).toBeGreaterThan(0)
  expect(end.rect.width).toBeGreaterThan(middle.rect.width)
  for (const { rect } of [start, middle, end]) {
    expect(rect.x + rect.width / 2).toBeCloseTo(control.x + control.width / 2)
    expect(rect.y + rect.height / 2).toBeCloseTo(control.y + control.height / 2)
  }

  await page.emulateMedia({ reducedMotion: "reduce" })
  await next.press("ArrowLeft")
  await expect(selected).toBeChecked()
  await expect(dot).toHaveCSS("scale", "0")
  await expect(dot).toHaveCSS("transition-property", "none")
})

test("progress moves forward and back, then snaps with reduced motion", async ({
  page,
}) => {
  await story(page, "components-progress--default")
  const bar = page.getByRole("progressbar")
  const indicator = page.locator('[data-slot="progress-indicator"]')
  const update = page.getByRole("button", { name: "Avanzar" })

  await expect(bar).toHaveAttribute("aria-valuenow", "64")
  await expect(indicator).toHaveCSS("transition-property", "width")
  for (const [label, previous, value] of [
    ["Avanzar", 64, 88],
    ["Avanzar", 88, 100],
    ["Reiniciar", 100, 0],
  ] as const) {
    await pauseTransition(indicator, "width")
    await page.getByRole("button", { name: label }).click()
    await expect(bar).toHaveAttribute("aria-valuenow", String(value))
    const [start, middle, end] = await sampleTransition(
      indicator,
      "width",
      [0, 0.25, 1]
    )
    const trackWidth = (await page
      .locator('[data-slot="progress-track"]')
      .boundingBox())!.width
    expect(start.rect.width / trackWidth).toBeCloseTo(previous / 100, 2)
    expect(end.rect.width / trackWidth).toBeCloseTo(value / 100, 2)
    expect(middle.rect.width).toBeGreaterThan(
      Math.min(start.rect.width, end.rect.width)
    )
    expect(middle.rect.width).toBeLessThan(
      Math.max(start.rect.width, end.rect.width)
    )
  }

  await page.emulateMedia({ reducedMotion: "reduce" })
  await update.click()
  await expect(bar).toHaveAttribute("aria-valuenow", "24")
  await expect(indicator).toHaveCSS("transition-property", "none")
})

test("successful clipboard write draws the check stroke", async ({
  context,
  page,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await story(page, "auradata-copy-button--default", "dark")
  const button = page.getByRole("button", { name: "Copiar" })
  const check = page.locator(
    '[data-slot="copy-button"] svg path[pathLength="1"]'
  )

  await expect(check).toHaveCSS("stroke-dashoffset", "1px")
  await pauseTransition(check, "stroke-dashoffset")
  await button.click()
  await expect(page.getByRole("button", { name: "Copiado" })).toBeVisible()
  await expect(
    page.locator('[aria-live="polite"]').filter({ hasText: "Copiado" })
  ).toBeAttached()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "https://bi.auradata.mx/informes/ventas-2026"
  )
  const [start, middle, end] = await sampleTransition(
    check,
    "stroke-dashoffset",
    [0, 0.25, 1]
  )
  expect(start.value).toBe(1)
  expect(middle.value).toBeGreaterThan(0)
  expect(middle.value).toBeLessThan(1)
  expect(end.value).toBe(0)

  await page.emulateMedia({ reducedMotion: "reduce" })
  await story(page, "auradata-copy-button--default")
  await button.press("Enter")
  await expect(page.getByRole("button", { name: "Copiado" })).toBeVisible()
  await expect(check).toHaveCSS("stroke-dashoffset", "0px")
  await expect(check).toHaveCSS("transition-property", "none")
})

test("the switch stretches inward from each end of its track", async ({
  page,
}) => {
  for (const size of ["default", "sm"]) {
    await story(page, `components-switch--default&args=size:${size}`)
    const control = page.getByRole("switch")
    const thumb = control.locator('[data-slot="switch-thumb"]')
    for (const checked of [false, true]) {
      await expect(control).toHaveAttribute("aria-checked", String(checked))
      const atRest = (await thumb.boundingBox())!
      const box = (await control.boundingBox())!
      await pauseTransition(thumb, "transform")
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.mouse.down()
      const [start, middle, end] = await sampleTransition(
        thumb,
        "transform",
        [0, 0.25, 1]
      )
      expect(start.rect.width).toBeCloseTo(atRest.width)
      expect(middle.rect.width).toBeGreaterThan(atRest.width)
      expect(end.rect.width).toBeGreaterThan(middle.rect.width)
      expect(end.rect.height).toBeCloseTo(atRest.height)
      if (checked) expect(end.rect.right).toBeCloseTo(atRest.x + atRest.width)
      else expect(end.rect.x).toBeCloseTo(atRest.x)
      await pauseTransition(thumb, "transform")
      await page.mouse.up()
      await expect(control).toHaveAttribute("aria-checked", String(!checked))
      const [release, slide, settled] = await sampleTransition(
        thumb,
        "transform",
        [0, 0.25, 1]
      )
      expect(release.rect.x).toBeCloseTo(end.rect.x)
      expect(release.rect.width).toBeCloseTo(end.rect.width)
      expect(settled.rect.width).toBeCloseTo(atRest.width)
      expect(Math.abs(slide.rect.x - release.rect.x)).toBeGreaterThan(0)
      expect(Math.abs(slide.rect.x - release.rect.x)).toBeLessThan(
        Math.abs(settled.rect.x - release.rect.x)
      )
    }

    await page.emulateMedia({ reducedMotion: "reduce" })
    await control.press("Space")
    await expect(control).toBeChecked()
    await expect(thumb).toHaveCSS("transition-property", "none")
    await page.emulateMedia({ reducedMotion: "no-preference" })
  }
})

for (const theme of ["light", "dark"]) {
  test(`stepper markers and connectors do not overlap across widths (${theme})`, async ({
    page,
  }) => {
    await story(page, "auradata-stepper--horizontal", theme)
    const nav = page.getByRole("navigation", { name: "Pasos" })
    await expect(nav.locator('[aria-current="step"]')).toHaveCount(1)
    await page.evaluate(() => document.fonts.ready)
    for (const width of [320, 390, 640, 768, 1024]) {
      await page.setViewportSize({ width, height: 800 })
      await checkStepperLayout(nav, `${width}px viewport`)
    }
    await nav.evaluate((node) => {
      node.style.maxWidth = "342px"
    })
    await checkStepperLayout(nav, "342px container on desktop")
    const current = nav.locator('[aria-current="step"]')
    await expect(current.locator('[data-slot="stepper-title"]')).toBeVisible()
    await expect(
      current.locator('[data-slot="stepper-description"]')
    ).toBeHidden()
    await expect(
      nav.getByText("Base de datos", { exact: false }).first().locator("..")
    ).toHaveCSS("position", "absolute")
  })
}

async function checkStepperLayout(nav: Locator, context: string) {
  const geometry = await nav.evaluate((node) => {
    const rects = (selector: string) =>
      Array.from(
        node.querySelectorAll(selector),
        (el) => el.getBoundingClientRect().toJSON() as DOMRect
      )
    return {
      nav: node.getBoundingClientRect().toJSON() as DOMRect,
      markers: rects('[data-slot="stepper-indicator"]'),
      links: rects('[data-slot="stepper-connector"]'),
      targets: rects("li > :first-child"),
    }
  })
  const { nav: container, markers, links, targets } = geometry
  for (let index = 0; index < markers.length; index++) {
    expect(targets[index].left, context).toBeGreaterThanOrEqual(container.left)
    expect(targets[index].right, context).toBeLessThanOrEqual(
      container.right + 0.1
    )
    if (index === links.length) continue
    expect(links[index].left, context).toBeGreaterThan(markers[index].right)
    expect(links[index].right, context).toBeLessThan(markers[index + 1].left)
    expect(targets[index].right, context).toBeLessThanOrEqual(
      targets[index + 1].left + 0.1
    )
  }
}

test("a completed step can be reopened by keyboard on a phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await story(page, "auradata-stepper--wizard", "dark")
  const connection = page.getByRole("button", { name: "Probar y guardar" })
  await expect(connection).toBeVisible()
  await page.waitForFunction(
    () =>
      (
        window as {
          __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } }
        }
      ).__STORYBOOK_PREVIEW__?.currentRender?.phase === "finished"
  )
  const previous = page.getByRole("button", {
    name: /^Credenciales \(completado\)/,
  })
  await previous.press("Enter")
  await expect(
    page.getByRole("heading", { name: "Credenciales" })
  ).toBeVisible()
  await expect(page.locator('[aria-current="step"]')).toContainText(
    "Credenciales"
  )
})
