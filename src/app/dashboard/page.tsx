import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { HeroCards } from "@/components/overview/hero-cards"
import { ShipActivityGraph } from "@/components/overview/ship-activity-graph"
import { RepoStatusCard } from "@/components/overview/repo-status-card"
import { AiExecutiveBrief } from "@/components/overview/ai-executive-brief"
import { NeedsAttention } from "@/components/overview/needs-attention"

export default function Page() {
  return (
    <DashboardShell breadcrumb={[{ label: "Overview" }]}>
      <PageContainer>
        <PageHeader
          title="Overview"
          subtitle="Is the factory shipping, is the pipeline healthy, and what needs attention right now?"
        />
        <div className="flex flex-col gap-6">
          <HeroCards />
          <ShipActivityGraph />
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
            <RepoStatusCard />
            <NeedsAttention />
          </div>
          <AiExecutiveBrief />
        </div>
      </PageContainer>
    </DashboardShell>
  )
}
