import { GitHubRepoTracker } from "@/components/github/github-repo-tracker"
import { GitHubRepoCard } from "@/components/github/github-repo-card"
import { getOverviewRepoContext } from "@/lib/pipedream/overview-context"
import {
  getGithubRepoDetails,
} from "@/lib/pipedream/server"
import type { GitHubRepoDetails } from "@/lib/pipedream/types"
import { getWorkspaceIdentity } from "@/lib/workspace-identity"
import { getActiveRepo, getTrackedRepos } from "@/lib/tracked-repos"
import { withTimeout } from "@/lib/with-timeout"

const GITHUB_FETCH_TIMEOUT_MS = 8_000

type RepoStatusCardProps = {
  mode?: "overview" | "integrations"
}

export async function RepoStatusCard({ mode = "overview" }: RepoStatusCardProps) {
  if (mode === "integrations") {
    const identity = await getWorkspaceIdentity()

    if (!identity) {
      return null
    }

    const trackedRepos = await getTrackedRepos(identity.externalUserId)
    const activeRepo = await getActiveRepo(identity.externalUserId, trackedRepos)

    return (
      <GitHubRepoTracker
        initialTrackedRepos={trackedRepos}
        initialActiveRepo={activeRepo}
      />
    )
  }

  const context = await getOverviewRepoContext()

  if (!context) {
    return null
  }

  let repoDetails: GitHubRepoDetails | null = null

  if (context.activeRepo && context.account && context.configured) {
    try {
      repoDetails = await withTimeout(
        getGithubRepoDetails(
          context.externalUserId,
          context.account.id,
          context.activeRepo
        ),
        GITHUB_FETCH_TIMEOUT_MS,
        () => null
      )
    } catch (error) {
      console.error(`Failed to load repo details for ${context.activeRepo}:`, error)
    }
  }

  return (
    <GitHubRepoCard
      trackedRepos={context.trackedRepos}
      activeRepo={context.activeRepo}
      repoDetails={repoDetails}
      connected={context.connected}
    />
  )
}
