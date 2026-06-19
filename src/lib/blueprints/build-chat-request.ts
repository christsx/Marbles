import type { BlueprintChatHistoryTurn } from "@/lib/blueprints/chat-history"
import { historyToGroqMessages } from "@/lib/blueprints/chat-history"
import { isTranscriptionRequest, type BlueprintDeliverableKind } from "@/lib/blueprints/intent"
import { detectQueryFocus } from "@/lib/blueprints/query-focus"
import { getBlueprintResearchContext } from "@/lib/blueprints/research-context"
import {
  buildBlueprintResearchUserPrompt,
  buildBlueprintSystemPrompt,
} from "@/lib/blueprints/research-prompt"

export type BlueprintChatRequestInput = {
  question: string
  system: string
  title?: string
  hasDocument: boolean
  deliverable?: BlueprintDeliverableKind
  corrections?: string[]
  includeRepoContext?: boolean
  attachmentContext?: string | null
  history?: BlueprintChatHistoryTurn[]
  userFirstName?: string
  isFirstTurn?: boolean
  workflowId?: string | null
}

export async function buildBlueprintChatRequest(input: BlueprintChatRequestInput) {
  const focus = detectQueryFocus(input.question)
  const transcribe = isTranscriptionRequest(input.question)
  const deliverable = transcribe
    ? null
    : input.deliverable ?? (focus.clientDeliverable ? ("sow" as const) : null)
  const research = await getBlueprintResearchContext({
    system: input.system,
    question: input.question,
    corrections: input.corrections,
    includeRepoContext: input.includeRepoContext,
    attachmentBlock: input.attachmentContext ?? null,
  })

  const hasAttachments = Boolean(input.attachmentContext?.trim())

  return {
    system: buildBlueprintSystemPrompt(research),
    prompt: buildBlueprintResearchUserPrompt({
      question: input.question,
      system: input.system,
      title: input.title,
      hasDocument: input.hasDocument,
      research,
      deliverable,
      transcribe,
      userFirstName: input.userFirstName,
      isFirstTurn: input.isFirstTurn,
      workflowId: input.workflowId,
    }),
    history: input.history ?? [],
    maxTokens: transcribe
      ? 8000
      : hasAttachments
        ? 2600
        : deliverable
          ? 2200
          : focus.wantsCodebaseOverview
            ? 2200
            : focus.wantsDiagram
              ? 1800
              : focus.infra
                ? 1600
                : 1200,
    deliverable,
  }
}

export function buildGroqChatMessages(input: {
  system: string
  prompt: string
  history?: BlueprintChatHistoryTurn[]
  format?: "json" | "text"
}) {
  const format = input.format ?? "text"
  const systemSuffix =
    format === "json"
      ? "JSON only. No fences. /no_think"
      : "Reply in plain text. Write naturally, like chat. No JSON. /no_think"

  return [
    {
      role: "system" as const,
      content: `${input.system}\n\n${systemSuffix}`,
    },
    ...historyToGroqMessages(input.history ?? []),
    { role: "user" as const, content: input.prompt },
  ]
}
