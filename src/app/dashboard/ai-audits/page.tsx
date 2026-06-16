import Link from "next/link"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { Badge } from "@/components/ui/badge"
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

type Severity = "high" | "medium" | "low"

type Finding = {
  area: string
  finding: string
  severity: Severity
  recommendation: string
  status: "Open" | "In progress" | "Resolved"
}

const findings: Finding[] = [
  { area: "Pipeline Hygiene", finding: "12 deals missing a next step", severity: "high", recommendation: "Assign follow-up tasks", status: "Open" },
  { area: "Stage Accuracy", finding: "8 deals stuck >30d in Proposal", severity: "high", recommendation: "Review or mark close-lost", status: "Open" },
  { area: "Speed-to-Lead", finding: "3 leads breached the 10-min SLA", severity: "high", recommendation: "Reassign and alert owner", status: "In progress" },
  { area: "Data Quality", finding: "Missing contact email on 5 opps", severity: "medium", recommendation: "Enrich from CRM", status: "In progress" },
  { area: "Duplicate Records", finding: "3 likely duplicate companies", severity: "medium", recommendation: "Merge records", status: "Open" },
  { area: "Forecast Risk", finding: "4 deals slipping past close date", severity: "medium", recommendation: "Confirm timeline with owner", status: "Open" },
  { area: "Ownership", finding: "2 unassigned inbound leads", severity: "low", recommendation: "Route via assignment rules", status: "Resolved" },
]

const severityFilters: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
]

function resolveSeverity(raw: string | undefined): string {
  return severityFilters.some((f) => f.id === raw) ? (raw as string) : "all"
}

function severityCount(id: string): number {
  if (id === "all") return findings.length
  return findings.filter((f) => f.severity === id).length
}

function SeverityBadge({ severity }: { severity: Severity }) {
  if (severity === "high") return <Badge variant="destructive">High</Badge>
  if (severity === "medium")
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
        Medium
      </Badge>
    )
  return <Badge variant="secondary">Low</Badge>
}

function StatusLabel({ status }: { status: Finding["status"] }) {
  return (
    <span
      className={cn(
        "text-sm",
        status === "Resolved"
          ? "text-muted-foreground"
          : status === "In progress"
            ? "text-foreground"
            : "font-medium text-foreground"
      )}
    >
      {status}
    </span>
  )
}

export default async function AiAuditsPage({
  searchParams,
}: {
  searchParams: Promise<{ severity?: string }>
}) {
  const { severity: rawSeverity } = await searchParams
  const severity = resolveSeverity(rawSeverity)
  const visible =
    severity === "all"
      ? findings
      : findings.filter((f) => f.severity === severity)

  return (
    <DashboardShell breadcrumb={[{ label: "Executive" }, { label: "AI Audits" }]}>
      <PageContainer>
        <PageHeader
          title="AI Audits"
          subtitle="Automated pipeline and CRM integrity checks."
          action={
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Last run 8:00 AM · hourly
            </span>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="CRM Health" value="88%" change={{ trend: "up", label: "+2%" }} footnote="completion score" />
          <MetricCard label="Open Issues" value="35" footnote="across 7 checks" />
          <MetricCard label="High Severity" value="3" footnote="need attention now" />
          <MetricCard label="Resolved (7d)" value="42" change={{ trend: "up", label: "+15" }} footnote="this week" />
        </div>

        <div className="flex w-fit items-center gap-1 rounded-lg bg-muted p-1">
          {severityFilters.map((filter) => {
            const active = filter.id === severity
            return (
              <Link
                key={filter.id}
                href={`/dashboard/ai-audits?severity=${filter.id}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "tabular-nums",
                    active ? "text-muted-foreground" : "text-muted-foreground/70"
                  )}
                >
                  {severityCount(filter.id)}
                </span>
              </Link>
            )
          })}
        </div>

        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-28 px-4">Severity</TableHead>
                <TableHead className="px-4">Area</TableHead>
                <TableHead className="px-4">Finding</TableHead>
                <TableHead className="px-4">Recommendation</TableHead>
                <TableHead className="px-4 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((f, i) => (
                <TableRow
                  key={i}
                  className={cn(f.severity === "high" && "bg-rose-500/[0.04]")}
                >
                  <TableCell className="px-4 py-3">
                    <SeverityBadge severity={f.severity} />
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium">{f.area}</TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {f.finding}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {f.recommendation}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <StatusLabel status={f.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </PageContainer>
    </DashboardShell>
  )
}
