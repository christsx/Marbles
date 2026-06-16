import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { ProvisionAgentForm } from "@/components/provision-agent-form"

export default function NewAgentPage() {
  return (
    <DashboardShell
      breadcrumb={[
        { label: "Build & Ship" },
        { label: "Agents", href: "/dashboard/agents" },
        { label: "Provision Agent" },
      ]}
    >
      <PageContainer>
        <Link
          href="/dashboard/agents"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Agents
        </Link>

        <PageHeader
          title="Provision an Agent"
          subtitle="Configure a new AI agent and add it to the build fleet."
        />

        <div className="max-w-2xl">
          <ProvisionAgentForm />
        </div>
      </PageContainer>
    </DashboardShell>
  )
}
