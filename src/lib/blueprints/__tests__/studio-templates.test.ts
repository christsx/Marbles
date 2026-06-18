import { describe, expect, it } from "vitest"

import { STUDIO_TEMPLATES } from "@/lib/blueprints/studio-templates"
import { getSectionExample } from "@/lib/blueprints/studio-template-examples"
import { buildTemplateEditorDocument } from "@/lib/blueprints/template-to-editor-doc"

const EXPECTED_IDS = [
  "client-discovery",
  "client-proposal",
  "client-sow",
  "client-handoff",
  "marketing-campaign-brief",
  "marketing-launch-plan",
  "marketing-campaign-recap",
  "internal-prd",
  "internal-tech-spec",
  "internal-arc42",
  "internal-change-request",
  "ops-runbook",
  "ops-incident-postmortem",
]

describe("studio template catalog", () => {
  it("includes client, marketing, internal, and ops deliverables", () => {
    const ids = STUDIO_TEMPLATES.map((template) => template.id)
    expect(ids).toEqual(EXPECTED_IDS)
    expect(STUDIO_TEMPLATES).toHaveLength(13)
  })

  it("uses Use when guidance on every template", () => {
    for (const template of STUDIO_TEMPLATES) {
      expect(template.description.startsWith("Use when:")).toBe(true)
    }
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
