import type { OutputData } from "@editorjs/editorjs"

import { normalizeChatProse, parseChatMarkdown } from "@/lib/blueprints/parse-chat-markdown"
import type { ChatMarkdownBlock } from "@/lib/blueprints/parse-chat-markdown"
import { getStudioTemplate } from "@/lib/blueprints/studio-templates"
import { getSectionExample } from "@/lib/blueprints/studio-template-examples"
import {
  normalizeSectionHeading,
  resolveTemplateSectionId,
  slugifySectionHeading,
} from "@/lib/blueprints/template-section-match"
import { TEMPLATE_PLACEHOLDER_MARK } from "@/lib/blueprints/template-to-editor-doc"

export type TemplateSectionStatus = "pending" | "filled" | "filling"

export type TemplateSectionView = {
  id: string
  heading: string
  headerIndex: number
  blockIndices: number[]
  status: TemplateSectionStatus
  placeholder?: string
}

function normalizeExampleForCompare(text: string) {
  return text
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/^[-*•]\s+/, "")
        .replace(/^\d+[.)]\s+/, "")
    )
    .filter(Boolean)
    .join("\n")
}

function normalizePlaceholder(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase()
}

function extractBlockText(block: OutputData["blocks"][number]) {
  if (block.type === "paragraph") {
    return (block.data as { text?: string }).text ?? ""
  }

  if (block.type === "list") {
    const data = block.data as { items?: string[] }
    return (data.items ?? []).join("\n")
  }

  return ""
}

function isPlaceholderBody(
  body: string,
  placeholder?: string,
  templateId?: string,
  heading?: string
) {
  const trimmed = body.trim()

  if (!trimmed) {
    return true
  }

  const lines = trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  if (
    trimmed === TEMPLATE_PLACEHOLDER_MARK ||
    trimmed.replace(/<[^>]+>/g, "") === TEMPLATE_PLACEHOLDER_MARK ||
    (lines.length > 0 &&
      lines.every(
        (line) =>
          line === TEMPLATE_PLACEHOLDER_MARK ||
          line.replace(/<[^>]+>/g, "") === TEMPLATE_PLACEHOLDER_MARK
      ))
  ) {
    return true
  }

  if (templateId && heading) {
    const example = getSectionExample(templateId, heading)
    if (example) {
      const normBody = normalizeExampleForCompare(body)
      const normExample = normalizeExampleForCompare(example)
      if (
        normBody === normExample ||
        normalizePlaceholder(normBody) === normalizePlaceholder(normExample)
      ) {
        return true
      }
    }
  }

  if (!placeholder) {
    return false
  }

  return normalizePlaceholder(trimmed) === normalizePlaceholder(placeholder)
}

export function listTemplateSections(
  content: OutputData,
  templateId: string,
  fillingSectionId?: string | null
): TemplateSectionView[] {
  const template = getStudioTemplate(templateId)
  if (!template) {
    return []
  }

  const placeholderByHeading = new Map(
    template.sections.map((section) => [
      normalizeSectionHeading(section.heading),
      section.placeholder,
    ])
  )

  const sections: TemplateSectionView[] = []
  let current: TemplateSectionView | null = null

  for (let index = 0; index < content.blocks.length; index += 1) {
    const block = content.blocks[index]

    if (block.type !== "header") {
      if (current && block.type !== "delimiter") {
        current.blockIndices.push(index)
      }
      continue
    }

    const data = block.data as { text?: string; level?: number }
    if (data.level !== 2) {
      continue
    }

    if (current) {
      sections.push(current)
    }

    const heading = data.text ?? ""
    current = {
      id: slugifySectionHeading(heading),
      heading,
      headerIndex: index,
      blockIndices: [],
      status: "pending",
      placeholder: placeholderByHeading.get(normalizeSectionHeading(heading)),
    }
  }

  if (current) {
    sections.push(current)
  }

  for (const section of sections) {
    if (section.id === fillingSectionId) {
      section.status = "filling"
      continue
    }

    const body = section.blockIndices
      .map((index) => extractBlockText(content.blocks[index]!))
      .join("\n")
    section.status = isPlaceholderBody(
      body,
      section.placeholder,
      templateId,
      section.heading
    )
      ? "pending"
      : "filled"
  }

  return sections
}

export function firstPendingSectionId(content: OutputData, templateId: string) {
  return listTemplateSections(content, templateId).find((section) => section.status === "pending")?.id ?? null
}

function chatBlocksToEditorBlocks(blocks: ChatMarkdownBlock[]): OutputData["blocks"] {
  const editorBlocks: OutputData["blocks"] = []

  for (const block of blocks) {
    if (block.type === "paragraph") {
      editorBlocks.push({ type: "paragraph", data: { text: block.text } })
      continue
    }

    if (block.type === "list") {
      editorBlocks.push({
        type: "list",
        data: { style: "unordered", items: block.items },
      })
    }
  }

  return editorBlocks
}

function splitChatAnswer(
  answer: string,
  templateId: string
): { chatReply: string; sectionUpdates: Map<string, ChatMarkdownBlock[]> } {
  const template = getStudioTemplate(templateId)
  const sectionUpdates = new Map<string, ChatMarkdownBlock[]>()
  const chatParts: string[] = []

  if (!template) {
    return { chatReply: answer.trim(), sectionUpdates }
  }

  const headingToId = new Map(
    template.sections.map((section) => [
      normalizeSectionHeading(section.heading),
      slugifySectionHeading(section.heading),
    ])
  )

  const parsed = parseChatMarkdown(normalizeChatProse(answer))
  let currentSectionId: string | null = null

  for (const block of parsed) {
    if (block.type === "heading") {
      currentSectionId =
        resolveTemplateSectionId(block.text, template) ??
        headingToId.get(normalizeSectionHeading(block.text)) ??
        null
      if (currentSectionId && !sectionUpdates.has(currentSectionId)) {
        sectionUpdates.set(currentSectionId, [])
      }
      continue
    }

    if (!currentSectionId) {
      if (block.type === "paragraph") {
        chatParts.push(block.text)
      }
      if (block.type === "list") {
        chatParts.push(block.items.map((item) => `- ${item}`).join("\n"))
      }
      continue
    }

    sectionUpdates.get(currentSectionId)?.push(block)
  }

  return { chatReply: chatParts.join("\n\n").trim(), sectionUpdates }
}

export function mergeChatIntoTemplateDoc(
  content: OutputData,
  templateId: string,
  answer: string
): { content: OutputData; chatReply: string; updatedSectionIds: string[] } {
  const { chatReply, sectionUpdates } = splitChatAnswer(answer, templateId)
  const updatedSectionIds: string[] = []
  const editorUpdates = new Map<string, OutputData["blocks"]>()

  for (const [sectionId, blocks] of sectionUpdates) {
    const editorBlocks = chatBlocksToEditorBlocks(blocks)
    if (editorBlocks.length) {
      editorUpdates.set(sectionId, editorBlocks)
      updatedSectionIds.push(sectionId)
    }
  }

  if (!editorUpdates.size) {
    return {
      content,
      chatReply: chatReply || answer.trim(),
      updatedSectionIds,
    }
  }

  const blocks: OutputData["blocks"] = []
  let index = 0

  while (index < content.blocks.length) {
    const block = content.blocks[index]!

    if (block.type === "header" && (block.data as { level?: number }).level === 2) {
      const heading = (block.data as { text?: string }).text ?? ""
      const sectionId = slugifySectionHeading(heading)
      blocks.push(block)
      index += 1

      const oldBody: OutputData["blocks"] = []
      while (index < content.blocks.length) {
        const next = content.blocks[index]!
        if (
          next.type === "header" &&
          (next.data as { level?: number }).level === 2
        ) {
          break
        }
        oldBody.push(next)
        index += 1
      }

      const updates = editorUpdates.get(sectionId)
      blocks.push(...(updates?.length ? updates : oldBody))
      continue
    }

    blocks.push(block)
    index += 1
  }

  const nextReply =
    chatReply ||
    (updatedSectionIds.length
      ? "Updated the highlighted sections on the right."
      : answer.trim())

  return {
    content: { ...content, blocks, time: Date.now() },
    chatReply: nextReply,
    updatedSectionIds,
  }
}

export function buildTemplateFollowUp(
  content: OutputData,
  templateId: string,
  updatedSectionIds: string[]
) {
  if (!updatedSectionIds.length) {
    return null
  }

  const nextSection = listTemplateSections(content, templateId).find(
    (section) => section.status === "pending"
  )

  if (!nextSection) {
    return "All sections are filled. Review the document on the right and tell me what to tweak."
  }

  return `Next up: **${nextSection.heading}**. Share any details or attach a brief and I'll fill it in.`
}
