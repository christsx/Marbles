"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"

import { BlueprintChatTurnList } from "@/components/blueprints/blueprint-chat-turn-list"
import { BlueprintComposer } from "@/components/blueprints/blueprint-composer"
import { BlueprintInitialView } from "@/components/blueprints/blueprint-initial-view"
import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"
import { useBlueprintAgentComposer } from "@/components/blueprints/use-blueprint-agent-composer"
import type { BlueprintProjectContext } from "@/lib/blueprints/project-context.types"
import { canScrollBlueprintChat } from "@/lib/blueprints/chat-scroll"
import { cn } from "@/lib/utils"

export type { BlueprintChatMessage }

type BlueprintAgentChatProps = {
  messages: BlueprintChatMessage[]
  generating: boolean
  onSend: (
    message: string,
    context: BlueprintProjectContext,
    modelId: string
  ) => void
  onRetry?: (
    message: string,
    context: BlueprintProjectContext,
    modelId: string
  ) => void
  className?: string
}

export function BlueprintAgentChat({
  messages,
  generating,
  onSend,
  onRetry,
  className,
}: BlueprintAgentChatProps) {
  const { user, isLoaded } = useUser()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { composerProps, projectContext, modelId } = useBlueprintAgentComposer({
    generating,
    onSend,
  })

  const firstName =
    user?.firstName ??
    user?.fullName?.split(/\s+/)[0] ??
    user?.username ??
    "there"

  const isLanding = messages.length === 0
  const canScrollChat = canScrollBlueprintChat(messages, isLanding)

  React.useEffect(() => {
    if (!canScrollChat || !scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, generating, canScrollChat])

  return (
    <main
      className={cn(
        "blueprint-studio flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
        isLanding && "blueprint-studio-is-landing",
        className
      )}
    >
      {isLanding ? (
        <BlueprintInitialView
          username={firstName}
          ready={isLoaded}
          composerProps={composerProps}
        />
      ) : (
        <>
          <div
            ref={scrollRef}
            className={cn(
              "blueprint-studio-chat-scroll min-h-0 flex-1 px-4 py-8",
              canScrollChat ? "is-scrollable" : "is-locked"
            )}
          >
            <BlueprintChatTurnList
              messages={messages}
              onRetry={
                onRetry
                  ? (prompt) => onRetry(prompt, projectContext, modelId)
                  : undefined
              }
            />
          </div>
          <div className="blueprint-studio-composer-wrap shrink-0 px-4 pb-4 pt-2">
            <BlueprintComposer {...composerProps} />
            <p className="blueprint-chat-disclaimer">
              Torse is AI and may get things wrong. Please verify important details.
            </p>
          </div>
        </>
      )}
    </main>
  )
}
