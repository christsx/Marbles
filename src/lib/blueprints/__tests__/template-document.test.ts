import { describe, expect, it } from "vitest"

import { STUDIO_TEMPLATES } from "@/lib/blueprints/studio-templates"
import { buildTemplateEditorDocument } from "@/lib/blueprints/template-to-editor-doc"
import {
  listTemplateSections,
  mergeChatIntoTemplateDoc,
} from "@/lib/blueprints/template-document"

describe("listTemplateSections", () => {
  it("marks placeholder sections as pending", () => {
    const template = STUDIO_TEMPLATES.find((item) => item.id === "client-sow")!
    const doc = buildTemplateEditorDocument(template)
    const sections = listTemplateSections(doc, template.id)

    expect(sections.length).toBeGreaterThan(0)
    expect(sections.every((section) => section.status === "pending")).toBe(true)
  })
})

describe("mergeChatIntoTemplateDoc", () => {
  it("merges ## sections into the doc and keeps chat prose separate", () => {
    const template = STUDIO_TEMPLATES.find((item) => item.id === "client-sow")!
    const doc = buildTemplateEditorDocument(template)

    const merged = mergeChatIntoTemplateDoc(
      doc,
      template.id,
      "Got it — here's a first pass.\n\n## Overview\nAcme wants a client portal.\n\n## In scope\n- Auth\n- Dashboard"
    )

    expect(merged.chatReply).toContain("Got it")
    expect(merged.updatedSectionIds).toEqual(
      expect.arrayContaining(["overview", "in-scope"])
    )

    const sections = listTemplateSections(merged.content, template.id)
    expect(sections.find((section) => section.id === "overview")?.status).toBe(
      "filled"
    )
  })

  it("maps SOW-style headings to template sections", () => {
    const template = STUDIO_TEMPLATES.find((item) => item.id === "client-sow")!
    const doc = buildTemplateEditorDocument(template)

    const merged = mergeChatIntoTemplateDoc(
      doc,
      template.id,
      "Filled from your brief.\n\n## Scope of Work\nNorthwind needs a billing portal.\n\n## In scope\n- Invoices\n- Payments"
    )

    expect(merged.updatedSectionIds).toEqual(
      expect.arrayContaining(["overview", "in-scope"])
    )

    const sections = listTemplateSections(merged.content, template.id)
    expect(sections.find((section) => section.id === "overview")?.status).toBe(
      "filled"
    )
  })
})
