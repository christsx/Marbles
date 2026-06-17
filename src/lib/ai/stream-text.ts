import {
  getBlueprintModelProvider,
  getGroqApiKey,
  getGroqModel,
} from "@/lib/ai/config"
import {
  getGroqModelOptions,
  getGroqStreamDeltaContent,
} from "@/lib/ai/groq-chat-options"

type StreamTextOptions = {
  system: string
  prompt: string
  maxTokens?: number
}

export async function* streamText(
  options: StreamTextOptions
): AsyncGenerator<string, void, unknown> {
  const provider = getBlueprintModelProvider()

  if (provider !== "groq") {
    throw new Error("Streaming is only supported with GROQ_API_KEY configured.")
  }

  yield* streamGroqText(options)
}

async function* streamGroqText({
  system,
  prompt,
  maxTokens = 1200,
}: StreamTextOptions): AsyncGenerator<string, void, unknown> {
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
      stream: true,
      ...getGroqModelOptions(),
      messages: [
        {
          role: "system",
          content: `${system}\n\nPlain text only. No JSON. /no_think`,
        },
        { role: "user", content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Groq request failed (${response.status}): ${body}`)
  }

  if (!response.body) {
    throw new Error("Groq returned an empty stream.")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    buffer += decoder.decode(value, { stream: true })

    while (true) {
      const lineEnd = buffer.indexOf("\n")

      if (lineEnd === -1) {
        break
      }

      const line = buffer.slice(0, lineEnd).trim()
      buffer = buffer.slice(lineEnd + 1)

      if (!line.startsWith("data: ")) {
        continue
      }

      const data = line.slice(6)

      if (data === "[DONE]") {
        return
      }

      try {
        const payload = JSON.parse(data) as {
          error?: { message?: string }
          choices?: Array<{
            delta?: { content?: string | null; reasoning?: string | null }
          }>
        }

        if (payload.error?.message) {
          throw new Error(payload.error.message)
        }

        const chunk = getGroqStreamDeltaContent(payload.choices?.[0]?.delta)

        if (chunk) {
          yield chunk
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          continue
        }

        throw error
      }
    }
  }
}
