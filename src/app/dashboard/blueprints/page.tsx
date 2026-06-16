import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { SectionHeading } from "@/components/section-heading"
import { StatusBadge, type StatusTone } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  blueprints,
  type BlueprintRisk,
  type BlueprintStatus,
} from "@/lib/blueprints"

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

export default function BlueprintsPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Factory" }, { label: "Blueprints" }]}>
      <PageContainer>
        <PageHeader
          title="Blueprints"
          subtitle="Architecture and design plans generated from requirements before any code is written."
          action={
            <Button asChild size="sm">
              <Link href="/dashboard/blueprints/new">
                <PlusIcon />
                New Blueprint
              </Link>
            </Button>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Active Blueprints" value="14" footnote="across 5 systems" />
          <MetricCard label="Awaiting Review" value="3" footnote="need two-agent sign-off" />
          <MetricCard label="High Risk" value="3" footnote="require rollback plan" />
          <MetricCard label="Implemented (30d)" value="9" change={{ trend: "up", label: "+4" }} footnote="shipped to prod" />
        </div>

        <section className="flex flex-col gap-3">
          <SectionHeading title="All blueprints" />
          <Card className="py-0 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Blueprint</TableHead>
                  <TableHead className="px-4">System</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4">Risk</TableHead>
                  <TableHead className="px-4 text-right">Components</TableHead>
                  <TableHead className="px-4">Author</TableHead>
                  <TableHead className="px-4 text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blueprints.map((bp) => (
                  <TableRow key={bp.id}>
                    <TableCell className="px-4 py-3">
                      <Link
                        href={`/dashboard/blueprints/${bp.id}`}
                        className="font-medium text-foreground transition-colors hover:text-foreground/70"
                      >
                        {bp.title}
                      </Link>
                      <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                        {bp.id}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline">{bp.system}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge tone={blueprintStatusTone[bp.status]}>
                        {bp.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge tone={riskTone[bp.risk]}>{bp.risk}</StatusBadge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums">
                      {bp.components}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {bp.author}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                      {bp.updated}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      </PageContainer>
    </DashboardShell>
  )
}
