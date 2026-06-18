import { describe, expect, it } from "vitest"

import { STUDIO_TEMPLATES } from "@/lib/blueprints/studio-templates"
import { getSectionExample } from "@/lib/blueprints/studio-template-examples"
import { buildTemplateEditorDocument } from "@/lib/blueprints/template-to-editor-doc"

describe("studio template catalog", () => {
  it("includes common client and internal deliverables", () => {
    const ids = STUDIO_TEMPLATES.map((template) => template.id)
    expect(ids).toEqual(
      expect.arrayContaining([
        "client-sow",
        "client-proposal",
        "client-discovery",
        "client-handoff",
        "internal-prd",
        "internal-tech-spec",
        "internal-arc42",
        "internal-change-request",
      ])
    )
  })

  it("provides example content for every section", () => {
    for (const template of STUDIO_TEMPLATES) {
      for (const section of template.sections) {
        expect(getSectionExample(template.id, section.heading)?.trim().length).toBeGreaterThan(
          10
        )
      }
    }
  })
})

describe("buildTemplateEditorDocument", () => {
  it("builds a full example document with lists and paragraphs", () => {
    const template = STUDIO_TEMPLATES.find((item) => item.id === "client-sow")!
    const doc = buildTemplateEditorDocument(template)

    expect(doc.blocks[0]?.type).toBe("header")
    expect(doc.blocks.some((block) => block.type === "list")).toBe(true)
    expect(doc.blocks.filter((block) => block.type === "header").length).toBeGreaterThan(2)
    expect(doc.blocks.some((block) => block.type === "paragraph")).toBe(true)
  })
})
