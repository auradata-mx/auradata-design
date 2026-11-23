import { createElement } from "react"
import { addons, types, useStorybookState } from "storybook/manager-api"

import { docsUrlForTitle } from "./docs-link"
import { auradata } from "./theme"

addons.setConfig({ theme: auradata })

/** «Docs» in the toolbar: the docs site page of the story's component (usage, props, install command). */
function DocsLink() {
  const { index, storyId } = useStorybookState()
  const entry = storyId ? index?.[storyId] : undefined
  if (!entry || !("title" in entry)) return null
  return createElement(
    "a",
    {
      href: docsUrlForTitle(entry.title),
      target: "_blank",
      rel: "noreferrer",
      title: "Abrir la página de este componente en el sitio de docs",
      style: { alignSelf: "center", fontSize: 13, fontWeight: 600, padding: "0 8px", color: "inherit" },
    },
    "Docs"
  )
}

addons.register("auradata/docs-link", () => {
  addons.add("auradata/docs-link/tool", {
    type: types.TOOL,
    title: "Docs",
    match: ({ viewMode }) => viewMode === "story",
    render: DocsLink,
  })
})
