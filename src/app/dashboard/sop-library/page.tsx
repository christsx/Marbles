import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { SopLibrary } from "@/components/sop-library"

export default function SopLibraryPage() {
  return (
    <DashboardShell
      breadcrumb={[{ label: "Marketing & Team" }, { label: "SOP Library" }]}
    >
      <PageContainer>
        <PageHeader
          title="SOP Library"
          subtitle="Standard operating procedures, playbooks, and scripts."
        />
        <SopLibrary />
      </PageContainer>
    </DashboardShell>
  )
}
