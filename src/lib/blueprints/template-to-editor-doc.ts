import type { OutputData } from "@editorjs/editorjs"

import type { StudioTemplate } from "@/lib/blueprints/studio-templates"
import { getSectionExample } from "@/lib/blueprints/studio-template-examples"

export const TEMPLATE_PLACEHOLDER_MARK = "—"

function exampleToBlocks(example: string): OutputData["blocks"] {
  const blocks: OutputData["blocks"] = []
  const lines = example.split("\n")
  let paragraphLines: string[] = []
  let listItems: string[] = []
  let listStyle: "ordered" | "unordered" | null = null

  const flushParagraph = () => {
    const text = paragraphLines.join(" ").trim()
    if (text) {
      blocks.push({ type: "paragraph", data: { text } })
    }
    paragraphLines = []
  }

  const flushList = () => {
    if (listItems.length && listStyle) {
      blocks.push({
        type: "list",
        data: { style: listStyle, items: [...listItems] },
      })
    }
    listItems = []
    listStyle = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      flushList()
      flushParagraph()
      continue
    }

    const bullet = line.match(/^[-*•]\s+(.+)$/)
    if (bullet) {
      flushParagraph()
      if (listStyle === "ordered") flushList()
      listStyle = "unordered"
      listItems.push(bullet[1]!)
      continue
    }

    const numbered = line.match(/^\d+[.)]\s+(.+)$/)
    if (numbered) {
      flushParagraph()
      if (listStyle === "unordered") flushList()
      listStyle = "ordered"
      listItems.push(numbered[1]!)
      continue
    }

    flushList()
    paragraphLines.push(line)
  }

  flushList()
  flushParagraph()
  return blocks.length ? blocks : [{ type: "paragraph", data: { text: example.trim() } }]
}

function sectionDisplayBlocks(templateId: string, heading: string, fallback: string) {
  const example = getSectionExample(templateId, heading)
  if (example?.trim()) {
    return exampleToBlocks(example)
  }

  return [{ type: "paragraph", data: { text: fallback.trim() || TEMPLATE_PLACEHOLDER_MARK } }]
}

export function buildTemplateEditorDocument(template: StudioTemplate): OutputData {
  const blocks: OutputData["blocks"] = [
    {
      type: "header",
      data: { text: template.documentTitle, level: 1 },
    },
    {
      type: "paragraph",
      data: {
        text: "<i>Example content below. Tell me about your client or attach a brief and I will replace it.</i>",
      },
    },
  ]

  for (const section of template.sections) {
    blocks.push({
      type: "header",
      data: { text: section.heading, level: 2 },
    })
    blocks.push(...sectionDisplayBlocks(template.id, section.heading, section.placeholder))
  }

  return {
    time: Date.now(),
    version: "2.29.0",
    blocks,
  }
}
