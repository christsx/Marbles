"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import { AppLogomark } from "@/components/app-logomark"
import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"

export function BlueprintChatThoughtLine({
  message,
}: {
  message: BlueprintChatMessage
}) {
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
        <AppLogomark spin size={14} className="mr-0.5 text-muted-foreground" />
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

export function BlueprintChatDocPendingBody({ content }: { content: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-muted-foreground">
      <AppLogomark spin size={14} className="text-muted-foreground" />
      {content}
    </span>
  )
}
