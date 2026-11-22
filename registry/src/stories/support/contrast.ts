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

/** The WCAG contrast ratio of two sRGB colors. */
export function contrast(a: number[], b: number[]) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (high + 0.05) / (low + 0.05)
}

export const rgb = (color: number[]) => `rgb(${color.join(' ')})`

/** The page background of the current theme, as sRGB. */
export const pageBackground = () =>
  paint(getComputedStyle(document.body).getPropertyValue('--background'), '#fff')

/** A theme token (such as `--success`) resolved to sRGB over the page. */
export const token = (name: string) =>
  paint(getComputedStyle(document.body).getPropertyValue(name), rgb(pageBackground()))

/** Runs `check` in light and then in dark, and puts the theme back. */
export async function inBothThemes(check: (theme: 'light' | 'dark') => Promise<void>) {
  const root = document.documentElement
  const wasDark = root.classList.contains('dark')
  try {
    for (const dark of [false, true]) {
      root.classList.toggle('dark', dark)
      await check(dark ? 'dark' : 'light')
    }
  } finally {
    root.classList.toggle('dark', wasDark)
  }
}
