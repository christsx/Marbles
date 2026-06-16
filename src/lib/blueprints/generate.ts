import type { OutputData } from "@editorjs/editorjs"

import {
  getBlueprintMaxTokens,
  getBlueprintModelProvider,
} from "@/lib/ai/config"
import { generateText } from "@/lib/ai/generate-text"
import {
  BLUEPRINT_SYSTEM_PROMPT,
  BLUEPRINT_SYSTEM_PROMPT_COMPACT,
  buildBlueprintUserPrompt,
  buildBlueprintUserPromptCompact,
} from "@/lib/blueprints/arc42-prompt"
import { parseBlueprintOutput } from "@/lib/blueprints/editorjs-from-llm"
import { getBlueprintRepoContext } from "@/lib/blueprints/repo-context"

export type GenerateBlueprintInput = {
  title: string
  system: string
}

function isGroqTokenLimitError(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }

  const message = error.message.toLowerCase()

  return (
    message.includes("groq request failed (413)") ||
    message.includes("rate_limit_exceeded") ||
    message.includes("request too large")
  )
}

export async function generateBlueprintWithLlm(
  input: GenerateBlueprintInput
): Promise<OutputData> {
  const provider = getBlueprintModelProvider()
  const maxTokens = getBlueprintMaxTokens(provider)
  const compact = provider === "groq"

  const repoContext = await getBlueprintRepoContext(compact)

  try {
    const raw = await generateText({
      system: compact ? BLUEPRINT_SYSTEM_PROMPT_COMPACT : BLUEPRINT_SYSTEM_PROMPT,
      prompt: compact
        ? buildBlueprintUserPromptCompact({
            title: input.title,
            system: input.system,
            repoContext: repoContext.summary,
            stack: repoContext.stack,
          })
        : buildBlueprintUserPrompt({
            title: input.title,
            system: input.system,
            repoContext: repoContext.summary,
            stack: repoContext.stack,
          }),
      maxTokens,
    })

    return parseBlueprintOutput(raw)
  } catch (error) {
    if (!compact || !isGroqTokenLimitError(error)) {
      throw error
    }

    const raw = await generateText({
      system: BLUEPRINT_SYSTEM_PROMPT_COMPACT,
      prompt: buildBlueprintUserPromptCompact({
        title: input.title,
        system: input.system,
        repoContext: repoContext.summary,
        stack: repoContext.stack,
      }),
      maxTokens: 1536,
    })

    return parseBlueprintOutput(raw)
  }
}
