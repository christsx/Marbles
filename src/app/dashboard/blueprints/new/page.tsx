import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { BlueprintForm } from "@/components/blueprints/blueprint-form"
import { Button } from "@/components/ui/button"

export default function NewBlueprintPage() {
  return (
    <DashboardShell
      breadcrumb={[
        { label: "Factory" },
        { label: "Blueprints", href: "/dashboard/blueprints" },
        { label: "New" },
      ]}
    >
      <PageContainer>
        <Link
          href="/dashboard/blueprints"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Blueprints
        </Link>

        <PageHeader
          title="New Blueprint"
          subtitle="Create an architecture doc for your team — write manually or generate a draft with an agent."
        />

        <BlueprintForm />
      </PageContainer>
    </DashboardShell>
  )
}
