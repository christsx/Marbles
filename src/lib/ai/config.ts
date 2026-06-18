export function getGroqApiKey() {
  return process.env.GROQ_API_KEY ?? process.env["groq-api-key"]
}

export function getBlueprintModelProvider() {
  if (getGroqApiKey()) {
    return "groq" as const
  }

  return null
}

export function isBlueprintGenerationConfigured() {
  return getBlueprintModelProvider() !== null
}

export function getGroqModel() {
  return process.env.BLUEPRINT_MODEL ?? "qwen/qwen3-32b"
}

export function getBlueprintMaxTokens(
  provider: ReturnType<typeof getBlueprintModelProvider>
) {
  const override = process.env.BLUEPRINT_MAX_TOKENS

  if (override) {
    const parsed = Number.parseInt(override, 10)

    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }

  if (provider === "groq") {
    return 3072
  }

  return 8192
}
