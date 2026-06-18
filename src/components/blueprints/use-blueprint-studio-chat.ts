"use client"

import * as React from "react"
import type { OutputData } from "@editorjs/editorjs"

import {
  answerBlueprintQuestionAction,
  generateBlueprintAction,
} from "@/app/dashboard/blueprints/actions"
import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"
import type { BlueprintEditorHandle } from "@/components/blueprints/blueprint-editor"
import { buildAttachmentContextBlock } from "@/lib/blueprints/attachment-context"
import { streamBlueprintChat } from "@/lib/blueprints/client-stream-chat"
import { collectSessionCorrections } from "@/lib/blueprints/chat-corrections"
import {
  classifyBlueprintIntent,
  detectDeliverableKind,
  getIntentAssistantHint,
  getIntentSuccessMessage,
  updatesDocumentPanel,
} from "@/lib/blueprints/intent"
import { detectQueryFocus } from "@/lib/blueprints/query-focus"
import { chatAnswerToEditorDoc } from "@/lib/blueprints/chat-answer-to-editor-doc"
import { dropLastChatTurn } from "@/lib/blueprints/drop-last-chat-turn"
import { isGroqModelId } from "@/lib/ai/model-catalog"
import { deliverableDocumentTitle } from "@/lib/blueprints/prose-to-editorjs"
import type { BlueprintProjectContext } from "@/lib/blueprints/project-context.types"
import {
  formatChatError,
  revealChatAnswer,
} from "@/lib/blueprints/reveal-chat-answer"

function isPlaceholderRepo(activeRepo: string | null | undefined) {
  if (!activeRepo) return true
  return (
    activeRepo.includes("Connect GitHub") ||
    activeRepo.includes("Select repo in Integrations")
  )
}

function repoContextIsActive(context: BlueprintProjectContext) {
  return (
    context.repoEnabled &&
    Boolean(context.activeRepo) &&
    !isPlaceholderRepo(context.activeRepo)
  )
}

async function buildResearchOptions(
  prompt: string,
  context: BlueprintProjectContext,
  corrections: string[]
) {
  return {
    includeRepoContext: repoContextIsActive(context),
    attachmentContext: await buildAttachmentContextBlock(context.attachments),
    corrections,
  }
}

const USE_STREAMING =
  process.env.NEXT_PUBLIC_BLUEPRINT_STREAM_CHAT === "true"

function deriveTitle(prompt: string) {
  const trimmed = prompt.trim()
  if (trimmed.length <= 80) return trimmed
  const slice = trimmed.slice(0, 77)
  const lastSpace = slice.lastIndexOf(" ")
  return `${lastSpace > 40 ? slice.slice(0, lastSpace) : slice}…`
}

function createMessage(
  role: BlueprintChatMessage["role"],
  content: string,
  extra?: Partial<BlueprintChatMessage>
): BlueprintChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    ...extra,
  }
}

type UseBlueprintStudioChatOptions = {
  title: string
  system: string
  hasDocument: boolean
  editorRef: React.RefObject<BlueprintEditorHandle | null>
  setTitle: React.Dispatch<React.SetStateAction<string>>
  setContent: React.Dispatch<React.SetStateAction<OutputData | null>>
  setHasDocument: React.Dispatch<React.SetStateAction<boolean>>
  setContentKey: React.Dispatch<React.SetStateAction<number>>
  setStudioError: React.Dispatch<React.SetStateAction<string | null>>
}

type QuestionAskResult =
  | { status: "cancelled" }
  | { status: "error"; message: string }
  | { status: "success"; answer: string }

export function useBlueprintStudioChat(options: UseBlueprintStudioChatOptions) {
  const {
    title,
    system,
    hasDocument,
    editorRef,
    setTitle,
    setContent,
    setHasDocument,
    setContentKey,
    setStudioError,
  } = options

  const [messages, setMessages] = React.useState<BlueprintChatMessage[]>([])
  const [generating, setGenerating] = React.useState(false)
  const [docGenerating, setDocGenerating] = React.useState(false)
  const frameRef = React.useRef<number | null>(null)
  const pendingContentRef = React.useRef("")
  const sessionRef = React.useRef(0)

  React.useEffect(() => {
    return () => {
      sessionRef.current += 1
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [])

  const isSessionActive = React.useCallback(
    (session: number) => sessionRef.current === session,
    []
  )

  const flushPendingMessage = React.useCallback((pendingId: string) => {
    if (frameRef.current !== null) return

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null
      setMessages((current) =>
        current.map((message) =>
          message.id === pendingId
            ? {
                ...message,
                content: pendingContentRef.current,
                streaming: true,
                pending: true,
              }
            : message
        )
      )
    })
  }, [])

  const finishThought = (startedAt: number) =>
    Math.max(1, Math.round((Date.now() - startedAt) / 1000))

  const completeAssistantReply = React.useCallback(
    (
      pendingId: string,
      answer: string,
      prompt: string,
      startedAt: number
    ) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === pendingId
            ? {
                ...message,
                content: answer,
                pending: false,
                streaming: false,
                thoughtSeconds: finishThought(startedAt),
                userPrompt: prompt,
              }
            : message
        )
      )
    },
    []
  )

  const syncDiagramDocFromAnswer = React.useCallback(
    async (answer: string, docTitle: string, wantsDiagram: boolean) => {
      if (!wantsDiagram) {
        return
      }

      const doc = chatAnswerToEditorDoc(docTitle, answer)

      if (!doc) {
        return
      }

      setContent(doc)
      setHasDocument(true)
      setContentKey((key) => key + 1)
      await editorRef.current?.render(doc)
    },
    [editorRef, setContent, setContentKey, setHasDocument]
  )

  const askWithServerAction = React.useCallback(
    async (
      prompt: string,
      pendingId: string,
      startedAt: number,
      session: number,
      deliverable: ReturnType<typeof detectDeliverableKind>,
      corrections: string[],
      research: {
        includeRepoContext: boolean
        attachmentContext: string | null
      },
      modelId: string
    ): Promise<QuestionAskResult> => {
      const result = await answerBlueprintQuestionAction({
        question: prompt,
        system,
        title: title.trim() || undefined,
        hasDocument,
        deliverable,
        corrections,
        includeRepoContext: research.includeRepoContext,
        attachmentContext: research.attachmentContext,
        modelId,
      })

      if (!isSessionActive(session)) {
        return { status: "cancelled" }
      }

      if (result.status !== "success" || !result.answer.trim()) {
        return {
          status: "error",
          message:
            result.status === "error"
              ? result.message
              : "The model returned an empty response.",
        }
      }

      await revealChatAnswer({
        answer: result.answer,
        pendingId,
        setMessages,
        shouldContinue: () => isSessionActive(session),
      })

      if (!isSessionActive(session)) {
        return { status: "cancelled" }
      }

      completeAssistantReply(pendingId, result.answer, prompt, startedAt)
      return { status: "success", answer: result.answer }
    },
    [completeAssistantReply, hasDocument, isSessionActive, system, title]
  )

  const askWithStream = React.useCallback(
    async (
      prompt: string,
      pendingId: string,
      startedAt: number,
      session: number,
      deliverable: ReturnType<typeof detectDeliverableKind>,
      corrections: string[],
      research: {
        includeRepoContext: boolean
        attachmentContext: string | null
      },
      modelId: string
    ): Promise<QuestionAskResult> => {
      const result = await streamBlueprintChat(
        {
          question: prompt,
          system,
          title: title.trim() || undefined,
          hasDocument,
          deliverable,
          corrections,
          includeRepoContext: research.includeRepoContext,
          attachmentContext: research.attachmentContext,
          modelId,
        },
        (chunk) => {
          if (!isSessionActive(session)) {
            return
          }

          pendingContentRef.current = chunk
          flushPendingMessage(pendingId)
        }
      )

      if (!isSessionActive(session)) {
        return { status: "cancelled" }
      }

      if (result.ok) {
        completeAssistantReply(pendingId, result.answer, prompt, startedAt)
        return { status: "success", answer: result.answer }
      }

      return askWithServerAction(
        prompt,
        pendingId,
        startedAt,
        session,
        deliverable,
        corrections,
        research,
        modelId
      )
    },
    [
      askWithServerAction,
      completeAssistantReply,
      flushPendingMessage,
      hasDocument,
      isSessionActive,
      system,
      title,
    ]
  )

  const handleSend = React.useCallback(
    async (
      prompt: string,
      projectContext: BlueprintProjectContext,
      modelId: string,
      options?: { retry?: boolean }
    ) => {
      setStudioError(null)

      const baseMessages = options?.retry
        ? dropLastChatTurn(messages)
        : messages

      const intent = classifyBlueprintIntent(prompt, { hasDocument })
      const focus = detectQueryFocus(prompt)
      const deliverable =
        detectDeliverableKind(prompt) ?? (focus.clientDeliverable ? "sow" : null)
      const corrections = collectSessionCorrections([
        ...baseMessages,
        { role: "user", content: prompt },
      ])
      const research = await buildResearchOptions(
        prompt,
        projectContext,
        corrections
      )
      const writesDocument = updatesDocumentPanel(intent)
      const nextTitle = title.trim() || deriveTitle(prompt)

      if (!title.trim() && (intent === "update_document" || deliverable)) {
        setTitle(
          deliverable
            ? deliverableDocumentTitle(deliverable, system)
            : nextTitle
        )
      }

      const pendingStartedAt = Date.now()
      const pendingId = `pending-${Date.now()}`
      const session = ++sessionRef.current
      pendingContentRef.current = ""

      setMessages([
        ...baseMessages,
        createMessage("user", prompt),
        {
          id: pendingId,
          role: "assistant",
          content: writesDocument
            ? getIntentAssistantHint(intent, deliverable, focus.wantsDiagram)
            : "",
          pending: true,
          streaming: !writesDocument,
          startedAt: pendingStartedAt,
          userPrompt: prompt,
        },
      ])
      setGenerating(true)
      setDocGenerating(writesDocument)

      try {
        if (intent === "question") {
          const shouldStream = USE_STREAMING && isGroqModelId(modelId)
          const outcome = shouldStream
            ? await askWithStream(
                prompt,
                pendingId,
                pendingStartedAt,
                session,
                deliverable,
                corrections,
                research,
                modelId
              )
            : await askWithServerAction(
                prompt,
                pendingId,
                pendingStartedAt,
                session,
                deliverable,
                corrections,
                research,
                modelId
              )

          if (!isSessionActive(session)) {
            return
          }

          if (!outcome || outcome.status === "cancelled") {
            return
          }

          if (outcome.status === "error") {
            setStudioError(outcome.message)
            setMessages([
              ...baseMessages,
              createMessage("user", prompt),
              createMessage("assistant", outcome.message, { userPrompt: prompt }),
            ])
            return
          }

          await syncDiagramDocFromAnswer(
            outcome.answer,
            nextTitle,
            focus.wantsDiagram
          )

          return
        }

        const result = await generateBlueprintAction({
          title: nextTitle,
          system,
          prompt,
          modelId,
        })

        if (!isSessionActive(session)) {
          return
        }

        if (result.status === "error") {
          setStudioError(result.message)
          setMessages((current) =>
            current
              .filter((message) => message.id !== pendingId)
              .concat(
                createMessage("assistant", `Generation failed: ${result.message}`)
              )
          )
          return
        }

        if (result.status !== "success") return

        setContent(result.content)
        setHasDocument(true)
        setContentKey((key) => key + 1)
        await editorRef.current?.render(result.content)

        const successMessage = getIntentSuccessMessage(intent, hasDocument)
        setMessages((current) =>
          current
            .filter((message) => message.id !== pendingId)
            .concat(
              successMessage
                ? createMessage("assistant", successMessage, {
                    thoughtSeconds: finishThought(pendingStartedAt),
                    userPrompt: prompt,
                  })
                : []
            )
        )
      } catch (error) {
        const message = formatChatError(error)
        console.error("Blueprint chat failed:", error)
        setStudioError(message)
        setMessages((current) =>
          current
            .filter((message) => message.id !== pendingId)
            .concat(createMessage("assistant", message))
        )
      } finally {
        if (!isSessionActive(session)) {
          return
        }

        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current)
          frameRef.current = null
        }

        setGenerating(false)
        setDocGenerating(false)
      }
    },
    [
      askWithServerAction,
      askWithStream,
      editorRef,
      hasDocument,
      isSessionActive,
      messages,
      setContent,
      setContentKey,
      setHasDocument,
      setStudioError,
      setTitle,
      syncDiagramDocFromAnswer,
      system,
      title,
    ]
  )

  const handleRetry = React.useCallback(
    (prompt: string, projectContext: BlueprintProjectContext, modelId: string) =>
      handleSend(prompt, projectContext, modelId, { retry: true }),
    [handleSend]
  )

  return {
    messages,
    setMessages,
    generating,
    docGenerating,
    handleSend,
    handleRetry,
  }
}
