import {
  isMermaidSource,
  stripMermaidFences,
} from "@/lib/blueprints/editorjs-from-llm"

export type ChatMarkdownBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "hr" }
  | { type: "diagram"; chart: string }

export function normalizeChatProse(text: string): string {
  return text
    .replace(/\n\?\s*$/g, "")
    .replace(/\n+Let me know if you['\u2019]d like[\s\S]*$/i, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function pushTextBlock(blocks: ChatMarkdownBlock[], text: string) {
  const trimmed = text.trim()

  if (!trimmed) {
    return
  }

  if (isMermaidSource(trimmed)) {
    blocks.push({ type: "diagram", chart: stripMermaidFences(trimmed) })
    return
  }

  blocks.push({ type: "paragraph", text: trimmed })
}

export function parseChatMarkdown(content: string): ChatMarkdownBlock[] {
  const lines = content.split("\n")
  const blocks: ChatMarkdownBlock[] = []
  let listItems: string[] = []
  let paragraphLines: string[] = []
  let fenceLines: string[] = []
  let fenceLang = ""
  let inFence = false

  const flushParagraph = () => {
    if (paragraphLines.length) {
      pushTextBlock(blocks, paragraphLines.join("\n"))
      paragraphLines = []
    }
  }

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: "list", items: listItems })
      listItems = []
    }
  }

  const flushFence = () => {
    const source = fenceLines.join("\n").trim()

    if (source && (fenceLang === "mermaid" || isMermaidSource(source))) {
      blocks.push({ type: "diagram", chart: stripMermaidFences(source) })
    } else if (source) {
      pushTextBlock(blocks, `\`\`\`${fenceLang}\n${source}\n\`\`\``)
    }

    fenceLines = []
    fenceLang = ""
    inFence = false
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith("```")) {
      if (inFence) {
        flushFence()
      } else {
        flushParagraph()
        flushList()
        inFence = true
        fenceLang = trimmed.slice(3).trim().toLowerCase()
        fenceLines = []
      }
      continue
    }

    if (inFence) {
      fenceLines.push(line)
      continue
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph()
      flushList()
      blocks.push({ type: "hr" })
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph()
      listItems.push(trimmed.replace(/^[-*]\s+/, ""))
      continue
    }

    const heading =
      trimmed.match(/^#{1,3}\s+(.+)$/) ??
      trimmed.match(/^\*\*(.+)\*\*$/)

    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({ type: "heading", text: heading[1].trim() })
      continue
    }

    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    flushList()
    paragraphLines.push(line)
  }

  flushParagraph()
  flushList()
  if (inFence) {
    flushFence()
  }

  return blocks
}

export function splitInlineMarkdown(text: string): Array<{ bold: boolean; text: string }> {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)

  return parts.map((part) => {
    const bold = part.match(/^\*\*(.+)\*\*$/)

    return bold
      ? { bold: true, text: bold[1] }
      : { bold: false, text: part }
  })
}
