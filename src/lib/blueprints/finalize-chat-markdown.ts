import { sanitizeLlmText } from "@/lib/ai/sanitize-llm-text"
import { normalizeChatProse } from "@/lib/blueprints/parse-chat-markdown"

export function finalizeChatMarkdown(raw: string): string {
  return normalizeChatProse(sanitizeLlmText(raw))
}
