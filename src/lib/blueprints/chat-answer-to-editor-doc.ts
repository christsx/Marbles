import { parseChatMarkdown } from "@/lib/blueprints/parse-chat-markdown"
import type { OutputData } from "@editorjs/editorjs"

export function chatAnswerHasDiagram(answer: string) {
  return parseChatMarkdown(answer).some((block) => block.type === "diagram")
}

export function chatAnswerToEditorDoc(
  title: string,
  answer: string
): OutputData | null {
  const parsed = parseChatMarkdown(answer)

  if (!parsed.some((block) => block.type === "diagram")) {
    return null
  }

  const blocks: OutputData["blocks"] = []

  if (title.trim()) {
    blocks.push({ type: "header", data: { text: title.trim(), level: 1 } })
  }

  for (const block of parsed) {
    if (block.type === "heading") {
      blocks.push({ type: "header", data: { text: block.text, level: 2 } })
      continue
    }

    if (block.type === "paragraph") {
      blocks.push({ type: "paragraph", data: { text: block.text } })
      continue
    }

    if (block.type === "list") {
      blocks.push({
        type: "list",
        data: { style: "unordered", items: block.items },
      })
      continue
    }

    if (block.type === "diagram") {
      blocks.push({
        type: "diagram",
        data: {
          title: "",
          variant: "flowchart",
          chart: block.chart,
        },
      })
      continue
    }

    if (block.type === "hr") {
      blocks.push({ type: "delimiter", data: {} })
    }
  }

  return blocks.length ? { blocks } : null
}
