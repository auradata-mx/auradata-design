import { describe, expect, it } from "vitest"

import { addView, readViews, removeView, type SavedView } from "./use-saved-views"

/** A Storage in memory, as `localStorage` behaves. */
function memory(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value), data }
}

describe("readViews", () => {
  it("reads the saved views of a key", () => {
    const views: SavedView<string>[] = [{ id: "v1", name: "Por nombre", value: "sort=nombre.asc" }]
    expect(readViews(memory({ "auradata:views:informes": JSON.stringify(views) }), "informes")).toEqual(views)
  })

  it("starts empty without storage, with nothing saved, or with something it cannot read", () => {
    expect(readViews(undefined, "informes")).toEqual([])
    expect(readViews(memory(), "informes")).toEqual([])
    expect(readViews(memory({ "auradata:views:informes": "{oops" }), "informes")).toEqual([])
    expect(readViews(memory({ "auradata:views:informes": '{"not":"a list"}' }), "informes")).toEqual([])
  })
})

describe("addView", () => {
  it("adds a view at the end with a new id", () => {
    const views = addView([], "Por nombre", "sort=nombre.asc")
    expect(views).toHaveLength(1)
    expect(views[0]).toMatchObject({ name: "Por nombre", value: "sort=nombre.asc" })
    expect(views[0].id).toMatch(/\S/)
  })

  it("replaces a view with the same name (ignoring case and spaces) instead of adding a twin", () => {
    const first = addView([], "Por nombre", "sort=nombre.asc")
    const again = addView(first, "  por NOMBRE ", "sort=nombre.desc")
    expect(again).toHaveLength(1)
    expect(again[0]).toMatchObject({ id: first[0].id, name: "por NOMBRE", value: "sort=nombre.desc" })
  })
})

describe("removeView", () => {
  it("removes a view by id", () => {
    const views = addView(addView([], "A", 1), "B", 2)
    expect(removeView(views, views[0].id).map((view) => view.name)).toEqual(["B"])
  })
})
