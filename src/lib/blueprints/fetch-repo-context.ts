export type RepoContextSnapshot = {
  repoEnabled: boolean
  activeRepo: string | null
}

export async function fetchRepoContextSnapshot(): Promise<RepoContextSnapshot> {
  const response = await fetch("/api/blueprints/repo-summary")
  const payload = (await response.json()) as {
    connected?: boolean
    activeRepo?: string | null
  }

  if (!payload.connected || !payload.activeRepo) {
    return {
      repoEnabled: true,
      activeRepo: "Select repo in Integrations",
    }
  }

  return {
    repoEnabled: true,
    activeRepo: payload.activeRepo ?? null,
  }
}
