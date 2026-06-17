import type { Dispatch, SetStateAction } from "react"

import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"

type RevealChatAnswerOptions = {
  answer: string
  pendingId: string
  setMessages: Dispatch<SetStateAction<BlueprintChatMessage[]>>
  chunkSize?: number
  intervalMs?: number
  shouldContinue?: () => boolean
}

export async function revealChatAnswer({
  answer,
  pendingId,
  setMessages,
  chunkSize = 6,
  intervalMs = 18,
  shouldContinue = () => true,
}: RevealChatAnswerOptions) {
  let index = 0

  while (index < answer.length) {
    if (!shouldContinue()) {
      return
    }

    index = Math.min(answer.length, index + chunkSize)
    const slice = answer.slice(0, index)

    setMessages((current) =>
      current.map((message) =>
        message.id === pendingId
          ? { ...message, content: slice, streaming: true, pending: true }
          : message
      )
    )

    if (index < answer.length) {
      if (!shouldContinue()) {
        return
      }

      await sleep(intervalMs)
    }
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function formatChatError(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  if (typeof error === "string" && error.trim()) {
    return error
  }

  return "Could not complete that request. Check your API key and try again."
}
