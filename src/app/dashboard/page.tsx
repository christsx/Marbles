import { OverviewSections } from "@/components/overview/overview-sections"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"

export default function Page() {
  return (
    <PageContainer>
      <PageHeader
        title="Overview"
        subtitle="Live metrics from the repository your workspace is tracking on GitHub."
      />
      <OverviewSections />
    </PageContainer>
  )
}
