import { RepoStatusCard } from "@/components/overview/repo-status-card"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"

export default function IntegrationsPage() {
  return (
      <PageContainer>
        <PageHeader
          title="Integrations"
          subtitle="Track GitHub repositories for this workspace. Connect OAuth is off for now."
        />
        <RepoStatusCard mode="integrations" />
      </PageContainer>
  )
}
