import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, PencilIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { BlueprintDocument } from "@/components/blueprints/blueprint-document"
import { StatusBadge, type StatusTone } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { blueprints, getBlueprint, type BlueprintRisk, type BlueprintStatus } from "@/lib/blueprints"

export function generateStaticParams() {
  return blueprints.map((bp) => ({ id: bp.id }))
}

const blueprintStatusTone: Record<BlueprintStatus, StatusTone> = {
  Implemented: "success",
  "In review": "info",
  Approved: "neutral",
  Draft: "neutral",
}

const riskTone: Record<BlueprintRisk, StatusTone> = {
  High: "error",
  Medium: "warning",
  Low: "neutral",
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
          <StatusBadge tone={blueprintStatusTone[blueprint.status]}>
            {blueprint.status}
          </StatusBadge>
          <StatusBadge tone={riskTone[blueprint.risk]}>{blueprint.risk}</StatusBadge>
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
