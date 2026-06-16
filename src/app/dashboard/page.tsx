import { DashboardShell } from "@/components/dashboard-shell"
import { ModuleMetricCards } from "@/components/overview/module-metric-cards"
import { RecentRepoCommits } from "@/components/overview/recent-repo-commits"
import { RepoStatusCard } from "@/components/overview/repo-status-card"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"

export default function Page() {
  return (
    <DashboardShell breadcrumb={[{ label: "Overview" }]}>
      <PageContainer>
        <PageHeader
          title="Overview"
          subtitle="Live metrics from the repository your workspace is tracking on GitHub."
        />
        <ModuleMetricCards />
        <RepoStatusCard />
        <RecentRepoCommits />
      </PageContainer>
    </DashboardShell>
  )
}
