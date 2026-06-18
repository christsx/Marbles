import { describe, expect, it } from "vitest"

import {
  ATTACHMENT_SCOPING_PROMPT,
  buildWorkflowPromptBlock,
  resolveAttachmentOnlyPrompt,
  resolveStudioDeliverable,
  shouldOpenDeliverablePanel,
} from "@/lib/blueprints/workflow-prompt"
import { templateAllowsRepo } from "@/lib/blueprints/studio-templates"

describe("resolveAttachmentOnlyPrompt", () => {
  it("uses scoping prompt by default", () => {
    expect(resolveAttachmentOnlyPrompt(null)).toBe(ATTACHMENT_SCOPING_PROMPT)
  })

  it("uses client SOW prompt for that template", () => {
    const prompt = resolveAttachmentOnlyPrompt("client-sow")
    expect(prompt).toContain("statement of work")
  })

  it("uses PRD prompt for internal template", () => {
    const prompt = resolveAttachmentOnlyPrompt("internal-prd")
    expect(prompt).toContain("PRD")
  })
})

describe("buildWorkflowPromptBlock", () => {
  it("returns null without template", () => {
    expect(buildWorkflowPromptBlock(null)).toBeNull()
  })

  it("includes template title and sections", () => {
    const block = buildWorkflowPromptBlock("client-sow")
    expect(block).toContain("Statement of Work")
    expect(block).toContain("Implementation tasks")
    expect(block).toContain("Do not reference GitHub")
  })

  it("allows repo for arc42 template", () => {
    const block = buildWorkflowPromptBlock("internal-arc42")
    expect(block).toContain("Repo context may inform")
  })

  it("returns null for unknown slug", () => {
    expect(buildWorkflowPromptBlock("not-a-real-template")).toBeNull()
  })
})

describe("resolveStudioDeliverable", () => {
  it("prefers explicit detection", () => {
    expect(
      resolveStudioDeliverable({
        prompt: "hello",
        hasAttachments: true,
        detected: "prd",
      })
    ).toBe("prd")
  })

  it("defaults attachments to sow without template", () => {
    expect(
      resolveStudioDeliverable({
        prompt: "",
        hasAttachments: true,
      })
    ).toBe("sow")
  })

  it("maps client SOW template to sow", () => {
    expect(
      resolveStudioDeliverable({
        prompt: "",
        workflowId: "client-sow",
        hasAttachments: false,
      })
    ).toBe("sow")
  })

  it("maps internal PRD template to prd", () => {
    expect(
      resolveStudioDeliverable({
        prompt: "",
        workflowId: "internal-prd",
        hasAttachments: false,
      })
    ).toBe("prd")
  })

  it("returns null for plain chat", () => {
    expect(
      resolveStudioDeliverable({
        prompt: "What is Redis?",
        hasAttachments: false,
      })
    ).toBeNull()
  })
})

describe("templateAllowsRepo", () => {
  it("blocks repo for client templates", () => {
    expect(templateAllowsRepo("client-sow")).toBe(false)
  })

  it("allows repo for arc42 template", () => {
    expect(templateAllowsRepo("internal-arc42")).toBe(true)
  })
})

describe("shouldOpenDeliverablePanel", () => {
  it("covers prose deliverables only", () => {
    expect(shouldOpenDeliverablePanel("sow")).toBe(true)
    expect(shouldOpenDeliverablePanel("prd")).toBe(true)
    expect(shouldOpenDeliverablePanel(null)).toBe(false)
  })
})
