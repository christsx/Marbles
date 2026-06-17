import { GitHubIntegrationPanel } from "@/components/github/github-integration-panel"
import { GitHubRepoCard } from "@/components/github/github-repo-card"
import { isPipedreamConfigured } from "@/lib/pipedream/config"
import { getOverviewRepoContext } from "@/lib/pipedream/overview-context"
import {
  getGithubRepoDetails,
  listConnectedAccounts,
} from "@/lib/pipedream/server"
import type {
  GitHubRepoDetails,
  PipedreamAccountSummary,
} from "@/lib/pipedream/types"
import { getPipedreamExternalUserId } from "@/lib/pipedream/user"
import { getActiveRepo, getTrackedRepos } from "@/lib/tracked-repos"
import { withTimeout } from "@/lib/with-timeout"

const GITHUB_FETCH_TIMEOUT_MS = 8_000

type RepoStatusCardProps = {
  mode?: "overview" | "integrations"
}

export async function RepoStatusCard({ mode = "overview" }: RepoStatusCardProps) {
  if (mode === "integrations") {
    const identity = await getPipedreamExternalUserId()

    if (!identity) {
      return null
    }

    const configured = isPipedreamConfigured()
    let accounts: PipedreamAccountSummary[] = []

    if (configured) {
      try {
        accounts = await listConnectedAccounts(identity.externalUserId, "github")
      } catch (error) {
        console.error("Failed to load GitHub accounts:", error)
      }
    }

    const trackedRepos = await getTrackedRepos(identity.externalUserId)
    const activeRepo = await getActiveRepo(identity.externalUserId, trackedRepos)

    return (
      <GitHubIntegrationPanel
        externalUserId={identity.externalUserId}
        initialAccounts={accounts}
        initialTrackedRepos={trackedRepos}
        initialActiveRepo={activeRepo}
        pipedreamConfigured={configured}
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
