import { sanitizeLlmText } from "@/lib/ai/sanitize-llm-text"
import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"
import type { BlueprintChatHistoryTurn } from "@/lib/blueprints/chat-history"
import { finalizeChatMarkdown } from "@/lib/blueprints/finalize-chat-markdown"

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
  history?: BlueprintChatHistoryTurn[]
  userFirstName?: string
  isFirstTurn?: boolean
  workflowId?: string | null
}

function parseStreamError(raw: string): string | null {
  const match = raw.match(/\[STREAM_ERROR\]\s*([\s\S]+)$/)
  return match?.[1]?.trim() ?? null
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError"
}

export async function streamBlueprintChat(
  input: StreamBlueprintChatInput,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<
  | { ok: true; answer: string }
  | { ok: false; message: string; aborted?: boolean }
> {
  let response: Response

  try {
    response = await fetch("/api/blueprints/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal,
    })
  } catch (error) {
    if (isAbortError(error)) {
      return { ok: false, message: "Request cancelled.", aborted: true }
    }

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

      if (signal?.aborted) {
        await reader.cancel()
        return { ok: false, message: "Request cancelled.", aborted: true }
      }

      raw += decoder.decode(value, { stream: true })
      onChunk(sanitizeLlmText(raw))
    }

    raw += decoder.decode()
  } catch (error) {
    if (isAbortError(error)) {
      return { ok: false, message: "Request cancelled.", aborted: true }
    }

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

  const answer = finalizeChatMarkdown(raw)

  if (!answer.trim()) {
    return { ok: false, message: "The model returned an empty response." }
  }

  onChunk(answer)

  return { ok: true, answer }
}
