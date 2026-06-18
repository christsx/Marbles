import { getGroqApiKey } from "@/lib/ai/config"
import { getGroqModelOptions } from "@/lib/ai/groq-chat-options"
import { resolveModelRequest } from "@/lib/ai/model-catalog"
import { sanitizeLlmText } from "@/lib/ai/sanitize-llm-text"

type GenerateTextOptions = {
  system: string
  prompt: string
  maxTokens?: number
  format?: "json" | "text"
  modelId?: string | null
}

export async function generateText({
  system,
  prompt,
  maxTokens = 2048,
  format = "json",
  modelId,
}: GenerateTextOptions): Promise<string> {
  const model = resolveModelRequest(modelId)
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
      model: model.apiModel,
      max_tokens: maxTokens,
      temperature: 0.4,
      ...getGroqModelOptions(model.apiModel),
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
