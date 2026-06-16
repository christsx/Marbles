import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { SectionCards } from "@/components/overview/section-cards"
import { AiExecutiveBrief } from "@/components/overview/ai-executive-brief"
import { TeamSnapshot } from "@/components/overview/team-snapshot"
import { CriticalAlerts } from "@/components/overview/critical-alerts"
import { OpportunityHealth } from "@/components/overview/opportunity-health"
import { RevenueTrend } from "@/components/overview/revenue-trend"

export default function Page() {
  return (
    <DashboardShell breadcrumb={[{ label: "Overview" }]}>
      <PageContainer>
        <PageHeader
          title="Overview"
          subtitle="Are we on pace, is the team executing, and what needs attention today?"
        />
        <SectionCards />
        <AiExecutiveBrief />
        <TeamSnapshot />
        <OpportunityHealth />
        <CriticalAlerts />
        <RevenueTrend />
      </PageContainer>
    </DashboardShell>
  )
}
