"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"

import { BlueprintChatTurnList } from "@/components/blueprints/blueprint-chat-turn-list"
import { BlueprintComposer } from "@/components/blueprints/blueprint-composer"
import { BlueprintInitialView } from "@/components/blueprints/blueprint-initial-view"
import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"
import { useBlueprintAgentComposer } from "@/components/blueprints/use-blueprint-agent-composer"
import { useBlueprintChatScroll } from "@/components/blueprints/use-blueprint-chat-scroll"
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
    modelId: string,
    options?: { userFirstName?: string; workflowId?: string | null }
  ) => void
  onRetry?: (
    message: string,
    context: BlueprintProjectContext,
    modelId: string,
    options?: { userFirstName?: string; workflowId?: string | null; attachmentContext?: string | null }
  ) => void
  onApplyTemplate?: (templateId: string) => void
  activeTemplateId?: string | null
  className?: string
}

export function BlueprintAgentChat({
  messages,
  generating,
  onSend,
  onRetry,
  onApplyTemplate,
  activeTemplateId = null,
  className,
}: BlueprintAgentChatProps) {
  const { user, isLoaded } = useUser()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const firstName =
    user?.firstName ??
    user?.fullName?.split(/\s+/)[0] ??
    user?.username ??
    null
  const greetingName = firstName && firstName !== "there" ? firstName : null
  const displayName = greetingName ?? "there"
  const { composerProps, projectContext, modelId } = useBlueprintAgentComposer({
    generating,
    activeTemplateId,
    onApplyTemplate,
    onSend: (message, context, modelId, sendOptions) =>
      onSend(message, context, modelId, {
        userFirstName: greetingName ?? undefined,
        workflowId: sendOptions?.workflowId ?? null,
      }),
  })

  const isLanding = messages.length === 0
  const canScrollChat = canScrollBlueprintChat(messages, isLanding)
  const streamTail = messages.at(-1)?.content ?? ""

  useBlueprintChatScroll(
    scrollRef,
    [messages.length, streamTail, generating],
    canScrollChat
  )

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
          username={displayName}
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
                  ? (prompt, meta) =>
                      onRetry(prompt, projectContext, modelId, {
                        userFirstName: greetingName ?? undefined,
                        workflowId: meta?.workflowId,
                        attachmentContext: meta?.attachmentContext,
                      })
                  : undefined
              }
            />
          </div>
          <div className="blueprint-studio-composer-wrap shrink-0 px-4 pb-4 pt-2">
            <BlueprintComposer {...composerProps} />
            <p className="blueprint-chat-disclaimer">
              Marbles is AI and may get things wrong. Please verify important details.
            </p>
          </div>
        </>
      )}
    </main>
  )
}
