import { getGroqModel } from "@/lib/ai/config"

export function isQwenGroqModel(model = getGroqModel()) {
  return model.toLowerCase().includes("qwen")
}

/** Qwen3 on Groq needs explicit reasoning disabled or streams return empty content. */
export function getGroqModelOptions(model = getGroqModel()) {
  if (!isQwenGroqModel(model)) {
    return {}
  }

  return {
    reasoning_effort: "none" as const,
  }
}

export function getGroqStreamDeltaContent(delta?: {
  content?: string | null
  reasoning?: string | null
}) {
  if (delta?.content) {
    return delta.content
  }

  if (delta?.reasoning) {
    return delta.reasoning
  }

  return null
}
