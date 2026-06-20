import fs from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { buildGroqChatMessages } from "@/lib/blueprints/build-chat-request"
import { formatAttachmentContextBlock } from "@/lib/blueprints/format-attachment-context"
import { buildBlueprintResearchUserPrompt } from "@/lib/blueprints/research-prompt"
import { proseToEditorJs } from "@/lib/blueprints/prose-to-editorjs"
import {
  ATTACHMENT_SCOPING_PROMPT,
  resolveAttachmentOnlyPrompt,
  resolveStudioDeliverable,
} from "@/lib/blueprints/workflow-prompt"
import type { BlueprintResearchContext } from "@/lib/blueprints/research-context"
import { filesToBlueprintAttachments } from "@/lib/blueprints/add-doc-files"

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
    "No repo attached for this message. Use general engineering knowledge.",
  narrativeBlock: "",
  systemScopeBlock: "General chat.",
  infraBlock: null,
  correctionsBlock: null,
  attachmentBlock,
})

describe("ClickUp automation brief fixture", () => {
  it("contains trigger and reference clients", () => {
    expect(sampleBrief).toContain("MOVE TO PRODUCTION")
    expect(sampleBrief).toContain("Back to Basics Manners")
    expect(sampleBrief).toContain("Opportunity Type")
  })

  it("maps to sow when uploaded without user text", () => {
    expect(
      resolveStudioDeliverable({
        prompt: "",
        hasAttachments: true,
      })
    ).toBe("sow")
  })

  it("uses scoping prompt for attachment-only send", () => {
    expect(resolveAttachmentOnlyPrompt(null)).toContain("scope of work")
    expect(resolveAttachmentOnlyPrompt(null)).toContain("implementation tasks")
  })

  it("builds Groq messages with system and user roles", () => {
    const messages = buildGroqChatMessages({
      system: "You are Marbles.",
      prompt: "Summarize the doc",
      history: [{ role: "user", content: "Earlier question" }],
    })

    expect(messages[0].role).toBe("system")
    expect(messages.at(-1)?.role).toBe("user")
    expect(messages.some((m) => m.content.includes("Summarize"))).toBe(true)
  })

  it("injects full brief into user prompt for Groq", () => {
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

    expect(prompt).toContain("Amber manually")
    expect(prompt).toContain("Do not paste the attachment back verbatim")
    expect(prompt).toContain("Numbered implementation tasks")
    expect(prompt).not.toContain("arc42 blueprint panel is open")
  })

  it("converts sow-style answer to editor blocks", () => {
    const answer = `Overview
Client wants ClickUp onboarding automated.

In scope
- Map opportunity type to space
- Copy template tasks

Implementation tasks
1. Define template structure
Definition of done: Template approved by Amber
2. Build automation trigger`

    const doc = proseToEditorJs("Scope of Work", answer)
    const types = doc.blocks.map((b) => b.type)

    expect(types).toContain("header")
    expect(types).toContain("list")
  })

  it("creates attachment records from FileList-shaped input", () => {
    const file = new File([sampleBrief], "clickup-automation-brief.txt", {
      type: "text/plain",
    })
    const list = {
      length: 1,
      0: file,
      item: (i: number) => (i === 0 ? file : null),
      [Symbol.iterator]: function* () {
        yield file
      },
    } as FileList

    const attachments = filesToBlueprintAttachments(list)
    expect(attachments).toHaveLength(1)
    expect(attachments[0].label).toBe("clickup-automation-brief.txt")
  })
})

describe("client proposal scenarios from fixture", () => {
  const scenarios = [
    {
      name: "automation scoping",
      question: "Scope this ClickUp automation for a client proposal",
      deliverable: "sow" as const,
    },
    {
      name: "open questions only",
      question: "What open questions should we ask the client about this brief?",
      deliverable: null,
    },
    {
      name: "task breakdown",
      question: "Break this into implementation tasks with dependencies",
      deliverable: "sow" as const,
    },
    {
      name: "clickup vs zapier",
      question: "Should we use ClickUp native automation or Zapier for this?",
      deliverable: null,
    },
  ]

  for (const scenario of scenarios) {
    it(`builds prompt for: ${scenario.name}`, () => {
      const attachmentBlock = formatAttachmentContextBlock([
        { label: "brief.txt", text: sampleBrief },
      ])

      const prompt = buildBlueprintResearchUserPrompt({
        question: scenario.question,
        system: "General",
        hasDocument: false,
        research: baseResearch(attachmentBlock),
        deliverable: scenario.deliverable,
      })

      expect(prompt).toContain(scenario.question)
      expect(prompt).toContain("USER ATTACHMENTS")
      expect(prompt).toContain("MOVE TO PRODUCTION")
    })
  }
})
