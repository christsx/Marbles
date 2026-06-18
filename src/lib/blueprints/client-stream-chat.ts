import { sanitizeLlmText } from "@/lib/ai/sanitize-llm-text"
import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"
import { normalizeChatProse } from "@/lib/blueprints/parse-chat-markdown"

export type StreamBlueprintChatInput = {
  question: string
  system: string
  title?: string
  hasDocument: boolean
  deliverable?: BlueprintDeliverableKind
  corrections?: string[]
  includeRepoContext?: boolean
  attachmentContext?: string | null
  modelId?: string | null
}

function parseStreamError(raw: string): string | null {
  const match = raw.match(/\[STREAM_ERROR\]\s*([\s\S]+)$/)
  return match?.[1]?.trim() ?? null
}

export async function streamBlueprintChat(
  input: StreamBlueprintChatInput,
  onChunk: (text: string) => void
): Promise<{ ok: true; answer: string } | { ok: false; message: string }> {
  let response: Response

  try {
    response = await fetch("/api/blueprints/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not reach the blueprint assistant.",
    }
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null

    return {
      ok: false,
      message: payload?.message ?? "Could not reach the blueprint assistant.",
    }
  }

  if (!response.body) {
    return { ok: false, message: "The assistant returned an empty stream." }
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let raw = ""

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      raw += decoder.decode(value, { stream: true })
      onChunk(raw)
    }
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "The assistant stream was interrupted.",
    }
  }

  const streamError = parseStreamError(raw)

  if (streamError) {
    return { ok: false, message: streamError }
  }

  const answer = normalizeChatProse(sanitizeLlmText(raw))

  if (!answer.trim()) {
    return { ok: false, message: "The model returned an empty response." }
  }

  return { ok: true, answer }
}
