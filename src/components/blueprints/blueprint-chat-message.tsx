"use client"

import { BlueprintChatActions } from "@/components/blueprints/blueprint-chat-actions"
import { BlueprintChatMarkdown } from "@/components/blueprints/blueprint-chat-markdown"
import {
  BlueprintChatDocPendingBody,
  BlueprintChatThoughtLine,
} from "@/components/blueprints/blueprint-chat-thought"
import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"
import { cn } from "@/lib/utils"

type BlueprintChatMessageViewProps = {
  message: BlueprintChatMessage
  retryPrompt?: string
  isLatest?: boolean
  onRetry?: (prompt: string) => void
}

export function BlueprintChatMessageView({
  message,
  retryPrompt,
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
      isLatest={isLatest}
      onRetry={onRetry}
    />
  )
}

function AssistantMessage({
  message,
  retryPrompt,
  isLatest = false,
  onRetry,
}: BlueprintChatMessageViewProps) {
  const isWaiting = message.pending && !message.content
  const isStreaming =
    message.pending && message.streaming && Boolean(message.content)
  const isDocPending =
    message.pending && !message.streaming && Boolean(message.content)
  const isComplete = !message.pending || Boolean(message.thoughtSeconds)
  const showActions =
    isComplete &&
    Boolean(message.content.trim()) &&
    !isWaiting &&
    !isDocPending
  const prompt = message.userPrompt ?? retryPrompt

  return (
    <div
      className={cn(
        "blueprint-chat-turn-assistant",
        isLatest && "is-latest"
      )}
    >
      <BlueprintChatThoughtLine message={message} />
      <div
        className={cn(
          "blueprint-chat-assistant-body",
          (isWaiting || isDocPending) && "is-muted"
        )}
      >
        {isStreaming ? <StreamingBody content={message.content} /> : null}
        {isDocPending ? (
          <BlueprintChatDocPendingBody content={message.content} />
        ) : null}
        {!message.pending ? (
          <BlueprintChatMarkdown content={message.content} />
        ) : null}
      </div>
      {showActions ? (
        <BlueprintChatActions
          content={message.content}
          onRetry={
            prompt && onRetry ? () => onRetry(prompt) : undefined
          }
        />
      ) : null}
    </div>
  )
}

function StreamingBody({ content }: { content: string }) {
  return (
    <div className="blueprint-chat-stream whitespace-pre-wrap">
      {content}
      <span className="blueprint-chat-cursor" aria-hidden />
    </div>
  )
}
