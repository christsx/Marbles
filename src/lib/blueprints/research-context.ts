import { isPipedreamConfigured } from "@/lib/pipedream/config"
import { getOverviewRepoContext } from "@/lib/pipedream/overview-context"
import { getGithubFileText } from "@/lib/pipedream/server"
import { detectQueryFocus } from "@/lib/blueprints/query-focus"
import { getBlueprintRepoContext } from "@/lib/blueprints/repo-context"
import { inferSystemScope } from "@/lib/blueprints/system-scope"

const INFRA_PATHS = [
  "vercel.json",
  "docker-compose.yml",
  "docker-compose.yaml",
  "drizzle.config.ts",
  "fly.toml",
  "railway.toml",
  ".github/workflows/ci.yml",
  ".github/workflows/deploy.yml",
]

function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1)}…`
}

async function fetchInfraSnippets(
  externalUserId: string,
  accountId: string,
  repo: string
) {
  const snippets = await Promise.all(
    INFRA_PATHS.map(async (path) => {
      const text = await getGithubFileText(externalUserId, accountId, repo, path)
      if (!text?.trim()) return null
      return `${path}: ${truncate(text.replace(/\s+/g, " ").trim(), 320)}`
    })
  )

  return snippets.filter((line): line is string => Boolean(line))
}

export type BlueprintResearchContext = {
  connected: boolean
  activeRepo: string | null
  verifiedBlock: string
  narrativeBlock: string
  systemScopeBlock: string
  infraBlock: string | null
  correctionsBlock: string | null
  attachmentBlock: string | null
}

function emptyResearchContext(input: {
  corrections?: string[]
  attachmentBlock?: string | null
}): BlueprintResearchContext {
  return {
    connected: false,
    activeRepo: null,
    verifiedBlock:
      "VERIFIED: No repository attached. Answer from general software architecture knowledge, user messages, and attachments only. Do not invent repo-specific facts.",
    narrativeBlock: "",
    systemScopeBlock:
      "No GitHub repo added to this blueprint. If the user needs repo-specific answers, suggest adding a GitHub repo from the + menu.",
    infraBlock: null,
    attachmentBlock: input.attachmentBlock ?? null,
    correctionsBlock: input.corrections?.length
      ? `USER CORRECTIONS (override all assumptions):\n${input.corrections.map((line) => `- ${line}`).join("\n")}`
      : null,
  }
}

export async function getBlueprintResearchContext(input: {
  system: string
  question: string
  corrections?: string[]
  includeRepoContext?: boolean
  attachmentBlock?: string | null
}): Promise<BlueprintResearchContext> {
  if (!input.includeRepoContext) {
    return emptyResearchContext(input)
  }

  const focus = detectQueryFocus(input.question)
  const repo = await getBlueprintRepoContext(false)
  const overview = await getOverviewRepoContext()

  const verifiedLines = [
    repo.activeRepo ? `Repository: ${repo.activeRepo}` : null,
    repo.stack ? `Stack (package.json): ${repo.stack}` : null,
    repo.verifiedTechnologies?.length
      ? `Dependencies (package.json): ${repo.verifiedTechnologies.join(", ")}`
      : null,
  ].filter(Boolean)

  const narrativeMatch = repo.summary
    .split("\n")
    .find((line) => line.startsWith("README:"))

  const narrativeBlock = narrativeMatch
    ? `NARRATIVE ONLY (README — may be outdated):\n${narrativeMatch.replace(/^README:\s*/, "")}`
    : "NARRATIVE ONLY: No README excerpt available."

  let infraBlock: string | null = null

  if (
    focus.infra &&
    overview?.activeRepo &&
    overview.account &&
    isPipedreamConfigured()
  ) {
    const snippets = await fetchInfraSnippets(
      overview.externalUserId,
      overview.account.id,
      overview.activeRepo
    )

    infraBlock = snippets.length
      ? `INFRA ARTIFACTS (verified file contents):\n${snippets.join("\n")}`
      : "INFRA ARTIFACTS: No vercel/docker/ci config files found at common paths."
  }

  const rootLine = repo.summary
    .split("\n")
    .find((line) => line.startsWith("Top-level:"))
  const rootPaths = rootLine
    ? rootLine.replace(/^Top-level:\s*/, "").split(", ")
    : []

  return {
    connected: repo.connected,
    activeRepo: repo.activeRepo,
    verifiedBlock: verifiedLines.length
      ? `VERIFIED (from attached repo + package.json):\n${verifiedLines.join("\n")}`
      : "VERIFIED: Repository attached but metadata unavailable.",
    narrativeBlock,
    systemScopeBlock: inferSystemScope(input.system, rootPaths),
    infraBlock,
    attachmentBlock: input.attachmentBlock ?? null,
    correctionsBlock: input.corrections?.length
      ? `USER CORRECTIONS (override README and assumptions):\n${input.corrections.map((line) => `- ${line}`).join("\n")}`
      : null,
  }
}
