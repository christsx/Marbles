import type { GitHubCommitSummary } from "@/lib/pipedream/types"

type GitHubApiCommit = {
  sha?: string
  commit?: {
    message?: string
    author?: { name?: string; date?: string }
  }
  author?: { login?: string } | null
  html_url?: string
}

export function parseGithubCommits(response: unknown): GitHubCommitSummary[] {
  const commits = Array.isArray(response)
    ? (response as GitHubApiCommit[])
    : []

  return commits
    .map((entry) => {
      const message = entry.commit?.message?.split("\n")[0]?.trim()

      if (!message || !entry.sha) {
        return null
      }

      return {
        sha: entry.sha.slice(0, 7),
        message,
        author:
          entry.author?.login ??
          entry.commit?.author?.name ??
          "Unknown",
        committedAt:
          entry.commit?.author?.date ?? new Date().toISOString(),
        htmlUrl: entry.html_url ?? "",
      }
    })
    .filter((commit): commit is GitHubCommitSummary => commit !== null)
}
