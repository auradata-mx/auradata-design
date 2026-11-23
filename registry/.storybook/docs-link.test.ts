import { describe, expect, it } from "vitest"

import { DOCS_ORIGIN, docsUrlForTitle } from "./docs-link"

describe("docsUrlForTitle", () => {
  it("links a registry component to its docs page", () => {
    expect(docsUrlForTitle("AuraData/Button group")).toBe(`${DOCS_ORIGIN}/docs/components/button-group/`)
  })

  it("aliases the stories whose title does not read as the item name", () => {
    expect(docsUrlForTitle("AuraData/Charts")).toBe(`${DOCS_ORIGIN}/docs/components/chart/`)
    expect(docsUrlForTitle("AuraData/Empty state")).toBe(`${DOCS_ORIGIN}/docs/components/empty/`)
    expect(docsUrlForTitle("AuraData/Empty illustrations")).toBe(`${DOCS_ORIGIN}/docs/components/empty-illustration/`)
  })

  it("links the Depth showcase to the elevation guide of the brand docs", () => {
    expect(docsUrlForTitle("AuraData/Depth")).toBe(
      `${DOCS_ORIGIN}/docs/brand/espaciado/#sombras-y-elevación`,
    )
  })

  it("sends blocks to the blocks gallery and unknown titles to the components index", () => {
    expect(docsUrlForTitle("Blocks/Login")).toBe(`${DOCS_ORIGIN}/docs/blocks/`)
    expect(docsUrlForTitle("Components/Card")).toBe(`${DOCS_ORIGIN}/docs/components/`)
  })
})
