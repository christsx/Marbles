import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"
import type { BlueprintChatHistoryTurn } from "@/lib/blueprints/chat-history"
import { buildBlueprintChatRequest } from "@/lib/blueprints/build-chat-request"
import { finalizeChatMarkdown } from "@/lib/blueprints/finalize-chat-markdown"
import { generateText } from "@/lib/ai/generate-text"

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
  history?: BlueprintChatHistoryTurn[]
  userFirstName?: string
  isFirstTurn?: boolean
  workflowId?: string | null
}

export async function answerBlueprintQuestion(
  input: AnswerBlueprintQuestionInput
): Promise<string> {
  const chatRequest = await buildBlueprintChatRequest(input)

  const text = await generateText({
    system: chatRequest.system,
    prompt: chatRequest.prompt,
    maxTokens: chatRequest.maxTokens,
    format: "text",
    modelId: input.modelId,
    history: chatRequest.history,
  })

  return finalizeChatMarkdown(text)
}
