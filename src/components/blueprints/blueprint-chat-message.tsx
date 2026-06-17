"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import { BlueprintChatActions } from "@/components/blueprints/blueprint-chat-actions"
import { BlueprintChatMarkdown } from "@/components/blueprints/blueprint-chat-markdown"
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
      <ThoughtLine message={message} />
      <div
        className={cn(
          "blueprint-chat-assistant-body",
          (isWaiting || isDocPending) && "is-muted"
        )}
      >
        {isStreaming ? <StreamingBody content={message.content} /> : null}
        {isDocPending ? <DocPendingBody content={message.content} /> : null}
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

function ThoughtLine({ message }: { message: BlueprintChatMessage }) {
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    if (!message.pending || !message.startedAt) {
      return
    }

    const tick = () => {
      setElapsed(Math.max(0, (Date.now() - message.startedAt!) / 1000))
    }

    tick()
    const id = window.setInterval(tick, 200)
    return () => window.clearInterval(id)
  }, [message.pending, message.startedAt])

  if (message.pending && !message.content) {
    const seconds = Math.max(1, Math.round(elapsed) || 1)
    return (
      <p className="blueprint-chat-thought">
        Thought for {seconds}s
        <span className="blueprint-chat-thought-chevron" aria-hidden>
          <ChevronRightIcon className="size-3.5" />
        </span>
      </p>
    )
  }

  if (message.thoughtSeconds) {
    return (
      <p className="blueprint-chat-thought">
        Thought for {message.thoughtSeconds}s
        <span className="blueprint-chat-thought-chevron" aria-hidden>
          <ChevronRightIcon className="size-3.5" />
        </span>
      </p>
    )
  }

  return null
}

function ThinkingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="blueprint-chat-dot" />
      <span className="blueprint-chat-dot animation-delay-150" />
      <span className="blueprint-chat-dot animation-delay-300" />
    </span>
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

function DocPendingBody({ content }: { content: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-muted-foreground">
      <ThinkingDots />
      {content}
    </span>
  )
}
