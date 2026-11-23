import { afterEach, describe, expect, test, vi } from "vitest"

import { transitionTheme } from "./theme-toggle"

const originalWindow = globalThis.window
const originalDocument = globalThis.document

afterEach(() => {
  globalThis.window = originalWindow
  globalThis.document = originalDocument
  vi.restoreAllMocks()
})

describe("transitionTheme", () => {
  test("applies immediately when View Transitions are unavailable", () => {
    const apply = vi.fn()
    globalThis.window = {
      self: {} as Window,
      matchMedia: () => ({ matches: false }),
    } as unknown as Window & typeof globalThis
    ;(globalThis.window as { top: Window }).top = globalThis.window.self
    globalThis.document = {} as Document

    transitionTheme(apply)
    expect(apply).toHaveBeenCalledTimes(1)
  })

  test("applies immediately when prefers-reduced-motion is enabled", () => {
    const apply = vi.fn()
    const startViewTransition = vi.fn()
    const selfRef = {} as Window
    globalThis.window = {
      self: selfRef,
      top: selfRef,
      innerWidth: 1200,
      innerHeight: 800,
      matchMedia: () => ({ matches: true }),
    } as unknown as Window & typeof globalThis
    globalThis.document = { startViewTransition } as unknown as Document

    transitionTheme(apply)
    expect(apply).toHaveBeenCalledTimes(1)
    expect(startViewTransition).not.toHaveBeenCalled()
  })

  test("expands a circular clip-path from the trigger center in top-level documents", async () => {
    const apply = vi.fn()
    const animate = vi.fn()
    const dataset: Record<string, string | undefined> = {}
    let resolveReady!: () => void
    let resolveFinished!: () => void
    const ready = new Promise<void>((r) => {
      resolveReady = r
    })
    const finished = new Promise<void>((r) => {
      resolveFinished = r
    })
    const startViewTransition = vi.fn((cb: () => void) => {
      cb()
      return { ready, finished }
    })

    const selfRef = {} as Window
    globalThis.window = {
      self: selfRef,
      top: selfRef,
      innerWidth: 1000,
      innerHeight: 600,
      matchMedia: () => ({ matches: false }),
    } as unknown as Window & typeof globalThis
    globalThis.document = {
      startViewTransition,
      documentElement: { dataset, animate },
    } as unknown as Document

    const origin = {
      getBoundingClientRect: () => ({ left: 900, top: 20, width: 32, height: 32 }),
    } as unknown as HTMLElement

    transitionTheme(apply, origin)
    expect(startViewTransition).toHaveBeenCalledTimes(1)
    expect(apply).toHaveBeenCalledTimes(1)
    expect(dataset.themeTransition).toBe("")

    resolveReady()
    await ready
    await Promise.resolve()

    expect(animate).toHaveBeenCalledTimes(1)
    const [keyframes, options] = animate.mock.calls[0]
    expect(keyframes.clipPath[0]).toBe("circle(0px at 916px 36px)")
    expect(keyframes.clipPath[1]).toMatch(/^circle\(\d+(\.\d+)?px at 916px 36px\)$/)
    expect(options).toMatchObject({ pseudoElement: "::view-transition-new(root)" })

    resolveFinished()
    await finished
    await Promise.resolve()
    expect(dataset.themeTransition).toBeUndefined()
  })
})
