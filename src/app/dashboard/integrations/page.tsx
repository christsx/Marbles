import { RepoStatusCard } from "@/components/overview/repo-status-card"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"

export default function IntegrationsPage() {
  return (
      <PageContainer>
        <PageHeader
          title="Integrations"
          subtitle="Connect GitHub and choose a repository to track. Each workspace keeps its own connection."
        />
        <RepoStatusCard mode="integrations" />
      </PageContainer>
  )
}
