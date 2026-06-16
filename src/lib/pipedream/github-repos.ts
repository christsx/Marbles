import type { GitHubRepoSummary } from "@/lib/pipedream/types"

type GitHubApiRepo = {
  id?: number
  full_name?: string
  name?: string
  private?: boolean
  updated_at?: string
  owner?: { login?: string }
}

function unwrapGithubRepoPayload(response: unknown): GitHubApiRepo[] {
  if (Array.isArray(response)) {
    return response as GitHubApiRepo[]
  }

  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>

    if (Array.isArray(record.data)) {
      return record.data as GitHubApiRepo[]
    }

    if (Array.isArray(record.repos)) {
      return record.repos as GitHubApiRepo[]
    }
  }

  return []
}

function toRepoFullName(repo: GitHubApiRepo): string | null {
  if (typeof repo.full_name === "string" && repo.full_name.length > 0) {
    return repo.full_name
  }

  if (
    typeof repo.name === "string" &&
    typeof repo.owner?.login === "string"
  ) {
    return `${repo.owner.login}/${repo.name}`
  }

  return null
}

export function parseGithubRepos(response: unknown): GitHubRepoSummary[] {
  return unwrapGithubRepoPayload(response)
    .map((repo) => {
      const fullName = toRepoFullName(repo)

      if (!fullName) {
        return null
      }

      return {
        id: repo.id ?? fullName,
        fullName,
        private: Boolean(repo.private),
        updatedAt: repo.updated_at ?? new Date().toISOString(),
      }
    })
    .filter((repo): repo is GitHubRepoSummary => repo !== null)
}
