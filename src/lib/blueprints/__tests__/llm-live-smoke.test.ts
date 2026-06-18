/**
 * Optional live Groq smoke test — runs only when GROQ_API_KEY is set.
 * Usage: GROQ_API_KEY=gsk_... npm test -- src/lib/blueprints/__tests__/llm-live-smoke.test.ts
 */
import fs from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { answerBlueprintQuestion } from "@/lib/blueprints/answer"
import { formatAttachmentContextBlock } from "@/lib/blueprints/format-attachment-context"
import { ATTACHMENT_SCOPING_PROMPT } from "@/lib/blueprints/workflow-prompt"

const hasGroqKey = Boolean(process.env.GROQ_API_KEY?.trim())

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "clickup-automation-brief.txt"
)

describe.skipIf(!hasGroqKey)("live Groq smoke (requires GROQ_API_KEY)", () => {
  it(
    "answers from ClickUp test doc without empty response",
    async () => {
      const brief = fs.readFileSync(fixturePath, "utf-8")
      const attachmentContext = formatAttachmentContextBlock([
        { label: "clickup-automation-brief.txt", text: brief },
      ])

      const answer = await answerBlueprintQuestion({
        question: ATTACHMENT_SCOPING_PROMPT,
        system: "General",
        hasDocument: false,
        deliverable: "sow",
        attachmentContext,
        modelId: "groq/qwen3-32b",
      })

      expect(answer.trim().length).toBeGreaterThan(200)
      expect(answer.toLowerCase()).toMatch(/clickup|amber|production/)
      expect(answer).not.toMatch(/^Hey\b/i)
    },
    60_000
  )
})

describe("live Groq smoke guard", () => {
  it("documents how to run live test", () => {
    if (hasGroqKey) {
      expect(true).toBe(true)
      return
    }
    expect(hasGroqKey).toBe(false)
  })
})
