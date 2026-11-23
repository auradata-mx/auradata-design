import { expect } from 'storybook/test'

/** The sRGB of any CSS color (oklab, color-mix, alpha…) painted over a background, read back from a canvas. */
export function paint(color: string, background: string) {
  const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
  context.fillStyle = background
  context.fillRect(0, 0, 1, 1)
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)]
}

const luminance = (rgb: number[]) => {
  const [r, g, b] = rgb.map((value) => {
    const c = value / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const contrast = (a: number[], b: number[]) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (high + 0.05) / (low + 0.05)
}

/** Runs `check` in light and then in dark, restoring the theme the story started in. */
export async function inBothThemes(element: HTMLElement, check: (dark: boolean) => Promise<void> | void) {
  const root = document.documentElement
  const wasDark = root.classList.contains('dark')
  // transition-colors would report the color halfway to the new theme.
  element.style.transition = 'none'
  try {
    for (const dark of [false, true]) {
      root.classList.toggle('dark', dark)
      await check(dark)
    }
  } finally {
    root.classList.toggle('dark', wasDark)
    element.style.transition = ''
  }
}

/**
 * A field's edge is the theme's soft `--field-border`, light and dark: visible against the page (1.5:1 or more)
 * but quiet; the label and the sunken shadow identify the field, and focus turns the edge Azul Aura.
 */
export async function expectSoftFieldBorder(element: HTMLElement) {
  await inBothThemes(element, async (dark) => {
    const probe = document.createElement('span')
    probe.style.color = getComputedStyle(document.documentElement).getPropertyValue('--field-border').trim()
    document.body.append(probe)
    const field = getComputedStyle(probe).color
    probe.remove()
    await expect(getComputedStyle(element).borderTopColor, dark ? 'dark' : 'light').toBe(field)
    const background = paint(getComputedStyle(document.body).getPropertyValue('--background'), '#fff')
    const border = paint(getComputedStyle(element).borderTopColor, `rgb(${background.join(' ')})`)
    await expect(contrast(border, background), dark ? 'dark' : 'light').toBeGreaterThanOrEqual(1.5)
  })
}

/** The element's border is exactly the theme's `--destructive`, light and dark (no 50 % tint). */
export async function expectDestructiveBorder(element: HTMLElement) {
  await inBothThemes(element, async (dark) => {
    const probe = document.createElement('span')
    probe.style.color = getComputedStyle(document.documentElement).getPropertyValue('--destructive').trim()
    document.body.append(probe)
    const destructive = getComputedStyle(probe).color
    probe.remove()
    await expect(getComputedStyle(element).borderTopColor, dark ? 'dark' : 'light').toBe(destructive)
  })
}

/** Leaves the story without a focused control, so the screenshot shows its resting state. */
export const blur = () => (document.activeElement as HTMLElement | null)?.blur()
