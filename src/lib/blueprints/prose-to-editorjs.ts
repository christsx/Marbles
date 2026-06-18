import type { OutputData } from "@editorjs/editorjs"

import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"

const SECTION_HEADERS = new Set(
  [
    "overview",
    "goals",
    "objectives",
    "in scope",
    "out of scope",
    "deliverables",
    "timeline",
    "milestones",
    "assumptions",
    "open questions",
    "requirements",
    "non-goals",
    "success metrics",
    "problem",
    "users",
    "context",
    "technical notes",
    "dependencies",
    "background",
    "summary",
  ].map((label) => label.toLowerCase())
)

function isSectionHeader(line: string) {
  const trimmed = line.trim()
  const withoutColon = trimmed.replace(/:$/, "").trim()

  return SECTION_HEADERS.has(withoutColon.toLowerCase())
}

function flushParagraph(lines: string[], blocks: OutputData["blocks"]) {
  const text = lines.join(" ").trim()

  if (text) {
    blocks.push({ type: "paragraph", data: { text } })
  }

  lines.length = 0
}

function flushList(
  items: string[],
  style: "unordered" | "ordered" | null,
  blocks: OutputData["blocks"]
) {
  if (items.length && style) {
    blocks.push({ type: "list", data: { style, items: [...items] } })
    items.length = 0
  }
}

export function deliverableDocumentTitle(
  kind: Exclude<BlueprintDeliverableKind, null>,
  _system: string
) {
  switch (kind) {
    case "sow":
      return "Scope of Work"
    case "prd":
      return "Product Requirements"
    case "spec":
      return "Technical Spec"
  }
}

export function proseToEditorJs(title: string, prose: string): OutputData {
  const blocks: OutputData["blocks"] = []

  if (title.trim()) {
    blocks.push({ type: "header", data: { text: title.trim(), level: 1 } })
  }

  const paragraphLines: string[] = []
  const listItems: string[] = []
  let listStyle: "unordered" | "ordered" | null = null

  for (const rawLine of prose.split("\n")) {
    const line = rawLine.trim()

    if (!line) {
      flushList(listItems, listStyle, blocks)
      listStyle = null
      flushParagraph(paragraphLines, blocks)
      continue
    }

    if (isSectionHeader(line)) {
      flushList(listItems, listStyle, blocks)
      listStyle = null
      flushParagraph(paragraphLines, blocks)
      blocks.push({
        type: "header",
        data: { text: line.replace(/:$/, "").trim(), level: 2 },
      })
      continue
    }

    const bulletMatch = line.match(/^[-*•]\s+(.+)$/)
    if (bulletMatch) {
      flushParagraph(paragraphLines, blocks)

      if (listStyle === "ordered") {
        flushList(listItems, listStyle, blocks)
        listStyle = null
      }

      listStyle = "unordered"
      listItems.push(bulletMatch[1])
      continue
    }

    const numberedMatch = line.match(/^\d+[.)]\s+(.+)$/)
    if (numberedMatch) {
      flushParagraph(paragraphLines, blocks)

      if (listStyle === "unordered") {
        flushList(listItems, listStyle, blocks)
        listStyle = null
      }

      listStyle = "ordered"
      listItems.push(numberedMatch[1])
      continue
    }

    if (listStyle && /^[A-Za-z].{0,40}:\s/.test(line)) {
      listItems[listItems.length - 1] = `${listItems[listItems.length - 1]} ${line}`
      continue
    }

    flushList(listItems, listStyle, blocks)
    listStyle = null
    paragraphLines.push(line)
  }

  flushList(listItems, listStyle, blocks)
  flushParagraph(paragraphLines, blocks)

  if (blocks.length === 0) {
    blocks.push({ type: "paragraph", data: { text: prose.trim() } })
  }

  return { time: Date.now(), blocks }
}
