type ProjectEnvironment = "development" | "production"

function parseAllowedOrigins(raw: string | undefined): string[] | undefined {
  if (!raw) return undefined

  try {
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string")
    }
  } catch {
    // fall through to comma-separated parsing
  }

  return raw.split(",").map((origin) => origin.trim()).filter(Boolean)
}

function resolveProjectEnvironment(): ProjectEnvironment | undefined {
  const raw =
    process.env.PIPEDREAM_PROJECT_ENVIRONMENT ??
    process.env.PIPEDREAM_ENVIRONMENT

  if (raw === "development" || raw === "production") {
    return raw
  }

  return undefined
}

export function getPipedreamConfig() {
  return {
    clientId: process.env.PIPEDREAM_CLIENT_ID,
    clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,
    projectId:
      process.env.PIPEDREAM_PROJECT_ID ??
      process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ID,
    projectEnvironment: resolveProjectEnvironment(),
    allowedOrigins: parseAllowedOrigins(process.env.PIPEDREAM_ALLOWED_ORIGINS),
  }
}

export function getPublicPipedreamProjectEnvironment(): ProjectEnvironment {
  const raw =
    process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ENVIRONMENT ??
    process.env.NEXT_PUBLIC_PIPEDREAM_ENVIRONMENT

  return raw === "production" ? "production" : "development"
}

export function isPipedreamConfigured() {
  if (process.env.PIPEDREAM_CONNECT_ENABLED !== "true") {
    return false
  }

  const config = getPipedreamConfig()

  return Boolean(
    config.clientId &&
      config.clientSecret &&
      config.projectId &&
      config.projectEnvironment
  )
}
