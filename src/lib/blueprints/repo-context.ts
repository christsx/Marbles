import { isPipedreamConfigured } from "@/lib/pipedream/config"
import { getOverviewRepoContext } from "@/lib/pipedream/overview-context"
import {
  formatStackSummary,
  summarizePackageJson,
} from "@/lib/blueprints/repo-stack"
import {
  getGithubFileText,
  getGithubRecentCommits,
  getGithubRepoDetails,
  getGithubRootPaths,
} from "@/lib/pipedream/server"

export type BlueprintRepoContext = {
  connected: boolean
  activeRepo: string | null
  summary: string
  stack?: string
  /** Dependency names detected in package.json — safe to cite in research answers */
  verifiedTechnologies?: string[]
}

function truncate(text: string, max: number) {
  if (text.length <= max) {
    return text
  }

  return `${text.slice(0, max - 1)}…`
}

function summarizeReadme(raw: string) {
  const withoutFrontmatter = raw.replace(/^---[\s\S]*?---\s*/m, "")
  const paragraph = withoutFrontmatter
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0 && !line.startsWith("#"))

  return paragraph ? truncate(paragraph, 160) : null
}

const REPO_CONTEXT_TTL_MS = 60_000
const repoContextCache = new Map<
  string,
  { expiresAt: number; value: BlueprintRepoContext }
>()

export async function getBlueprintRepoContext(
  compact = false
): Promise<BlueprintRepoContext> {
  const overview = await getOverviewRepoContext()
  const cacheKey = `${overview?.activeRepo ?? "none"}:${compact ? "compact" : "full"}`
  const cached = repoContextCache.get(cacheKey)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value
  }

  const value = await resolveBlueprintRepoContext(overview, compact)
  repoContextCache.set(cacheKey, {
    expiresAt: Date.now() + REPO_CONTEXT_TTL_MS,
    value,
  })

  return value
}

async function resolveBlueprintRepoContext(
  context: Awaited<ReturnType<typeof getOverviewRepoContext>>,
  compact: boolean
): Promise<BlueprintRepoContext> {

  if (!context?.activeRepo || !context.account || !context.configured) {
    return {
      connected: false,
      activeRepo: null,
      summary: compact
        ? "Repo: none"
        : "No GitHub repo linked — note in Constraints.",
    }
  }

  if (!isPipedreamConfigured()) {
    return {
      connected: false,
      activeRepo: context.activeRepo,
      summary: compact
        ? `Repo: ${context.activeRepo} (offline)`
        : "Pipedream not configured — infer from title/system only.",
    }
  }

  const { externalUserId, account, activeRepo } = context

  try {
    const [details, commits, rootPaths, packageJson, readme] = await Promise.all([
      getGithubRepoDetails(externalUserId, account!.id, activeRepo),
      getGithubRecentCommits(externalUserId, account!.id, activeRepo, 3),
      getGithubRootPaths(externalUserId, account!.id, activeRepo),
      getGithubFileText(externalUserId, account!.id, activeRepo, "package.json"),
      getGithubFileText(externalUserId, account!.id, activeRepo, "README.md"),
    ])

    const stack = packageJson ? summarizePackageJson(packageJson) : null
    const stackLine = stack ? formatStackSummary(stack) : null
    const verifiedTechnologies = stack
      ? [
          stack.framework,
          stack.language,
          ...stack.dependencies,
        ].filter((value): value is string => Boolean(value))
      : undefined
    const readmeLine = readme ? summarizeReadme(readme) : null

    const roots = rootPaths.slice(0, compact ? 8 : 12).join(", ")
    const recent = commits
      .map((commit) =>
        truncate(`${commit.sha} ${commit.message}`, compact ? 48 : 80)
      )
      .join("; ")

    if (compact) {
      const parts = [
        `Repo: ${activeRepo}`,
        stackLine,
        details?.defaultBranch ? `branch=${details.defaultBranch}` : null,
        details?.fileCount != null ? `files=${details.fileCount}` : null,
        details?.openIssues != null ? `issues=${details.openIssues}` : null,
        roots ? `roots=${roots}` : null,
        recent ? `commits=${recent}` : null,
        readmeLine ? `readme=${readmeLine}` : null,
      ].filter(Boolean)

      return {
        connected: true,
        activeRepo,
        stack: stackLine ?? undefined,
        verifiedTechnologies,
        summary: parts.join(" | "),
      }
    }

    const lines = [
      `Repository: ${activeRepo}`,
      stackLine ? `Stack: ${stackLine}` : null,
      details?.language ? `Language: ${details.language}` : null,
      details?.defaultBranch ? `Branch: ${details.defaultBranch}` : null,
      details?.fileCount != null ? `Files: ${details.fileCount}` : null,
      details?.openIssues != null ? `Open issues: ${details.openIssues}` : null,
      roots ? `Top-level: ${roots}` : null,
      recent ? `Recent commits: ${recent}` : null,
      readmeLine ? `README: ${readmeLine}` : null,
    ].filter(Boolean)

    return {
      connected: true,
      activeRepo,
      stack: stackLine ?? undefined,
      verifiedTechnologies,
      summary: lines.join("\n"),
    }
  } catch (error) {
    console.error("Failed to build blueprint repo context:", error)

    return {
      connected: true,
      activeRepo,
      summary: compact
        ? `Repo: ${activeRepo} (metadata unavailable)`
        : `Connected to ${activeRepo}; metadata unavailable — infer conservatively.`,
    }
  }
}
