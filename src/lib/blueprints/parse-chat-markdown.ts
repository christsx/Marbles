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

const DASHES = "\\u2014\\u2013\\-" // em dash, en dash, hyphen

const GREETING_OPENER = new RegExp(
  `^(Hey|Hi|Hello)(\\s+(there|[A-Za-z]+))?\\s*[${DASHES},]\\s*`,
  "i"
)

const CHATTY_OPENER = new RegExp(
  `^(No worries|Got it\\.?\\s*No problem)\\s*[${DASHES}]\\s*`,
  "i"
)

function stripChatOpeners(text: string): string {
  return text
    .replace(GREETING_OPENER, "")
    .replace(CHATTY_OPENER, "Got it. ")
}

function hidePartialStreamingOpener(text: string): string {
  const trimmed = text.trim()

  if (!trimmed) {
    return text
  }

  const firstLine = trimmed.split("\n")[0]?.trim() ?? ""

  if (
    /^(Hey|Hi)(\s+(there|[A-Za-z]+)?)?$/i.test(firstLine) ||
    (/^(Hey|Hi|Hello)(\s+(there|[A-Za-z]+))?\s/i.test(firstLine) &&
      !new RegExp(`[${DASHES},]`).test(firstLine))
  ) {
    return ""
  }

  if (
    new RegExp(`^(No worries|Got it\\.?\\s*No problem)(\\s+[${DASHES}])?$`, "i").test(
      firstLine
    ) ||
    (/^(No worries|Got it\.?\s*No problem)\s/i.test(firstLine) &&
      !new RegExp(`[${DASHES}]`).test(firstLine))
  ) {
    return ""
  }

  return text
}

function humanizeChatDashes(text: string): string {
  return text
    .replace(/\s+[—–]\s+/g, ", ")
    .replace(/^[—–]\s*/gm, "")
    .replace(/\s+[—–](?=\s|$)/gm, "")
    .replace(/,\s+,/g, ", ")
}

export function normalizeChatProse(text: string): string {
  return humanizeChatDashes(
    stripChatOpeners(text)
      .replace(/^#{4,6}\s+/gm, "### ")
      .replace(/\n\?\s*$/g, "")
      .replace(/\n+Let me know if you['\u2019]d like[\s\S]*$/i, "")
      .replace(/\n+What would you like to explore next\?[\s\S]*$/i, "")
      .replace(/\n+Suggested next steps[\s\S]*$/i, "")
      .replace(/\n+\*\*Suggested next steps\*\*[\s\S]*$/i, "")
      .replace(/\n+Let me know so I can proceed\.?[\s\S]*$/i, "")
      .replace(/\n+(When you['\u2019]re ready|Just (shout|let me know)|No worries)[\s\S]*$/i, "")
      .replace(/^what['\u2019]?s on your mind\??[.!]?\s*$/gim, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  )
}

/** Light cleanup while tokens arrive — no full normalize (that runs on finalize). */
export function prepareStreamingDisplayText(content: string): string {
  let text = hidePartialStreamingOpener(content)
  text = stripChatOpeners(text)

  const fenceCount = (text.match(/```/g) ?? []).length
  if (fenceCount % 2 === 1) {
    const lastFence = text.lastIndexOf("```")
    text = text.slice(0, lastFence).trimEnd()
  }

  text = text.replace(/\n#{1,6}\s[^\n]*$/, "")
  text = text.replace(/\n-{2,}\s*$/, "")

  return text
}

/** @deprecated Prefer prepareStreamingDisplayText during live streams. */
export function prepareStreamingChatMarkdown(content: string): string {
  return prepareStreamingDisplayText(content).trim()
}

/** Completed lines vs the in-progress last line for incremental stream rendering. */
export function splitStreamingDisplayText(content: string): {
  stable: string
  tail: string
} {
  const prepared = prepareStreamingDisplayText(content)

  if (!prepared) {
    return { stable: "", tail: "" }
  }

  if (!prepared.includes("\n")) {
    return { stable: "", tail: prepared }
  }

  if (prepared.endsWith("\n")) {
    const lines = prepared.split("\n")
    return { stable: lines.slice(0, -1).join("\n"), tail: "" }
  }

  const lines = prepared.split("\n")
  const tail = lines.pop() ?? ""

  return { stable: lines.join("\n"), tail }
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

    const numberedMatch = trimmed.match(/^\d+[.)]\s+(.+)$/)
    if (numberedMatch) {
      flushParagraph()
      listItems.push(numberedMatch[1])
      continue
    }

    const heading =
      trimmed.match(/^#{1,6}\s+(.+)$/) ??
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
