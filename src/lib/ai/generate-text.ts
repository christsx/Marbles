import {
  getAnthropicModel,
  getBlueprintModelProvider,
  getGroqApiKey,
  getGroqModel,
  getOpenAiModel,
} from "@/lib/ai/config"
import { getGroqModelOptions } from "@/lib/ai/groq-chat-options"
import { sanitizeLlmText } from "@/lib/ai/sanitize-llm-text"

type GenerateTextOptions = {
  system: string
  prompt: string
  maxTokens?: number
  format?: "json" | "text"
}

export async function generateText({
  system,
  prompt,
  maxTokens,
  format = "json",
}: GenerateTextOptions): Promise<string> {
  const provider = getBlueprintModelProvider()
  const resolvedMaxTokens =
    maxTokens ?? (provider === "groq" ? 2048 : 8192)

  if (provider === "groq") {
    return generateWithGroq({ system, prompt, maxTokens: resolvedMaxTokens, format })
  }

  if (provider === "anthropic") {
    return generateWithAnthropic({ system, prompt, maxTokens: resolvedMaxTokens })
  }

  if (provider === "openai") {
    return generateWithOpenAi({ system, prompt, maxTokens: resolvedMaxTokens })
  }

  throw new Error(
    "Blueprint generation is not configured. Set GROQ_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY."
  )
}

async function generateWithGroq({
  system,
  prompt,
  maxTokens,
  format = "json",
}: GenerateTextOptions) {
  const apiKey = getGroqApiKey()

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing.")
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: getGroqModel(),
      max_tokens: maxTokens,
      temperature: 0.4,
      ...getGroqModelOptions(),
      messages: [
        {
          role: "system",
          content:
            format === "json"
              ? `${system}\n\nJSON only. No fences. /no_think`
              : `${system}\n\nPlain text only. No JSON. /no_think`,
        },
        { role: "user", content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    const salvaged = extractGroqFailedGeneration(body)

    if (salvaged) {
      return sanitizeLlmText(salvaged)
    }

    throw new Error(`Groq request failed (${response.status}): ${body}`)
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>
  }

  const text = payload.choices?.[0]?.message?.content?.trim()

  if (!text) {
    throw new Error("Groq returned an empty response.")
  }

  return sanitizeLlmText(text)
}

function extractGroqFailedGeneration(body: string): string | null {
  try {
    const payload = JSON.parse(body) as {
      error?: { failed_generation?: string }
    }
    const failed = payload.error?.failed_generation

    return typeof failed === "string" && failed.trim().length > 0
      ? failed
      : null
  } catch {
    return null
  }
}

async function generateWithAnthropic({
  system,
  prompt,
  maxTokens,
}: GenerateTextOptions) {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is missing.")
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: getAnthropicModel(),
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Anthropic request failed (${response.status}): ${body}`)
  }

  const payload = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>
  }

  const text = payload.content
    ?.filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("\n")
    .trim()

  if (!text) {
    throw new Error("Anthropic returned an empty response.")
  }

  return sanitizeLlmText(text)
}

async function generateWithOpenAi({
  system,
  prompt,
  maxTokens,
}: GenerateTextOptions) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.")
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: getOpenAiModel(),
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`OpenAI request failed (${response.status}): ${body}`)
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>
  }

  const text = payload.choices?.[0]?.message?.content?.trim()

  if (!text) {
    throw new Error("OpenAI returned an empty response.")
  }

  return sanitizeLlmText(text)
}
