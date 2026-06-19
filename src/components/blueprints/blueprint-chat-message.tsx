"use client"

import { BlueprintChatActions } from "@/components/blueprints/blueprint-chat-actions"
import { BlueprintChatRichContent } from "@/components/blueprints/blueprint-chat-rich-content"
import {
  BlueprintChatDocPendingBody,
  BlueprintChatThoughtLine,
} from "@/components/blueprints/blueprint-chat-thought"
import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"
import type { BlueprintChatRetryMeta } from "@/components/blueprints/blueprint-chat-turn-list"
import { cn } from "@/lib/utils"

type BlueprintChatMessageViewProps = {
  message: BlueprintChatMessage
  retryPrompt?: string
  retryMeta?: BlueprintChatRetryMeta
  isLatest?: boolean
  onRetry?: (prompt: string, meta?: BlueprintChatRetryMeta) => void
}

export function BlueprintChatMessageView({
  message,
  retryPrompt,
  retryMeta,
  isLatest = false,
  onRetry,
}: BlueprintChatMessageViewProps) {
  if (message.role === "user") {
    return (
      <div className="blueprint-chat-turn-user">
        <div className="blueprint-chat-user">{message.content}</div>
      </div>
    )
  }

  return (
    <AssistantMessage
      message={message}
      retryPrompt={retryPrompt}
      retryMeta={retryMeta}
      isLatest={isLatest}
      onRetry={onRetry}
    />
  )
}

function AssistantMessage({
  message,
  retryPrompt,
  retryMeta,
  isLatest = false,
  onRetry,
}: BlueprintChatMessageViewProps) {
  const isWaiting = message.pending && !message.content
  const isStreaming =
    message.pending && message.streaming && Boolean(message.content)
  const isDocPending =
    message.pending && !message.streaming && Boolean(message.content)
  const isComplete = !message.pending
  const showActions =
    isComplete && Boolean(message.content.trim()) && !isDocPending
  const prompt = message.userPrompt ?? retryPrompt

  return (
    <div
      className={cn(
        "blueprint-chat-turn-assistant",
        isLatest && "is-latest",
        isStreaming && "is-streaming"
      )}
    >
      <BlueprintChatThoughtLine message={message} />
      <div
        className={cn(
          "blueprint-chat-assistant-body",
          (isWaiting || isDocPending) && "is-muted"
        )}
      >
        {isDocPending ? (
          <BlueprintChatDocPendingBody content={message.content} />
        ) : isWaiting ? (
          null
        ) : isStreaming ? (
          <BlueprintChatRichContent content={message.content} streaming />
        ) : message.content ? (
          <BlueprintChatRichContent content={message.content} />
        ) : null}
      </div>
      {showActions ? (
        <BlueprintChatActions
          content={message.content}
          prompt={prompt}
          onRetry={
            prompt && onRetry
              ? () => onRetry(prompt, retryMeta)
              : undefined
          }
        />
      ) : null}
    </div>
  )
}
