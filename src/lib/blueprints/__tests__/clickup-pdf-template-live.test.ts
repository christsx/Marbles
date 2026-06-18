/**
 * Live end-to-end test: Client SOW template + ClickUp PDF attachment.
 * Usage: npm test -- src/lib/blueprints/__tests__/clickup-pdf-template-live.test.ts
 */
import fs from "node:fs"

import { describe, expect, it } from "vitest"

import { answerBlueprintQuestion } from "@/lib/blueprints/answer"
import { extractAttachmentText } from "@/lib/blueprints/extract-attachment-text"
import { formatAttachmentContextBlock } from "@/lib/blueprints/format-attachment-context"
import { STUDIO_TEMPLATES } from "@/lib/blueprints/studio-templates"
import {
  listTemplateSections,
  mergeChatIntoTemplateDoc,
} from "@/lib/blueprints/template-document"
import { buildTemplateEditorDocument } from "@/lib/blueprints/template-to-editor-doc"
import { resolveAttachmentOnlyPrompt } from "@/lib/blueprints/workflow-prompt"

const PDF_PATH = "/Users/chris/Desktop/ClickUp Automation Overview.pdf"
const TEMPLATE_ID = "client-sow"
const hasGroqKey = Boolean(process.env.GROQ_API_KEY?.trim())
const hasPdf = fs.existsSync(PDF_PATH)

describe.skipIf(!hasGroqKey || !hasPdf)(
  "Client SOW + ClickUp PDF (live Groq)",
  () => {
    it(
      "extracts PDF, fills template sections, and replaces example content",
      async () => {
        const buffer = fs.readFileSync(PDF_PATH)
        const extracted = await extractAttachmentText(
          buffer,
          "ClickUp Automation Overview.pdf",
          "application/pdf"
        )

        expect(extracted.text?.length ?? 0).toBeGreaterThan(500)
        expect(extracted.text).toContain("MOVE TO PRODUCTION")

        const attachmentContext = formatAttachmentContextBlock([
          {
            label: "ClickUp Automation Overview.pdf",
            text: extracted.text!,
          },
        ])

        const template = STUDIO_TEMPLATES.find((item) => item.id === TEMPLATE_ID)!
        const doc = buildTemplateEditorDocument(template)
        const prompt = resolveAttachmentOnlyPrompt(TEMPLATE_ID)

        const answer = await answerBlueprintQuestion({
          question: prompt,
          system: "General",
          title: template.documentTitle,
          hasDocument: true,
          workflowId: TEMPLATE_ID,
          attachmentContext,
          modelId: "groq/qwen3-32b",
        })

        expect(answer.trim().length).toBeGreaterThan(200)

        const merged = mergeChatIntoTemplateDoc(doc, TEMPLATE_ID, answer)

        expect(merged.updatedSectionIds.length).toBeGreaterThan(0)
        expect(merged.updatedSectionIds).toEqual(
          expect.arrayContaining(["overview"])
        )

        const sections = listTemplateSections(merged.content, TEMPLATE_ID)
        const filled = sections.filter((section) => section.status === "filled")
        expect(filled.length).toBeGreaterThanOrEqual(3)

        const overviewBlock = merged.content.blocks.find(
          (block, index) =>
            block.type === "header" &&
            (block.data as { text?: string }).text === "Overview" &&
            merged.content.blocks[index + 1]?.type === "paragraph"
        )
        const overviewText =
          overviewBlock &&
          merged.content.blocks[
            merged.content.blocks.indexOf(overviewBlock) + 1
          ]?.type === "paragraph"
            ? (
                merged.content.blocks[
                  merged.content.blocks.indexOf(overviewBlock) + 1
                ]!.data as { text?: string }
              ).text
            : ""

        expect(overviewText?.toLowerCase()).toMatch(/clickup|amber|production/)
        expect(overviewText?.toLowerCase()).not.toContain("acme logistics")

        console.log("\n--- Updated sections ---")
        console.log(merged.updatedSectionIds.join(", "))
        console.log("\n--- Overview (merged) ---")
        console.log(overviewText?.slice(0, 400))
        console.log("\n--- Chat reply ---")
        console.log(merged.chatReply.slice(0, 300))
      },
      90_000
    )
  }
)

describe("ClickUp PDF template live guard", () => {
  it("reports prerequisites", () => {
    if (!hasPdf) {
      expect(PDF_PATH).toBeTruthy()
      return
    }
    if (!hasGroqKey) {
      expect(hasGroqKey).toBe(false)
      return
    }
    expect(true).toBe(true)
  })
})
