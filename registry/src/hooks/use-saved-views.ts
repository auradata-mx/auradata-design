// registry: auradata (named views saved in the browser, or in any storage you pass: list, save, delete)
import * as React from "react"

type SavedView<T> = { id: string; name: string; value: T }

/** What the views are kept in: `localStorage` by default; anything with `getItem`/`setItem` (a server-backed cache). */
type ViewStorage = Pick<Storage, "getItem" | "setItem">

const storageKey = (key: string) => `auradata:views:${key}`
const sameName = (a: string, b: string) => a.trim().toLocaleLowerCase("es") === b.trim().toLocaleLowerCase("es")

/** The views saved under a key; none when there is no storage or what is there cannot be read. */
function readViews<T>(storage: ViewStorage | undefined, key: string): SavedView<T>[] {
  try {
    const views = JSON.parse(storage?.getItem(storageKey(key)) ?? "[]") as unknown
    return Array.isArray(views) ? (views as SavedView<T>[]) : []
  } catch {
    return []
  }
}

/** Adds a view; one with the same name (case and spaces aside) is replaced, keeping its id and place. */
function addView<T>(views: SavedView<T>[], name: string, value: T): SavedView<T>[] {
  const clean = name.trim()
  const twin = views.find((view) => sameName(view.name, clean))
  if (twin) return views.map((view) => (view === twin ? { ...view, name: clean, value } : view))
  const id = globalThis.crypto?.randomUUID?.() ?? `view-${Date.now()}-${views.length}`
  return [...views, { id, name: clean, value }]
}

function removeView<T>(views: SavedView<T>[], id: string) {
  return views.filter((view) => view.id !== id)
}

/**
 * Named views kept under a key: `views`, `save(name, value)` (the same name replaces it) and `remove(id)`. Kept in
 * `localStorage` unless a `storage` is given; every instance with the same key reads the same list.
 */
function useSavedViews<T>(key: string, { storage }: { storage?: ViewStorage } = {}) {
  const store = storage ?? (typeof window === "undefined" ? undefined : window.localStorage)
  const [views, setViews] = React.useState<SavedView<T>[]>(() => readViews<T>(store, key))

  const write = (next: SavedView<T>[]) => {
    setViews(next)
    try {
      store?.setItem(storageKey(key), JSON.stringify(next))
    } catch {
      // A full or blocked storage keeps the views for this visit.
    }
  }

  return {
    views,
    save: (name: string, value: T) => {
      const next = addView(views, name, value)
      write(next)
      return next.find((view) => sameName(view.name, name))!
    },
    remove: (id: string) => write(removeView(views, id)),
  }
}

export { addView, readViews, removeView, useSavedViews, type SavedView, type ViewStorage }
