// registry: auradata (a chart card as a PNG: its title, the chart with the theme colors resolved, and its legend)

/** The SVG properties the theme sets through CSS: an SVG drawn as an image sees neither the page's CSS nor its variables. */
const SVG_STYLES = [
  "fill",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-opacity",
  "stroke-dasharray",
  "stroke-linecap",
  "stroke-linejoin",
  "opacity",
  "font-family",
  "font-size",
  "font-weight",
  "visibility",
] as const

/** "Ventas por región" → "ventas-por-region". */
function fileNameOf(title: string) {
  const slug = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return slug || "grafica"
}

/** A copy of the chart's SVG with every themed property written on each element, so it draws the same as an image. */
function inlineSvg(svg: SVGSVGElement) {
  const copy = svg.cloneNode(true) as SVGSVGElement
  const sources = [svg, ...svg.querySelectorAll("*")]
  const targets = [copy, ...copy.querySelectorAll("*")]
  sources.forEach((source, index) => {
    const target = targets[index] as SVGElement
    const computed = getComputedStyle(source)
    for (const property of SVG_STYLES) {
      target.style.setProperty(property, computed.getPropertyValue(property))
    }
  })
  const { width, height } = svg.getBoundingClientRect()
  copy.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  copy.setAttribute("width", String(width))
  copy.setAttribute("height", String(height))
  return { markup: new XMLSerializer().serializeToString(copy), width, height }
}

function loadImage(markup: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("The chart could not be drawn as an image"))
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
  })
}

type LegendEntry = { color: string; label: string; line: boolean; hidden: boolean }

/** The legend of the chart, read from the page: Recharts draws it as HTML, outside the SVG. */
function legendOf(root: HTMLElement): LegendEntry[] {
  const legend = root.querySelector<HTMLElement>('[data-slot="chart-legend"]')
  if (!legend) return []
  return [...legend.children].map((item) => {
    const swatch = item.querySelector<HTMLElement>("div, svg")
    const style = swatch ? getComputedStyle(swatch) : null
    return {
      color: style?.borderTopColor || style?.backgroundColor || "currentColor",
      label: item.textContent?.trim() ?? "",
      line: Boolean(swatch && swatch.getBoundingClientRect().height < 4),
      hidden: item.getAttribute("aria-pressed") === "false",
    }
  })
}

type ChartImageOptions = {
  title?: string
  description?: string
  /** Pixels per CSS pixel: 2 by default, sharp on a retina screen and in a slide. */
  scale?: number
}

/** The chart inside `root` (a chart card or any element holding a `[data-slot=chart]`) as a PNG. */
async function chartToPng(root: HTMLElement, { title, description, scale = 2 }: ChartImageOptions = {}) {
  const svg =
    root.querySelector<SVGSVGElement>('[data-slot="chart"] svg.recharts-surface') ??
    root.querySelector<SVGSVGElement>("svg.recharts-surface")
  if (!svg) throw new Error("There is no chart to export")
  const chart = inlineSvg(svg)
  const image = await loadImage(chart.markup)
  const legend = legendOf(root)
  // Recharts keeps the legend's room inside the SVG: cut it, the legend is drawn right under the plot.
  const legendBox = svg.parentElement?.querySelector(".recharts-legend-wrapper")?.getBoundingClientRect()
  const plotHeight = legendBox ? Math.min(legendBox.top - svg.getBoundingClientRect().top, chart.height) : chart.height

  const page = getComputedStyle(root)
  const font = getComputedStyle(document.body).fontFamily
  const background = page.backgroundColor === "rgba(0, 0, 0, 0)" ? getComputedStyle(document.body).backgroundColor : page.backgroundColor
  const muted = getComputedStyle(svg).getPropertyValue("--muted-foreground") || page.color
  const padding = 24
  const titleHeight = (title ? 24 : 0) + (description ? 20 : 0) + (title || description ? 16 : 0)
  const legendHeight = legend.length ? 36 : 0
  const width = Math.ceil(chart.width + padding * 2)
  const height = Math.ceil(padding + titleHeight + plotHeight + legendHeight + padding)

  const canvas = document.createElement("canvas")
  canvas.width = width * scale
  canvas.height = height * scale
  const context = canvas.getContext("2d")
  if (!context) throw new Error("This browser cannot draw the image")
  context.scale(scale, scale)
  context.fillStyle = background
  context.fillRect(0, 0, width, height)
  context.textBaseline = "top"

  let y = padding
  if (title) {
    context.fillStyle = page.color
    context.font = `500 16px ${font}`
    context.fillText(title, padding, y)
    y += 24
  }
  if (description) {
    context.fillStyle = muted
    context.font = `400 14px ${font}`
    context.fillText(description, padding, y)
    y += 20
  }
  if (title || description) y += 16
  context.drawImage(image, 0, 0, chart.width, plotHeight, padding, y, chart.width, plotHeight)
  y += plotHeight + 12

  if (legend.length) {
    // Centered under the chart, as on the page: a key, its name, 16 px to the next.
    context.font = `400 12px ${font}`
    const widths = legend.map((entry) => 14 + context.measureText(entry.label).width)
    let x = (width - widths.reduce((sum, item) => sum + item, 0) - 16 * (legend.length - 1)) / 2
    legend.forEach((entry, index) => {
      context.globalAlpha = entry.hidden ? 0.5 : 1
      context.fillStyle = entry.color
      if (entry.line) context.fillRect(x, y + 6, 12, 2)
      else context.fillRect(x + 2, y + 3, 8, 8)
      context.fillStyle = entry.hidden ? muted : page.color
      context.fillText(entry.label, x + 14, y + 1)
      x += widths[index] + 16
    })
    context.globalAlpha = 1
  }

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("The image could not be made"))), "image/png")
  )
}

/** Downloads the chart inside `root` as `<file name>.png`; the name comes from the title when none is given. */
async function exportChartPng(root: HTMLElement, options: ChartImageOptions & { fileName?: string } = {}) {
  const blob = await chartToPng(root, options)
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${options.fileName ?? fileNameOf(options.title ?? "")}.png`
  link.click()
  // Long enough for the download to start; the image stays readable by whoever holds the link until then.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
  return blob
}

export { chartToPng, exportChartPng, fileNameOf }
