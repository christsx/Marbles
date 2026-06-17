import { buildAttachmentContextBlock } from "@/lib/blueprints/attachment-context"
import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"
import { detectQueryFocus } from "@/lib/blueprints/query-focus"
import { getBlueprintResearchContext } from "@/lib/blueprints/research-context"
import {
  BLUEPRINT_RESEARCH_SYSTEM_PROMPT,
  buildBlueprintResearchUserPrompt,
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
}

export async function buildBlueprintChatRequest(input: BlueprintChatRequestInput) {
  const focus = detectQueryFocus(input.question)
  const deliverable =
    input.deliverable ?? (focus.clientDeliverable ? ("sow" as const) : null)
  const research = await getBlueprintResearchContext({
    system: input.system,
    question: input.question,
    corrections: input.corrections,
    includeRepoContext: input.includeRepoContext,
    attachmentBlock: input.attachmentContext ?? null,
  })

  return {
    system: BLUEPRINT_RESEARCH_SYSTEM_PROMPT,
    prompt: buildBlueprintResearchUserPrompt({
      question: input.question,
      system: input.system,
      title: input.title,
      hasDocument: input.hasDocument,
      research,
      deliverable,
    }),
    maxTokens: deliverable ? 2200 : focus.wantsDiagram ? 1800 : focus.infra ? 1600 : 1200,
    deliverable,
  }
}
