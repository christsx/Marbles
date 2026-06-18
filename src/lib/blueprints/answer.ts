import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"
import { buildBlueprintChatRequest } from "@/lib/blueprints/build-chat-request"
import { generateText } from "@/lib/ai/generate-text"
import { sanitizeLlmText } from "@/lib/ai/sanitize-llm-text"
import { normalizeChatProse } from "@/lib/blueprints/parse-chat-markdown"

export type AnswerBlueprintQuestionInput = {
  question: string
  system: string
  title?: string
  hasDocument: boolean
  deliverable?: BlueprintDeliverableKind
  corrections?: string[]
  includeRepoContext?: boolean
  attachmentContext?: string | null
  modelId?: string | null
}

export async function answerBlueprintQuestion(
  input: AnswerBlueprintQuestionInput
): Promise<string> {
  const chatRequest = await buildBlueprintChatRequest(input)

  const text = await generateText({
    ...chatRequest,
    format: "text",
    modelId: input.modelId,
  })

  return normalizeChatProse(sanitizeLlmText(text))
}
