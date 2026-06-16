import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { BlueprintForm } from "@/components/blueprints/blueprint-form"
import { blueprints, getBlueprint } from "@/lib/blueprints"

export function generateStaticParams() {
  return blueprints.map((bp) => ({ id: bp.id }))
}

export default async function EditBlueprintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const blueprint = getBlueprint(id)

  if (!blueprint) {
    notFound()
  }

  return (
    <DashboardShell
      breadcrumb={[
        { label: "Factory" },
        { label: "Blueprints", href: "/dashboard/blueprints" },
        { label: blueprint.id, href: `/dashboard/blueprints/${blueprint.id}` },
        { label: "Edit" },
      ]}
    >
      <PageContainer>
        <Link
          href={`/dashboard/blueprints/${blueprint.id}`}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to blueprint
        </Link>

        <PageHeader
          title="Edit Blueprint"
          subtitle={`${blueprint.id} · update the doc for your team`}
        />

        <BlueprintForm
          blueprintId={blueprint.id}
          defaultTitle={blueprint.title}
          defaultSystem={blueprint.system}
          initialContent={blueprint.content}
        />
      </PageContainer>
    </DashboardShell>
  )
}
