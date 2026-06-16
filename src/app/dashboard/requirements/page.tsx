import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { ProgressBar } from "@/components/progress-bar"
import { ScorePill } from "@/components/score-pill"
import { SectionHeading } from "@/components/section-heading"
import { StatusBadge, type StatusTone } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  requirements,
  sourceCounts,
  type RequirementStatus,
} from "@/lib/requirements"

const maxSource = Math.max(...sourceCounts.map((s) => s.count))

const requirementStatusTone: Record<RequirementStatus, StatusTone> = {
  Shipped: "success",
  "In build": "warning",
  Triage: "error",
  Specced: "info",
}

export default function RequirementsPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Factory" }, { label: "Requirements" }]}>
      <PageContainer>
        <PageHeader
          title="Requirements"
          subtitle="Intake from every source, scored and turned into buildable specs."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="New (7d)" value="18" change={{ trend: "up", label: "+6" }} footnote="across all sources" />
          <MetricCard label="In Triage" value="9" footnote="awaiting spec" />
          <MetricCard label="Specced" value="88%" change={{ trend: "up", label: "+4%" }} footnote="have acceptance criteria" />
          <MetricCard label="Shipped (30d)" value="42" footnote="requirements delivered" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Intake by Source</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {sourceCounts.map((source) => (
              <div key={source.source} className="flex items-center gap-4">
                <span className="w-24 shrink-0 text-sm font-medium">
                  {source.source}
                </span>
                <ProgressBar
                  value={(source.count / maxSource) * 100}
                  className="flex-1"
                />
                <span className="w-8 shrink-0 text-right text-sm tabular-nums">
                  {source.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <section className="flex flex-col gap-3">
          <SectionHeading title="Recent requirements" />
          <Card className="py-0 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 px-4">Priority</TableHead>
                  <TableHead className="px-4">Requirement</TableHead>
                  <TableHead className="px-4">Source</TableHead>
                  <TableHead className="px-4">Owner</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4 text-right">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="px-4 py-3">
                      <ScorePill score={req.priority} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="font-medium">{req.title}</span>
                      <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                        {req.id}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {req.source}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {req.owner}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge tone={requirementStatusTone[req.status]}>
                        {req.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                      {req.created}
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
