import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { PlaybookLibrary } from "@/components/playbook-library"

export default function PlaybooksPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Operate" }, { label: "Playbooks" }]}>
      <PageContainer>
        <PageHeader
          title="Playbooks"
          subtitle="How the factory works — the standing procedures agents follow."
        />
        <PlaybookLibrary />
      </PageContainer>
    </DashboardShell>
  )
}
