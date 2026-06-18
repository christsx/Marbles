export type ModelProvider = "groq"

export type ModelGroup = "Groq"

export type ModelOption = {
  id: string
  label: string
  group: ModelGroup
  provider: ModelProvider
  apiModel: string
}

export const MODELS: ModelOption[] = [
  {
    id: "qwen3-32b",
    label: "Qwen3 32B",
    group: "Groq",
    provider: "groq",
    apiModel: "qwen/qwen3-32b",
  },
]

export const DEFAULT_MODEL_ID = "qwen3-32b"

export const ALLOWED_MODEL_IDS = new Set(MODELS.map((model) => model.id))

export const MODEL_GROUP_ORDER: ModelGroup[] = ["Groq"]

const MODEL_BY_ID = new Map(MODELS.map((model) => [model.id, model]))

export function getModelOption(modelId: string) {
  return MODEL_BY_ID.get(modelId)
}

export function resolveModelId(modelId?: string | null) {
  if (modelId && ALLOWED_MODEL_IDS.has(modelId)) {
    return modelId
  }

  return DEFAULT_MODEL_ID
}

export function resolveModelRequest(modelId?: string | null) {
  const id = resolveModelId(modelId)
  const option = getModelOption(id)

  if (!option) {
    throw new Error(`Unknown model: ${id}`)
  }

  return option
}

export function isGroqModelId(modelId?: string | null) {
  return resolveModelRequest(modelId).provider === "groq"
}
