"use client"

import * as React from "react"
import type { OutputData } from "@editorjs/editorjs"

import {
  answerBlueprintQuestionAction,
  generateBlueprintAction,
} from "@/app/dashboard/blueprints/actions"
import type { BlueprintChatMessage } from "@/components/blueprints/blueprint-chat-message.types"
import type { BlueprintEditorHandle } from "@/components/blueprints/blueprint-editor"
import { extractAttachmentsForChat } from "@/lib/blueprints/client-extract-attachments"
import { buildChatHistory } from "@/lib/blueprints/chat-history"
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
import { dropLastChatTurn } from "@/lib/blueprints/drop-last-chat-turn"
import { isGroqModelId } from "@/lib/ai/model-catalog"
import { deliverableDocumentTitle } from "@/lib/blueprints/prose-to-editorjs"
import type { BlueprintProjectContext } from "@/lib/blueprints/project-context.types"
import { repoContextIsActive } from "@/lib/blueprints/project-context.types"
import { templateAllowsRepo } from "@/lib/blueprints/studio-templates"
import { formatChatError } from "@/lib/blueprints/format-chat-error"
import {
  buildTemplateFollowUp,
  mergeChatIntoTemplateDoc,
} from "@/lib/blueprints/template-document"
import { resolveStudioDeliverable } from "@/lib/blueprints/workflow-prompt"

function resolveEffectiveWorkflowId(
  activeTemplateId: string | null,
  workflowId?: string | null,
  priorWorkflowId?: string | null
) {
  return activeTemplateId ?? workflowId ?? priorWorkflowId ?? null
}

async function buildResearchOptions(
  context: BlueprintProjectContext,
  corrections: string[],
  workflowId: string | null,
  cachedAttachment?: string | null
) {
  return {
    includeRepoContext:
      repoContextIsActive(context) && templateAllowsRepo(workflowId),
    attachmentContext:
      cachedAttachment ??
      (context.attachments.length
        ? await extractAttachmentsForChat(context.attachments)
        : null),
    corrections,
  }
}

const USE_STREAMING =
  process.env.NEXT_PUBLIC_BLUEPRINT_STREAM_CHAT !== "false"

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
  content: OutputData | null
  activeTemplateId: string | null
  beginTemplateFill: (content: OutputData | null, templateId: string | null) => void
  finishTemplateFill: () => void
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
    content,
    activeTemplateId,
    beginTemplateFill,
    finishTemplateFill,
    editorRef,
    setTitle,
    setContent,
    setHasDocument,
    setContentKey,
    setStudioError,
  } = options

  const contentRef = React.useRef(content)
  const activeTemplateIdRef = React.useRef(activeTemplateId)

  React.useEffect(() => {
    contentRef.current = content
  }, [content])

  React.useEffect(() => {
    activeTemplateIdRef.current = activeTemplateId
  }, [activeTemplateId])

  const [messages, setMessages] = React.useState<BlueprintChatMessage[]>([])
  const [generating, setGenerating] = React.useState(false)
  const [docGenerating, setDocGenerating] = React.useState(false)
  const frameRef = React.useRef<number | null>(null)
  const pendingContentRef = React.useRef("")
  const streamStartedRef = React.useRef(false)
  const sessionRef = React.useRef(0)
  const abortRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => {
    return () => {
      sessionRef.current += 1
      abortRef.current?.abort()
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

  const applyPendingMessage = React.useCallback((pendingId: string) => {
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
  }, [])

  const flushPendingMessage = React.useCallback(
    (pendingId: string, immediate = false) => {
      const run = () => {
        frameRef.current = null
        applyPendingMessage(pendingId)
      }

      if (immediate) {
        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current)
          frameRef.current = null
        }

        run()
        return
      }

      if (frameRef.current !== null) {
        return
      }

      frameRef.current = window.requestAnimationFrame(run)
    },
    [applyPendingMessage]
  )

  const finishThought = (startedAt: number) =>
    Math.max(1, Math.round((Date.now() - startedAt) / 1000))

  const completeAssistantReply = React.useCallback(
    (
      pendingId: string,
      answer: string,
      prompt: string,
      startedAt: number
    ) => {
      const templateId = activeTemplateIdRef.current
      const currentContent = contentRef.current

      if (templateId && currentContent) {
        const merged = mergeChatIntoTemplateDoc(currentContent, templateId, answer)
        setContent(merged.content)
        setContentKey((key) => key + 1)
        contentRef.current = merged.content

        let display = merged.chatReply
        const followUp = buildTemplateFollowUp(
          merged.content,
          templateId,
          merged.updatedSectionIds
        )

        if (followUp) {
          display = display ? `${display}\n\n${followUp}` : followUp
        }

        finishTemplateFill()
        answer = display || answer
      }

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
    [finishTemplateFill, setContent, setContentKey]
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
      modelId: string,
      history: ReturnType<typeof buildChatHistory>,
      workflowId: string | null,
      userFirstName?: string,
      isFirstTurn?: boolean
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
        history,
        userFirstName,
        isFirstTurn,
        workflowId,
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
      modelId: string,
      history: ReturnType<typeof buildChatHistory>,
      signal: AbortSignal,
      workflowId: string | null,
      userFirstName?: string,
      isFirstTurn?: boolean
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
          history,
          userFirstName,
          isFirstTurn,
          workflowId,
        },
        (chunk) => {
          if (!isSessionActive(session)) {
            return
          }

          pendingContentRef.current = chunk

          if (activeTemplateIdRef.current) {
            if (!streamStartedRef.current) {
              streamStartedRef.current = true
              setMessages((current) =>
                current.map((message) =>
                  message.id === pendingId
                    ? {
                        ...message,
                        content: "Updating document…",
                        streaming: true,
                        pending: true,
                      }
                    : message
                )
              )
            }
            return
          }

          if (!streamStartedRef.current && chunk.trim()) {
            streamStartedRef.current = true
            flushPendingMessage(pendingId, true)
            return
          }

          flushPendingMessage(pendingId)
        },
        signal
      )

      if (!isSessionActive(session)) {
        return { status: "cancelled" }
      }

      if (result.ok) {
        completeAssistantReply(pendingId, result.answer, prompt, startedAt)
        return { status: "success", answer: result.answer }
      }

      if (result.aborted) {
        return { status: "cancelled" }
      }

      return askWithServerAction(
        prompt,
        pendingId,
        startedAt,
        session,
        deliverable,
        corrections,
        research,
        modelId,
        history,
        workflowId,
        userFirstName,
        isFirstTurn
      )
    },
    [askWithServerAction, completeAssistantReply, flushPendingMessage, hasDocument, isSessionActive, system, title]
  )

  const handleSend = React.useCallback(
    async (
      prompt: string,
      projectContext: BlueprintProjectContext,
      modelId: string,
      options?: {
        retry?: boolean
        userFirstName?: string
        workflowId?: string | null
        attachmentContext?: string | null
      }
    ) => {
      setStudioError(null)

      const baseMessages = options?.retry
        ? dropLastChatTurn(messages)
        : messages
      const isFirstTurn = baseMessages.length === 0
      const userFirstName = options?.userFirstName?.trim()
      const priorUser = options?.retry
        ? baseMessages.filter((message) => message.role === "user").at(-1)
        : undefined
      const workflowId = resolveEffectiveWorkflowId(
        activeTemplateIdRef.current,
        options?.workflowId,
        priorUser?.workflowId
      )

      if (activeTemplateIdRef.current) {
        beginTemplateFill(contentRef.current, activeTemplateIdRef.current)
      }

      const intent = classifyBlueprintIntent(prompt, { hasDocument })
      const focus = detectQueryFocus(prompt)
      const hasAttachments =
        projectContext.attachments.length > 0 ||
        Boolean(options?.attachmentContext ?? priorUser?.attachmentContext)
      const deliverable = resolveStudioDeliverable({
        prompt,
        workflowId,
        hasAttachments,
        detected: detectDeliverableKind(prompt),
        clientDeliverable: focus.clientDeliverable,
      })
      const corrections = collectSessionCorrections([
        ...baseMessages,
        { role: "user", content: prompt },
      ])
      const research = await buildResearchOptions(
        projectContext,
        corrections,
        workflowId,
        options?.attachmentContext ?? priorUser?.attachmentContext
      )
      const history = buildChatHistory(baseMessages)
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
      streamStartedRef.current = false
      abortRef.current?.abort()
      const abortController = new AbortController()
      abortRef.current = abortController

      setMessages([
        ...baseMessages,
        createMessage("user", prompt, {
          workflowId,
          attachmentContext: research.attachmentContext,
        }),
        {
          id: pendingId,
          role: "assistant",
          content: activeTemplateIdRef.current
            ? "Updating document…"
            : writesDocument
              ? getIntentAssistantHint(intent, deliverable, focus)
              : "",
          pending: true,
          streaming: !writesDocument && !activeTemplateIdRef.current,
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
                modelId,
                history,
                abortController.signal,
                workflowId,
                userFirstName,
                isFirstTurn
              )
            : await askWithServerAction(
                prompt,
                pendingId,
                pendingStartedAt,
                session,
                deliverable,
                corrections,
                research,
                modelId,
                history,
                workflowId,
                userFirstName,
                isFirstTurn
              )

          if (!isSessionActive(session)) {
            return
          }

          if (!outcome || outcome.status === "cancelled") {
            setMessages((current) => {
              const pending = current.find((message) => message.id === pendingId)

              if (!pending?.content.trim()) {
                return current.filter((message) => message.id !== pendingId)
              }

              return current.map((message) =>
                message.id === pendingId
                  ? {
                      ...message,
                      pending: false,
                      streaming: false,
                      thoughtSeconds: finishThought(pendingStartedAt),
                    }
                  : message
              )
            })
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

        if (activeTemplateIdRef.current) {
          finishTemplateFill()
        }
      }
    },
    [
      askWithServerAction,
      askWithStream,
      beginTemplateFill,
      editorRef,
      finishTemplateFill,
      hasDocument,
      isSessionActive,
      messages,
      setContent,
      setContentKey,
      setHasDocument,
      setStudioError,
      setTitle,
      system,
      title,
    ]
  )

  const handleRetry = React.useCallback(
    (
      prompt: string,
      projectContext: BlueprintProjectContext,
      modelId: string,
      options?: {
        userFirstName?: string
        workflowId?: string | null
        attachmentContext?: string | null
      }
    ) =>
      handleSend(prompt, projectContext, modelId, {
        retry: true,
        userFirstName: options?.userFirstName,
        workflowId: options?.workflowId,
        attachmentContext: options?.attachmentContext,
      }),
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
