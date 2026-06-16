import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
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
import { cn } from "@/lib/utils"
import {
  blueprints,
  type BlueprintRisk,
  type BlueprintStatus,
} from "@/lib/blueprints"

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
  if (risk === "Medium")
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
        Medium
      </Badge>
    )
  return <Badge variant="secondary">Low</Badge>
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
          <h2 className="font-heading text-base font-medium">All Blueprints</h2>
          <Card className="py-0">
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
                  <TableRow
                    key={bp.id}
                    className={cn(bp.risk === "High" && bp.status === "Draft" && "bg-rose-500/[0.03]")}
                  >
                    <TableCell className="px-4 py-3">
                      <Link
                        href={`/dashboard/blueprints/${bp.id}`}
                        className="font-medium transition-colors hover:text-foreground/80"
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
                      <StatusBadge status={bp.status} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <RiskBadge risk={bp.risk} />
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
