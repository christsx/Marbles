import type { BlueprintSystem } from "@/lib/blueprints"

const SYSTEM_PATH_HINTS: Record<BlueprintSystem, string[]> = {
  "core-api": ["backend", "api", "server", "core-api", "services/api", "apps/api"],
  platform: ["platform", "packages", "shared", "services", "workers", "jobs"],
  "web-app": ["src/app", "frontend", "web", "apps/web", "apps/app"],
  "billing-svc": ["billing", "payments", "stripe"],
  infra: [
    ".github",
    "terraform",
    "docker",
    "supabase",
    "drizzle",
    "vercel.json",
    "fly.toml",
  ],
}

export function inferSystemScope(system: string, rootPaths: string[]) {
  if (system === "general") {
    return "Scope: general blueprint conversation. Use attached repo or files when provided."
  }

  const hints = SYSTEM_PATH_HINTS[system as BlueprintSystem] ?? []
  const normalizedRoots = rootPaths.map((path) => path.toLowerCase())
  const matches = hints.filter((hint) =>
    normalizedRoots.some(
      (root) => root === hint || root.startsWith(`${hint}/`) || root.includes(hint)
    )
  )

  if (matches.length) {
    return `Selected system "${system}" matches repo paths: ${matches.join(", ")}. Scope answers to this boundary unless the user says otherwise.`
  }

  return `Selected system "${system}". No obvious matching top-level folder in repo — say what is unknown and ask which part of the repo owns this work.`
}
