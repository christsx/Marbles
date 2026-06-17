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
  prompt?: string
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

function isJsonParseError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("Model response was not valid JSON")
  )
}

async function requestBlueprintJson(
  input: GenerateBlueprintInput,
  promptInput: {
    title: string
    system: string
    repoContext: string
    stack?: string
    prompt?: string
    connected?: boolean
  },
  options: { compact: boolean; maxTokens: number; strict?: boolean }
) {
  const system = options.compact
    ? BLUEPRINT_SYSTEM_PROMPT_COMPACT
    : BLUEPRINT_SYSTEM_PROMPT

  const prompt = options.compact
    ? buildBlueprintUserPromptCompact(promptInput)
    : buildBlueprintUserPrompt(promptInput)

  const raw = await generateText({
    system: options.strict
      ? `${system}\n\nCRITICAL: Output must be a single valid JSON object {"blocks":[...]} with no prose before or after.`
      : system,
    prompt: options.strict
      ? `${prompt}\n\nReturn ONLY valid JSON {"blocks":[...]}. No markdown fences. No explanation.`
      : prompt,
    maxTokens: options.maxTokens,
  })

  return parseBlueprintOutput(raw)
}

export async function generateBlueprintWithLlm(
  input: GenerateBlueprintInput
): Promise<OutputData> {
  const provider = getBlueprintModelProvider()
  const maxTokens = getBlueprintMaxTokens(provider)
  const compact = provider === "groq"

  const repoContext = await getBlueprintRepoContext(compact)

  const promptInput = {
    title: input.title,
    system: input.system,
    repoContext: repoContext.summary,
    stack: repoContext.stack,
    prompt: input.prompt,
    connected: repoContext.connected,
  }

  try {
    return await requestBlueprintJson(input, promptInput, {
      compact,
      maxTokens,
    })
  } catch (error) {
    if (isJsonParseError(error)) {
      try {
        return await requestBlueprintJson(input, promptInput, {
          compact: true,
          maxTokens: compact ? 1536 : maxTokens,
          strict: true,
        })
      } catch (retryError) {
        throw retryError
      }
    }

    if (!compact || !isGroqTokenLimitError(error)) {
      throw error
    }

    return requestBlueprintJson(input, promptInput, {
      compact: true,
      maxTokens: 1536,
    })
  }
}
