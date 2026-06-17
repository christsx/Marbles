import { GitHubRepoCard } from "@/components/github/github-repo-card"
import { OverviewCommitsList } from "@/components/overview/overview-commits-list"
import { OverviewMetricsGrid } from "@/components/overview/overview-metrics-grid"
import { getOverviewPageData } from "@/lib/pipedream/overview-data"

export async function OverviewSections() {
  const { context, metrics, commits, repoDetails } = await getOverviewPageData()

  if (!context) {
    return null
  }

  return (
    <>
      {metrics ? <OverviewMetricsGrid metrics={metrics} /> : null}
      <GitHubRepoCard
        trackedRepos={context.trackedRepos}
        activeRepo={context.activeRepo}
        repoDetails={repoDetails}
        connected={context.connected}
      />
      {context.activeRepo ? (
        <OverviewCommitsList activeRepo={context.activeRepo} commits={commits} />
      ) : null}
    </>
  )
}
