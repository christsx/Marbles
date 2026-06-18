"use client"

import { BlueprintChatMessageView } from "@/components/blueprints/blueprint-chat-message"
import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"

export type BlueprintChatRetryMeta = {
  workflowId?: string | null
  attachmentContext?: string | null
}

type BlueprintChatTurnListProps = {
  messages: BlueprintChatMessage[]
  onRetry?: (prompt: string, meta?: BlueprintChatRetryMeta) => void
}

export function BlueprintChatTurnList({
  messages,
  onRetry,
}: BlueprintChatTurnListProps) {
  const turns = groupIntoTurns(messages)

  return (
    <div className="blueprint-chat-turns">
      {turns.map((turn, index) => {
        const retryMeta: BlueprintChatRetryMeta = {
          workflowId: turn.user?.workflowId,
          attachmentContext: turn.user?.attachmentContext,
        }

        return (
          <div key={turn.key} className="blueprint-chat-turn">
            {turn.user ? (
              <BlueprintChatMessageView message={turn.user} onRetry={onRetry} />
            ) : null}
            {turn.assistant ? (
              <BlueprintChatMessageView
                message={turn.assistant}
                retryPrompt={turn.user?.content}
                retryMeta={retryMeta}
                isLatest={index === turns.length - 1}
                onRetry={onRetry}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function groupIntoTurns(messages: BlueprintChatMessage[]) {
  const turns: Array<{
    key: string
    user?: BlueprintChatMessage
    assistant?: BlueprintChatMessage
  }> = []

  for (const message of messages) {
    if (message.role === "user") {
      turns.push({ key: message.id, user: message })
      continue
    }

    const last = turns[turns.length - 1]

    if (last && last.user && !last.assistant) {
      last.assistant = message
      last.key = `${last.user.id}-${message.id}`
      continue
    }

    turns.push({ key: message.id, assistant: message })
  }

  return turns
}
