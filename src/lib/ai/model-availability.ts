import { getGroqApiKey } from "@/lib/ai/config"
import {
  getModelOption,
  resolveModelId,
} from "@/lib/ai/model-catalog"

export type ApiKeyState = {
  groq: boolean
}

export function getServerApiKeyState(): ApiKeyState {
  return {
    groq: Boolean(getGroqApiKey()),
  }
}

export function isModelAvailable(modelId: string, apiKeys: ApiKeyState) {
  return getModelOption(resolveModelId(modelId))?.provider === "groq" && apiKeys.groq
}

export function isAnyModelAvailable(apiKeys: ApiKeyState) {
  return apiKeys.groq
}
