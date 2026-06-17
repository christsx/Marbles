import { unstable_cache } from "next/cache"

import { getOverviewRepoContext } from "@/lib/pipedream/overview-context"
import {
  getGithubOverviewMetrics,
  getGithubRecentCommits,
  getGithubRepoDetails,
} from "@/lib/pipedream/server"
import type {
  GitHubCommitSummary,
  GitHubOverviewMetrics,
  GitHubRepoDetails,
} from "@/lib/pipedream/types"
import { withTimeout } from "@/lib/with-timeout"

import type { OverviewRepoContext } from "@/lib/pipedream/overview-context"

const GITHUB_FETCH_TIMEOUT_MS = 8_000
const OVERVIEW_CACHE_SECONDS = 60

export type OverviewPageData = {
  context: OverviewRepoContext | null
  metrics: GitHubOverviewMetrics | null
  commits: GitHubCommitSummary[]
  repoDetails: GitHubRepoDetails | null
}

const loadGithubOverview = unstable_cache(
  async (
    externalUserId: string,
    accountId: string,
    activeRepo: string
  ): Promise<Pick<OverviewPageData, "metrics" | "commits" | "repoDetails">> => {
    const [metrics, commits, repoDetails] = await Promise.all([
      withTimeout(
        getGithubOverviewMetrics(externalUserId, accountId, activeRepo),
        GITHUB_FETCH_TIMEOUT_MS,
        () => null
      ),
      withTimeout(
        getGithubRecentCommits(externalUserId, accountId, activeRepo),
        GITHUB_FETCH_TIMEOUT_MS,
        () => []
      ),
      withTimeout(
        getGithubRepoDetails(externalUserId, accountId, activeRepo),
        GITHUB_FETCH_TIMEOUT_MS,
        () => null
      ),
    ])

    return { metrics, commits, repoDetails }
  },
  ["overview-github-data"],
  { revalidate: OVERVIEW_CACHE_SECONDS }
)

export async function getOverviewPageData(): Promise<OverviewPageData> {
  const context = await getOverviewRepoContext()

  if (!context?.activeRepo || !context.account || !context.configured) {
    return {
      context,
      metrics: null,
      commits: [],
      repoDetails: null,
    }
  }

  const github = await loadGithubOverview(
    context.externalUserId,
    context.account.id,
    context.activeRepo
  )

  return {
    context,
    ...github,
  }
}
