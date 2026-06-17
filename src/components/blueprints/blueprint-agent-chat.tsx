"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"

import { BlueprintChatTurnList } from "@/components/blueprints/blueprint-chat-turn-list"
import { BlueprintComposer } from "@/components/blueprints/blueprint-composer"
import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"
import { fetchRepoContextSnapshot } from "@/lib/blueprints/fetch-repo-context"
import {
  emptyProjectContext,
  type BlueprintProjectContext,
} from "@/lib/blueprints/project-context.types"
import { cn } from "@/lib/utils"

export type { BlueprintChatMessage }

type BlueprintAgentChatProps = {
  messages: BlueprintChatMessage[]
  generating: boolean
  onSend: (message: string, context: BlueprintProjectContext) => void
  onRetry?: (message: string, context: BlueprintProjectContext) => void
  className?: string
}

function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Morning"
  if (hour < 17) return "Afternoon"
  return "Evening"
}

export function BlueprintAgentChat({
  messages,
  generating,
  onSend,
  onRetry,
  className,
}: BlueprintAgentChatProps) {
  const { user, isLoaded } = useUser()
  const [input, setInput] = React.useState("")
  const [projectContext, setProjectContext] =
    React.useState<BlueprintProjectContext>(emptyProjectContext)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const firstName =
    user?.firstName ??
    user?.fullName?.split(/\s+/)[0] ??
    user?.username ??
    "there"

  const isLanding = messages.length === 0

  React.useEffect(() => {
    if (isLanding || !scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, generating, isLanding])

  const enableRepoContext = React.useCallback(async () => {
    const snapshot = await fetchRepoContextSnapshot()
    setProjectContext((current) => ({ ...current, ...snapshot }))
  }, [])

  const toggleRepo = React.useCallback(async () => {
    if (projectContext.repoEnabled) {
      setProjectContext((current) => ({
        ...current,
        repoEnabled: false,
        activeRepo: null,
      }))
      return
    }

    await enableRepoContext()
  }, [enableRepoContext, projectContext.repoEnabled])

  const submit = React.useCallback(
    (value?: string) => {
      const text = (value ?? input).trim()
      if (
        (!text && projectContext.attachments.length === 0) ||
        generating
      ) {
        return
      }

      onSend(text, projectContext)
      setInput("")
      setProjectContext((current) => ({ ...current, attachments: [] }))
      if (textareaRef.current) textareaRef.current.style.height = ""
    },
    [generating, input, onSend, projectContext]
  )

  const composerProps = {
    input,
    generating,
    projectContext,
    textareaRef,
    onInput: (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      setInput(event.target.value),
    onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        submit()
      }
    },
    onSubmit: () => submit(),
    onAttachFiles: (attachments: BlueprintProjectContext["attachments"]) =>
      setProjectContext((current) => ({
        ...current,
        attachments: [...current.attachments, ...attachments],
      })),
    onToggleRepo: () => void toggleRepo(),
    onRemoveRepo: () =>
      setProjectContext((current) => ({
        ...current,
        repoEnabled: false,
        activeRepo: null,
      })),
    onRemoveAttachment: (id: string) =>
      setProjectContext((current) => ({
        ...current,
        attachments: current.attachments.filter((item) => item.id !== id),
      })),
  }

  return (
    <main
      className={cn(
        "blueprint-studio flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
        className
      )}
    >
      {isLanding ? (
        <div className="blueprint-studio-landing flex flex-col items-center px-4">
          <div className="blueprint-studio-landing-inner flex w-full flex-col items-center gap-8">
            <h1 className="blueprint-greeting text-center">
              {isLoaded ? `${getTimeGreeting()}, ${firstName}` : "Blueprint studio"}
            </h1>
            <BlueprintComposer {...composerProps} large />
            <p className="blueprint-chat-disclaimer mt-6 text-center">
              Torse is AI and may get things wrong. Please verify important details.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="blueprint-studio-chat-scroll min-h-0 flex-1 overflow-y-auto px-4 py-8"
          >
            <BlueprintChatTurnList
              messages={messages}
              onRetry={
                onRetry ? (prompt) => onRetry(prompt, projectContext) : undefined
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
