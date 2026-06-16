import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, PencilIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { BlueprintDocument } from "@/components/blueprints/blueprint-document"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { blueprints, getBlueprint, type BlueprintRisk, type BlueprintStatus } from "@/lib/blueprints"

export function generateStaticParams() {
  return blueprints.map((bp) => ({ id: bp.id }))
}

function StatusBadge({ status }: { status: BlueprintStatus }) {
  if (status === "Implemented") {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
        {status}
      </Badge>
    )
  }
  if (status === "In review") {
    return (
      <Badge className="bg-violet-500/15 text-violet-700 dark:text-violet-400">
        {status}
      </Badge>
    )
  }
  if (status === "Approved") {
    return <Badge variant="secondary">{status}</Badge>
  }
  return <Badge variant="outline">{status}</Badge>
}

function RiskBadge({ risk }: { risk: BlueprintRisk }) {
  if (risk === "High") return <Badge variant="destructive">High</Badge>
  if (risk === "Medium") {
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
        Medium
      </Badge>
    )
  }
  return <Badge variant="secondary">Low</Badge>
}

export default async function BlueprintDetailPage({
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
        { label: blueprint.id },
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
          title={blueprint.title}
          subtitle={`${blueprint.id} · ${blueprint.system}`}
          action={
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/blueprints/${blueprint.id}/edit`}>
                <PencilIcon />
                Edit
              </Link>
            </Button>
          }
        />

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={blueprint.status} />
          <RiskBadge risk={blueprint.risk} />
          <Badge variant="outline">{blueprint.components} components</Badge>
          <span className="text-sm text-muted-foreground">
            {blueprint.author} · Updated {blueprint.updated}
          </span>
        </div>

        <Card>
          <CardContent className="py-6">
            <BlueprintDocument content={blueprint.content} />
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardShell>
  )
}
