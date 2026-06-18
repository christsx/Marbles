import { describe, expect, it } from "vitest"

import { STUDIO_TEMPLATES } from "@/lib/blueprints/studio-templates"
import { resolveTemplateSectionId } from "@/lib/blueprints/template-section-match"

describe("resolveTemplateSectionId", () => {
  it("maps scope of work to Overview on client SOW", () => {
    const template = STUDIO_TEMPLATES.find((item) => item.id === "client-sow")!

    expect(resolveTemplateSectionId("Scope of Work", template)).toBe("overview")
    expect(resolveTemplateSectionId("Statement of Work", template)).toBe(
      "overview"
    )
  })
})
