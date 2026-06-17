import { OverviewCommitsList } from "@/components/overview/overview-commits-list"
import { getOverviewPageData } from "@/lib/pipedream/overview-data"

export async function RecentRepoCommits() {
  const { context, commits } = await getOverviewPageData()

  if (!context?.activeRepo) {
    return null
  }

  return (
    <OverviewCommitsList activeRepo={context.activeRepo} commits={commits} />
  )
}
