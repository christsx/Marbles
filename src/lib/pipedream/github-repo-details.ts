import type { GitHubRepoDetails } from "@/lib/pipedream/types"

type GitHubApiRepo = {
  full_name?: string
  private?: boolean
  default_branch?: string
  language?: string | null
  pushed_at?: string
  updated_at?: string
  open_issues_count?: number
  size?: number
  html_url?: string
}

type GitHubApiTree = {
  tree?: Array<{ type?: string }>
  truncated?: boolean
}

export function parseGithubRepoDetails(
  repoPayload: unknown,
  treePayload: unknown | null,
  fullName: string
): GitHubRepoDetails | null {
  if (!repoPayload || typeof repoPayload !== "object") {
    return null
  }

  const repo = repoPayload as GitHubApiRepo

  let fileCount: number | null = null

  if (treePayload && typeof treePayload === "object") {
    const tree = treePayload as GitHubApiTree

    if (Array.isArray(tree.tree)) {
      fileCount = tree.tree.filter((entry) => entry.type === "blob").length

      if (tree.truncated) {
        fileCount = Math.max(fileCount, 100_000)
      }
    }
  }

  return {
    fullName: repo.full_name ?? fullName,
    private: Boolean(repo.private),
    defaultBranch: repo.default_branch ?? "main",
    language: repo.language ?? null,
    pushedAt: repo.pushed_at ?? repo.updated_at ?? new Date().toISOString(),
    updatedAt: repo.updated_at ?? new Date().toISOString(),
    openIssues: repo.open_issues_count ?? 0,
    sizeKb: repo.size ?? 0,
    fileCount,
    htmlUrl: repo.html_url ?? `https://github.com/${fullName}`,
  }
}
