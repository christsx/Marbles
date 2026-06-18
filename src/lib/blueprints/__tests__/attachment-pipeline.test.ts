import fs from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { formatAttachmentContextBlock } from "@/lib/blueprints/format-attachment-context"
import { extractAttachmentText } from "@/lib/blueprints/extract-attachment-text"
import { buildBlueprintResearchUserPrompt } from "@/lib/blueprints/research-prompt"
import { ATTACHMENT_SCOPING_PROMPT } from "@/lib/blueprints/workflow-prompt"
import type { BlueprintResearchContext } from "@/lib/blueprints/research-context"

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "clickup-automation-brief.txt"
)

const sampleBrief = fs.readFileSync(fixturePath, "utf-8")

const baseResearch = (
  attachmentBlock: string | null
): BlueprintResearchContext => ({
  connected: false,
  activeRepo: null,
  verifiedBlock:
    "No repo attached for this message. Use general engineering knowledge; don't make up project-specific facts.",
  narrativeBlock: "",
  systemScopeBlock: "General chat.",
  infraBlock: null,
  correctionsBlock: null,
  attachmentBlock,
})

describe("extractAttachmentText with test doc fixture", () => {
  it("reads txt fixture content", async () => {
    const result = await extractAttachmentText(
      Buffer.from(sampleBrief, "utf-8"),
      "clickup-automation-brief.txt",
      "text/plain"
    )

    expect(result.text).toContain("MOVE TO PRODUCTION")
    expect(result.text).toContain("Mirror Mirror Inc")
    expect(result.text).toContain("ClickUp space")
  })

  it("rejects legacy doc with helpful note", async () => {
    const result = await extractAttachmentText(
      Buffer.from("fake", "utf-8"),
      "brief.doc",
      "application/msword"
    )

    expect(result.text).toBeNull()
    expect(result.note).toContain(".docx")
  })

  it("rejects image uploads for inline text", async () => {
    const result = await extractAttachmentText(
      Buffer.from("fake", "utf-8"),
      "screenshot.png",
      "image/png"
    )

    expect(result.text).toBeNull()
    expect(result.note).toContain("image")
  })

  it("reads markdown files as text", async () => {
    const result = await extractAttachmentText(
      Buffer.from("# Title\n\nBody", "utf-8"),
      "notes.md",
      "text/markdown"
    )

    expect(result.text).toBe("# Title\n\nBody")
  })
})

describe("formatAttachmentContextBlock with test doc", () => {
  it("wraps extracted brief for Groq prompt", () => {
    const block = formatAttachmentContextBlock([
      { label: "clickup-automation-brief.txt", text: sampleBrief },
    ])

    expect(block).toContain("USER ATTACHMENTS")
    expect(block).toContain("File: clickup-automation-brief.txt")
    expect(block).toContain("Amber manually")
  })

  it("returns null for empty parts", () => {
    expect(formatAttachmentContextBlock([])).toBeNull()
  })

  it("includes failure note when text missing", () => {
    const block = formatAttachmentContextBlock([
      {
        label: "scan.pdf",
        text: null,
        note: "PDF had no extractable text",
      },
    ])

    expect(block).toContain("PDF had no extractable text")
  })

  it("truncates very large files to budget", () => {
    const huge = "x".repeat(30_000)
    const block = formatAttachmentContextBlock([
      { label: "big.txt", text: huge },
    ])

    expect(block?.length).toBeLessThan(30_000)
    expect(block).toContain("…")
  })
})

describe("buildBlueprintResearchUserPrompt with attachment", () => {
  it("injects attachment block and synthesis instruction", () => {
    const attachmentBlock = formatAttachmentContextBlock([
      { label: "clickup-automation-brief.txt", text: sampleBrief },
    ])

    const prompt = buildBlueprintResearchUserPrompt({
      question: ATTACHMENT_SCOPING_PROMPT,
      system: "General",
      hasDocument: false,
      research: baseResearch(attachmentBlock),
      deliverable: "sow",
    })

    expect(prompt).toContain("USER ATTACHMENTS")
    expect(prompt).toContain("Do not paste the attachment back verbatim")
    expect(prompt).toContain("scope-of-work")
    expect(prompt).toContain("MOVE TO PRODUCTION")
  })

  it("includes workflow block when workflowId set", () => {
    const prompt = buildBlueprintResearchUserPrompt({
      question: "Analyze attached doc",
      system: "General",
      hasDocument: false,
      research: baseResearch(null),
      workflowId: "client-sow",
    })

    expect(prompt).toContain("Client SOW")
  })
})
